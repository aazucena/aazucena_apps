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
  if (!engineUrl || !query) return '';
  try {
    const res = await fetch(
      `${engineUrl}/knowledge/search?q=${encodeURIComponent(query)}&top_k=5`,
      { signal: AbortSignal.timeout(3000) },
    );
    const { results } = await res.json();
    return results.map((r: any) => `SOURCE: ${r.source}\n${r.content}`).join('\n\n');
  } catch {
    return '';
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

### Phase 3 — Full Routing Through Intel-Engine (post Phase 5)

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

Do Phase 3 after Phase 1 is validated, intel-engine is stable on Railway, and **Phase 5 (Testing) is complete**.

---

#### LangGraph Architecture

Two libraries, two roles:

| Library       | Role                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| **LangChain** | Component library — wraps Voyage AI, pgVector, Claude, Cohere Rerank into standard interfaces |
| **LangGraph** | Orchestration — decides when each component runs, under what conditions, and whether to retry |

Every LangGraph node calls a LangChain component. LangChain has no concept of routing or retry loops.

**Graph flow:**

```
[Classify Intent]
        ↓
   [Retrieve]  ←──────────────────────┐
        ↓                             │ retry (max 2x)
[Grade Relevance]  ──── score < 0.4 ──┘
        ↓ score ≥ 0.4
  [Generate Answer]
```

**State shape** (`services/intel-engine/app/services/graph.py`):

```python
from typing import TypedDict, Literal, Optional
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage

class RinState(TypedDict):
    messages: list[BaseMessage]          # full conversation history
    retrieved_chunks: list[Document]     # current retrieval results
    retrieval_attempts: int              # prevents infinite retry loops
    intent: Optional[Literal[
        "projects", "experience",
        "contact", "technical"
    ]]
    voyage_scores: list[float]           # similarity scores from retrieval
    should_retry: bool                   # set by grade node
```

**Domain routing** (set by Classify Intent node):

| Intent       | Retrieval source               | Strategy                                |
| ------------ | ------------------------------ | --------------------------------------- |
| `projects`   | Strapi projects corpus         | multi-hop — code context + descriptions |
| `experience` | Timeline + skills chunks       | single-hop                              |
| `contact`    | —                              | bypass retrieval, direct answer         |
| `technical`  | Blog posts + architecture docs | multi-hop + Cohere Rerank               |

---

#### LangChain Component Map

Each node uses one LangChain component as its implementation:

| Node            | LangChain component                                | Notes                                         |
| --------------- | -------------------------------------------------- | --------------------------------------------- |
| Classify Intent | `ChatAnthropic` + structured output                | Short prompt, classify to 4 intents           |
| Retrieve        | `PGVector.as_retriever(filter={"domain": intent})` | Filter by intent domain                       |
| Grade Relevance | `CohereRerank(top_n=3)`                            | Rerank, check `relevance_score` on top result |
| Generate Answer | `ChatAnthropic` + `ChatPromptTemplate`             | Full Rin persona prompt + retrieved context   |

```python
# Grade Relevance node — threshold that triggers a retry
from langchain_cohere import CohereRerank

async def grade_relevance(state: RinState) -> RinState:
    reranker = CohereRerank(top_n=3)
    reranked = await reranker.acompress_documents(
        state["retrieved_chunks"],
        state["messages"][-1].content,
    )
    top_score = reranked[0].metadata.get("relevance_score", 0) if reranked else 0
    return {
        **state,
        "retrieved_chunks": reranked,
        "voyage_scores": [d.metadata.get("relevance_score", 0) for d in reranked],
        "should_retry": top_score < 0.4 and state["retrieval_attempts"] < 2,
        "retrieval_attempts": state["retrieval_attempts"] + 1,
    }
```

---

#### Ingestion Pipeline

Runs at startup and on Strapi content webhooks — not in the request path.

```
Strapi API clients (25)
        ↓
RecursiveCharacterTextSplitter
  chunkSize=1000, chunkOverlap=200
  (blog posts: 800/150 — shorter, denser)
        ↓
VoyageAIEmbeddings(model="voyage-3")
  (technical content: "voyage-code-2")
        ↓
PGVector (existing PostgreSQL + pgVector)
  metadata: { domain, source_slug, content_type }
```

The `domain` metadata field drives the retrieval filter in the Retrieve node — the same four values as the intent enum (`projects`, `experience`, `contact`, `technical`).

**Scheduling:** `services/intel-engine/app/services/indexer.py` already handles indexing. Add a Strapi webhook handler (`POST /knowledge/reindex`) that triggers a partial re-index on content publish rather than a full rebuild.

---

#### Implementation Order

Build and validate each piece in isolation before wiring into the graph:

1. **LangChain components first** — test `VoyageAIEmbeddings`, `PGVector` retrieval, and `CohereRerank` as standalone scripts. Confirm Voyage similarity scores and Cohere relevance scores are in expected ranges on real Strapi content.
2. **Individual nodes** — implement each node function, test with a hardcoded `RinState`. Validate the classify node routes correctly; validate the grade node triggers retry at the right threshold.
3. **Assemble the graph** — wire nodes into `StateGraph`, add the conditional edge from Grade → Retrieve (retry) or Generate (proceed).
4. **Wire to `/brain/think`** — replace `brain.process_query` internals with the new graph. The SSE output format stays the same.
5. **Resolve the stream adapter** (Path A or B from above) — connect Rin's UI to the updated endpoint.

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

| Layer                                | Tool                                          |
| ------------------------------------ | --------------------------------------------- |
| Portfolio `/api/chat` (TypeScript)   | Vercel AI Gateway + LangSmith (if configured) |
| Intel-engine `/brain/think` (Python) | LangSmith — traces every LangGraph node       |

Keep them separate. Vercel AI Gateway is TypeScript/AI SDK native. LangSmith is Python/LangChain native. Bridging them adds no value and loses per-node tracing.

---

## Rive Animation

The `RinCharacter` component (`apps/portfolio/src/components/assistant/RinCharacter.tsx`) wraps Rive and is already scaffolded. It renders when `PUBLIC_RIN_CHARACTER_SRC` is set; falls back to the static `RinMark` SVG otherwise.

### Package

Use `@rive-app/react-webgl2` — not `@rive-app/react-canvas`. The canvas renderer is the legacy path; it doesn't support Rive's advanced features (e.g. Vector Feathering) and is no longer recommended. Both packages expose the same `useRive` / `useStateMachineInput` API — the swap is a one-line import change.

### Asset hosting

The `.riv` file should be hosted at a URL and referenced via `PUBLIC_RIN_CHARACTER_SRC`. Do not serve it from `public/` as a local static asset. Cloudinary (already in the CMS stack) or Vercel Blob are both natural fits.

### State machine interface

The artboard uses two state machines running simultaneously:

| State machine | Owns                                                               | Status      |
| ------------- | ------------------------------------------------------------------ | ----------- |
| `MovementSM`  | Body behavior (idle/listening/thinking/responding/error), blinking | In progress |
| `EmotionSM`   | Eye shape, effects, face expression                                | Pending     |

`EmotionSM` is pending — it will be driven by a Number input mapping to the 22 emotion states.

### MovementSM animation timelines

**Already built**

| Timeline           | Role                                         |
| ------------------ | -------------------------------------------- |
| `idle`             | `behavior = 0` default pose                  |
| `blinking`         | looped independently of behavior             |
| `talking_light`    | `behavior = 3 (responding)`, weighted random |
| `talking_normal`   | `behavior = 3 (responding)`, weighted random |
| `talking_emphasis` | `behavior = 3 (responding)`, weighted random |

**Create — behavior states**

| Timeline        | Behavior | Description                                                |
| --------------- | -------- | ---------------------------------------------------------- |
| `listening`     | 1        | small forward lean or attentive sway loop while user types |
| `thinking_idle` | 2        | slow head tilt + look-up loop while AI generates           |
| `error`         | 4        | slump or distressed pose on API error                      |

**Create — always-on additive layer**

| Timeline    | Notes                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `breathing` | no input — layered on top of all states at all times; makes Rin feel alive between interactions |

**Create — emotion-paired reactions** (internal, no code input)

These auto-trigger inside `MovementSM` when the `emotion` Number input matches a specific value, then snap back to the active behavior. No new React props needed — `MovementSM` reads the same `emotion` input that `EmotionSM` owns.

| Timeline  | Fires when `emotion ==`      |
| --------- | ---------------------------- |
| `bounce`  | 9 (laughing), 10 (delighted) |
| `startle` | 4 (shocked)                  |
| `slump`   | 19 (exhausted), 21 (sleepy)  |

**Create — one-shot Trigger inputs**

| Timeline     | Input name  | When to fire               |
| ------------ | ----------- | -------------------------- |
| `nod`        | `nod`       | acknowledgment / agreement |
| `head_shake` | `headShake` | denial / uncertain         |

All inputs `RinCharacter` binds to:

| Input       | Type          | State machine | Values             | How exposed          |
| ----------- | ------------- | ------------- | ------------------ | -------------------- |
| `emotion`   | Number (0–21) | `EmotionSM`   | see EMOTION_INDEX  | `emotionInput` prop  |
| `behavior`  | Enum (0–4)    | `MovementSM`  | see BEHAVIOR_INDEX | `behaviorInput` prop |
| `nod`       | Trigger       | `MovementSM`  | — (one-shot)       | `ref.nod()`          |
| `headShake` | Trigger       | `MovementSM`  | — (one-shot)       | `ref.headShake()`    |

Triggers are one-shot pulses with no value — they cannot be driven by props. They are exposed via an imperative ref handle:

```tsx
export interface RinCharacterHandle {
  nod: () => void;
  headShake: () => void;
}

// Usage in a parent component:
const rinRef = React.useRef<RinCharacterHandle>(null);

rinRef.current?.nod(); // fire a single head dip
rinRef.current?.headShake(); // fire a single left-right shake
```

Internally `RinCharacter` forwards the ref via `React.forwardRef` + `React.useImperativeHandle`, calling `smi.fire()` on the corresponding `useStateMachineInput` result.

**`BEHAVIOR_INDEX`** — maps the assistant's conversational state to `MovementSM`:

| Value        | #   | Body animation                     |
| ------------ | --- | ---------------------------------- |
| `idle`       | 0   | breathing loop                     |
| `listening`  | 1   | attentive sway (user is typing)    |
| `thinking`   | 2   | head tilt loop (AI generating)     |
| `responding` | 3   | weighted-random talking animations |
| `error`      | 4   | distressed/slump pose              |

`behavior` is derived from the AI SDK `status` in `useAssistantChat`:

```ts
status === "streaming"   → "responding"
status === "submitted"   → "thinking"
status === "error"       → "error"
input.length > 0         → "listening"
(300ms tail)             → "idle"
```

State machine names are configured via a single grouped prop:

```tsx
// defaults — no prop needed
<RinCharacter src={rinSrc} currentEmotion={currentEmotion} behavior={behavior} />

// override one or both
<RinCharacter
  src={rinSrc}
  currentEmotion={currentEmotion}
  behavior={behavior}
  stateMachines={{ movement: "MovementSM", emotion: "EmotionSM" }}
/>
```

Internally both are passed to `useRive` as `stateMachines: [movementSM, emotionSM]`. Order matters — `MovementSM` last means the talking mouth animation always wins over the expression mouth shape while responding is active.

### Artboard states reference

**Effects (10):** Angry, Laughing, Embarrassed, Sad, Disgusted, Sleepy, Amazed, Nervous, Confused, Scared

**Eyes (15):**

- Wink: Normal
- Open: Dialed, Whiten, Amazed, Expanded, Tired, Tired/Exhausted, Tired/Delirious, Half, Downwards, Upwards, Normal
- Closed: Sleepy, Curved, Flat, Delight, Winced

**Mouth (24):**

- Open/Flat: Grin
- Open/Smile: Grin, Silly, Delight, Amazed, Happy, Surprised, Wide, Half
- Open/Frown: Grin, Snore, Tired, Gasp
- Closed: Frown, Cute, Smirk, Smile, Zigzag, Flat, Thinking, Pouting, Disappointed, Normal

### Emotion → state mapping

| #   | Emotion      | Eyes                 | Mouth                | Effect      |
| --- | ------------ | -------------------- | -------------------- | ----------- |
| 0   | idle         | Open/Normal          | Closed/Normal        | —           |
| 1   | happy        | Closed/Curved        | Closed/Smile         | —           |
| 2   | thinking     | Open/Downwards       | Closed/Thinking      | Nervous     |
| 3   | surprised    | Open/Expanded        | Open/Smile/Surprised | —           |
| 4   | shocked      | Open/Whiten          | Open/Frown/Gasp      | Scared      |
| 5   | flustered    | Open/Upwards         | Closed/Cute          | Embarrassed |
| 6   | sad          | Open/Downwards       | Closed/Pouting       | Sad         |
| 7   | angry        | Open/Downwards       | Closed/Frown         | Angry       |
| 8   | disgusted    | Closed/Winced        | Open/Frown/Grin      | Disgusted   |
| 9   | laughing     | Closed/Delight       | Open/Smile/Wide      | Laughing    |
| 10  | delighted    | Closed/Delight       | Open/Smile/Delight   | Amazed      |
| 11  | uninterested | Open/Half            | Closed/Flat          | —           |
| 12  | cute         | Open/Expanded        | Closed/Cute          | Embarrassed |
| 13  | annoyed      | Open/Tired           | Closed/Disappointed  | Angry       |
| 14  | winking      | Wink/Normal          | Closed/Smirk         | —           |
| 15  | silly        | Open/Dialed          | Open/Smile/Silly     | —           |
| 16  | smirky       | Open/Normal          | Closed/Smirk         | —           |
| 17  | cringe       | Closed/Winced        | Closed/Zigzag        | Disgusted   |
| 18  | impressed    | Open/Amazed          | Open/Smile/Amazed    | Amazed      |
| 19  | exhausted    | Open/Tired/Exhausted | Open/Frown/Tired     | Sad         |
| 20  | confused     | Open/Tired/Delirious | Closed/Zigzag        | Confused    |
| 21  | sleepy       | Closed/Sleepy        | Open/Frown/Snore     | Sleepy      |

All 22 emotions have a complete mapping — no missing states.

### Emotion descriptions (Claude guidance)

These descriptions live in `set-emotion.ts` as the `.describe()` on the `emotion` input. Claude reads them when selecting which emotion to fire — they exist specifically to disambiguate similar emotions.

| Emotion      | When to use                                                                   | Portfolio context                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| idle         | Default/neutral, no particular feeling; waiting or simply present             | Opening state, between topics, or when a visitor first arrives                                                                             |
| happy        | Warm, pleased, genuinely positive; contentment or good news                   | Visitor engages meaningfully with the archive or asks about something Rin finds rewarding to discuss                                       |
| delighted    | Strong joy or excitement; something wonderful happened                        | Visitor discovers something Rin finds particularly special in the archive, or shares genuine enthusiasm about the work                     |
| laughing     | Finding something genuinely funny; amusement or a good joke                   | Visitor makes a clever observation, a self-aware joke, or something unexpectedly witty                                                     |
| thinking     | Focused, processing, working something out (sweat drop effect)                | Explaining a complex architectural decision, tracing how something was built, or recalling specific details from the archive               |
| confused     | Lost or uncertain; doesn't follow, needs clarification (question mark effect) | Visitor's question is ambiguous, references something outside the archive, or Rin genuinely lacks the context to answer                    |
| surprised    | Mild unexpected moment; caught off guard but not alarmed                      | Visitor asks something Rin didn't anticipate, or surfaces an unexpected connection between works                                           |
| shocked      | Overwhelmed or startled; intense surprise, can't believe it                   | Visitor notices an extremely obscure detail or asks something that cuts unexpectedly to the heart of the archive                           |
| flustered    | Bashful, caught off guard emotionally; a compliment or personal question      | Visitor asks directly about Rin's nature, compliments the work in a personal way, or asks something unexpectedly touching about the temple |
| cute         | Playfully sweet or endearing; a warm lighthearted moment                      | Light, friendly exchange — visitor is enthusiastic or playful in a way that's genuinely charming                                           |
| sad          | Emotionally low; something disappointing, melancholy, or touching             | Discussing work that didn't make it into the archive, something Aldrin withdrew, or a project that never shipped                           |
| angry        | Genuinely upset or wronged; strong negative feeling                           | Visitor is dismissive of the work, asks in bad faith, or challenges something Rin holds with genuine care                                  |
| annoyed      | Mildly irritated; something repetitive or frustrating but not severe          | Repeated questions, attempts to make Rin break character, or mildly dismissive framing                                                     |
| disgusted    | Strong aversion or distaste; something gross or objectionable                 | Visitor asks Rin to act outside its purpose or says something genuinely objectionable                                                      |
| cringe       | Social discomfort or secondhand embarrassment; an awkward situation           | Visitor brings up something awkward, an old project that didn't age well, or makes an unintentionally odd remark                           |
| uninterested | Bored or indifferent; a topic that doesn't engage Rin                         | Topic is entirely outside the archive's scope and Rin has nothing meaningful to offer                                                      |
| exhausted    | Physically or mentally drained; worn out, overworked                          | Long or demanding conversation; visitor has asked many detailed questions in sequence                                                      |
| sleepy       | Drowsy, barely awake; heavy-lidded and fading (Zzz effect)                    | Very slow conversation, a moment of quiet calm at the end of an exchange, or a late-night visit                                            |
| impressed    | Admiration for something skillful or unexpected; genuine respect              | Visitor demonstrates deep technical knowledge, notices a subtle architectural decision, or asks an unusually perceptive question           |
| winking      | Playful, teasing, a knowing aside                                             | Sharing a subtle easter egg, a hidden reference, or an inside detail about the archive                                                     |
| smirky       | Confident, slightly mischievous; a sly or knowing smile                       | Rin knows something the visitor doesn't yet, or can see exactly where a line of questions is heading                                       |
| silly        | Goofy, absurd, or playfully ridiculous                                        | Visitor goes playfully off-script, asks an absurd hypothetical, or the conversation takes an unexpectedly funny turn                       |

### Visual style

Visual novel style is a **layout decision**, not a character proportion decision. Chibi is recommended as the primary art direction — it reads clearly at all sizes (28px header avatar through 400px VN portrait panel) and suits the portfolio's approachable tone. A full-body portrait can be added later as an alternate `src` for the VN panel only.

---

## Related Docs

- [`rin.md`](./rin.md) — character lore and persona register
- [`azucena-lytics-plan.md`](./azucena-lytics-plan.md) — analytics dashboard context
- [`agentic-telemetry.md`](./agentic-telemetry.md) — RL trajectory telemetry design
