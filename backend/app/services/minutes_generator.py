from app.models.session import Session
from app.services import audio_handler, rag_agent, transcriber


def generate(session: Session, meeting_name: str | None = None) -> tuple[str, str]:
    """Run full pipeline: combine audio → transcribe → RAG → minutes.

    Returns (minutes_markdown, transcription_text).
    """
    name = meeting_name or session.meeting_name

    # Step 1: Combine audio and transcribe
    if not session.transcription_text:
        wav_data = audio_handler.combine_to_wav(session)
        text, _, _ = transcriber.transcribe(wav_data)
        session.transcription_text = text

    # Step 2: Generate minutes with RAG
    minutes = rag_agent.generate_minutes(
        transcription=session.transcription_text,
        meeting_name=name,
        session_id=session.session_id,
    )

    return minutes, session.transcription_text
