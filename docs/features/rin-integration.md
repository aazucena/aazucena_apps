# Rin ↔ Intel-Engine Integration

> **Lore:** See [`rin.md`](./rin.md) — this document covers the technical integration only.

---

## Current Architecture (as of 2026-05-12)

Rin is live. The full UI exists and already calls Claude directly.

```
Rin UI (useAssistantChat.ts)
    ↓  POST /api/chat  { messages, pathname }
apps/portfolio/src/pages/api/chat.ts
    ↓  fetchChatContext() → Strapi (about, skills, projects, services)
    ↓  streamText() → Claude via Vercel AI Gateway
    ↑  UIMessageStream
Rin UI renders
```

Intel-engine is not in this chain yet. It runs independently on Railway, indexing the monorepo docs corpus into pgVector and serving a LangGraph agent via `/brain/think`.

**Key files:**
- `apps/portfolio/src/pages/api/chat.ts` — the Astro API route
- `apps/portfolio/src/lib/utils/chat/context.ts` — builds the system prompt from Strapi
- `apps/portfolio/src/lib/utils/chat/prompt.ts` — system prompt template
- `apps/portfolio/src/components/assistant/useAssistantChat.ts` — chat state + AI SDK hooks
- `services/intel-engine/app/api/brain.py` — `/brain/think` SSE endpoint
- `services/intel-engine/app/services/indexer.py` — docs indexing pipeline
- `services/intel-engine/app/services/retriever.py` — pgVector search

---

## Integration Phases

### Phase 1 — RAG Context Enrichment

Intel-engine's value right now is the indexed docs corpus (178 markdown files). The fastest path: call it as a context provider at request time, keeping the Vercel AI SDK streaming layer intact.

**Step 1: Add a search endpoint to intel-engine**

`services/intel-engine/app/api/indexing.py` — add:

```python
@router.get("/search")
async def search_knowledge(q: str, top_k: int = 5):
    docs = await retriever.find_relevant_docs(q, top_k=top_k)
    return {"results": docs}
```

**Step 2: Add `fetchRagContext` to the portfolio**

`apps/portfolio/src/lib/utils/chat/context.ts`:

```ts
export async function fetchRagContext(query: string): Promise<string> {
  const engineUrl = import.meta.env.INTEL_ENGINE_URL;
  if (!engineUrl || !query) return "";
  try {
    const res = await fetch(
      `${engineUrl}/knowledge/search?q=${encodeURIComponent(query)}&top_k=5`,
      { signal: AbortSignal.timeout(3000) }
    );
    const { results } = await res.json();
    return results
      .map((r: any) => `SOURCE: ${r.source}\n${r.content}`)
      .join("\n\n");
  } catch {
    return "";
  }
}
```

**Step 3: Wire it into `chat.ts`**

`apps/portfolio/src/pages/api/chat.ts`:

```ts
const lastUserMessage =
  safeMessages.findLast((m: any) => m.role === "user")?.content ?? "";

const [{ systemPrompt }, ragContext] = await Promise.all([
  fetchChatContext(pathname),
  fetchRagContext(lastUserMessage),
]);

// then in streamText:
system: ragContext
  ? `${systemPrompt}\n\n--- KNOWLEDGE BASE ---\n${ragContext}`
  : systemPrompt,
```

**Step 4: Add env var**

- Portfolio (Vercel): `INTEL_ENGINE_URL=https://<intel-engine-domain>`
- Fails gracefully — `fetchRagContext` returns `""` on any error, so Rin still works if intel-engine is down.

---

### Phase 2 — Rin's Persona

`context.ts` already calls `getPromptBySlug("portfolio-assistant")` from Strapi. If that record exists, it overrides the built system prompt entirely.

Intel-engine seeds this record at startup via `brain.sync_prompts_to_strapi()`. The current `system_message` is generic — update it to carry Rin's register from `docs/features/rin.md`:

- Keeper framing, not assistant framing
- `"What brings you here today?"` — never `"How can I help?"`
- Lore lives as subtext, not narration
- Neutral pronouns throughout

Two ways to update:
1. Edit `DEFAULT_PROMPTS` in `services/intel-engine/app/core/brain.py` → redeploy → hit `/brain/sync`
2. Edit the record directly in Strapi admin → takes effect on next request, no deploy needed

---

### Phase 3 — Full Routing Through Intel-Engine (future)

This replaces `streamText → Claude` with `POST /brain/think → LangGraph`. Unlocks:
- Persistent conversation memory (LangGraph checkpointing in PostgreSQL)
- Full expert dispatcher (librarian, architect, sage, etc.)
- RL trajectory tracking per conversation

**The blocker:** Intel-engine's SSE format is:
```
{ event: "node_start",     data: "ANALYZE INTENT" }
{ event: "final_response", data: "{ intent, response }" }
```

Vercel AI SDK's `useChat` expects UIMessageStream. These are incompatible.

**Two resolution paths:**

A. Add a format adapter in intel-engine — wrap `brain.process_query` output to emit AI SDK-compatible stream chunks. Keeps `useChat` and the existing UI intact.

B. Replace `useChat` with a custom SSE hook in `useAssistantChat.ts`. More work on the frontend, full control over the stream format.

Do Phase 3 after Phase 1 is validated and intel-engine is stable on Railway.

---

## Prerequisites

Before Phase 1 can ship:

1. **Intel-engine deployed on Railway** — service exists, env vars set
2. **`/app/data` docs volume** — the indexer runs at startup against `/app/data`. On Railway there are no volume mounts; docs must be baked into the Docker image. This is an open problem. Options:
   - Change Railway root directory to monorepo root and copy docs in Dockerfile
   - Run a build-time script that fetches docs from the GitHub API
   - Mount a Railway Volume and sync docs on deploy via a startup script
3. **`VOYAGE_API_KEY`** set on Railway — embeddings fail silently otherwise
4. **`ANTHROPIC_API_KEY`** set on Railway — LLM calls fail

---

## Observability Split

| Layer | Tool |
|---|---|
| Portfolio `/api/chat` (TypeScript) | Vercel AI Gateway + LangSmith (if configured) |
| Intel-engine `/brain/think` (Python) | LangSmith — traces every LangGraph node |

Keep them separate. Vercel AI Gateway is TypeScript/AI SDK native. LangSmith is Python/LangChain native. Bridging them adds no value and loses per-node tracing.

---

## Related Docs

- [`rin.md`](./rin.md) — character lore and persona register
- [`azucena-lytics-plan.md`](./azucena-lytics-plan.md) — analytics dashboard context
- [`agentic-telemetry.md`](./agentic-telemetry.md) — RL trajectory telemetry design
