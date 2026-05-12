import os
from fastapi import APIRouter, BackgroundTasks
from app.services.indexer import indexer
from app.services.retriever import retriever
from app.api.schemas import KnowledgeSearchRequest, KnowledgeSyncResponse

router = APIRouter()

@router.get("/search")
async def search_knowledge_get(q: str, top_k: int = 5):
    """GET-friendly search used by portfolio RAG context fetcher."""
    results = await retriever.find_relevant_docs(q, top_k=top_k)
    return {"results": results}

@router.post("/search")
async def search_knowledge(request: KnowledgeSearchRequest):
    """Search the vectorized documentation base for a query."""
    results = await retriever.find_relevant_docs(request.query, top_k=request.limit)
    return {"query": request.query, "results": results}

@router.post("/sync", response_model=KnowledgeSyncResponse)
async def sync_knowledge(background_tasks: BackgroundTasks, force: bool = False):
    """Triggers a knowledge re-sync: GitHub in production, local /app/data in dev."""
    if os.getenv("GITHUB_REPO"):
        background_tasks.add_task(indexer.index_github_docs, force)
        return {"status": "indexing_queued", "target": "github"}
    background_tasks.add_task(indexer.index_docs_folder, "/app/data", force=force)
    return {"status": "indexing_queued", "target": "/app/data"}