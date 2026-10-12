import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.config import settings
from app.database import get_db
from app.dependencies import require_admin
from app.models import Registration, TeamMember, ParticipantSession
from app.schemas import (
    AdminLoginRequest,
    AdminRegistrationItem,
    AdminStats,
)
from app.security import create_admin_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/login")
def admin_login(payload: AdminLoginRequest, response: Response):
    # Verify username and password
    valid_user = payload.username == settings.ADMIN_USERNAME
    valid_pass = payload.password == settings.ADMIN_PASSWORD

    if not (valid_user and valid_pass):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrative username or password.",
        )

    token = create_admin_token(payload.username)

    # Set HttpOnly cookie
    response.set_cookie(
        key=settings.ADMIN_COOKIE_NAME,
        value=token,
        max_age=86400,  # 24 hours
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/",
    )

    return {
        "success": True,
        "message": "Administrative session established.",
        "username": payload.username,
        "token": token,
    }


@router.post("/logout")
def admin_logout(response: Response):
    response.delete_cookie(
        key=settings.ADMIN_COOKIE_NAME,
        path="/",
    )
    return {"success": True, "message": "Admin session terminated."}


@router.get("/me")
def check_admin_status(username: str = Depends(require_admin)):
    return {
        "authenticated": True,
        "username": username,
    }


@router.get("/registrations")
def get_registrations(
    q: Optional[str] = None,
    username: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Registration)

    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Registration.team_name.ilike(term),
                Registration.institution.ilike(term),
                Registration.leader_name.ilike(term),
                Registration.leader_email.ilike(term),
                Registration.registration_code.ilike(term),
            )
        )

    registrations = query.order_by(Registration.created_at.desc()).all()

    items: List[AdminRegistrationItem] = []
    total_participants = 0
    t1 = t2 = t3 = t4 = 0

    for reg in registrations:
        members_list = [m.full_name for m in reg.members]
        items.append(
            AdminRegistrationItem(
                id=reg.id,
                registration_code=reg.registration_code,
                team_name=reg.team_name,
                institution=reg.institution,
                leader_name=reg.leader_name,
                leader_email=reg.leader_email,
                leader_phone=reg.leader_phone,
                team_size=reg.team_size,
                members=members_list,
                created_at=reg.created_at,
            )
        )
        total_participants += reg.team_size
        if reg.team_size == 1:
            t1 += 1
        elif reg.team_size == 2:
            t2 += 1
        elif reg.team_size == 3:
            t3 += 1
        elif reg.team_size == 4:
            t4 += 1

    # Sessions who completed both challenges
    completed_sessions = (
        db.query(ParticipantSession)
        .filter(
            ParticipantSession.challenge_1_completed.is_(True),
            ParticipantSession.challenge_2_completed.is_(True),
        )
        .count()
    )

    stats = AdminStats(
        total_registrations=len(items),
        total_participants=total_participants,
        completed_challenges_sessions=completed_sessions,
        teams_1_person=t1,
        teams_2_person=t2,
        teams_3_person=t3,
        teams_4_person=t4,
    )

    return {
        "items": items,
        "stats": stats,
    }


@router.get("/registrations/export")
def export_registrations_csv(
    username: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    registrations = db.query(Registration).order_by(Registration.created_at.asc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Registration Code",
        "Team Name",
        "Institution",
        "Team Leader",
        "Leader Email",
        "Leader Phone",
        "Team Size",
        "Other Members",
        "Agreed to Rules",
        "Registered At (UTC)",
    ])

    for reg in registrations:
        members_str = ", ".join([m.full_name for m in reg.members])
        writer.writerow([
            reg.registration_code,
            reg.team_name,
            reg.institution,
            reg.leader_name,
            reg.leader_email,
            reg.leader_phone,
            reg.team_size,
            members_str,
            "Yes" if reg.agreed_to_rules else "No",
            reg.created_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=defcon_2_registrations.csv",
        },
    )
