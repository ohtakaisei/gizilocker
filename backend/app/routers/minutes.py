from fastapi import APIRouter, HTTPException

from app.models.schemas import MinutesRequest, MinutesResponse
from app.services import minutes_generator
from app.services.session_manager import session_manager

router = APIRouter(prefix="/api/v1/sessions/{session_id}", tags=["minutes"])


@router.post("/generate-minutes", response_model=MinutesResponse)
async def generate_minutes(session_id: str, body: MinutesRequest | None = None):
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session.audio_chunks:
        raise HTTPException(status_code=400, detail="No audio recorded")

    meeting_name = body.meeting_name if body else None
    minutes, transcription = minutes_generator.generate(session, meeting_name)

    return MinutesResponse(
        session_id=session_id,
        minutes=minutes,
        transcription_text=transcription,
        document_count=len(session.document_names),
    )
