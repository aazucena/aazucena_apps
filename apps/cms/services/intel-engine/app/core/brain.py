import os
import uuid
import json
import time
import asyncio
from datetime import datetime
from typing import TypedDict, List, Dict, Any, Annotated, Sequence, Optional
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from psycopg_pool import AsyncConnectionPool
from langsmith import Client
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.services.retriever import retriever
from app.core.rl_agent import rl_agent
from app.services.librarian import librarian
from app.services.sage import sage
from app.services.architect import architect
from app.services.chronicler import chronicler
from app.services.auditor import auditor
from app.services.fiscal import fiscal
from app.services.navigator import navigator
from app.core.database import DATABASE_URL, AsyncSessionLocal, get_table, reflect_db, engine
from sqlalchemy import select, insert, text, update, delete

# --- Engine Configuration (vLLM Style) ---
class EngineConfig(BaseModel):
    model: str = "llama3.2"
    temperature: float = 0
    max_tokens: int = 2048
    top_p: float = 0.9
    context_window: int = 8192

# --- State Definition ---
class AgentState(TypedDict):
    trajectory_id: str
    session_id: str
    query: str
    messages: Annotated[List[BaseMessage], "Add to existing history"]
    intent: str
    reasoning: str
    expert_context: str
    context: List[Dict[Any, Any]]
    response: str
    is_valid: bool
    steps_count: int
    temperature: float

# --- Brain Orchestrator ---
class IntelBrain:
    def __init__(self, config: Optional[EngineConfig] = None):
        self.config = config or EngineConfig()
        self.ollama_url = os.getenv("OLLAMA_URL", "http://aazucena-ollama:11434/v1")
        self.ls_client = Client(cache=True) 
        self.pool = None
        self.checkpointer = None
        
        self.llm = ChatOpenAI(
            model=self.config.model,
            api_key="ollama",
            base_url=self.ollama_url,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
            top_p=self.config.top_p,
            request_timeout=120.0
        )
        
        # Expert Registry
        self.experts = [
            {"id": "librarian", "service": librarian},
            {"id": "sage", "service": sage},
            {"id": "architect", "service": architect},
            {"id": "chronicler", "service": chronicler},
            {"id": "auditor", "service": auditor},
            {"id": "fiscal", "service": fiscal},
            {"id": "navigator", "service": navigator}
        ]
        
        # System Personas (Local Defaults)
        self.SYSTEM_PROMPTS = {
            "intent_analyst": (
                "You are an expert Intent Analyst for Aldrin's Portfolio. Your task is to analyze user queries and determine their primary goal. Always reason step-by-step before classifying."
            ),
            "portfolio_assistant": (
                "You are Aldrin Azucena's Engineering Intelligence Assistant. You are professional, technical, and concise. You have access to structured data (SHADES) and documentation context. PRIORITIZE SHADES data as the ground truth."
            ),
            "validator": (
                "You are a hallucination checker. Verify if the generated response "
                "is supported by the retrieved structured knowledge. "
                "Respond ONLY with 'VALID' or 'INVALID: reasoning'."
            )
        }
        
        self.DEFAULT_PROMPTS = [
            {
                "name": "portfolio-intent-analyst",
                "slug": "portfolio-intent-analyst",
                "type": "intent_analyst",
                "description": "Classifies user queries into project, experience, or contact intents.",
                "system_message": self.SYSTEM_PROMPTS["intent_analyst"],
                "human_template": "USER_QUERY: {input}\n\nTASKS:\n1. Reason through possible goals.\n2. Classify into ONE: [GENERAL_INFO, PROJECT_QUERY, EXPERIENCE_QUERY, CONTACT, SYSTEM_STATUS].\n\nFORMAT AS JSON:\n{{\"reasoning\": \"...\", \"intent\": \"...\"}}"
            },
            {
                "name": "portfolio-assistant",
                "slug": "portfolio-assistant",
                "type": "assistant",
                "description": "The primary personality for the portfolio RAG assistant.",
                "system_message": self.SYSTEM_PROMPTS["portfolio_assistant"],
                "human_template": "CONTEXT:\n{context}\n\nUSER_QUERY: {input}\n\nASSISTANT_RESPONSE:"
            },
            {
                "name": "portfolio-intel-summarizer",
                "slug": "portfolio-intel-summarizer",
                "type": "assistant",
                "description": "Summarizes AI conversations into concise technical titles.",
                "system_message": "You are a professional metadata architect. Summarize the following AI conversation into a {scope}. Respond ONLY with the title (max 5 words), no quotes or punctuation.",
                "human_template": "TEXT: {text}"
            }
        ]
        
        self._compiled_graph = None

    def _generate_document_id(self) -> str:
        """Generates a Strapi-compatible document ID (24 chars)."""
        return uuid.uuid4().hex[:24]

    async def sync_prompts_to_strapi(self, force: bool = False):
        """Ensures Strapi has the default prompts. If force=True, wipes the table first."""
        await reflect_db()
        prompts_table = get_table("prompts")
        
        if prompts_table is None:
            print("⚠️ [Brain] 'prompts' table not found. Creating it...")
            async with engine.begin() as conn:
                await conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS prompts (
                        id SERIAL PRIMARY KEY,
                        document_id VARCHAR(255),
                        name VARCHAR(255) NOT NULL UNIQUE,
                        slug VARCHAR(255) NOT NULL UNIQUE,
                        description TEXT,
                        system_message TEXT NOT NULL,
                        human_template TEXT,
                        type VARCHAR(255) DEFAULT 'assistant',
                        langsmith_id VARCHAR(255),
                        langsmith_url VARCHAR(255),
                        metadata JSONB,
                        locale VARCHAR(255) DEFAULT 'en',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        created_by_id INTEGER,
                        updated_by_id INTEGER
                    )
                """))
            await reflect_db()
            prompts_table = get_table("prompts")

        async with AsyncSessionLocal() as session:
            # --- Snapshot: What is currently in the DB? ---
            query = select(prompts_table)
            result = await session.execute(query)
            snapshot = result.mappings().all()
            
            print(f"📸 [Brain] Current Strapi Database Snapshot ({len(snapshot)} prompts found):")
            if not snapshot:
                print("   └─ 📭 Table is empty.")
            for row in snapshot:
                # Truncate message for cleaner logs
                msg_preview = row['system_message'][:50].replace('\n', ' ') + "..." if row['system_message'] else "N/A"
                print(f"   └─ 📄 [{row['type'].upper()}] {row['name']} (DocID: {row['document_id'][:8]}...)")
                print(f"      └─ Content: {msg_preview}")
                
                # Format timestamps for display
                created = row.get('created_at').strftime('%Y-%m-%d %H:%M') if row.get('created_at') else "N/A"
                updated = row.get('updated_at').strftime('%Y-%m-%d %H:%M') if row.get('updated_at') else "N/A"
                print(f"      └─ 📅 Created: {created} | Updated: {updated}")
            
            if force:
                print("🗑️ [Brain] Force-clearing Strapi prompts...")
                await session.execute(delete(prompts_table))
                # We commit immediately to ensure the table is empty for the next loop
                await session.commit()

            # Check for missing default prompts individually
            print("🌱 [Brain] Checking for missing default prompts...")
            added_count = 0
            
            for d in self.DEFAULT_PROMPTS:
                # Check if this specific prompt name exists
                query = select(prompts_table).where(prompts_table.c.name == d["name"])
                result = await session.execute(query)
                exists = result.mappings().one_or_none()
                
                if not exists:
                    print(f"   └─ ➕ Seeding missing prompt: {d['name']}")
                    stmt = insert(prompts_table).values(
                        document_id=self._generate_document_id(),
                        name=d["name"],
                        slug=d["slug"],
                        type=d["type"],
                        description=d.get("description"),
                        system_message=d["system_message"],
                        human_template=d["human_template"],
                        locale="en",
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    await session.execute(stmt)
                    added_count += 1
                else:
                    print(f"   └─ 🆗 Prompt already exists: {d['name']} (ID: {exists.get('document_id', 'N/A')})")
            
            if added_count > 0:
                await session.commit()
                print(f"✅ [Brain] Seeding Complete. Added {added_count} new prompts.")
            else:
                print("📊 [Brain] Strapi is already up-to-date with all default prompts.")

    async def setup(self):
        """Initializes the database pool and checkpointer."""
        if self.pool is None:
            print("🔗 [Brain] Initializing Connection Pool for Checkpointer...")
            self.pool = AsyncConnectionPool(conninfo=DATABASE_URL, max_size=20, kwargs={"autocommit": True}, open=False)
            await self.pool.open()
            self.checkpointer = AsyncPostgresSaver(self.pool)
            await self.checkpointer.setup()
            print("✅ [Brain] Checkpointer Ready.")

    async def get_graph(self):
        """Lazy-loaded graph with persistent checkpointer."""
        if self._compiled_graph is None:
            await self.setup()
            
            workflow = StateGraph(AgentState)
            
            workflow.add_node("analyze_intent", self.node_analyze_intent)
            workflow.add_node("expert_dispatcher", self.node_expert_dispatcher)
            workflow.add_node("retrieve_knowledge", self.node_retrieve_knowledge)
            workflow.add_node("generate_response", self.node_generate_response)
            workflow.add_node("validate_response", self.node_validator)

            workflow.set_entry_point("analyze_intent")
            workflow.add_edge("analyze_intent", "expert_dispatcher")
            workflow.add_edge("expert_dispatcher", "retrieve_knowledge")
            workflow.add_edge("retrieve_knowledge", "generate_response")
            workflow.add_edge("generate_response", "validate_response")
            workflow.add_edge("validate_response", END)

            self._compiled_graph = workflow.compile(checkpointer=self.checkpointer)
            
        return self._compiled_graph

    def _get_prompt(self, prompt_name: str, fallback_content: str) -> ChatPromptTemplate:
        """Programmatically pulls a prompt from LangSmith."""
        try:
            if os.getenv("LANGCHAIN_API_KEY"):
                return self.ls_client.pull_prompt(prompt_name)
        except Exception as e:
            if "/" in prompt_name:
                root_name = prompt_name.split("/")[-1]
                try: return self.ls_client.pull_prompt(root_name)
                except: pass
            print(f"⚠️ [Brain] Hub pull failed for '{prompt_name}': {e}. Using local fallback.")
        
        return ChatPromptTemplate.from_messages([
            ("system", fallback_content),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])

    async def push_default_prompts(self, clean: bool = True, force_reset: bool = False) -> Dict[str, str]:
        """Pushes current Strapi prompts to LangSmith Hub."""
        # 1. Ensure Strapi is synced with code defaults (optionally force reset)
        await self.sync_prompts_to_strapi(force=force_reset)
        
        # 2. Cleanup Hub if requested
        if clean: 
            print("🧹 [Brain] Cleaning up LangSmith Hub defaults...")
            self.delete_default_prompts()
            
        results = {}
        print("🚀 [Brain] BEGIN LANGSMITH HUB SYNC...")
        
        prompts_table = get_table("prompts")
        async with AsyncSessionLocal() as session:
            # Fetch all prompts from Strapi (Draft & Publish is disabled)
            query = select(prompts_table)
            result = await session.execute(query)
            db_prompts = result.mappings().all()

            if db_prompts:
                print(f"📡 [Brain] Syncing {len(db_prompts)} Strapi prompts to Hub...")
                for p in db_prompts:
                    try:
                        # Construct the template from the database content (The Source of Truth)
                        template = ChatPromptTemplate.from_messages([
                            ("system", p["system_message"]),
                            MessagesPlaceholder(variable_name="history"),
                            ("human", p["human_template"] or "{input}")
                        ])
                        
                        # Push to LangSmith
                        url = self.ls_client.push_prompt(p["name"], object=template)
                        
                        # Extract ID from URL (e.g. .../portfolio-assistant/6f088d3a?...)
                        prompt_url = str(url)
                        try:
                            # Basic extraction of the commit hash/id
                            ls_id = prompt_url.split('/')[-1].split('?')[0]
                        except:
                            ls_id = None

                        # Update Strapi with LangSmith metadata
                        update_stmt = update(prompts_table).where(prompts_table.c.id == p["id"]).values(
                            langsmith_id=ls_id,
                            langsmith_url=prompt_url
                        )
                        await session.execute(update_stmt)
                        
                        results[p["name"]] = prompt_url
                        print(f"   └─ ✅ Synced: {p['name']} (ID: {ls_id})")
                    except Exception as e:
                        print(f"   └─ ❌ Failed {p['name']}: {e}")
                
                await session.commit()
            else:
                print("⚠️ [Brain] No published prompts found in Strapi to sync.")

        print(f"🏁 LANGSMITH SYNC COMPLETE. Total synced: {len(results)}")
        return results

    def delete_default_prompts(self):
        for p in [d["name"] for d in self.DEFAULT_PROMPTS]:
            try: 
                print(f"   └─ 🗑️ Deleting prompt from Hub: {p}")
                self.ls_client.delete_prompt(p)
                print(f"      └─ ✅ Deleted.")
            except Exception as e: 
                print(f"      └─ 🆗 Already gone or error: {e}")

    async def get_graph_schema(self):
        """Dynamic schema extraction."""
        nodes = [
            {"id": "analyze_intent", "label": "Analyze Intent"},
            {"id": "expert_dispatcher", "label": "Expert Dispatcher"},
            {"id": "retrieve_knowledge", "label": "Retrieve Knowledge"},
            {"id": "generate_response", "label": "Generate Response"},
            {"id": "validate_response", "label": "Validate Response"}
        ]
        edges = [
            {"from": "analyze_intent", "to": "expert_dispatcher"},
            {"from": "expert_dispatcher", "to": "retrieve_knowledge"},
            {"from": "retrieve_knowledge", "to": "generate_response"},
            {"from": "generate_response", "to": "validate_response"}
        ]
        return {"nodes": nodes, "edges": edges}

    def _estimate_tokens(self, text: str) -> int:
        return int(len(text.split()) * 1.3)

    # --- Nodes ---
    async def node_analyze_intent(self, state: AgentState):
        """Reason-first classification."""
        print(f"🧠 [Brain] Analyzing Intent...")
        start_time = time.time()
        template = self._get_prompt("portfolio-intent-analyst", self.SYSTEM_PROMPTS["intent_analyst"])
        
        history = state.get("messages", [])[:-1]
        # Use bound temperature if provided
        llm = self.llm.bind(temperature=state.get("temperature", self.config.temperature))
        res = await llm.ainvoke(template.invoke({
            "input": state['query'],
            "history": history
        }))
        
        latency = int((time.time() - start_time) * 1000)
        try:
            data = json.loads(res.content)
            intent = data.get("intent", "GENERAL_INFO")
            reasoning = data.get("reasoning", "")
        except:
            intent = "GENERAL_INFO"
            reasoning = res.content
        
        # RICH OBSERVATION: Intent Classification Details
        observation = json.dumps({
            "detected_intent": intent,
            "reasoning": reasoning,
            "history_snapshot_length": len(history),
            "input_query": state['query']
        })

        try:
            rl_agent._send_ai_event(self.config.model, "intent_classifier", self._estimate_tokens(str(template)), self._estimate_tokens(res.content), latency, state['session_id'], state['trajectory_id'])
            rl_agent._send_step(state['trajectory_id'], state['steps_count'], {"reasoning": reasoning}, f"CLASSIFY_INTENT: {intent}", 0.1, state['session_id'], observation=observation)
        except Exception as e:
            print(f"❌ [Brain] Intent Ingestion Failed: {e}")

        return {"intent": intent, "reasoning": reasoning, "steps_count": state['steps_count'] + 1}

    async def node_expert_dispatcher(self, state: AgentState):
        """Parallel Expert discovery."""
        print(f"📡 [Brain] Dispatching experts...")
        start_time = time.time()
        active = [e for e in self.experts if e['service'].is_relevant(state['query'])]
        if active:
            tasks = [e['service'].discover_knowledge(state['query']) for e in active]
            results = await asyncio.gather(*tasks)
            expert_context = "\n".join(results)
        else: expert_context = ""
            
        latency = int((time.time() - start_time) * 1000)
        observation = json.dumps({
            "routing_logic": "semantic_relevance_check",
            "active_experts": [e['id'] for e in active],
            "considered_count": len(self.experts),
            "payload_query": state['query'],
            "expert_responses_length": len(expert_context)
        })
        try: rl_agent._send_step(state['trajectory_id'], state['steps_count'], {"experts": [e['id'] for e in active]}, "EXPERT_DISPATCHER", 0.4, state['session_id'], observation=observation)
        except: pass
        return {"expert_context": expert_context, "steps_count": state['steps_count'] + 1}

    async def node_retrieve_knowledge(self, state: AgentState):
        """Vector RAG."""
        print(f"🔍 [Brain] Vector Search...")
        start_time = time.time()
        # Increased top_k to 5 to catch relevant docs that might be slightly lower ranked
        docs = await retriever.find_relevant_docs(state['query'], top_k=5)
        latency = int((time.time() - start_time) * 1000)
        observation = json.dumps({
            "vector_engine": "pgVector",
            "embedding_model": "nomic-embed-text",
            "top_k": 5,
            "retrieved_documents": [
                {
                    "source": d.get("source"),
                    "title": d.get("title"),
                    "score": d.get("score", "N/A"),
                    "snippet": d.get("content", "")[:100] + "..."
                } for d in docs
            ],
            "total_tokens_retrieved": sum(len(d.get("content", "").split()) for d in docs)
        })
        try:
            rl_agent._send_ai_event("nomic-embed-text", "vector_retriever", self._estimate_tokens(state['query']), 0, latency, state['session_id'], state['trajectory_id'])
            rl_agent._send_step(state['trajectory_id'], state['steps_count'], {"found": len(docs)}, "RETRIEVE_CONTEXT", 0.5, state['session_id'], observation=observation)
        except: pass
        return {"context": docs, "steps_count": state['steps_count'] + 1}

    async def node_generate_response(self, state: AgentState):
        """Synthesis."""
        print(f"✍️ [Brain] Generating final response...")
        start_time = time.time()
        doc_context = "\n".join([f"SOURCE: {d['source']}\nCONTENT: {d['content']}" for d in state['context']])
        combined_context = f"--- TRUTH ---\n{state['expert_context']}\n\n--- DOCS ---\n{doc_context}"
        template = self._get_prompt("portfolio-assistant", self.SYSTEM_PROMPTS["portfolio_assistant"])
        history = state.get("messages", [])[:-1]
        llm = self.llm.bind(temperature=state.get("temperature", self.config.temperature))
        res = await llm.ainvoke(template.invoke({
            "context": combined_context, 
            "input": state['query'],
            "history": history
        }))
        latency = int((time.time() - start_time) * 1000)
        observation = json.dumps({
            "model": self.config.model,
            "temperature_used": state.get("temperature", self.config.temperature),
            "full_context_tokens": self._estimate_tokens(combined_context),
            "response_tokens": self._estimate_tokens(res.content),
            "history_depth": len(history)
        })
        try:
            rl_agent._send_ai_event(self.config.model, "response_generator", self._estimate_tokens(str(template)), self._estimate_tokens(res.content), latency, state['session_id'], state['trajectory_id'])
            rl_agent._send_step(state['trajectory_id'], state['steps_count'], {"db_used": bool(state['expert_context'])}, "GENERATE_ANSWER", 1.0, session_id=state['session_id'], observation=observation)
        except: pass
        return {"response": res.content, "messages": [AIMessage(content=res.content)], "steps_count": state['steps_count'] + 1}

    async def node_validator(self, state: AgentState):
        """Truth check."""
        print(f"🛡️ [Brain] Validating output...")
        prompt = [SystemMessage(content=self.SYSTEM_PROMPTS["validator"])
, HumanMessage(content=f"TRUTH:\n{state['expert_context']}\n\nRESPONSE:\n{state['response']}")]
        llm = self.llm.bind(temperature=state.get("temperature", self.config.temperature))
        res = await llm.ainvoke(prompt)
        is_valid = "INVALID" not in res.content.upper()
        observation = json.dumps({
            "validation_engine": "Self-Correction-Chain",
            "is_valid": is_valid,
            "reasoning": res.content,
            "claims_checked_against": "expert_truth_context"
        })
        try: 
            rl_agent._send_step(state['trajectory_id'], state['steps_count'], {"is_valid": is_valid, "feedback": res.content}, "VALIDATE_OUTPUT", 1.0, state['session_id'], observation=observation)
        except Exception as e:
            print(f"❌ [Brain] Validator Ingestion Failed: {e}")
        return {"is_valid": is_valid, "steps_count": state['steps_count'] + 1}

    async def summarize(self, text: str, scope: Optional[str] = "concise technical title") -> str:
        """Generates a high-quality summary title based on the provided scope."""
        print(f"📝 [Brain] Summarizing with scope: {scope}...")
        template = self._get_prompt(
            "portfolio-intel-summarizer", 
            "You are a professional metadata architect. Summarize the following AI conversation into a {scope}. Respond ONLY with the title (max 5 words), no quotes or punctuation.\n\nTEXT: {text}"
        )
        res = await self.llm.ainvoke(template.invoke({
            "text": text,
            "scope": scope,
            "input": text,
            "history": []
        }))
        return res.content.strip()

    async def process_query(self, query: str, session_id: str = None, temperature: Optional[float] = None):
        """Entry with memory and real-time event streaming."""
        yield {"event": "status", "data": "CONNECTION_ESTABLISHED"}
        yield {"event": "status", "data": "BRAIN_WAKING_UP"}
        if session_id:
            try:
                uuid.UUID(session_id)
                thread_id = session_id
            except ValueError:
                thread_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, session_id))
        else:
            thread_id = str(uuid.uuid4())
        initial_state: AgentState = {
            "trajectory_id": f"brain_{uuid.uuid4().hex[:6]}",
            "session_id": thread_id,
            "query": query,
            "messages": [HumanMessage(content=query)],
            "intent": "", "reasoning": "", "expert_context": "", "context": [], "response": "", "is_valid": True, "steps_count": 0,
            "temperature": temperature if temperature is not None else self.config.temperature
        }
        graph = await self.get_graph()
        config = {"configurable": {"thread_id": thread_id}}
        TRACKED_NODES = ["analyze_intent", "expert_dispatcher", "retrieve_knowledge", "generate_response", "validate_response"]
        print("⚡ [Brain-Stream] Starting astream_events loop...")
        yield {"event": "status", "data": "BRAIN_INITIALIZED"}
        try:
            async for event in graph.astream_events(initial_state, config=config, version="v2"):
                kind = event["event"]
                name = event.get("name", "Unknown")
                if kind == "on_chain_start" and name in TRACKED_NODES:
                    node_label = name.replace("_", " ").upper()
                    print(f"📍 [Brain-Stream] Node Start: {node_label}")
                    yield {"event": "node_start", "data": node_label}
                elif kind == "on_chain_end" and name == "LangGraph":
                    print("🏁 [Brain-Stream] Chain End Detected.")
                    final_output = event["data"]["output"]
                    yield {"event": "status", "data": "SYNTHESIZING_FINAL_ANSWER"}
                    yield {
                        "event": "final_response",
                        "data": json.dumps({
                            "trajectory_id": final_output.get("trajectory_id", ""),
                            "intent": final_output.get("intent", ""),
                            "response": final_output.get("response", "No response generated.")
                        })
                    }
        except Exception as e:
            print(f"❌ [Brain-Stream] Loop Error: {e}")
            yield {"event": "status", "data": f"ERROR: {str(e)}"}
        yield {"event": "status", "data": "COMPLETED"}

# Global Instance
brain = IntelBrain()
