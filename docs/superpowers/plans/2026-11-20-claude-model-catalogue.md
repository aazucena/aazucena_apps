# Claude Model Catalogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give AI model IDs, names, roles and prices one home that the AI Terminal picker, the chat route and the cost ledger all read. Offer three current Claude models.

**Architecture:**

- **Data:** a typed catalogue in `@aazucena/constants` holds the chat models and a price table, which also covers retired models so history still gets a cost.
- **Cost:** one `calculateAiCost` in `@aazucena/utils` replaces the three copies. The analytics and api `pricing.ts` files become thin re-exports.
- **Validation:** the chat route accepts only catalogue IDs.

**Tech Stack:** TypeScript, Next.js 16 route handlers, AI SDK through the Vercel AI Gateway (`gateway(modelId)`), vitest (in `@aazucena/utils`), Changesets.

**Spec:** this plan carries the spec itself, since there's no separate document. It's the owner-approved recommendation from 2026-11-20:

- **Problem:** model IDs live in 6 places and disagree. The picker sends `anthropic/claude-3-5-sonnet`, but the price table knows only `…-20241022`, so terminal chats go unpriced.
- **What to build:**
  1. one catalogue
  2. three current Claude models (deep, default and fast)
  3. IDs and prices checked against the gateway's live model list
  4. a chat-route allow-list
  5. a test that every catalogue model is priced and the default is in the catalogue
- **Out of scope:** the Python `services/intel-engine`, which keeps its own setting.

## Global Constraints

- **Prices** are USD per 1,000,000 tokens. They were checked against `https://ai-gateway.vercel.sh/v1/models` on 2026-11-20, where the gateway gives per-token values (×1e6).

  Chat models:

  | Model ID                      | Role    | Input | Output |
  | ----------------------------- | ------- | ----- | ------ |
  | `anthropic/claude-opus-5.5`   | deep    | 4.0   | 20.0   |
  | `anthropic/claude-sonnet-5.5` | default | 2.0   | 10.0   |
  | `anthropic/claude-haiku-5.5`  | fast    | 0.1   | 0.5    |

  Legacy models (priced, never offered):

  | Model ID                                      | Input | Output | Note                                                                        |
  | --------------------------------------------- | ----- | ------ | --------------------------------------------------------------------------- |
  | `anthropic/claude-opus-4.7`                   | 5.0   | 25.0   |                                                                             |
  | `anthropic/claude-sonnet-4.6`                 | 3.0   | 15.0   |                                                                             |
  | `anthropic/claude-haiku-4.5`                  | 1.0   | 5.0    |                                                                             |
  | `anthropic/claude-3-5-sonnet` and `-20241022` | 3.0   | 15.0   |                                                                             |
  | `anthropic/claude-3-opus` and `-20240229`     | 15.0  | 75.0   |                                                                             |
  | `anthropic/claude-3-haiku` and `-20240307`    | 0.25  | 1.25   |                                                                             |
  | OpenAI, Google and Voyage IDs                 | —     | —      | Keep the values in today's `apps/analytics/src/lib/services/ai/pricing.ts`. |
  | `local/brain`                                 | 0     | 0      |                                                                             |

- **Default chat model:** `anthropic/claude-sonnet-5.5`. **Savings baseline:** `anthropic/claude-opus-5.5`, the deep tier, so "savings" means "vs the most capable model".
- **Never offered:** OpenAI and Google, which are dropped providers. They stay priced only.
- **Unknown model IDs** cost 0 and are reported by `isPriced(id) === false`. Nothing throws on telemetry.
- **Commits:** one per concern, `git add <path>` only, conventional with emoji, lower-case subject after the type, body lines ≤ 100 chars, no AI attribution, never push or branch.
- **Changesets:** `@aazucena/constants` minor, `@aazucena/utils` patch, `@aazucena/api` patch.

## Review Focus

1. **A browser sends an old or garbage `modelId`**, for example a saved request with `openai/gpt-4o` or a typo. The route must answer 400 with `{ error: 'Unknown model' }`, never forward it to the gateway. Test: Task 3, `rejects a model outside the catalogue`.
2. **No `modelId` at all.** The route uses `DEFAULT_CHAT_MODEL`. Test: Task 3, `uses the default model when none is sent`.
3. **Telemetry with a model ID in a different case**, for example `Anthropic/Claude-Sonnet-5.5`. It must still be priced, because lookup lower-cases the ID. Test: Task 1, `prices ids case-insensitively`.
4. **History priced under a retired ID**, such as the picker's old `anthropic/claude-3-5-sonnet`. It must get its real price, not 0. Test: Task 1, `prices the retired picker id`.
5. **Savings when the actual model costs more than the baseline**, which is impossible today but not by construction. Savings must clamp at 0. Test: Task 1, `savings never go negative`.

---

## File Structure

| File                                                                                       | Responsibility                                                                                                                               |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/constants/src/ai-models.ts` (create)                                             | `CLAUDE_MODELS`, `DEFAULT_CHAT_MODEL`, `MODEL_PRICES`, `SAVINGS_BASELINE_MODEL`, `isChatModel`, `priceFor`, `isPriced`, types                |
| `packages/constants/src/ai.ts`                                                             | Remove `AI_MODELS`, `AI_PRICING` and the old `SAVINGS_BASELINE_MODEL`; keep `NEURAL_MAP_FALLBACK_NODES` and the rest. Re-export `ai-models`. |
| `packages/utils/src/math.ts`                                                               | `calculateAiCost`, `calculateAiSavings` read `priceFor` / `SAVINGS_BASELINE_MODEL`                                                           |
| `packages/utils/src/__tests__/ai-models.test.ts` (create)                                  | Catalogue and cost tests                                                                                                                     |
| `apps/analytics/src/lib/services/ai/pricing.ts`, `packages/api/src/services/ai/pricing.ts` | Become re-exports (same exported names as today)                                                                                             |
| `apps/analytics/src/app/api/ai/chat/route.ts`                                              | Allow-list + default                                                                                                                         |
| `apps/analytics/src/app/(dashboard)/ai/page.tsx`                                           | Picker reads `CLAUDE_MODELS`                                                                                                                 |
| `packages/constants/README.md`, `packages/constants/docs/*.md`, `.changeset/*.md`          | Docs and release notes                                                                                                                       |

---

### Task 1: Catalogue and one cost function

**Files:** create `packages/constants/src/ai-models.ts` and `packages/utils/src/__tests__/ai-models.test.ts`; modify `packages/constants/src/ai.ts` and `packages/utils/src/math.ts`.

**Interfaces (produces):**

```ts
export type ModelRole = 'deep' | 'default' | 'fast';
export interface ModelPrice {
  in: number;
  out: number;
} // USD per 1M tokens
export interface ChatModel {
  id: string;
  name: string;
  role: ModelRole;
  price: ModelPrice;
}
export const CLAUDE_MODELS: readonly ChatModel[]; // order: deep, default, fast
export type ChatModelId = (typeof CLAUDE_MODELS)[number]['id'];
export const DEFAULT_CHAT_MODEL: ChatModelId; // 'anthropic/claude-sonnet-5.5'
export const SAVINGS_BASELINE_MODEL: ChatModelId; // 'anthropic/claude-opus-5.5'
export const MODEL_PRICES: Readonly<Record<string, ModelPrice>>; // catalogue + legacy, lower-case keys
export function isChatModel(id: unknown): id is ChatModelId;
export function priceFor(model: string): ModelPrice; // lower-cases; unknown → { in: 0, out: 0 }
export function isPriced(model: string): boolean;
// in @aazucena/utils (math.ts), signatures unchanged:
export function calculateAiCost(model: string, inputTokens: number, outputTokens: number): number;
export function calculateAiSavings(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number;
```

Names: `Claude Opus 5.5`, `Claude Sonnet 5.5`, `Claude Haiku 5.5`. Declare `CLAUDE_MODELS` `as const satisfies readonly ChatModel[]`, so `ChatModelId` is the literal union. `MODEL_PRICES` spreads the catalogue prices first, then the legacy table from Global Constraints.

- [ ] **Step 1: Write the failing tests** in `ai-models.test.ts`, importing from `@aazucena/constants` and `../math`:
  - `offers three Claude models, one per role`: `CLAUDE_MODELS.map(m => m.role)` equals `['deep','default','fast']`; every id starts with `anthropic/`.
  - `prices every catalogue model`: for each model, `isPriced(m.id)` is true and `priceFor(m.id)` equals `m.price`.
  - `keeps the default and the baseline in the catalogue`: `isChatModel(DEFAULT_CHAT_MODEL)` and `isChatModel(SAVINGS_BASELINE_MODEL)` are true.
  - `rejects ids outside the catalogue`: `isChatModel('openai/gpt-4o')`, `isChatModel('')` and `isChatModel(42)` are false.
  - `prices ids case-insensitively`: `priceFor('Anthropic/Claude-Sonnet-5.5')` equals `{ in: 2, out: 10 }`.
  - `prices the retired picker id`: `priceFor('anthropic/claude-3-5-sonnet')` equals `{ in: 3, out: 15 }`.
  - `costs unknown models nothing`: `calculateAiCost('mystery/model', 1e6, 1e6)` is `0`, and `isPriced('mystery/model')` is false.
  - `calculates cost per million tokens`: `calculateAiCost('anthropic/claude-sonnet-5.5', 1_000_000, 500_000)` is `7`.
  - `savings never go negative`: `calculateAiSavings('anthropic/claude-3-opus', 1e6, 1e6)` is `0` (it costs more than the baseline). `calculateAiSavings('anthropic/claude-haiku-5.5', 1e6, 1e6)` is close to `23.4` (`toBeCloseTo`).
- [ ] **Step 2: Run them and watch them fail.** Run `pnpm --filter @aazucena/utils exec vitest run src/__tests__/ai-models.test.ts`. Expected: they fail because the imports are missing.
- [ ] **Step 3: Implement.**
  - Create `ai-models.ts`.
  - Remove `AI_MODELS`, `AI_PRICING` and the old `SAVINGS_BASELINE_MODEL` from `ai.ts`, and add `export * from './ai-models'`. Run `rg -n "AI_MODELS|AI_PRICING" apps packages --glob '!**/node_modules/**'` first; the only code consumer is `math.ts`, and fix any other you find.
  - In `math.ts`, `calculateAiCost` uses `priceFor`, and `calculateAiSavings` uses `Math.max(0, …)` with the new baseline.
- [ ] **Step 4: Run them and watch them pass.** Run the same command, then `pnpm --filter @aazucena/utils test`, `cd packages/constants && npx tsc --noEmit` and `cd packages/utils && npx tsc --noEmit`. Expected: everything passes.
- [ ] **Step 5: Commit.** `✨ feat(constants): one claude model catalogue with prices`, staging `ai-models.ts`, `ai.ts`, `math.ts` and the test.

### Task 2: Analytics and api read the catalogue

**Files:** modify `apps/analytics/src/lib/services/ai/pricing.ts` and `packages/api/src/services/ai/pricing.ts`.

**Interfaces:**

- **Consumes:** Task 1.
- **Keeps** the exported names both files export today, because `apps/analytics/src/app/api/ingest/route.ts:140-145` and the services barrels import them: `MODEL_REGISTRY`, `normalizeModelName`, `SAVINGS_BASELINE_MODEL`, `calculateAiCost` and `calculateHypotheticalCost` in analytics, plus whatever `packages/api`'s file exports.

- [ ] **Step 1: Rewrite both files as thin adapters.**
  - `MODEL_REGISTRY = { ...MODEL_PRICES, default: { in: 0, out: 0 } }`.
  - `calculateAiCost` and `SAVINGS_BASELINE_MODEL` are re-exported from `@aazucena/utils` and `@aazucena/constants`.
  - `calculateHypotheticalCost(i, o) = calculateAiCost(SAVINGS_BASELINE_MODEL, i, o)`.
  - `normalizeModelName` keeps its current behaviour.
  - Delete the local price tables, including the Ollama entries in `packages/api`. Ollama is dropped and unknown IDs cost 0 anyway.
- [ ] **Step 2: Verify.** Run `pnpm --filter analytics type-check`, `cd packages/api && npx tsc --noEmit`, and `rg -n "in: [0-9.]+, out:" apps/analytics/src packages/api/src`. Expected: no price literals remain outside `packages/constants`.
- [ ] **Step 3: Commit.** `♻️ refactor(analytics,api): price ai calls from the shared catalogue`.

### Task 3: Chat route allow-list and the picker

**Files:**

- Modify: `apps/analytics/src/app/api/ai/chat/route.ts` and `apps/analytics/src/app/(dashboard)/ai/page.tsx`.
- Create: `apps/analytics/src/app/api/ai/chat/model.ts` and `packages/utils/src/__tests__/chat-model.test.ts`. The analytics app has no unit runner, so the pure resolver is tested from utils by relative import. If that import fails across packages, put `resolveChatModel` in `@aazucena/utils` (`src/ai.ts`, exported) and import it in the route.

**Interfaces:**

- **Consumes:** `isChatModel` and `DEFAULT_CHAT_MODEL` (Task 1).
- **Produces:** `resolveChatModel(input: unknown): { ok: true; id: ChatModelId } | { ok: false }`.
  - `undefined` or `null` → `{ ok: true, id: DEFAULT_CHAT_MODEL }`
  - a catalogue ID → `ok: true`
  - anything else → `{ ok: false }`

- [ ] **Step 1: Write the failing tests** for `resolveChatModel`:
  - `uses the default model when none is sent`: `resolveChatModel(undefined)` returns `{ ok: true, id: 'anthropic/claude-sonnet-5.5' }`.
  - `accepts a catalogue model`: `resolveChatModel('anthropic/claude-haiku-5.5').ok` is true.
  - `rejects a model outside the catalogue`: `resolveChatModel('openai/gpt-4o')`, `resolveChatModel('anthropic/claude-3-5-sonnet')` and `resolveChatModel(7)` each return `{ ok: false }`.
- [ ] **Step 2: Run them and watch them fail.** Run `pnpm --filter @aazucena/utils exec vitest run src/__tests__/chat-model.test.ts`.
- [ ] **Step 3: Implement.**
  - **Route:** replace the destructured default with `resolveChatModel(body.modelId)`. On `{ ok: false }`, return `new Response(JSON.stringify({ error: 'Unknown model' }), { status: 400, headers: { 'Content-Type': 'application/json' } })` before calling the gateway. Use the resolved ID for `gateway(...)` and for telemetry.
  - **Picker:** replace `AVAILABLE_MODELS` with `CLAUDE_MODELS`, initial state `DEFAULT_CHAT_MODEL`. The option label is `${m.name} · ${m.role}`, and both selects (session panel and compact header) render the same list. The page's `activeModel` lookup uses `CLAUDE_MODELS`.
- [ ] **Step 4: Verify.**
  - Tests pass, `pnpm --filter analytics type-check` and `pnpm --filter analytics lint` are clean, and the analytics token guard passes (`pnpm --filter @aazucena/design-system exec vitest run src/utils/analytics-token-usage.test.ts`).
  - With the dev server on :8080, `curl -s -o /dev/null -w '%{http_code}' -X POST localhost:8080/api/ai/chat -H 'Content-Type: application/json' --cookie "az_session=$ADMIN_SECRET" -d '{"messages":[],"modelId":"openai/gpt-4o"}'` prints `400`. Read `ADMIN_SECRET` from `apps/analytics/.env` into the shell, and never print it.
  - Stop the server afterwards.
- [ ] **Step 5: Commit, one per concern.**
  - `🔒 fix(analytics): chat route accepts only catalogue models` (route, resolver, test)
  - `✨ feat(analytics): ai terminal offers opus, sonnet and haiku 5.5` (page)

### Task 4: Docs and changesets

**Files:**

- Modify: `packages/constants/README.md` (lines about `AI_MODELS`, `AI_PRICING` and `SAVINGS_BASELINE_MODEL`, around L442 and L721-743), `packages/constants/docs/usage-patterns.md` (around L141) and `packages/constants/docs/constants-catalog.md` (around L493).
- Create: `.changeset/claude-model-catalogue.md`.

- [ ] **Step 1: Docs.** Replace the old `AI_MODELS` / `AI_PRICING` sections with a short `CLAUDE_MODELS` / `MODEL_PRICES` section:
  - the table from Global Constraints
  - how to add a model: catalogue entry, gateway price, test
  - that prices are checked against the gateway's live model list
  - one line saying `services/intel-engine` sets its own model (`claude-haiku-4-5-20251001`) outside the catalogue

  Use plain wording, no marketing words.

- [ ] **Step 2: Changeset.**
  - Header: `'@aazucena/constants': minor`, `'@aazucena/utils': patch`, `'@aazucena/api': patch`.
  - Body: "One Claude model catalogue (`CLAUDE_MODELS`, `MODEL_PRICES`) replaces `AI_MODELS` and `AI_PRICING`. AI costs come from a single `calculateAiCost`, priced from the gateway's list; the savings baseline is Claude Opus 5.5."
- [ ] **Step 3: Verify.** Run `rg -n "AI_MODELS|AI_PRICING|GPT_4O" packages/constants`. Expected: nothing, except in `CHANGELOG.md`.
- [ ] **Step 4: Commit.** `📝 docs(constants): document the claude model catalogue` (docs + changeset).

---

## Verification (end)

- `pnpm --filter @aazucena/utils test`
- `pnpm --filter @aazucena/design-system test`
- `cd packages/constants && npx tsc --noEmit`, `cd packages/api && npx tsc --noEmit`
- `pnpm --filter analytics type-check`, `pnpm --filter analytics lint`
- `git log --format=%B <base>..HEAD | grep -ciE "co-authored|generated with"` prints `0`.
