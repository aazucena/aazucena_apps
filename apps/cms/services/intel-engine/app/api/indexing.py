from fastapi import APIRouter, BackgroundTasks
from app.services.indexer import indexer
from app.services.retriever import retriever
from app.api.schemas import KnowledgeSearchRequest, KnowledgeSyncResponse

router = APIRouter()

@router.post("/search")
async def search_knowledge(request: KnowledgeSearchRequest):
    """Search the vectorized documentation base for a query."""
    results = await retriever.find_relevant_docs(request.query, top_k=request.limit)
    return {"query": request.query, "results": results}

@router.post("/sync", response_model=KnowledgeSyncResponse)
async def sync_knowledge(background_tasks: BackgroundTasks):
    """Triggers the scan of /app/data/docs/ and indexing into pgVector."""
    docs_path = "/app/data/docs"
    background_tasks.add_task(indexer.index_docs_folder, docs_path)
    return {"status": "indexing_queued", "target": docs_path}