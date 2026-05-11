# 🧠 AAZUCENA_INTEL_ENGINE // Cognitive Processing Node

The primary intelligence orchestrator for the portfolio, using LangGraph and RAG (Retrieval-Augmented Generation) to power the "Agentic Brain."

## 🚀 Role

- **Agentic Brain:** Orchestrates 7 specialized expert nodes (Librarian, Architect, Fiscal, etc.) via LangGraph.
- **Internal RAG:** Performs automated document indexing and vector search using `pgVector` and `Ollama`.
- **Telemetry Generation:** Emits detailed AI trajectories and token spend data to ClickHouse via `intel-bridge`.
- **System Sync:** Harmonizes prompts between Strapi CMS and LangSmith Hub.

## 🛠️ Tech Stack

- **Framework:** FastAPI / LangChain / LangGraph
- **LLM Runner:** Ollama (Llama 3.2 / Nomic-Embed-Text)
- **Vector DB:** PostgreSQL + `pgVector`
- **Observability:** LangSmith

## 📁 Key Files

- `app/core/brain.py`: The LangGraph state machine and expert registry.
- `app/services/indexer.py`: Document-to-vector synchronization.
- `app/services/librarian.py`: Structured data retrieval from Strapi.

## 📡 Endpoints

- `POST /brain/think`: Streaming SSE (Server-Sent Events) for AI reasoning.
- `POST /knowledge/sync`: Triggers re-indexing of `/app/data`. Supports `?force=true` for full re-sync.
- `POST /brain/sync`: Syncs local default prompts to LangSmith Hub.
- `GET /status`: Cognitive state and knowledge inventory UI.

## ⚙️ Configuration (`intel.config.json`)

You can control the scope of the Knowledge Base Indexing (KBI) using `intel.config.json`:

```json
{
  "indexing": {
    "include": ["docs/**/*.md", "context/*.md"],
    "exclude": ["**/temp-**", "**/ARCHIVE/**"]
  }
}
```

- **Differential Sync:** The engine uses MD5 hashing to skip unchanged files, significantly reducing startup overhead.
- **Support:** Markdown (`.md`) and PDF (`.pdf`) files are supported for indexing.

## 🔗 Integration

- **Source:** Reads documentation from root `/docs` and structured data from `aazucena-db`.
- **Target:** Connects to `aazucena-ollama` for local inference.
