import os
import requests
import time
from typing import Optional

class IntelTelemetry:
    def __init__(self):
        self.bridge_url = os.getenv('INTEL_BRIDGE_URL', 'http://aazucena-intel-bridge:3001')
        self.secret_key = os.getenv('INGESTION_SECRET_KEY', '')

    def pulse_inference(self, agent: str, model: str, input_tokens: int, output_tokens: int, latency_ms: int, context: str = "engine_core"):
        """Reports AI metrics to the Intel Bridge."""
        payload = {
            "agent_name": agent,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "latency_ms": latency_ms,
            "context": context
        }
        try:
            requests.post(f"{self.bridge_url}/pulse/ai", json=payload, timeout=1.0)
        except Exception as e:
            print(f"⚠️ [Intel-Engine] Telemetry failed: {e}")

# Global Instance
telemetry = IntelTelemetry()
