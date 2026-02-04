from fastapi import APIRouter, BackgroundTasks
from app.core.rl_agent import rl_agent
from app.api.schemas import SimulationRequest

router = APIRouter()

@router.post("/simulate")
async def simulate_rl(background_tasks: BackgroundTasks, request: SimulationRequest):
    """Triggers an RL agent simulation that emits trajectory steps to ClickHouse."""
    background_tasks.add_task(rl_agent.run_simulation, request.steps)
    return {"status": "simulation_queued", "steps": request.steps, "env": request.env}
