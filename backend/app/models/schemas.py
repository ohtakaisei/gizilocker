from pydantic import BaseModel


class SessionCreate(BaseModel):
    meeting_name: str = "無題の会議"


class SessionResponse(BaseModel):
    session_id: str
    meeting_name: str


class DocumentResponse(BaseModel):
    filename: str
    chunk_count: int


class TranscriptionResponse(BaseModel):
    session_id: str
    text: str
    language: str
    duration: float


class MinutesRequest(BaseModel):
    meeting_name: str | None = None


class MinutesResponse(BaseModel):
    session_id: str
    minutes: str
    transcription_text: str
    document_count: int


class HealthResponse(BaseModel):
    status: str


class SessionHealthResponse(BaseModel):
    session_id: str
    audio_chunks: int
    documents: int
    has_transcription: bool
