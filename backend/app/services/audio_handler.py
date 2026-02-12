import io
import tempfile

from pydub import AudioSegment

from app.models.session import Session


def add_chunk(session: Session, data: bytes) -> int:
    session.audio_chunks.append(data)
    session.touch()
    return len(session.audio_chunks)


def combine_to_wav(session: Session) -> bytes:
    if not session.audio_chunks:
        raise ValueError("No audio chunks recorded")

    # Concatenate raw bytes first — MediaRecorder chunks share a single
    # webm header (only the first chunk contains it), so they must be
    # joined before decoding.
    raw_webm = b"".join(session.audio_chunks)
    combined = AudioSegment.from_file(io.BytesIO(raw_webm), format="webm")

    # Convert to 16kHz mono WAV for Whisper
    combined = combined.set_frame_rate(16000).set_channels(1)

    buf = io.BytesIO()
    combined.export(buf, format="wav")
    return buf.getvalue()
