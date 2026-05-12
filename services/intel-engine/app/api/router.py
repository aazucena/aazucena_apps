from fastapi import APIRouter, Depends
from app.api import indexing, brain, simulation
from app.api.deps import verify_api_key

api_router = APIRouter(dependencies=[Depends(verify_api_key)])

api_router.include_router(brain.router, prefix="/brain", tags=["brain"])
api_router.include_router(indexing.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(simulation.router, prefix="/labs", tags=["labs"])