import os
import time
import uuid
import random
import requests
from typing import List, Dict, Any

class RLAgent:
    def __init__(self):
        # Default to host.docker.internal for local dev if analytics is on host
        self.ingest_url = os.getenv("INTERNAL_INGEST_URL", "http://host.docker.internal:8080/api/ingest")
        self.secret_key = os.getenv("INGESTION_SECRET_KEY", "dev-secret-123")
        
    def _send_ai_event(self, model: str, agent_name: str, input_tokens: int, output_tokens: int, latency_ms: int, session_id: str, trace_id: str = ""):
        print(f"📡 [RL-Agent] Attempting AI event ingestion to: {self.ingest_url}")
        payload = {
            "type": "ai_event",
            "model": model,
            "agent_name": agent_name,
            "input_tokens": int(input_tokens),
            "output_tokens": int(output_tokens),
            "latency_ms": int(latency_ms),
            "trace_id": trace_id or f"trace_{uuid.uuid4().hex[:8]}",
            "sessionId": session_id,
            "form_type": "brain_query"
        }
        
        try:
            headers = {"x-secret-key": self.secret_key}
            response = requests.post(self.ingest_url, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"✅ [RL-Agent] AI Event Ingested: {agent_name}")
            else:
                print(f"❌ [RL-Agent] AI Event Ingestion failed ({response.status_code}): {response.text}")
        except Exception as e:
            print(f"❌ [RL-Agent] Error sending AI event: {e}")

    async def run_simulation(self, steps: int = 10):
        """Simulates a simple trajectory and emits events."""
        trajectory_id = f"traj_{uuid.uuid4().hex[:8]}"
        session_id = str(uuid.uuid4())
        print(f"🎮 [RL-Agent] Starting Trajectory: {trajectory_id}")
        
        current_pos = [0, 0]
        goal = [3, 3]
        
        for i in range(steps):
            state = {"pos": current_pos, "goal": goal}
            
            # Simple policy: move towards goal
            if current_pos[0] < goal[0]:
                action = "MOVE_RIGHT"
                current_pos[0] += 1
            elif current_pos[1] < goal[1]:
                action = "MOVE_DOWN"
                current_pos[1] += 1
            else:
                action = "REACH_GOAL"
            
            # Reward logic
            reward = 1.0 if action == "REACH_GOAL" else -0.1
            if current_pos == goal and action != "REACH_GOAL":
                reward = 10.0
                
            self._send_step(trajectory_id, i, state, action, reward, session_id)
            print(f"   Step {i}: {action} -> {current_pos} (Reward: {reward})")
            
            if action == "REACH_GOAL":
                break
                
            time.sleep(0.5) # Simulate processing time

        print(f"🏁 [RL-Agent] Trajectory Complete: {trajectory_id}")

    def _send_step(self, trajectory_id: str, step: int, state: Dict, action: str, reward: float, session_id: str, observation: str = ""):
        print(f"📡 [RL-Agent] Attempting trajectory step ingestion to: {self.ingest_url}")
        
        # Use provided rich observation, or fallback to state dump
        final_observation = observation if observation else json.dumps(state)
        
        payload = {
            "type": "ai_trajectory",
            "trajectory_id": trajectory_id,
            "step_index": step,
            "state": state, # Keep raw state for legacy/debug
            "observation": final_observation, # NEW: Dedicated field for the flux
            "action": action,
            "reward": reward,
            "sessionId": session_id,
            "metadata": {
                "agent_version": "1.0.0",
                "env": "Intel-Brain-Logic",
                "raw_observation": len(final_observation)
            }
        }
        
        try:
            headers = {"x-secret-key": self.secret_key}
            response = requests.post(self.ingest_url, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"✅ [RL-Agent] Trajectory Step Ingested: {step}")
            else:
                print(f"❌ [RL-Agent] Trajectory Step Ingestion failed ({response.status_code}): {response.text}")
        except Exception as e:
            print(f"❌ [RL-Agent] Error sending trajectory step: {e}")

# Global Instance
rl_agent = RLAgent()
