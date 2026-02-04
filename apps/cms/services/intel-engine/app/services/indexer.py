import os
import glob
import json
import requests
import uuid
from typing import List
from datetime import datetime
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy import text
from app.core.database import engine, AsyncSessionLocal, KnowledgeChunk

class KnowledgeIndexer:
    def __init__(self):
        # Point to the local Ollama service within the Docker network
        self.ollama_url = "http://aazucena-ollama:11434/api/embeddings"
        self.model = "nomic-embed-text"
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )

    def _generate_document_id(self) -> str:
        """Generates a Strapi-compatible document ID (24 chars)."""
        return uuid.uuid4().hex[:24]

    async def init_vector_store(self):
        """Ensures pgvector extension exists and injects the embedding column."""
        async with engine.begin() as conn:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            
            # Removed destructive DROP TABLE - Schema is stable for Strapi v5
            # Re-create table logic with Strapi v5 columns (safe if already exists)
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS knowledge_items (
                    id SERIAL PRIMARY KEY,
                    document_id VARCHAR(255),
                    title TEXT NOT NULL,
                    slug TEXT NOT NULL UNIQUE,
                    content TEXT NOT NULL,
                    source TEXT NOT NULL,
                    type TEXT DEFAULT 'docs',
                    metadata JSONB,
                    embedding vector(768),
                    locale VARCHAR(255) DEFAULT 'en',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_by_id INTEGER,
                    updated_by_id INTEGER
                )
            """))
            print("✅ Vector Store: Initialized and persistent")

    def _get_embedding_local(self, text_input: str) -> List[float]:
        """
        Calls the local Ollama service for embeddings.
        """
        payload = {
            "model": self.model,
            "prompt": text_input
        }
        
        # Increased timeout to 120s for local inference
        response = requests.post(self.ollama_url, json=payload, timeout=120)
        
        if response.status_code != 200:
            raise Exception(f"Ollama Error {response.status_code}: {response.text}")
            
        return response.json()["embedding"]

    async def index_docs_folder(self, docs_path: str):
        """Scans, chunks, and indexes all markdown files."""
        print(f"🚀 [Indexer] BEGIN LOCAL SYNC (Ollama): {docs_path}")
        
        # 1. Clear existing 'docs' entries to avoid duplicates and remove deleted files
        async with engine.begin() as conn:
            print("🧹 [Indexer] Purging existing documentation chunks for clean sync...")
            await conn.execute(text("DELETE FROM knowledge_items WHERE type = 'docs'"))

        md_files = glob.glob(f"{docs_path}/**/*.md", recursive=True)
        print(f"🔍 [Indexer] Found {len(md_files)} files.")
        
        total_chunks = 0
        for i, file_path in enumerate(md_files):
            try:
                print(f"📂 [{i+1}/{len(md_files)}] {file_path}")
                loader = TextLoader(file_path, encoding='utf-8')
                chunks = self.text_splitter.split_documents(loader.load())
                
                async with AsyncSessionLocal() as session:
                    for j, chunk in enumerate(chunks):
                        content = chunk.page_content.strip()
                        if not content: continue

                        # Use Local Ollama call
                        vector = self._get_embedding_local(content)
                        
                        filename = os.path.basename(file_path)
                        new_chunk = KnowledgeChunk(
                            document_id=self._generate_document_id(),
                            title=f"{filename} - Part {j+1}",
                            slug=f"{filename.lower().replace('.', '-')}-{i}-{j}",
                            content=content,
                            source=os.path.relpath(file_path, docs_path),
                            embedding=vector,
                            extra_metadata=chunk.metadata,
                            type="docs",
                            locale="en",
                            created_at=datetime.utcnow(),
                            updated_at=datetime.utcnow(),
                            published_at=datetime.utcnow()
                        )
                        session.add(new_chunk)
                        total_chunks += 1
                    
                    await session.commit()
                    print(f"   └─ ✅ Saved")
                    
            except Exception as e:
                print(f"   └─ ❌ FAILED: {e}")

        print(f"🏁 LOCAL SYNC COMPLETE. Chunks: {total_chunks}")

# Global Instance
indexer = KnowledgeIndexer()
