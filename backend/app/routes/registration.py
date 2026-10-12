from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.dependencies import get_or_create_participant_session
from app.models import ParticipantSession, Registration, TeamMember, utc_now
from app.schemas import RegistrationCreate, RegistrationResponse
from app.security import generate_registration_code

router = APIRouter(prefix="/api", tags=["Registration"])


@router.post("/registrations", response_model=RegistrationResponse)
def register_team(
    payload: RegistrationCreate,
    session: ParticipantSession = Depends(get_or_create_participant_session),
    db: Session = Depends(get_db),
):
    # 1. Enforce Challenge Completion Gate
    if not session.is_eligible_for_registration:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ACCESS DENIED: Complete both challenges before registration can be unlocked.",
        )

    # 2. Check if this session is already registered
    existing_session_reg = (
        db.query(Registration)
        .filter(Registration.session_id == session.id)
        .first()
    )
    if existing_session_reg:
        return RegistrationResponse(
            success=True,
            registration_code=existing_session_reg.registration_code,
            team_name=existing_session_reg.team_name,
            institution=existing_session_reg.institution,
            leader_name=existing_session_reg.leader_name,
            leader_email=existing_session_reg.leader_email,
            team_size=existing_session_reg.team_size,
            members=[m.full_name for m in existing_session_reg.members],
            created_at=existing_session_reg.created_at,
            message="Your team is already registered under this terminal session.",
        )

    # 3. Check duplicate leader email across the entire system
    existing_email_reg = (
        db.query(Registration)
        .filter(Registration.leader_email == payload.leader_email)
        .first()
    )
    if existing_email_reg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A team has already been registered with leader email '{payload.leader_email}'.",
        )

    # 4. Validate member counts according to team size
    required_additional_members = payload.team_size - 1
    cleaned_members = [m.strip() for m in payload.members if m.strip()]
    if len(cleaned_members) != required_additional_members:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"For a team of {payload.team_size}, exactly {required_additional_members} additional member name(s) must be provided.",
        )

    # 5. Generate unique registration code
    # Retry a couple of times in case of code collision
    reg_code = ""
    for _ in range(5):
        candidate_code = generate_registration_code()
        exists = db.query(Registration).filter(Registration.registration_code == candidate_code).first()
        if not exists:
            reg_code = candidate_code
            break

    if not reg_code:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate unique registration code. Please try again.",
        )

    # 6. Create registration record
    new_reg = Registration(
        registration_code=reg_code,
        session_id=session.id,
        team_name=payload.team_name,
        institution=payload.institution,
        leader_name=payload.leader_name,
        leader_email=payload.leader_email,
        leader_phone=payload.leader_phone,
        team_size=payload.team_size,
        agreed_to_rules=payload.agreed_to_rules,
        created_at=utc_now(),
    )
    db.add(new_reg)

    try:
        db.flush()  # Get new_reg.id for foreign key

        # Add team members
        for idx, member_name in enumerate(cleaned_members, start=2):
            team_member = TeamMember(
                registration_id=new_reg.id,
                member_index=idx,
                full_name=member_name,
            )
            db.add(team_member)

        db.commit()
        db.refresh(new_reg)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed due to a unique constraint violation (duplicate email or session).",
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to persist registration record.",
        )

    return RegistrationResponse(
        success=True,
        registration_code=new_reg.registration_code,
        team_name=new_reg.team_name,
        institution=new_reg.institution,
        leader_name=new_reg.leader_name,
        leader_email=new_reg.leader_email,
        team_size=new_reg.team_size,
        members=[m.full_name for m in new_reg.members],
        created_at=new_reg.created_at,
        message="Registration successfully completed for DEFCON 2.0!",
    )
