/**
 * MODEL_REGISTRY: Centralized pricing for AI models (via Vercel AI Gateway).
 * Prices are per 1,000,000 (1M) tokens.
 */
export const MODEL_REGISTRY: Record<string, { in: number; out: number }> = {
  // Anthropic — Claude 4.x
  'anthropic/claude-opus-4.7': { in: 15.0, out: 75.0 },
  'anthropic/claude-sonnet-4.6': { in: 3.0, out: 15.0 },
  'anthropic/claude-haiku-4.5': { in: 0.8, out: 4.0 },

  // Anthropic — Claude 3.x (legacy)
  'anthropic/claude-3-5-sonnet-20241022': { in: 3.0, out: 15.0 },
  'anthropic/claude-3-opus-20240229': { in: 15.0, out: 75.0 },
  'anthropic/claude-3-haiku-20240307': { in: 0.25, out: 1.25 },

  // OpenAI (via AI Gateway)
  'openai/gpt-4o': { in: 2.5, out: 10.0 },
  'openai/gpt-4o-mini': { in: 0.15, out: 0.6 },
  'openai/gpt-4-turbo': { in: 10.0, out: 30.0 },
  'openai/o1': { in: 15.0, out: 60.0 },
  'openai/o1-mini': { in: 1.1, out: 4.4 },

  // Google (via AI Gateway)
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

  // Default fallback for unknown models
  default: { in: 0, out: 0 },
};

/**
 * Normalizes model strings from telemetry for registry lookup.
 */
export function normalizeModelName(model: string): string {
  if (!model) return 'default';
  return model.toLowerCase();
}

/**
 * Baseline model used for calculating 'Opportunity Savings'
 */
export const SAVINGS_BASELINE_MODEL = 'anthropic/claude-opus-4.7';

/**
 * Calculates the estimated USD cost of an AI inference.
 */
export function calculateAiCost(model: string, inputTokens: number, outputTokens: number): number {
  const normalized = normalizeModelName(model);
  const pricing = MODEL_REGISTRY[normalized] || MODEL_REGISTRY['default'];

  const inputCost = (inputTokens / 1_000_000) * pricing.in;
  const outputCost = (outputTokens / 1_000_000) * pricing.out;

  return inputCost + outputCost;
}

/**
 * Calculates the hypothetical cost if the query were run on the baseline model.
 */
export function calculateHypotheticalCost(inputTokens: number, outputTokens: number): number {
  return calculateAiCost(SAVINGS_BASELINE_MODEL, inputTokens, outputTokens);
}
