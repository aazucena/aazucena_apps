from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# --- Brain Schemas ---
class BrainQueryRequest(BaseModel):
    query: str = Field(..., example="What is the monorepo stack?")
    session_id: Optional[str] = Field(None, example="user-session-123")
    temperature: Optional[float] = Field(None, ge=0, le=2.0)

class BrainResponse(BaseModel):
    trajectory_id: str
    intent: str
    response: str

class BrainSyncResponse(BaseModel):
    status: str
    urls: Dict[str, str]

class SummarizeRequest(BaseModel):
    text: str
    scope: Optional[str] = "concise technical title"

class SummarizeResponse(BaseModel):
    title: str

# --- Knowledge Schemas ---
class KnowledgeSearchRequest(BaseModel):
    query: str = Field(..., example="Astro deployment")
    limit: int = Field(3, ge=1, le=10)

class KnowledgeSyncResponse(BaseModel):
    status: str
    target: str

# --- Lab/Simulation Schemas ---
class SimulationRequest(BaseModel):
    steps: int = Field(20, ge=1, le=100)
    env: Optional[str] = "GridWorld-Sim"
