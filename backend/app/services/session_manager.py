import uuid
from datetime import datetime, timedelta

from app.config import settings
from app.models.session import Session


class SessionManager:
    def __init__(self) -> None:
        self._sessions: dict[str, Session] = {}

    def create(self, meeting_name: str) -> Session:
        session_id = uuid.uuid4().hex[:12]
        session = Session(session_id=session_id, meeting_name=meeting_name)
        self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> Session | None:
        session = self._sessions.get(session_id)
        if session:
            session.touch()
        return session

    def delete(self, session_id: str) -> bool:
        return self._sessions.pop(session_id, None) is not None

    def cleanup_expired(self) -> int:
        ttl = timedelta(minutes=settings.session_ttl_minutes)
        now = datetime.now()
        expired = [
            sid
            for sid, s in self._sessions.items()
            if now - s.last_active > ttl
        ]
        for sid in expired:
            del self._sessions[sid]
        return len(expired)


session_manager = SessionManager()
