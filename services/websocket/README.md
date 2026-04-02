# 📡 AAZUCENA_WEBSOCKET // Real-time Broadcast Node

The central communication hub for the **AZUCENA_LYTICS** ecosystem, providing low-latency telemetry broadcasts and system health monitoring.

## 🚀 Role

- **Broadcast Bridge:** Receives internal signals (via POST) and broadcasts them to all connected dashboards via Socket.IO.
- **Heartbeat Monitor:** Periodically checks the health (HTTP 200/latency) of all core services (Strapi, ClickHouse, etc.) every 60 seconds.
- **Ingestion Reporting:** Automatically reports system integrity metrics back to the central Analytics Ingestion API.

## 🛠️ Tech Stack

- **Framework:** Node.js / Socket.IO
- **Language:** TypeScript
- **Internal Monitoring:** HTTP Heartbeats

## 📁 Key Files

- `src/bridge.ts`: The Socket.IO server and broadcast logic.
- `src/heartbeat.ts`: The automated service monitoring and reporting loop.
- `monitors.json`: Registry of services to be monitored.

## 📡 Endpoints

- `POST /emit`: Internal endpoint for broadcasting signals (Requires `WS_INTERNAL_SECRET`).
- `GET /status`: HTML dashboard for real-time uptime and client count.
- `WS /`: Socket.IO connection point for dashboards.

## 🔗 Integration

- **Source:** The `analytics` ingestion API triggers broadcasts on this node.
- **Client:** The **AZUCENA_LYTICS Terminal** connects to this for real-time live data updates.
