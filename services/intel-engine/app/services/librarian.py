import json
from typing import List, Dict, Any, Optional
from sqlalchemy import select, text
from app.core.database import AsyncSessionLocal, reflected_tables, get_table

class Librarian:
    def __init__(self):
        # Keywords to Table Mappings (Collections)
        self.ENTITY_MAP = {
            "project": "projects",
            "skill": "skills",
            "experience": "experiences",
            "award": "awards",
            "education": "educations",
            "portfolio": "portfolios",
            "blog": "blogs",
            "post": "posts",
            "testimonial": "testimonials",
            "prompt": "prompts"
        }

    def is_relevant(self, query: str) -> bool:
        """Checks if any entity keywords exist in the query."""
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in self.ENTITY_MAP.keys())

    def _get_relevant_tables(self, query: str) -> List[str]:
        """Identifies which tables might be relevant based on query keywords."""
        query_lower = query.lower()
        target_tables = []
        
        for keyword, table in self.ENTITY_MAP.items():
            if keyword in query_lower:
                target_tables.append(table)
        
        return target_tables

    def _row_to_shade(self, row_data: Dict, table_name: str) -> str:
        """Converts a database row into a structured 'Shade' string for LLM context."""
        shade = f"\n---\n[KNOWLEDGE_SOURCE]: Primary Database ({table_name})\n"
        
        # Priority fields to show
        priority_fields = ['title', 'name', 'tagline', 'description', 'role', 'company', 'institution']
        
        for field in priority_fields:
            if field in row_data and row_data[field]:
                label = field.replace('_', ' ').upper()
                shade += f"**[{label}]**: {row_data[field]}\n"
        
        # Add metadata if it exists
        if 'published_at' in row_data:
            shade += f"**[STATUS]**: {'Published' if row_data['published_at'] else 'Draft'}\n"
            
        shade += "---\n"
        return shade

    async def discover_knowledge(self, query: str, limit: int = 2) -> str:
        """
        Scans keywords, queries relevant Strapi tables, 
        and returns a combined 'Shades' string.
        """
        target_tables = self._get_relevant_tables(query)
        if not target_tables:
            return ""

        print(f"📚 [Librarian] Discovering knowledge from: {target_tables}")
        all_shades = ""

        async with AsyncSessionLocal() as session:
            for table_name in target_tables:
                table = get_table(table_name)
                if table is None: continue

                try:
                    # Query with a small limit to prevent token explosion
                    query_stmt = select(table).limit(limit)
                    result = await session.execute(query_stmt)
                    rows = result.mappings().all()

                    for row in rows:
                        all_shades += self._row_to_shade(dict(row), table_name)
                        
                        # --- Component Discovery ---
                        cmp_table_name = f"{table_name}_cmps"
                        if cmp_table_name in reflected_tables:
                            cmp_table = reflected_tables[cmp_table_name]
                            cmp_stmt = select(cmp_table).where(cmp_table.c.entity_id == row['id'])
                            cmp_res = await session.execute(cmp_stmt)
                            cmp_rows = cmp_res.mappings().all()
                            
                            if cmp_rows:
                                all_shades += f"   └─ [Related Components]: {len(cmp_rows)} items found.\n"
                
                except Exception as e:
                    print(f"⚠️ [Librarian] Error querying {table_name}: {e}")

        return all_shades

# Global Instance
librarian = Librarian()