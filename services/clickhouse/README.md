# 📊 AAZUCENA_LYTICS // ClickHouse OLAP Node

This service provides the high-performance OLAP (Online Analytical Processing) backbone for the portfolio's telemetry and engineering intelligence.

## 🚀 Role

- **Data Warehouse:** Stores high-volume telemetry events, AI trajectories, and system integrity logs.
- **Aggregation:** Uses Materialized Views (`mv_daily_event_summary`, etc.) to accelerate dashboard queries.
- **Security:** Implements RBAC (Role-Based Access Control) with restricted users for ingestion and viewing.

## 🛠️ Tech Stack

- **Engine:** ClickHouse Server (Latest)
- **Interface:** `clickhouse-connect` (Python) / HTTP (Port 8123)
- **Optimization:** Low-resource configuration for <2GB RAM environments.

## 📁 Key Files

- `scripts/01_init_analytics_schema.sql`: Core table definitions.
- `scripts/02_materialized_views.sql`: Performance aggregation layer.
- `scripts/03_rbac_security.sql`: User and permission management.
- `backup.sh`: Automated native database backups.

## 🔗 Integration

- **Ingestion:** Receives data via the Analytics Dashboard's ingestion API.
- **Querying:** Queried by the `intel-engine` and `analytics` app for real-time insights.
