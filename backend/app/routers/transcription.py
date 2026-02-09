from fastapi import APIRouter, HTTPException

from app.models.schemas import TranscriptionResponse
from app.services import audio_handler, transcriber
from app.services.session_manager import session_manager

router = APIRouter(prefix="/api/v1/sessions/{session_id}", tags=["transcription"])


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(session_id: str):
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session.audio_chunks:
        raise HTTPException(status_code=400, detail="No audio recorded")

    wav_data = audio_handler.combine_to_wav(session)
    text, language, duration = transcriber.transcribe(wav_data)

    session.transcription_text = text

    return TranscriptionResponse(
        session_id=session_id,
        text=text,
        language=language,
        duration=duration,
    )
