import os
import time
import asyncio
import requests
import redis
import clickhouse_connect
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any

# --- CONFIGURATION ---
INGEST_URL = os.getenv('INTERNAL_INGEST_URL', 'http://host.docker.internal:8080/api/ingest')
SECRET_KEY = os.getenv('INGESTION_SECRET_KEY')

REDIS_HOST = os.getenv('REDIS_HOST', 'aazucena-redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))

CH_HOST = os.getenv('CLICKHOUSE_HOST', 'aazucena-clickhouse')
CH_PORT = int(os.getenv('CLICKHOUSE_PORT', 8123))
CH_USER = os.getenv('CLICKHOUSE_USER', 'admin')
CH_PASS = os.getenv('CLICKHOUSE_PASSWORD', 'password')

# Global stats for the "UI Status" view
bridge_stats = {
    "start_time": time.time(),
    "events_processed": 0,
    "last_event_at": None,
    "errors": 0,
    "external_services": {
        "redis": "UNKNOWN",
        "clickhouse": "UNKNOWN"
    }
}

# --- SCHEMAS ---
class AiTelemetryEvent(BaseModel):
    agent_name: str
    model: str
    input_tokens: int
    output_tokens: int
    latency_ms: int
    context: Optional[str] = "python_runtime"

class SystemIntegrityEvent(BaseModel):
    service: str
    status: str
    latency_ms: Optional[int] = 0
    error_count: Optional[int] = 0
    message: Optional[str] = ""

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

# --- WATCHDOG LOGIC ---
_redis_client: Optional[redis.Redis] = None
_ch_client = None

def _get_redis() -> redis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, socket_timeout=2)
    return _redis_client

def _get_ch_client():
    global _ch_client
    if _ch_client is None:
        _ch_client = clickhouse_connect.get_client(
            host=CH_HOST, port=CH_PORT, username=CH_USER, password=CH_PASS, connect_timeout=2
        )
    return _ch_client

async def check_external_services():
    """Pings Redis and Clickhouse to report their health."""
    global _redis_client, _ch_client

    # 1. Check Redis
    try:
        if _get_redis().ping():
            bridge_stats["external_services"]["redis"] = "UP"
            forward_to_analytics({
                "type": "system_integrity",
                "service": "redis-cache",
                "status": "UP",
                "message": "Redis is responsive"
            })
    except Exception as e:
        bridge_stats["external_services"]["redis"] = "DOWN"
        _redis_client = None  # reset so next call reconnects
        forward_to_analytics({
            "type": "system_integrity",
            "service": "redis-cache",
            "status": "DOWN",
            "message": f"Redis Error: {str(e)}"
        })

    # 2. Check Clickhouse
    try:
        if _get_ch_client().ping():
            bridge_stats["external_services"]["clickhouse"] = "UP"
            forward_to_analytics({
                "type": "system_integrity",
                "service": "clickhouse-olap",
                "status": "UP",
                "message": "ClickHouse is responsive"
            })
    except Exception as e:
        bridge_stats["external_services"]["clickhouse"] = "DOWN"
        _ch_client = None  # reset so next call reconnects
        forward_to_analytics({
            "type": "system_integrity",
            "service": "clickhouse-olap",
            "status": "DOWN",
            "message": f"Clickhouse Error: {str(e)}"
        })

async def start_heartbeat():
    """Periodic self-pulse and watchdog to keep the Analytics Status Page alive."""
    print("💓 [Intel-Bridge] Starting periodic heartbeat and watchdog (60s)...")
    while True:
        try:
            # Self-pulse
            uptime = int(time.time() - bridge_stats["start_time"])
            forward_to_analytics({
                "type": "system_integrity",
                "service": "intel-bridge",
                "status": "UP",
                "latency_ms": 0,
                "message": f"Uptime: {uptime}s | Events: {bridge_stats['events_processed']}"
            })
            
            # Watchdog for externals
            await check_external_services()
            
        except Exception as e:
            print(f"❌ [Intel-Bridge] Heartbeat failed: {e}")
        
        await asyncio.sleep(60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌐 Intel Bridge: Initializing Lifespan...")
    heartbeat_task = asyncio.create_task(start_heartbeat())
    yield
    heartbeat_task.cancel()
    print("🌐 Intel Bridge: Shutting down...")

app = FastAPI(title="AAZUCENA_INTEL_BRIDGE", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINTS ---
@app.post("/pulse/ai")
async def pulse_ai(event: AiTelemetryEvent, background_tasks: BackgroundTasks):
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

@app.post("/pulse/health")
async def pulse_health(event: SystemIntegrityEvent, background_tasks: BackgroundTasks):
    payload = {
        "type": "system_integrity",
        "service": event.service,
        "status": event.status,
        "latency_ms": event.latency_ms,
        "error_count": event.error_count,
        "message": event.message
    }
    background_tasks.add_task(forward_to_analytics, payload)
    return {"status": "queued", "service": event.service}

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
                        <span class="font-bold uppercase tracking-wider">Redis Cache</span>
                        <span class="font-mono { 'text-emerald-500' if bridge_stats['external_services']['redis'] == 'UP' else 'text-rose-500' }">{bridge_stats['external_services']['redis']}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3 border-b border-zinc-800/50">
                        <span class="font-bold uppercase tracking-wider">ClickHouse OLAP</span>
                        <span class="font-mono { 'text-emerald-500' if bridge_stats['external_services']['clickhouse'] == 'UP' else 'text-rose-500' }">{bridge_stats['external_services']['clickhouse']}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3 border-b border-zinc-800/50">
                        <span class="font-bold uppercase tracking-wider">Last Pulse</span>
                        <span class="font-mono">{last_active}</span>
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
