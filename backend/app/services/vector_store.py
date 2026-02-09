from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

from app.config import settings

_stores: dict[str, FAISS] = {}


def _embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=settings.openai_api_key,
    )


def add_chunks(session_id: str, chunks: list[str]) -> int:
    emb = _embeddings()
    if session_id in _stores:
        _stores[session_id].add_texts(chunks)
    else:
        _stores[session_id] = FAISS.from_texts(chunks, emb)
    return len(chunks)


def search(session_id: str, query: str, k: int = 8) -> list[str]:
    store = _stores.get(session_id)
    if not store:
        return []
    docs = store.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]


def delete(session_id: str) -> None:
    _stores.pop(session_id, None)
