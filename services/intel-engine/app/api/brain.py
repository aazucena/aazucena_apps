from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from app.core.brain import brain
from app.api.schemas import BrainQueryRequest, BrainResponse, BrainSyncResponse, SummarizeRequest, SummarizeResponse

router = APIRouter()

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest):
    """Generate an AI summary title for a given text."""
    title = await brain.summarize(request.text, request.scope)
    return {"title": title}

@router.get("/schema")
async def get_brain_schema():
    """Returns the graph structure (nodes and edges) for dynamic visualization."""
    return await brain.get_graph_schema()

@router.post("/sync", response_model=BrainSyncResponse)
async def sync_brain_prompts(force: bool = False):
    """Seeds local default prompts into the LangSmith Hub."""
    urls = await brain.push_default_prompts(force_reset=force)
    return {
        "status": "success",
        "urls": urls
    }

@router.post("/think")

async def query_brain(request: BrainQueryRequest, req: Request):

    """Process a user query through the LangGraph agentic brain with SSE streaming."""

    generator = brain.process_query(request.query, request.session_id, request.temperature)

    return EventSourceResponse(generator)
