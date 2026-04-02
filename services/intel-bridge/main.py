import os
import time
import requests
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any

# --- CONFIGURATION ---
INGEST_URL = os.getenv('INTERNAL_INGEST_URL', 'http://host.docker.internal:8080/api/ingest')
SECRET_KEY = os.getenv('INGESTION_SECRET_KEY')

# Global stats for the "UI Status" view
bridge_stats = {
    "start_time": time.time(),
    "events_processed": 0,
    "last_event_at": None,
    "errors": 0
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌐 Intel Bridge: Initializing Lifespan...")
    # Setup background tasks or connections here
    yield
    print("🌐 Intel Bridge: Shutting down...")

app = FastAPI(title="AAZUCENA_INTEL_BRIDGE", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS ---
class AiTelemetryEvent(BaseModel):
    agent_name: str
    model: str
    input_tokens: int
    output_tokens: int
    latency_ms: int
    context: Optional[str] = "python_runtime"

# --- TELEMETRY LOGIC ---
def forward_to_analytics(payload: Dict[str, Any]):
    try:
        requests.post(
            INGEST_URL,
            json=payload,
            headers={'x-secret-key': SECRET_KEY},
            timeout=5
        )
        bridge_stats["events_processed"] += 1
        bridge_stats["last_event_at"] = time.time()
    except Exception as e:
        print(f"❌ [Intel-Bridge] Ingest failed: {e}")
        bridge_stats["errors"] += 1

# --- ENDPOINTS ---
@app.post("/pulse/ai")
async def pulse_ai(event: AiTelemetryEvent, background_tasks: BackgroundTasks):
    """
    Receives AI metrics from Python agents and forwards them to the Analytics Dashboard.
    Non-blocking: Uses BackgroundTasks for the network call.
    """
    payload = {
        "type": "ai_event",
        "agent_name": event.agent_name,
        "model": event.model,
        "input_tokens": event.input_tokens,
        "output_tokens": event.output_tokens,
        "latency_ms": event.latency_ms,
        "form_type": event.context,
        "sessionId": "intel_bridge_runtime"
    }
    background_tasks.add_task(forward_to_analytics, payload)
    return {"status": "queued", "agent": event.agent_name}

@app.get("/health")
async def health():
    return {
        "status": "UP",
        "uptime": int(time.time() - bridge_stats["start_time"]),
        "processed": bridge_stats["events_processed"],
        "service": "intel-bridge"
    }

@app.get("/")
async def root():
    return RedirectResponse(url="/status")

# --- THE "UI STATUS" VIEW ---
@app.get("/status", response_class=HTMLResponse)
async def status_ui():
    uptime = int(time.time() - bridge_stats["start_time"])
    last_active = "NEVER"
    if bridge_stats["last_event_at"]:
        last_active = time.strftime('%H:%M:%S', time.localtime(bridge_stats["last_event_at"]))

    return f"""
    <html>
        <head>
            <title>Intel Bridge Status</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <meta http-equiv="refresh" content="5">
        </head>
        <body class="bg-zinc-950 text-zinc-100 font-mono p-12 min-h-screen flex items-center justify-center">
            <div class="w-full max-w-2xl border border-zinc-800 rounded-[2rem] p-10 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
                <div class="flex items-center justify-between mb-10">
                    <div>
                        <h1 class="text-3xl font-black tracking-tighter text-white uppercase italic">AAZUCENA<span class="text-emerald-500">_INTEL_BRIDGE</span></h1>
                        <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">Python Telemetry Node</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-10">
                    <div class="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                        <p class="text-zinc-500 text-[9px] uppercase font-black tracking-widest mb-2">System Uptime</p>
                        <p class="text-4xl font-black tracking-tight">{uptime}<span class="text-sm text-zinc-600 ml-1">s</span></p>
                    </div>
                    <div class="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                        <p class="text-zinc-500 text-[9px] uppercase font-black tracking-widest mb-2">Events Pulsed</p>
                        <p class="text-4xl font-black tracking-tight text-emerald-400">{bridge_stats['events_processed']}</p>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3 border-b border-zinc-800/50">
                        <span class="font-bold uppercase tracking-wider">Last Pulse</span>
                        <span class="font-mono">{last_active}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3 border-b border-zinc-800/50">
                        <span class="font-bold uppercase tracking-wider">Ingest Target</span>
                        <span class="font-mono text-zinc-600 truncate max-w-[200px]">{INGEST_URL}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3">
                        <span class="font-bold uppercase tracking-wider">Error Count</span>
                        <span class={f"font-mono {'text-rose-500 font-bold' if bridge_stats['errors'] > 0 else 'text-zinc-600'}"}>{bridge_stats['errors']}</span>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
