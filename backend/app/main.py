import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import audio, documents, health, minutes, sessions, transcription
from app.services.session_manager import session_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: begin periodic cleanup
    task = asyncio.create_task(_cleanup_loop())
    yield
    # Shutdown
    task.cancel()


async def _cleanup_loop():
    while True:
        await asyncio.sleep(300)  # every 5 minutes
        session_manager.cleanup_expired()


app = FastAPI(title="Gizilocker", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(sessions.router)
app.include_router(documents.router)
app.include_router(audio.router)
app.include_router(transcription.router)
app.include_router(minutes.router)
