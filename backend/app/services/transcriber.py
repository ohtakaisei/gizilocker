import tempfile

from faster_whisper import WhisperModel

from app.config import settings

_model: WhisperModel | None = None


def _get_model() -> WhisperModel:
    global _model
    if _model is None:
        _model = WhisperModel(settings.whisper_model_size, compute_type="int8")
    return _model


def transcribe(wav_data: bytes) -> tuple[str, str, float]:
    """Transcribe WAV data. Returns (text, language, duration)."""
    model = _get_model()

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(wav_data)
        f.flush()
        segments, info = model.transcribe(
            f.name,
            language="ja",
            vad_filter=True,
        )

    text = "".join(seg.text for seg in segments)
    return text, info.language, info.duration
