import json
from typing import List, Dict, Any
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, reflected_tables, get_table

class Chronicler:
    def __init__(self):
        self.KEYWORDS = ["journey", "timeline", "history", "background", "award", "education", "degree", "honors"]
        self.TARGET_TABLES = ["journeys", "awards", "educations"]

    def is_relevant(self, query: str) -> bool:
        """Checks if the query is relevant to career narrative or history."""
        query_lower = query.lower()
        return any(kw in query_lower for kw in self.KEYWORDS)

    async def discover_knowledge(self, query: str, limit: int = 3) -> str:
        """Fetches career timeline, awards, and education details."""
        print(f"📖 [Chronicler] Deep-diving into career narrative...")
        shades = "\n---\n[KNOWLEDGE_SOURCE]: Journey Chronicler (Career Narrative)\n"
        
        async with AsyncSessionLocal() as session:
            for table_name in self.TARGET_TABLES:
                table = get_table(table_name)
                if table is None: continue
                
                try:
                    # Pull entries
                    stmt = select(table).limit(limit)
                    result = await session.execute(stmt)
                    rows = result.mappings().all()
                    
                    if rows:
                        shades += f"**[{table_name.upper()}]**:\n"
                        for row in rows:
                            row_dict = dict(row)
                            if table_name == "awards":
                                shades += f"  - Award: {row_dict.get('title')} from {row_dict.get('organization')} ({row_dict.get('year')})\n"
                            elif table_name == "educations":
                                shades += f"  - {row_dict.get('degree')} in {row_dict.get('field')} @ {row_dict.get('institution')}\n"
                            elif table_name == "journeys":
                                shades += f"  - Milestone: {row_dict.get('title')}\n"
                except Exception as e:
                    print(f"⚠️ [Chronicler] Error querying {table_name}: {e}")
        
        shades += "---\n"
        return shades

# Global Instance
chronicler = Chronicler()
