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

    combined = AudioSegment.empty()
    for chunk in session.audio_chunks:
        segment = AudioSegment.from_file(io.BytesIO(chunk), format="webm")
        combined += segment

    # Convert to 16kHz mono WAV for Whisper
    combined = combined.set_frame_rate(16000).set_channels(1)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        combined.export(f.name, format="wav")
        f.seek(0)
        with open(f.name, "rb") as wav_file:
            return wav_file.read()
