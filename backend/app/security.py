import secrets
import hmac
import hashlib
import time
from typing import Optional
import bcrypt
from app.config import settings


def generate_session_token() -> str:
    """Generate a cryptographically secure random token for participant sessions."""
    return secrets.token_hex(32)


def generate_registration_code() -> str:
    """Generate an authoritative, human-friendly registration identifier, e.g. DEFCON-2026-X7K9M2."""
    random_part = secrets.token_hex(3).upper()
    return f"DEFCON-2026-{random_part}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")


def create_admin_token(username: str) -> str:
    """Create a signed, tamper-proof admin token with timestamp."""
    timestamp = str(int(time.time()))
    payload = f"{username}:{timestamp}"
    signature = hmac.new(
        settings.ADMIN_SECRET.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{payload}:{signature}"


def verify_admin_token(token: Optional[str]) -> Optional[str]:
    """Verify admin token signature and expiration (max 24 hours). Returns username if valid."""
    if not token:
        return None
    try:
        parts = token.split(":")
        if len(parts) != 3:
            return None
        username, timestamp_str, signature = parts
        timestamp = int(timestamp_str)
        # Check token expiration (24 hours = 86400 seconds)
        if time.time() - timestamp > 86400:
            return None

        expected_payload = f"{username}:{timestamp_str}"
        expected_sig = hmac.new(
            settings.ADMIN_SECRET.encode("utf-8"),
            expected_payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        if hmac.compare_digest(signature, expected_sig):
            return username
    except Exception:
        return None
    return None
