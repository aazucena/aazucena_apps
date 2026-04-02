# 🤖 AAZUCENA_OLLAMA // Local LLM Runtime

The localized Large Language Model runtime that provides secure, offline-first inference and embedding generation.

## 🚀 Role

- **Model Hosting:** Serves `llama3.2` for agentic reasoning and `nomic-embed-text` for vector generation.
- **Privacy:** Ensures all portfolio intelligence data remains local to the server.
- **Acceleration:** Optimized for ROCm (AMD GPU) hardware for high-throughput inference.

## 🛠️ Tech Stack

- **Engine:** Ollama (Latest)
- **Interface:** OpenAI-Compatible API (Port 11434)
- **Deployment:** Docker (ROCm flavor for GPU support)

## 📁 Key Files

- `compose.yml`: GPU-aware container configuration.
- `ollama-data`: Persistent volume for downloaded model weights.

## 📡 Models

- `llama3.2`: Primary reasoning model for the `intel-engine`.
- `nomic-embed-text`: High-performance embedding model for documentation RAG.

## 🔗 Integration

- **Client:** The `intel-engine` and `indexer` call this service for all cognitive tasks.
