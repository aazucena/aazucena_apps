import os
import re
import glob
import json
import uuid
import hashlib
import fnmatch
import asyncio
import requests
import voyageai
from typing import List
from datetime import datetime
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy import text, select
from app.core.database import engine, AsyncSessionLocal, KnowledgeChunk

GITHUB_REPO = os.getenv("GITHUB_REPO", "")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

class KnowledgeIndexer:
    def __init__(self):
        self.voyage_client = voyageai.Client()  # reads VOYAGE_API_KEY from env
        self.model = "voyage-3"
        self.config_path = "intel.config.json"
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )

    def _load_config(self):
        """Loads indexing configuration from JSON."""
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                return json.load(f).get("indexing", {})
        return {}

    def _generate_document_id(self) -> str:
        """Generates a Strapi-compatible document ID (24 chars)."""
        return uuid.uuid4().hex[:24]

    def _get_file_hash(self, file_path: str) -> str:
        """Computes MD5 hash of a file."""
        hasher = hashlib.md5()
        with open(file_path, 'rb') as f:
            buf = f.read()
            hasher.update(buf)
        return hasher.hexdigest()

    async def init_vector_store(self):
        """Ensures pgvector extension exists and injects the embedding column."""
        async with engine.begin() as conn:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            
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
                    embedding vector(1024),
                    file_hash VARCHAR(64),
                    locale VARCHAR(255) DEFAULT 'en',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_by_id INTEGER,
                    updated_by_id INTEGER
                )
            """))
            
            # Ensure file_hash column exists for older installations
            try:
                await conn.execute(text("ALTER TABLE knowledge_items ADD COLUMN IF NOT EXISTS file_hash VARCHAR(64)"))
            except Exception:
                pass # Already exists or table was just created

            # Migrate embedding dimension if changed (e.g. nomic 768 → voyage-3 1024)
            result = await conn.execute(text(
                "SELECT atttypmod FROM pg_attribute "
                "JOIN pg_class ON pg_attribute.attrelid = pg_class.oid "
                "WHERE relname = 'knowledge_items' AND attname = 'embedding'"
            ))
            row = result.fetchone()
            if row and row[0] != 1024:
                print(f"⚠️ [Vector Store] Embedding dimension mismatch ({row[0]} → 1024) — clearing stale data...")
                await conn.execute(text("TRUNCATE TABLE knowledge_items CASCADE"))
                await conn.execute(text("ALTER TABLE knowledge_items ALTER COLUMN embedding TYPE vector(1024)"))
                print("✅ [Vector Store] Dimension migration complete.")

            print("✅ Vector Store: Initialized and persistent")

    def _get_embedding(self, text_input: str) -> List[float]:
        """Calls Voyage AI for embeddings."""
        result = self.voyage_client.embed([text_input], model=self.model, input_type="document")
        return result.embeddings[0]

    @staticmethod
    def _glob_to_regex(pattern: str) -> re.Pattern:
        """Converts a glob pattern with ** support to a compiled regex."""
        escaped = re.escape(pattern)
        # /**/  surrounded by slashes → zero-or-more intermediate segments
        escaped = escaped.replace(r'/\*\*/', '/(.*/)?')
        # Remaining ** (at start/end without surrounding slashes)
        escaped = escaped.replace(r'\*\*', '.*')
        # Single * → one segment (no slashes)
        escaped = escaped.replace(r'\*', '[^/]*')
        return re.compile(f'^{escaped}$')

    def _fetch_github_docs_sync(self, dest_path: str):
        """Downloads all files matching intel.config.json include patterns from GitHub."""
        if not GITHUB_REPO:
            print("⚠️ [Indexer] GITHUB_REPO not set — skipping remote fetch, using local files")
            return

        config = self._load_config()
        include_patterns = config.get("include", ["docs/**/*.md"])
        exclude_patterns = config.get("exclude", [])

        compiled_includes = [self._glob_to_regex(p) for p in include_patterns]
        compiled_excludes = [self._glob_to_regex(p) for p in exclude_patterns]

        headers = {"Accept": "application/vnd.github.v3+json"}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

        print(f"🌐 [Indexer] Fetching docs from github.com/{GITHUB_REPO}@{GITHUB_BRANCH}...")

        tree_url = f"https://api.github.com/repos/{GITHUB_REPO}/git/trees/{GITHUB_BRANCH}?recursive=1"
        resp = requests.get(tree_url, headers=headers, timeout=30)
        resp.raise_for_status()
        tree_data = resp.json()

        if tree_data.get("truncated"):
            print("⚠️ [Indexer] GitHub tree response was truncated — some files may be missed")

        doc_files = [
            item["path"] for item in tree_data.get("tree", [])
            if item["type"] == "blob"
            and any(p.match(item["path"]) for p in compiled_includes)
            and not any(p.match(item["path"]) for p in compiled_excludes)
        ]

        print(f"📄 [Indexer] {len(doc_files)} remote doc files found")

        fetched = 0
        for path in doc_files:
            raw_url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}/{path}"
            file_resp = requests.get(raw_url, headers=headers, timeout=10)
            if not file_resp.ok:
                print(f"   └─ ⚠️ Skipped {path}: HTTP {file_resp.status_code}")
                continue
            dest_file = os.path.join(dest_path, path)
            os.makedirs(os.path.dirname(dest_file), exist_ok=True)
            with open(dest_file, "w", encoding="utf-8") as f:
                f.write(file_resp.text)
            fetched += 1

        print(f"✅ [Indexer] Remote fetch complete — {fetched}/{len(doc_files)} files downloaded")

    async def fetch_github_docs(self, dest_path: str):
        """Async wrapper: fetches docs from GitHub into dest_path before indexing."""
        await asyncio.to_thread(self._fetch_github_docs_sync, dest_path)

    async def index_docs_folder(self, docs_path: str, force: bool = False):
        """Scans, chunks, and indexes files based on configuration."""
        config = self._load_config()
        include_patterns = config.get("include", ["docs/**/*.md"])
        exclude_patterns = config.get("exclude", [])
        
        print(f"🚀 [Indexer] BEGIN DIFFERENTIAL SYNC: {docs_path}")
        
        # 1. Find all files matching the include patterns
        all_files = []
        for pattern in include_patterns:
            # Handle absolute/relative mapping
            search_pattern = os.path.join(docs_path, pattern)
            all_files.extend(glob.glob(search_pattern, recursive=True))

        # 2. Filter out excluded files
        valid_files = []
        for f in all_files:
            rel_path = os.path.relpath(f, docs_path)
            is_excluded = False
            for p in exclude_patterns:
                if fnmatch.fnmatch(rel_path, p) or fnmatch.fnmatch(f, p):
                    is_excluded = True
                    break
            if not is_excluded:
                valid_files.append(f)

        print(f"🔍 [Indexer] Found {len(valid_files)} valid files in scope.")
        
        current_sources = []
        total_indexed = 0
        total_skipped = 0

        async with AsyncSessionLocal() as session:
            for i, file_path in enumerate(valid_files):
                try:
                    rel_source = os.path.relpath(file_path, docs_path)
                    current_sources.append(rel_source)
                    file_hash = self._get_file_hash(file_path)

                    # Check if already indexed with same hash
                    if not force:
                        stmt = select(KnowledgeChunk).where(
                            KnowledgeChunk.source == rel_source,
                            KnowledgeChunk.file_hash == file_hash
                        ).limit(1)
                        result = await session.execute(stmt)
                        existing = result.scalars().first()
                        if existing:
                            total_skipped += 1
                            continue

                    print(f"📂 [{i+1}/{len(valid_files)}] Processing: {rel_source}")
                    
                    # Clear old chunks for THIS file if re-indexing
                    await session.execute(
                        text("DELETE FROM knowledge_items WHERE source = :source"),
                        {"source": rel_source}
                    )

                    # Load document
                    if file_path.endswith(".pdf"):
                        loader = PyPDFLoader(file_path)
                    else:
                        loader = TextLoader(file_path, encoding='utf-8')
                        
                    chunks = self.text_splitter.split_documents(loader.load())
                    
                    filename = os.path.basename(file_path)
                    for j, chunk in enumerate(chunks):
                        content = chunk.page_content.strip()
                        if not content: continue

                        vector = self._get_embedding(content)
                        
                        new_chunk = KnowledgeChunk(
                            document_id=self._generate_document_id(),
                            title=f"{filename} - Part {j+1}",
                            slug=f"{filename.lower().replace('.', '-')}-{uuid.uuid4().hex[:6]}",
                            content=content,
                            source=rel_source,
                            embedding=vector,
                            extra_metadata=chunk.metadata,
                            type="docs",
                            file_hash=file_hash,
                            locale="en",
                            created_at=datetime.utcnow(),
                            updated_at=datetime.utcnow(),
                            published_at=datetime.utcnow()
                        )
                        session.add(new_chunk)
                        total_indexed += 1
                    
                    await session.commit()
                except Exception as e:
                    print(f"   └─ ❌ FAILED {file_path}: {e}")
                    await session.rollback()

            # 3. Cleanup: Remove entries for files no longer on disk or in scope
            print("🧹 [Indexer] Cleaning up obsolete records...")
            if current_sources:
                delete_stmt = text("DELETE FROM knowledge_items WHERE type = 'docs' AND source != ALL(:sources)")
                await session.execute(delete_stmt, {"sources": list(current_sources)})
            else:
                await session.execute(text("DELETE FROM knowledge_items WHERE type = 'docs'"))
            await session.commit()

        print(f"🏁 SYNC COMPLETE. Indexed: {total_indexed}, Skipped: {total_skipped}")

# Global Instance
indexer = KnowledgeIndexer()
