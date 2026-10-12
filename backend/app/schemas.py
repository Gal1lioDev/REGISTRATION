from datetime import datetime
from typing import List, Optional
import re
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class EventInfoResponse(BaseModel):
    name: str
    format: str
    duration: str
    mode: str
    venue: str
    date: str


class SessionResponse(BaseModel):
    session_token: str
    challenge_1_completed: bool
    challenge_2_completed: bool
    completed_count: int
    is_eligible: bool
    registered: bool
    registration_code: Optional[str] = None
    event_info: EventInfoResponse

    model_config = ConfigDict(from_attributes=True)


class ChallengeInfo(BaseModel):
    id: int
    title: str
    difficulty: str
    description: str
    hints: List[str]
    completed: bool


class ChallengesListResponse(BaseModel):
    challenges: List[ChallengeInfo]
    completed_count: int
    total_challenges: int = 2


class SubmitAnswerRequest(BaseModel):
    answer: str = Field(..., min_length=1, max_length=200, description="Submitted answer")

    @field_validator("answer")
    @classmethod
    def clean_answer(cls, v: str) -> str:
        return v.strip()


class SubmitAnswerResponse(BaseModel):
    success: bool
    message: str
    challenge_id: int
    completed_count: int
    total_challenges: int = 2
    is_unlocked: bool
    detail: Optional[str] = None


class ProgressResponse(BaseModel):
    challenge_1_completed: bool
    challenge_2_completed: bool
    completed_count: int
    total_challenges: int = 2
    is_unlocked: bool
    registered: bool
    registration_code: Optional[str] = None


class RegistrationCreate(BaseModel):
    team_name: str = Field(..., min_length=2, max_length=100)
    institution: str = Field(..., min_length=2, max_length=150)
    leader_name: str = Field(..., min_length=2, max_length=100)
    leader_email: EmailStr
    leader_phone: str = Field(..., min_length=7, max_length=20)
    team_size: int = Field(..., ge=1, le=4)
    members: List[str] = Field(default_factory=list)
    agreed_to_rules: bool = Field(..., description="Must agree to competition rules")

    @field_validator("leader_name", "team_name", "institution")
    @classmethod
    def strip_text(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Field cannot be empty or only spaces")
        return val

    @field_validator("leader_email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("leader_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        clean = re.sub(r"[\s\-\(\)\+]", "", v)
        if len(clean) < 7 or len(clean) > 15 or not clean.isdigit():
            raise ValueError("Please provide a valid phone number (7 to 15 digits)")
        return v.strip()

    @field_validator("agreed_to_rules")
    @classmethod
    def validate_rules_agreement(cls, v: bool) -> bool:
        if not v:
            raise ValueError("You must agree to the event rules and privacy notice to register")
        return v


class RegistrationResponse(BaseModel):
    success: bool = True
    registration_code: str
    team_name: str
    institution: str
    leader_name: str
    leader_email: str
    team_size: int
    members: List[str]
    created_at: datetime
    message: str


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminRegistrationItem(BaseModel):
    id: int
    registration_code: str
    team_name: str
    institution: str
    leader_name: str
    leader_email: str
    leader_phone: str
    team_size: int
    members: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminStats(BaseModel):
    total_registrations: int
    total_participants: int
    completed_challenges_sessions: int
    teams_1_person: int
    teams_2_person: int
    teams_3_person: int
    teams_4_person: int
