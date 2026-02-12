from pathlib import Path

from pydantic_settings import BaseSettings

_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    openai_api_key: str = ""
    whisper_model_size: str = "base"
    session_ttl_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    model_config = {"env_file": str(_ENV_FILE), "env_file_encoding": "utf-8"}


settings = Settings()
