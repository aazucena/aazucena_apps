import voyageai
from typing import List, Dict, Any
from sqlalchemy import text
from app.core.database import AsyncSessionLocal

class KnowledgeRetriever:
    def __init__(self):
        self.voyage_client = voyageai.Client()
        self.model = "voyage-3"

    def _get_embedding(self, text_input: str) -> List[float]:
        result = self.voyage_client.embed([text_input], model=self.model, input_type="query")
        return result.embeddings[0]

    async def find_relevant_docs(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_vector = self._get_embedding(query)
        
        # 2. Perform Vector Similarity Search
        search_query = text("""
            SELECT content, source, metadata, 
                   (embedding <=> :vector) as distance
            FROM knowledge_items
            ORDER BY distance ASC
            LIMIT :limit
        """)

        async with AsyncSessionLocal() as session:
            result = await session.execute(
                search_query, 
                {"vector": str(query_vector), "limit": top_k}
            )
            
            docs = []
            for row in result:
                docs.append({
                    "content": row.content,
                    "source": row.source,
                    "distance": float(row.distance)
                })
            
            return docs

# Global Instance
retriever = KnowledgeRetriever()