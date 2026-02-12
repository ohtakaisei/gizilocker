import io

from openai import OpenAI

from app.config import settings


def transcribe(wav_data: bytes) -> tuple[str, str, float]:
    """Transcribe WAV data via OpenAI Whisper API. Returns (text, language, duration)."""
    client = OpenAI(api_key=settings.openai_api_key)

    audio_file = io.BytesIO(wav_data)
    audio_file.name = "audio.wav"

    result = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        language="ja",
        response_format="verbose_json",
    )

    return result.text, result.language, result.duration
