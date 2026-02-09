from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.audio_handler import add_chunk
from app.services.session_manager import session_manager

router = APIRouter(tags=["audio"])


@router.websocket("/api/v1/sessions/{session_id}/audio")
async def audio_websocket(websocket: WebSocket, session_id: str):
    session = session_manager.get(session_id)
    if not session:
        await websocket.close(code=4004, reason="Session not found")
        return

    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            count = add_chunk(session, data)
            await websocket.send_json({"chunks": count})
    except WebSocketDisconnect:
        pass
