import os
import json
from typing import List, Dict, Any

class Architect:
    def __init__(self):
        self.KEYWORDS = ["architecture", "stack", "monorepo", "structure", "folder", "deployment", "tech", "turborepo", "pnpm"]
        
        # High-level structural knowledge (Static for performance, can be expanded to file-read)
        self.SYSTEM_MANIFEST = {
            "monorepo_type": "pnpm + Turborepo",
            "apps": {
                "portfolio": "Astro 5 + React 19 (Main Frontend)",
                "analytics": "Next.js 15 + Redux (Engineering Intelligence Terminal)",
                "cms": "Strapi v5 (Content Management & PostgreSQL)"
            },
            "intelligence_core": "FastAPI + LangChain + LangGraph + pgVector",
            "database": "PostgreSQL 16 + ClickHouse (Analytics) + Redis (Caching)",
            "deployment": "Vercel (Frontend), Railway (Backend/CMS)",
            "animations": "GSAP, Three.js, PixiJS, Framer Motion"
        }

    def is_relevant(self, query: str) -> bool:
        """Checks if the query is relevant to technical architecture."""
        query_lower = query.lower()
        return any(kw in query_lower for kw in self.KEYWORDS)

    async def discover_knowledge(self, query: str) -> str:
        """Returns a formatted string of the system's technical architecture."""
        manifest = self.SYSTEM_MANIFEST
        
        shades = "\n---\n[KNOWLEDGE_SOURCE]: Project Architect (System Structure)\n"
        shades += f"**[MONOREPO]**: {manifest['monorepo_type']}\n"
        shades += "**[APPLICATIONS]**:\n"
        for app, desc in manifest['apps'].items():
            shades += f"  - {app.upper()}: {desc}\n"
        
        shades += f"**[INTEL_ENGINE]**: {manifest['intelligence_core']}\n"
        shades += f"**[INFRASTRUCTURE]**: {manifest['database']}\n"
        shades += f"**[DEPLOYMENT]**: {manifest['deployment']}\n"
        shades += f"**[ANIMATIONS]**: {manifest['animations']}\n"
        shades += "---\n"
        
        return shades

# Global Instance
architect = Architect()