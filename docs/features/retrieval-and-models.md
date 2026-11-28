# Retrieval and models for the next release (design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Owner-approved approach: C (gateway now, embedder behind one interface, Modal later).

## Intent

The owner wants the AI parts of the stack to **find, cite and point to existing material**: answers come from sources and link to them. For this release that means better retrieval: Rin (the portfolio assistant) and intel-engine find the right passages in the docs and in the Strapi content and point to them.

The owner also wants to move off Voyage to open models (Qwen, Kimi and others) and, longer term, to run models of their own on Modal. This release does the first and leaves a clean place for the second.

## Goals

1. Replace Voyage (`voyage-3`) with an open embedding model, reached through the Vercel AI Gateway, and re-index, **if** it retrieves at least as well on this corpus (see the comparison gate).
2. Index Strapi content (experiences, projects, blog posts, services, about) next to the docs, each chunk carrying its source title and URL, so answers can point to it.
3. Offer Kimi and Qwen as chat models next to Claude in the shared model catalogue. Claude stays the default.
4. Put embedding behind one interface in intel-engine, so a Modal-hosted model can replace the gateway later by configuration.
5. Refresh intel-engine's dependencies while the code is open (see Constraints).

## Non-goals

- Modal in production. It may come later with audio embeddings, a reranker and image tools, not now.
- Training or fine-tuning any model. Nothing in scope creates, so nothing needs training.
- Changing what Rin says or how it answers beyond adding sources.
- intel-bridge changes. They move to the ClickHouse project, since the bridge writes to ClickHouse.
- A reranker. Add it only if plain retrieval proves too fuzzy.

## Anti-goals (a failure even if it works)

- Any path where the model produces new work (patterns, prose, music) for a visitor instead of pointing to existing material.
- Answers about the owner's work that cite nothing, or cite something that does not say it.
- A second embedding model left half-migrated: Voyage and Qwen vectors are not comparable and must never sit in the same search.

## Current state (2026-11-27)

- **intel-engine** (Python 3.11, FastAPI 0.115, Railway) embeds with `voyageai.Client()` and `voyage-3` in two places: `app/services/indexer.py` and `app/services/retriever.py`. Vectors live in `knowledge_items.embedding vector(1024)` in the Postgres it shares with Strapi (`app/core/database.py:58`). No vector index exists; search is a sequential scan.
- **Indexer** pulls markdown from GitHub (`GITHUB_REPO`, `GITHUB_BRANCH`) filtered by `intel.config.json`, splits it into 1,000-character chunks with 100 overlap, and skips unchanged files by MD5 hash.
- **Rin** (`apps/portfolio/src/pages/api/chat.ts`) streams from the gateway (`DEFAULT_CHAT_MODEL`, Claude Sonnet 5.5). It builds a system prompt from Strapi on every request (`lib/utils/chat/context.ts`: about, portfolio, core skills, experiences, featured projects, services, the CMS prompt) and appends the top 5 docs from `GET {INTEL_ENGINE_URL}/knowledge/search` as `SOURCE: … content`. Blog posts and non-featured projects never reach Rin.
- **The LangGraph brain path already reads Strapi, crudely.** `app/services/librarian.py` maps keywords in the question ("project", "skill", "blog"…) to Strapi tables and reads up to 2 rows each straight from Postgres (title, name, description, role, company), with no visibility filter and no URL. It only runs on `/brain/think`, which is off by default. Once Strapi content is in the index, the librarian should query the index (public entries only, with title and URL) instead of raw tables; the builder decides whether it stays as a node or folds into retrieval.
- **intel-engine's own LLM calls** use LangChain with Anthropic directly (`claude-haiku-4-5-20251001`), outside the shared catalogue.
- **Model catalogue**: `packages/constants/src/ai-models.ts` exports `CLAUDE_MODELS` (deep, default, fast) with gateway ids and prices; a test checks every model is priced.

## Constraints

- **Vector width.** Qwen3-Embedding-0.6B outputs 1024 dimensions, the same as `voyage-3`, so it fits the existing column. The 4B (2560) and 8B (4096) models need a column change, and pgvector cannot index a `vector` wider than 2,000 dimensions (4,000 for `halfvec`). Start with 0.6B; the interface keeps the bigger ones one setting away.
- **Re-index is all or nothing.** After the switch, every row must be re-embedded before search uses the new model.
- **No live gateway calls during development or tests** (owner rule). Tests mock the gateway; a real re-index runs only on the owner's go.
- **Railway installs from the service's own `requirements.txt`.** Pin every dependency exactly; today several LangChain packages float on `>=`, so two builds can differ.
- **Secrets**: the gateway key comes from the environment (`AI_GATEWAY_API_KEY`); never in the repo. `VOYAGE_API_KEY` is removed from config and docs once nothing reads it.
- Commit per concern, no AI attribution, push only when asked.

## Approaches considered

|                     | A · Gateway only                                 | B · Modal for retrieval                        | **C · Gateway now, Modal-ready (chosen)**                       |
| ------------------- | ------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------- |
| Embeddings          | Qwen3-Embedding via the gateway, called directly | Qwen3-Embedding hosted on Modal                | Qwen3-Embedding via the gateway, behind an `Embedder` interface |
| Reranker            | none                                             | Qwen3-Reranker on Modal                        | none yet                                                        |
| New platform        | none                                             | Modal (account, secrets, deploys, cold starts) | none now                                                        |
| Later move to Modal | rewrite the call sites                           | already there                                  | one new `Embedder` class and a setting                          |

The owner chose **C**: no new platform this release, and Modal slots in later without touching search code. B adds Modal for a job the gateway already does; A makes the later move a rewrite.

## Design

### Embedder interface (intel-engine)

A small module, `app/services/embedder.py`:

- `Embedder` protocol: `embed_documents(texts: list[str]) -> list[list[float]]`, `embed_query(text: str) -> list[float]`, and `dimensions: int`, `model_id: str`.
- `GatewayEmbedder`: calls the AI Gateway embeddings endpoint with model `alibaba/qwen3-embedding-0.6b` (exact id to confirm against the live gateway list). Batches document calls.
- `VoyageEmbedder`: wraps the current `voyage-3` calls (query and document input types) behind the same interface. It exists so the comparison gate below can run both models side by side, and so the owner can stay on Voyage if the gate says so.
- `get_embedder()` picks the implementation from `EMBEDDER` (`voyage` or `gateway`; the default stays `voyage` until the gate passes) and the model from `EMBEDDING_MODEL`. A later `ModalEmbedder` is a new class and `EMBEDDER=modal`.
- `indexer.py` and `retriever.py` call only `get_embedder()`; `voyageai` is imported only inside `VoyageEmbedder`, and is removed with it if the cutover happens.

### Comparison gate before the cutover (owner decision, 2026-11-27)

The switch away from Voyage is decided by measurement on this corpus, not by leaderboards. Qwen's MTEB lead belongs to the 8B model; the 0.6B model chosen to fit the 1024 column may retrieve slightly worse than `voyage-3`, and no fair head-to-head was found.

- **Question set**: 15–20 questions with known answers, committed with the tests, covering both docs (how a service works, a monorepo convention) and Strapi content (a role, a project, a blog post). Each names the source(s) that should come back.
- **Metrics**: hit@5 (a correct source is in the top 5) and MRR (how high the first correct source ranks), per model, over the same chunks.
- **Run**: index the corpus once per model into separate tables or rows tagged by `embedding_model`, run the set against each, and report the two scores side by side. Runs against real APIs only on the owner's go (Voyage and the gateway both bill).
- **Decision rule**: switch to Qwen3-Embedding-0.6B if its hit@5 is at least Voyage's and its MRR is within 0.05. If it falls short, run Qwen3-Embedding-4B (needs a 2560-wide column) through the same set; if that also falls short, stay on Voyage with the interface in place and revisit with the Modal work. The owner sees the numbers before the default changes.

### Knowing which model made a vector

Store the embedding model id with each row (new column `embedding_model`). Search filters to the current `model_id`. This makes the switch safe: until the re-index finishes, old rows are ignored rather than compared with new ones, and a later model change works the same way. The indexer treats a row whose `embedding_model` differs from the current one as changed and re-embeds it.

### Strapi content in the index (ETL)

- **Extract**: read published entries through `@aazucena/api`'s Strapi endpoints or the Strapi REST API from Python: experiences, projects (all, not only featured), blog posts, services, about.
- **Transform**: turn each entry into plain text (title, key fields, rich text converted to text), split long entries with the same splitter, and attach `source_type`, `title`, `url` (the public portfolio URL, e.g. `/experiences/{slug}`), and Strapi `documentId`.
- **Load**: upsert into `knowledge_items` keyed by source and chunk; re-embed only entries whose `updatedAt` changed or whose model differs.
- **When it runs**: on demand through the existing `POST /knowledge/sync`, plus a Strapi publish webhook that calls it for the changed entry. A scheduled full sync is the builder's call.

### Sources in answers

`GET /knowledge/search` returns `title` and `url` with each result. `fetchRagContext` passes them to Rin as `SOURCE: {title} ({url})`, and the Rin prompt asks it to name and link the source for facts it uses. The system prompt keeps its Strapi summary this release, so core facts never depend on a search hit.

### Chat models

- Rename `CLAUDE_MODELS` to a provider-neutral `CHAT_MODELS` (keeping a deprecated alias if callers outside the repo need it is the builder's call) and add one Kimi and one Qwen model with gateway ids and prices checked against `https://ai-gateway.vercel.sh/v1/models` on the day.
- `DEFAULT_CHAT_MODEL` stays Claude Sonnet 5.5. Roles stay deep, default, fast; the new models get the role their price and quality fit, or a new role if none fits (builder's call, stated in the plan).
- intel-engine moves its LLM calls from LangChain Anthropic to the gateway (OpenAI-compatible endpoint), with the model id from configuration, so Kimi or Qwen can be chosen there too.

### Dependency refresh (intel-engine)

Pin every package exactly, bring FastAPI, uvicorn, pydantic, SQLAlchemy, LangChain and LangGraph to current releases that work together, drop `voyageai` and `langchain-voyageai`, and move the image to a current Python (3.12 or 3.13, whichever the pinned stack supports). Verify with the existing `test_integrations.py` plus new tests.

## Verification

- Unit tests with the gateway mocked: the embedder returns the configured width, the indexer re-embeds only changed rows and rows from another model, search never mixes models, Strapi entries become chunks with title and URL.
- The comparison gate's question set runs against the mocked pipeline in tests (checks the harness and scoring), and against both real models on the owner's go (decides the cutover).
- Rin in the browser with `/api/chat` and `/knowledge/search` mocked: a source title and link appear for a factual answer.
- Production, if the gate passes: set `EMBEDDER=gateway`, run `POST /knowledge/sync` once (owner's go), confirm every row carries the new model id, then remove `VOYAGE_API_KEY` from Railway and `VoyageEmbedder` from the code. If the gate fails, production stays on Voyage with the new interface and the Strapi content indexed.

## Owner decision (2026-11-27): repo docs in Rin's answers

Rin may quote and link the repo's docs to visitors, linked to GitHub, **except** incident write-ups (`docs/incidents/**`), audits (`docs/audits/**`) and security notes (`SECURITY.md`, anything under a `security` path). Those stay in the index for intel-engine's own use but are filtered out of what `/knowledge/search` returns to Rin (a `visibility` field on each chunk: `public` or `internal`). Doc chunks carry a GitHub URL at `main` as their source link.

## Calls made after the builder check (author's, for the owner to check)

- **Cutover without a gap.** `main.py` runs `index_github_docs()` on every boot. Rows are tagged by `embedding_model`, and queries use the model named by `EMBEDDER`, so the default stays `voyage` and boots keep indexing with Voyage. The Qwen rows are built by an explicit sync run for the new model (owner's go); `EMBEDDER` flips only once that run completes. Rin never searches an empty index. `voyageai` stays in `VoyageEmbedder` until the gate passes and the flip is done.
- **Only what visitors can already see goes in the index.** Projects: the `listed` set the site uses (`display` of `standard`, `featured` or `home`), linked to `/projects/{slug}`; hidden and unlisted never. Posts: published posts with a page, linked to `/blog/{slug}`; external posts link to their own `url`; planned posts never. Services: only `enable`d ones, linked to the homepage services section. Experiences and about: their public pages. A source with no public page is not indexed.
- **Citations from the prompt summary count.** A fact Rin takes from the Strapi summary in its prompt may cite that page's link (the summary already carries `Page: /…`). When neither the summary nor search covers a question, Rin says it doesn't know and points to the contact page; it never invents a source.
- **The `/api/brain` path is off by default** (`PUBLIC_USE_BRAIN_ENDPOINT` is empty in `.env.example`). Its LangGraph flow moves to the gateway with the rest of intel-engine and gets the same `title`/`url` sources, tested with mocks; a live production check of that path is out of scope unless the owner says it is switched on.
- **Live calls.** `test_integrations.py` becomes a manual live smoke test, run only on the owner's go. The Voyage "before" numbers come from the comparison gate's run, so no separate baseline step exists.
- Smaller calls: the source entry's `documentId` goes in chunk `metadata`, not `knowledge_items.document_id` (that column is the Strapi key of the knowledge item itself); search may add a similarity cutoff; Qwen query instructions are the builder's; Kimi and Qwen surface in the analytics AI terminal's model picker, the only place a model is chosen.

## Left to the builder

Exact gateway model ids and prices on the day; batching sizes; the Strapi read path (Python REST client or a small export endpoint); webhook security (shared secret); whether to add a scheduled sync; the migration mechanism for the new column; the Python version.
