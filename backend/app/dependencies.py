from typing import Optional, Tuple
from fastapi import Request, Response, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models import ParticipantSession, utc_now
from app.security import generate_session_token, verify_admin_token


def get_or_create_participant_session(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> ParticipantSession:
    """
    Retrieve existing participant session from HttpOnly cookie or initialize a new one.
    Updates the session's last_seen_at and sets the cookie if newly created.
    """
    session_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    participant_session: Optional[ParticipantSession] = None

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent", "")[:500]

    if session_token:
        participant_session = (
            db.query(ParticipantSession)
            .filter(ParticipantSession.session_token == session_token)
            .first()
        )

    if participant_session:
        participant_session.last_seen_at = utc_now()
        participant_session.ip_address = client_ip
        participant_session.user_agent = user_agent
        db.commit()
        db.refresh(participant_session)
    else:
        new_token = generate_session_token()
        participant_session = ParticipantSession(
            session_token=new_token,
            ip_address=client_ip,
            user_agent=user_agent,
            challenge_1_completed=False,
            challenge_2_completed=False,
        )
        db.add(participant_session)
        db.commit()
        db.refresh(participant_session)

        # Set HttpOnly cookie
        response.set_cookie(
            key=settings.SESSION_COOKIE_NAME,
            value=new_token,
            max_age=settings.SESSION_MAX_AGE,
            httponly=True,
            samesite=settings.COOKIE_SAMESITE,
            secure=settings.COOKIE_SECURE,
            path="/",
        )

    return participant_session


def require_admin(request: Request) -> str:
    """Dependency that verifies admin authorization from cookie or Authorization header."""
    admin_token = request.cookies.get(settings.ADMIN_COOKIE_NAME)
    if not admin_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            admin_token = auth_header.split(" ", 1)[1].strip()

    username = verify_admin_token(admin_token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrative authorization required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
