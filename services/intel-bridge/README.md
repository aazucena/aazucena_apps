# 🌐 AAZUCENA_INTEL_BRIDGE // Python Telemetry Node

A lightweight Python/FastAPI bridge that handles real-time telemetry from external Python agents and local intelligence nodes.

## 🚀 Role

- **Event Forwarding:** Receives AI metrics (tokens, latency, model) from Python-based services and forwards them to the Analytics Dashboard.
- **Non-blocking Pulse:** Uses FastAPI `BackgroundTasks` to ensure telemetry reporting never blocks core inference.
- **Node Monitoring:** Provides a visual "UI Status" page at `/status` for real-time traffic monitoring.

## 🛠️ Tech Stack

- **Framework:** FastAPI / Uvicorn
- **Language:** Python 3.11
- **Styling:** Tailwind CSS (Status UI)

## 📡 Endpoints

- `POST /pulse/ai`: Receives `AiTelemetryEvent` payloads.
- `GET /status`: HTML dashboard for node health and throughput.
- `GET /health`: JSON status check for Docker healthchecks.

## 🔗 Integration

- **Target:** Forwards data to the central ingestion endpoint (Port 8080/api/ingest).
- **Security:** Requires `INGESTION_SECRET_KEY` for all write operations.
