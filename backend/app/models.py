from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class ParticipantSession(Base):
    __tablename__ = "participant_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String(64), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    last_seen_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
    ip_address = Column(String(64), nullable=True)
    user_agent = Column(String(500), nullable=True)

    challenge_1_completed = Column(Boolean, default=False, nullable=False)
    challenge_1_completed_at = Column(DateTime(timezone=True), nullable=True)
    challenge_2_completed = Column(Boolean, default=False, nullable=False)
    challenge_2_completed_at = Column(DateTime(timezone=True), nullable=True)

    attempts = relationship("ChallengeAttempt", back_populates="session", cascade="all, delete-orphan")
    registration = relationship("Registration", back_populates="session", uselist=False)

    @property
    def completed_count(self) -> int:
        return (1 if self.challenge_1_completed else 0) + (1 if self.challenge_2_completed else 0)

    @property
    def is_eligible_for_registration(self) -> bool:
        return self.challenge_1_completed and self.challenge_2_completed


class ChallengeAttempt(Base):
    __tablename__ = "challenge_attempts"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("participant_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge_id = Column(Integer, nullable=False, index=True)
    submitted_answer = Column(String(200), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    session = relationship("ParticipantSession", back_populates="attempts")


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    registration_code = Column(String(32), unique=True, index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("participant_sessions.id", ondelete="SET NULL"), unique=True, nullable=True)
    
    team_name = Column(String(100), nullable=False)
    institution = Column(String(150), nullable=False)
    leader_name = Column(String(100), nullable=False)
    leader_email = Column(String(255), unique=True, index=True, nullable=False)
    leader_phone = Column(String(25), nullable=False)
    team_size = Column(Integer, nullable=False)  # 1 to 4
    agreed_to_rules = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    session = relationship("ParticipantSession", back_populates="registration")
    members = relationship("TeamMember", back_populates="registration", cascade="all, delete-orphan", order_by="TeamMember.member_index")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(Integer, ForeignKey("registrations.id", ondelete="CASCADE"), nullable=False, index=True)
    member_index = Column(Integer, nullable=False)  # 2, 3, or 4
    full_name = Column(String(100), nullable=False)

    registration = relationship("Registration", back_populates="members")
