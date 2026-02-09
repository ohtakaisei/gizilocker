from fastapi import APIRouter, HTTPException

from app.models.schemas import SessionCreate, SessionResponse
from app.services.session_manager import session_manager

router = APIRouter(prefix="/api/v1/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=201)
async def create_session(body: SessionCreate):
    session = session_manager.create(body.meeting_name)
    return SessionResponse(
        session_id=session.session_id,
        meeting_name=session.meeting_name,
    )


@router.delete("/{session_id}", status_code=204)
async def delete_session(session_id: str):
    if not session_manager.delete(session_id):
        raise HTTPException(status_code=404, detail="Session not found")
