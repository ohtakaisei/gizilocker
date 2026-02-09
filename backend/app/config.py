from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    whisper_model_size: str = "base"
    session_ttl_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
