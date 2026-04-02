import os
import requests
from typing import List, Dict, Any
from sqlalchemy import text
from app.core.database import engine, AsyncSessionLocal

class KnowledgeRetriever:
    def __init__(self):
        # Point to the local Ollama service within the Docker network
        self.ollama_url = "http://aazucena-ollama:11434/api/embeddings"
        self.model = "nomic-embed-text"

    async def _get_embedding_local(self, text_input: str) -> List[float]:
        payload = {
            "model": self.model,
            "prompt": text_input
        }
        # Increased timeout to 120s for local inference
        response = requests.post(self.ollama_url, json=payload, timeout=120)
        if response.status_code != 200:
            raise Exception(f"Ollama Error: {response.text}")
        return response.json()["embedding"]

    async def find_relevant_docs(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches the local knowledge base using Ollama embeddings.
        """
        # 1. Generate local embedding
        query_vector = await self._get_embedding_local(query)
        
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