from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.dependencies import get_or_create_participant_session
from app.models import ParticipantSession
from app.schemas import SessionResponse, ProgressResponse, EventInfoResponse

router = APIRouter(prefix="/api", tags=["Session"])


@router.get("/session", response_model=SessionResponse)
def get_session(
    session: ParticipantSession = Depends(get_or_create_participant_session),
):
    event_info = EventInfoResponse(
        name=settings.EVENT_NAME,
        format=settings.EVENT_FORMAT,
        duration=settings.EVENT_DURATION,
        mode=settings.EVENT_MODE,
        venue=settings.EVENT_VENUE,
        date=settings.EVENT_DATE,
    )

    reg = session.registration
    return SessionResponse(
        session_token=session.session_token,
        challenge_1_completed=session.challenge_1_completed,
        challenge_2_completed=session.challenge_2_completed,
        completed_count=session.completed_count,
        is_eligible=session.is_eligible_for_registration,
        registered=reg is not None,
        registration_code=reg.registration_code if reg else None,
        event_info=event_info,
    )


@router.get("/progress", response_model=ProgressResponse)
def get_progress(
    session: ParticipantSession = Depends(get_or_create_participant_session),
):
    reg = session.registration
    return ProgressResponse(
        challenge_1_completed=session.challenge_1_completed,
        challenge_2_completed=session.challenge_2_completed,
        completed_count=session.completed_count,
        total_challenges=2,
        is_unlocked=session.is_eligible_for_registration,
        registered=reg is not None,
        registration_code=reg.registration_code if reg else None,
    )
