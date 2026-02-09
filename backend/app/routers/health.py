from fastapi import APIRouter, HTTPException

from app.models.schemas import HealthResponse, SessionHealthResponse
from app.services.session_manager import session_manager

router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")


@router.get("/sessions/{session_id}/health", response_model=SessionHealthResponse)
async def session_health(session_id: str):
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionHealthResponse(
        session_id=session.session_id,
        audio_chunks=len(session.audio_chunks),
        documents=len(session.document_names),
        has_transcription=bool(session.transcription_text),
    )
