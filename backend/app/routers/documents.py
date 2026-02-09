from fastapi import APIRouter, HTTPException, UploadFile

from app.models.schemas import DocumentResponse
from app.services import document_processor, vector_store
from app.services.session_manager import session_manager

router = APIRouter(prefix="/api/v1/sessions/{session_id}/documents", tags=["documents"])


@router.post("", response_model=DocumentResponse, status_code=201)
async def upload_document(session_id: str, file: UploadFile):
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    content = await file.read()
    text = document_processor.extract_text(file.filename or "file.txt", content)

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted")

    chunks = document_processor.split_into_chunks(text)
    vector_store.add_chunks(session_id, chunks)

    session.document_names.append(file.filename or "unknown")
    session.has_vector_store = True

    return DocumentResponse(filename=file.filename or "unknown", chunk_count=len(chunks))
