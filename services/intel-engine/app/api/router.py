from fastapi import APIRouter
from app.api import indexing, brain, simulation

api_router = APIRouter()

# Refactored Clean REST Routes
api_router.include_router(brain.router, prefix="/brain", tags=["brain"])
api_router.include_router(indexing.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(simulation.router, prefix="/labs", tags=["labs"])