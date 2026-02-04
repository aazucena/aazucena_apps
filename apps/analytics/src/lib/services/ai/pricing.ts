/**
 * MODEL_REGISTRY: Centralized pricing for AI models.
 * Prices are per 1,000,000 (1M) tokens.
 */
export const MODEL_REGISTRY: Record<string, { in: number; out: number }> = {
  // OpenAI
  'openai/gpt-4o': { in: 5.0, out: 15.0 },
  'openai/gpt-4o-mini': { in: 0.15, out: 0.6 },
  'openai/gpt-4-turbo': { in: 10.0, out: 30.0 },
  
  // Anthropic
  'anthropic/claude-3-5-sonnet': { in: 3.0, out: 15.0 },
  'anthropic/claude-3-opus': { in: 15.0, out: 75.0 },
  'anthropic/claude-3-haiku': { in: 0.25, out: 1.25 },

  // Google
  'google/gemini-1.5-pro': { in: 3.5, out: 10.5 },
  'google/gemini-1.5-flash': { in: 0.075, out: 0.3 },
  'google/gemini-2.0-flash-exp': { in: 0.1, out: 0.4 },

  // Local Models (Ollama)
  'llama3.2': { in: 0, out: 0 },
  'llama3.1': { in: 0, out: 0 },
  'phi3': { in: 0, out: 0 },
  'nomic-embed-text': { in: 0, out: 0 },

  // Default fallback for unknown models
  'default': { in: 0, out: 0 }
};

/**
 * Normalizes model strings from telemetry (e.g. 'ollama/llama3.2' -> 'llama3.2')
 */
export function normalizeModelName(model: string): string {
  if (!model) return 'default';
  
  // Strip ollama prefix if present
  let normalized = model.toLowerCase();
  if (normalized.startsWith('ollama/')) {
    normalized = normalized.replace('ollama/', '');
  }
  
  return normalized;
}

/**
 * Baseline model used for calculating 'Opportunity Savings'
 */
export const SAVINGS_BASELINE_MODEL = 'openai/gpt-4o';

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
