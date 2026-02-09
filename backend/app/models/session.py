from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Session:
    session_id: str
    meeting_name: str
    created_at: datetime = field(default_factory=datetime.now)
    last_active: datetime = field(default_factory=datetime.now)
    audio_chunks: list[bytes] = field(default_factory=list)
    document_names: list[str] = field(default_factory=list)
    transcription_text: str = ""
    has_vector_store: bool = False

    def touch(self) -> None:
        self.last_active = datetime.now()
