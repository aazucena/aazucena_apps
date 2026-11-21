/**
 * [Constants] : Claude_Model_Catalogue
 * The one list of chat models the apps offer, and the price table every AI cost is computed from.
 * Prices are USD per 1,000,000 tokens, checked against the Vercel AI Gateway model list
 * (https://ai-gateway.vercel.sh/v1/models) on 2026-11-20.
 *
 * To add a model: add it to CLAUDE_MODELS with its gateway id and price; the catalogue test
 * (packages/utils/src/__tests__/ai-models.test.ts) checks it is priced.
 * services/intel-engine (Python) sets its own model (claude-haiku-4-5-20251001) outside this list.
 */

export type ModelRole = 'deep' | 'default' | 'fast';

/** USD per 1M tokens. */
export interface ModelPrice {
  in: number;
  out: number;
}

export interface ChatModel {
  id: string;
  name: string;
  role: ModelRole;
  price: ModelPrice;
}

/** The chat models the apps offer, in role order: deep, default, fast. */
export const CLAUDE_MODELS = [
  {
    id: 'anthropic/claude-opus-5.5',
    name: 'Claude Opus 5.5',
    role: 'deep',
    price: { in: 4.0, out: 20.0 },
  },
  {
    id: 'anthropic/claude-sonnet-5.5',
    name: 'Claude Sonnet 5.5',
    role: 'default',
    price: { in: 2.0, out: 10.0 },
  },
  {
    id: 'anthropic/claude-haiku-5.5',
    name: 'Claude Haiku 5.5',
    role: 'fast',
    price: { in: 0.1, out: 0.5 },
  },
] as const satisfies readonly ChatModel[];

export type ChatModelId = (typeof CLAUDE_MODELS)[number]['id'];

export const DEFAULT_CHAT_MODEL: ChatModelId = 'anthropic/claude-sonnet-5.5';

/** "Savings" are measured against the deep tier: what the call would have cost on the most capable model. */
export const SAVINGS_BASELINE_MODEL: ChatModelId = 'anthropic/claude-opus-5.5';

/** Models no longer offered, priced so history still gets a cost. Keys are lower-case. */
const LEGACY_PRICES: Record<string, ModelPrice> = {
  // Anthropic — Claude 4.x
  'anthropic/claude-opus-4.7': { in: 5.0, out: 25.0 },
  'anthropic/claude-sonnet-4.6': { in: 3.0, out: 15.0 },
  'anthropic/claude-haiku-4.5': { in: 1.0, out: 5.0 },
  // Anthropic — Claude 3.x (retired from the gateway; ids as sent historically)
  'anthropic/claude-3-5-sonnet': { in: 3.0, out: 15.0 },
  'anthropic/claude-3-5-sonnet-20241022': { in: 3.0, out: 15.0 },
  'anthropic/claude-3-opus': { in: 15.0, out: 75.0 },
  'anthropic/claude-3-opus-20240229': { in: 15.0, out: 75.0 },
  'anthropic/claude-3-haiku': { in: 0.25, out: 1.25 },
  'anthropic/claude-3-haiku-20240307': { in: 0.25, out: 1.25 },
  // OpenAI and Google (dropped providers; history only)
  'openai/gpt-4o': { in: 2.5, out: 10.0 },
  'openai/gpt-4o-mini': { in: 0.15, out: 0.6 },
  'openai/gpt-4-turbo': { in: 10.0, out: 30.0 },
  'openai/o1': { in: 15.0, out: 60.0 },
  'openai/o1-mini': { in: 1.1, out: 4.4 },
  'google/gemini-2.0-flash': { in: 0.1, out: 0.4 },
  'google/gemini-2.0-flash-lite': { in: 0.075, out: 0.3 },
  'google/gemini-1.5-pro': { in: 1.25, out: 5.0 },
  'google/gemini-1.5-flash': { in: 0.075, out: 0.3 },
  // Voyage AI — embeddings only (no output tokens)
  'voyage-3': { in: 0.06, out: 0 },
  'voyage-3-lite': { in: 0.02, out: 0 },
  'voyage-code-3': { in: 0.18, out: 0 },
  'voyage-multimodal-3': { in: 0.12, out: 0 },
  'voyage-finance-2': { in: 0.12, out: 0 },
  'voyage-law-2': { in: 0.12, out: 0 },
  // Local
  'local/brain': { in: 0, out: 0 },
};

/** Every priced model: the catalogue first, then legacy ids. Keys are lower-case. */
export const MODEL_PRICES: Readonly<Record<string, ModelPrice>> = {
  ...Object.fromEntries(CLAUDE_MODELS.map((m) => [m.id, m.price])),
  ...LEGACY_PRICES,
};

const CHAT_MODEL_IDS: ReadonlySet<string> = new Set(CLAUDE_MODELS.map((m) => m.id));

export function isChatModel(id: unknown): id is ChatModelId {
  return typeof id === 'string' && CHAT_MODEL_IDS.has(id);
}

const FREE: ModelPrice = { in: 0, out: 0 };

/** Price for a model id (case-insensitive); unknown ids cost nothing. */
export function priceFor(model: string): ModelPrice {
  return MODEL_PRICES[(model ?? '').toLowerCase()] ?? FREE;
}

export function isPriced(model: string): boolean {
  return (model ?? '').toLowerCase() in MODEL_PRICES;
}
