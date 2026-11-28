import json
from typing import List, Dict, Any
from app.core.clickhouse import ch_core

class Sage:
    def __init__(self):
        self.ENTITY_KEYWORDS = ["traffic", "visitor", "popular", "performance", "health", "latency", "uptime"]

    def is_relevant(self, query: str) -> bool:
        """Checks if the query is relevant to telemetry or traffic."""
        query_lower = query.lower()
        return any(kw in query_lower for kw in self.ENTITY_KEYWORDS)

    async def get_traffic_summary(self) -> str:
        """Fetches a summary of traffic from first-party telemetry (visits and page views)."""
        try:
            client = ch_core.get_analytics_client()
            # Visits (per-tab sessions) and page views for the last 24 hours. Unique visitors
            # come with the visitor-experience lab's daily-salt count.
            query = """
                SELECT
                    uniqIf(sessionId, event = 'PageView') as visits,
                    countIf(event = 'PageView') as page_views
                FROM analytics.telemetry_events
                WHERE timestamp >= subtractHours(now(), 24)
            """
            result = client.query(query)
            row = result.result_rows[0] if result.result_rows else (0, 0)
            if not row[1]:
                return "No traffic data recorded in the last 24 hours."
            return f"Traffic (24h): {row[0]} visits, {row[1]} page views."
        except Exception as e:
            return f"Error fetching traffic: {str(e)}"

    async def get_health_summary(self) -> str:
        """Fetches a summary of system health from Analytics."""
        try:
            client = ch_core.get_analytics_client()
            # Query average latency and status of services
            query = """
                SELECT 
                    service,
                    any(status) as status,
                    avg(latency_ms) as avg_latency
                FROM analytics.system_integrity
                WHERE timestamp >= subtractHours(now(), 1)
                GROUP BY service
            """
            result = client.query(query)
            if not result.result_rows:
                return "No system health data recorded in the last hour."
            
            summary = "System Health (1h):\n"
            for row in result.result_rows:
                summary += f"- {row[0]}: {row[1]} (Avg Latency: {row[2]:.2f}ms)\n"
            return summary
        except Exception as e:
            return f"Error fetching system health: {str(e)}"

    async def discover_knowledge(self, query: str) -> str:
        """Combined insights based on query context."""
        insights = "\n---\n[KNOWLEDGE_SOURCE]: Telemetry Sage (Real-time Analytics)\n"
        
        query_lower = query.lower()
        if any(kw in query_lower for kw in ["traffic", "visitor", "popular"]):
            insights += await self.get_traffic_summary() + "\n"
            
        if any(kw in query_lower for kw in ["performance", "health", "latency", "uptime"]):
            insights += await self.get_health_summary() + "\n"
            
        insights += "---\n"
        return insights

# Global Instance
sage = Sage()