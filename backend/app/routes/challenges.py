from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_or_create_participant_session
from app.models import ParticipantSession, ChallengeAttempt, utc_now
from app.schemas import (
    ChallengesListResponse,
    ChallengeInfo,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)
from app.challenges_data import (
    CHALLENGES,
    get_all_public_challenges,
    verify_challenge_answer,
)
from app.rate_limiter import submission_rate_limiter

router = APIRouter(prefix="/api/challenges", tags=["Challenges"])


@router.get("", response_model=ChallengesListResponse)
def list_challenges(
    session: ParticipantSession = Depends(get_or_create_participant_session),
):
    challenges = [
        ChallengeInfo(
            id=1,
            title=CHALLENGES[1]["title"],
            difficulty=CHALLENGES[1]["difficulty"],
            description=CHALLENGES[1]["description"],
            hints=CHALLENGES[1]["hints"],
            completed=session.challenge_1_completed,
        ),
        ChallengeInfo(
            id=2,
            title=CHALLENGES[2]["title"],
            difficulty=CHALLENGES[2]["difficulty"],
            description=CHALLENGES[2]["description"],
            hints=CHALLENGES[2]["hints"],
            completed=session.challenge_2_completed,
        ),
    ]

    return ChallengesListResponse(
        challenges=challenges,
        completed_count=session.completed_count,
        total_challenges=2,
    )


@router.post("/{challenge_id}/submit", response_model=SubmitAnswerResponse)
def submit_answer(
    challenge_id: int,
    payload: SubmitAnswerRequest,
    session: ParticipantSession = Depends(get_or_create_participant_session),
    db: Session = Depends(get_db),
):
    if challenge_id not in (1, 2):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Challenge {challenge_id} does not exist. Only challenges 1 and 2 are active.",
        )

    # Check already completed
    already_completed = (
        (challenge_id == 1 and session.challenge_1_completed)
        or (challenge_id == 2 and session.challenge_2_completed)
    )
    if already_completed:
        return SubmitAnswerResponse(
            success=True,
            message=f"[✓] Challenge {challenge_id} ({CHALLENGES[challenge_id]['title']}) is already solved!",
            challenge_id=challenge_id,
            completed_count=session.completed_count,
            total_challenges=2,
            is_unlocked=session.is_eligible_for_registration,
        )

    # Check rate limit
    is_limited, wait_seconds = submission_rate_limiter.is_rate_limited(session.session_token)
    if is_limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: Too many failed attempts. Try again in {wait_seconds} seconds.",
        )

    # Validate answer
    is_correct = verify_challenge_answer(challenge_id, payload.answer)

    # Record attempt in database
    attempt = ChallengeAttempt(
        session_id=session.id,
        challenge_id=challenge_id,
        submitted_answer=payload.answer[:200],
        is_correct=is_correct,
    )
    db.add(attempt)

    if is_correct:
        if challenge_id == 1:
            session.challenge_1_completed = True
            session.challenge_1_completed_at = utc_now()
        elif challenge_id == 2:
            session.challenge_2_completed = True
            session.challenge_2_completed_at = utc_now()

        db.commit()
        db.refresh(session)
        submission_rate_limiter.reset_session(session.session_token)

        unlock_msg = ""
        if session.is_eligible_for_registration:
            unlock_msg = "\n[!] ACCESS GRANTED: All challenges solved! Type 'register' to complete registration."

        return SubmitAnswerResponse(
            success=True,
            message=f"[+] Correct! Challenge {challenge_id} ({CHALLENGES[challenge_id]['title']}) solved! ({session.completed_count}/2){unlock_msg}",
            challenge_id=challenge_id,
            completed_count=session.completed_count,
            total_challenges=2,
            is_unlocked=session.is_eligible_for_registration,
        )
    else:
        submission_rate_limiter.record_failure(session.session_token)
        db.commit()

        return SubmitAnswerResponse(
            success=False,
            message=f"[-] Incorrect keyword submitted for Challenge {challenge_id}. Check hints with 'hint {challenge_id}'.",
            challenge_id=challenge_id,
            completed_count=session.completed_count,
            total_challenges=2,
            is_unlocked=session.is_eligible_for_registration,
        )
