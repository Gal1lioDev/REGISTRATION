import time
from collections import defaultdict
from typing import Dict, List, Tuple
from app.config import settings


class SubmissionRateLimiter:
    """In-memory sliding window rate limiter for failed challenge submissions per session."""

    def __init__(self):
        # Maps session_token -> list of failure timestamps
        self._failures: Dict[str, List[float]] = defaultdict(list)

    def is_rate_limited(self, session_token: str) -> Tuple[bool, int]:
        """
        Check if the session has exceeded the maximum failed attempts.
        Returns (is_limited, seconds_to_wait).
        """
        now = time.time()
        window = settings.SUBMISSION_RATE_LIMIT_WINDOW_SECONDS
        max_attempts = settings.MAX_SUBMISSION_ATTEMPTS

        timestamps = self._failures.get(session_token, [])
        # Prune old timestamps
        valid_timestamps = [t for t in timestamps if now - t < window]
        self._failures[session_token] = valid_timestamps

        if len(valid_timestamps) >= max_attempts:
            oldest = valid_timestamps[0]
            retry_after = int(window - (now - oldest)) + 1
            return True, max(1, retry_after)

        return False, 0

    def record_failure(self, session_token: str):
        """Record an incorrect answer submission timestamp."""
        now = time.time()
        self._failures[session_token].append(now)

    def reset_session(self, session_token: str):
        """Clear rate limit history for a session upon success or expiration."""
        if session_token in self._failures:
            del self._failures[session_token]


submission_rate_limiter = SubmissionRateLimiter()
