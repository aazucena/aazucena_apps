import os
from typing import List, Dict, Any

class NavigatorExpert:
    """
    Expert specialized in Monorepo Logistics and Architectural Routing.
    Maps out the 'paths' between services, apps, and packages.
    """
    def __init__(self):
        self.service_map = {
            "telemetry": ["portfolio", "intel-bridge", "clickhouse", "analytics"],
            "cms_data": ["strapi", "postgres", "cloudinary", "portfolio"],
            "ai_inference": ["analytics", "intel-engine", "ollama", "langsmith"],
            "deployments": ["vercel", "railway", "github-actions"]
        }

    def is_relevant(self, query: str) -> bool:
        """Determines if the query asks about routing, flow, or monorepo structure."""
        keywords = ["route", "flow", "path", "connect", "architecture", "structure", "how does", "pipeline"]
        return any(k in query.lower() for k in keywords)

    async def discover_knowledge(self, query: str) -> str:
        """Simulates architectural pathfinding logic."""
        print(f"🧭 [Navigator] Mapping architectural path for: {query}")
        
        # Simple logic to find related pipelines
        found_paths = []
        for pipeline, services in self.service_map.items():
            if any(word in query.lower() for word in pipeline.split("_")):
                found_paths.append(f"PIPELINE: {pipeline.upper()}\nPATH: {' ➔ '.join(services)}")
        
        if not found_paths:
            return "NAVIGATOR_INFO: Monorepo uses a pnpm-workspace structure with apps/ and packages/ layers. Turborepo handles task orchestration."
            
        return "\n\n".join(found_paths)

# Global Instance
navigator = NavigatorExpert()
