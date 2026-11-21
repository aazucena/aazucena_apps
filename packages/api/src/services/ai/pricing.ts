/**
 * AI pricing adapter. Models and prices live in one catalogue (@aazucena/constants, ai-models.ts);
 * cost maths lives in @aazucena/utils. This file keeps the names existing callers import.
 * Prices are USD per 1,000,000 tokens.
 */
import { MODEL_PRICES, SAVINGS_BASELINE_MODEL, type ModelPrice } from '@aazucena/constants';
import { calculateAiCost } from '@aazucena/utils';

export { SAVINGS_BASELINE_MODEL, calculateAiCost };
export { normalizeModelName } from '@aazucena/utils';

/** Every priced model plus a zero-cost fallback for unknown ids. */
export const MODEL_REGISTRY: Record<string, ModelPrice> = {
  ...MODEL_PRICES,
  default: { in: 0, out: 0 },
};

/** What the call would have cost on the savings baseline model (the deep tier). */
export function calculateHypotheticalCost(inputTokens: number, outputTokens: number): number {
  return calculateAiCost(SAVINGS_BASELINE_MODEL, inputTokens, outputTokens);
}
