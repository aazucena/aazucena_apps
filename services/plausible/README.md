# 📉 AAZUCENA_PLAUSIBLE // Web Analytics Node

A self-hosted, privacy-first alternative to Google Analytics, providing site traffic insights without user tracking.

## 🚀 Role

- **Traffic Monitoring:** Tracks visitors, pageviews, and custom goal completions for the portfolio.
- **Privacy:** Lightweight scripts that respect user privacy (no cookies/GDPR compliant).
- **Dashboard:** Provides a clean web interface for traffic overview at `/`.

## 🛠️ Tech Stack

- **Engine:** Plausible Community Edition (v3.2.0)
- **Database:** PostgreSQL (Metadata) + ClickHouse (Events)
- **Interface:** Web Dashboard (Port 8000)

## 📁 Key Files

- `compose.yml`: Multi-container orchestrator for Plausible services.
- `logs.xml`: Performance-tuned ClickHouse logging.
- `low-resources.xml`: RAM-optimized configuration.

## 🔗 Integration

- **Tracking:** The `portfolio` app includes the Plausible tracking script.
- **Querying:** The `analytics` dashboard queries the Plausible ClickHouse DB via the `intel-engine`.
