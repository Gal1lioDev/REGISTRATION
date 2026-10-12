import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "DEFCON 2.0 Registration System"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+psycopg://defcon_user:defcon_secret@localhost:5432/defcon_db"

    # CORS configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Security & Sessions
    SESSION_COOKIE_NAME: str = "defcon_session"
    SESSION_SECRET: str = "defcon_cyber_session_secret_key_change_in_production_2026"
    ADMIN_COOKIE_NAME: str = "defcon_admin_token"
    ADMIN_SECRET: str = "defcon_cyber_admin_secret_key_change_in_production_2026"
    SESSION_MAX_AGE: int = 60 * 60 * 24 * 7  # 7 days
    COOKIE_SECURE: bool = False  # Set to True in HTTPS production
    COOKIE_SAMESITE: str = "lax"

    # Admin credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "defcon_warangal_2026"

    # Event Metadata
    EVENT_NAME: str = "DEFCON 2.0"
    EVENT_FORMAT: str = "Attack – Defense"
    EVENT_DURATION: str = "4 Hours"
    EVENT_MODE: str = "Team (1 – 4 members)"
    EVENT_VENUE: str = "NIT Warangal"
    EVENT_DATE: str = "October 24, 2026"

    # Rate Limiting
    MAX_SUBMISSION_ATTEMPTS: int = 5
    SUBMISSION_RATE_LIMIT_WINDOW_SECONDS: int = 60

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
