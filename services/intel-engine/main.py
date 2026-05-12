import os
import time
import asyncio
import requests
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, RedirectResponse
from contextlib import asynccontextmanager
from app.core.database import reflect_db
from app.services.indexer import indexer
from app.core.brain import brain
from app.api.router import api_router

INTEL_BRIDGE_URL = os.getenv("INTEL_BRIDGE_URL", "")
INTEL_BRIDGE_SECRET = os.getenv("INTEL_BRIDGE_SECRET", "")

# Production: fetch docs from GitHub into a writable temp dir.
# Local dev: GITHUB_REPO is unset, so volume-mounted /app/data is used directly.
_DOCS_SYNC_PATH = "/tmp/github_sync" if os.getenv("GITHUB_REPO") else "/app/data"

async def start_heartbeat():
    """Periodic pulse to the Intel Bridge for the Analytics Dashboard."""
    print("💓 [Intel-Engine] Starting periodic heartbeat (60s)...")
    while True:
        try:
            if INTEL_BRIDGE_URL:
                payload = {
                    "service": "intel-engine",
                    "status": "UP",
                    "latency_ms": 0,
                    "message": "Neural engine operational"
                }
                headers = {"X-Bridge-Secret": INTEL_BRIDGE_SECRET} if INTEL_BRIDGE_SECRET else {}
                requests.post(f"{INTEL_BRIDGE_URL}/pulse/health", json=payload, headers=headers, timeout=5)
        except Exception as e:
            print(f"❌ [Intel-Engine] Heartbeat pulse failed: {e}")
        
        await asyncio.sleep(60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🧠 [Intel-Engine] INITIALIZING COGNITIVE SERVICES...")
    # Start heartbeat task
    heartbeat_task = asyncio.create_task(start_heartbeat())
    
    try:
        # 1. Initialize DB and pgVector extension
        print("🔗 [Database] Connecting to Postgres and ensuring pgvector...")
        await indexer.init_vector_store()
        
        # 2. Reflect Strapi Schema for Librarian
        await reflect_db()

        # 3. Ensure Prompts Table & Defaults
        print("🧠 [Brain] Syncing Prompts Schema...")
        await brain.sync_prompts_to_strapi()

        # 4. Automated Knowledge Sync (Internal RAG)
        print("📚 [Indexer] Starting Automated Knowledge Sync...")
        await indexer.fetch_github_docs(_DOCS_SYNC_PATH)
        await indexer.index_docs_folder(_DOCS_SYNC_PATH)
        
        print("✅ [Vector Store] Handshake Complete.")
    except Exception as e:
        print(f"❌ [Vector Store] FATAL INITIALIZATION ERROR: {e}")
    
    yield
    # Cleanup
    heartbeat_task.cancel()
    print("🧠 [Intel-Engine] Shutting down...")

app = FastAPI(title="AAZUCENA_INTEL_ENGINE", lifespan=lifespan)

# Register the Master API Router
app.include_router(api_router)

@app.get("/health")
async def health():
    return {"status": "UP", "service": "intel-engine"}

@app.get("/")
async def root():
    return RedirectResponse(url="/status")

@app.get("/status", response_class=HTMLResponse)
async def status_ui():
    return f"""
    <html>
        <head>
            <title>Intel Engine Status</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
                async function triggerSync(event, endpoint, label) {{
                    const btn = event.target;
                    const originalText = btn.innerText;
                    
                    const forceToggle = document.getElementById("force-reset-toggle");
                    let finalUrl = endpoint;
                    if (forceToggle && forceToggle.checked) {{
                        finalUrl += (endpoint.includes("?") ? "&" : "?") + "force=true";
                    }}

                    btn.innerText = "Syncing...";
                    btn.disabled = true;
                    try {{
                        const res = await fetch(finalUrl, {{method: 'POST'}});
                        if (res.ok) {{
                            btn.innerText = "✅ Done";
                            setTimeout(() => {{
                                btn.innerText = originalText;
                                btn.disabled = false;
                            }}, 2000);
                        }} else {{
                            throw new Error("Failed");
                        }}
                    }} catch (e) {{
                        btn.innerText = "❌ Error";
                        btn.classList.add("border-rose-500", "text-rose-500");
                        setTimeout(() => {{
                            btn.innerText = originalText;
                            btn.disabled = false;
                            btn.classList.remove("border-rose-500", "text-rose-500");
                        }}, 2000);
                    }}
                }}
            </script>
        </head>
        <body class="bg-zinc-950 text-zinc-100 font-mono p-12 min-h-screen flex items-center justify-center">
            <div class="w-full max-w-2xl border border-zinc-800 rounded-[2.5rem] p-10 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
                <div class="flex items-center justify-between mb-10">
                    <div>
                        <h1 class="text-3xl font-black tracking-tighter text-white uppercase italic tracking-widest">AAZUCENA<span class="text-rose-500">_INTEL_ENGINE</span></h1>
                        <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">Cognitive Processing Node</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <div class="p-6 bg-black/40 rounded-2xl border border-zinc-800 flex justify-between items-center transition-all hover:border-zinc-700">
                        <div class="flex flex-col">
                            <span class="text-zinc-500 text-[9px] uppercase font-black tracking-widest">Neural_State</span>
                            <span class="text-emerald-500 font-black tracking-tighter flex items-center gap-2 mt-1">
                                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                                SYSTEM_READY
                            </span>
                        </div>
                        <label class="flex items-center cursor-pointer group">
                            <div class="relative">
                                <input type="checkbox" id="force-reset-toggle" class="sr-only">
                                <div class="block bg-zinc-800 w-10 h-6 rounded-full border border-zinc-700 group-hover:border-zinc-600 transition-all"></div>
                                <div class="dot absolute left-1 top-1 bg-zinc-500 w-4 h-4 rounded-full transition-all"></div>
                            </div>
                            <div class="ml-3 text-zinc-500 text-[9px] uppercase font-black tracking-widest group-hover:text-zinc-300">Force_Reset</div>
                        </label>
                        <style>
                            #force-reset-toggle:checked ~ .dot {{
                                transform: translateX(100%);
                                background-color: #f43f5e;
                                box-shadow: 0 0 10px #f43f5e;
                            }}
                            #force-reset-toggle:checked ~ div:nth-child(2) {{
                                background-color: rgba(244, 63, 94, 0.1);
                                border-color: rgba(244, 63, 94, 0.4);
                            }}
                        </style>
                    </div>
                    <div class="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                        <p class="text-zinc-500 text-[9px] uppercase font-black tracking-widest mb-4">Knowledge_Inventory</p>
                        <div class="grid grid-cols-2 gap-4">
                            <button 
                                onclick="triggerSync(event, '/knowledge/sync')"
                                class="py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sync_Docs
                            </button>
                            <button 
                                onclick="triggerSync(event, '/brain/sync')"
                                class="py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase text-blue-500 hover:bg-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sync_Prompts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """