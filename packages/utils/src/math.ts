/**
 * [Utils] : Mathematical_Primitives
 * CONCEPT: (Endgame_Score << 16) + Midgame_Score
 */

import { AI_PRICING, SAVINGS_BASELINE_MODEL } from '@aazucena/constants';

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Packs MG and EG scores into a single 32-bit integer
 */
export function packScore(mg: number, eg: number): number {
  return (eg << 16) + mg;
}

/**
 * Extracts MG and EG scores from a packed 32-bit integer
 */
export function unpackScore(packed: number) {
  return {
    mg: packed & 0xffff,
    eg: (packed >> 16) & 0xffff,
  };
}

/**
 * Generate random number in range
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Normalize value between 0 and 1
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Smooth step function for smooth transitions
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Normalizes model strings from telemetry
 */
export function normalizeModelName(model: string): string {
  if (!model) return 'default';
  let normalized = model.toLowerCase();
  if (normalized.startsWith('ollama/')) {
    normalized = normalized.replace('ollama/', '');
  }
  return normalized;
}

/**
 * Calculates the estimated USD cost of an AI inference.
 */
export function calculateAiCost(model: string, inputTokens: number, outputTokens: number): number {
  const normalized = normalizeModelName(model);
  const pricing = (AI_PRICING as any)[normalized] || AI_PRICING.default;
  const inputCost = (inputTokens / 1_000_000) * pricing.in;
  const outputCost = (outputTokens / 1_000_000) * pricing.out;
  return inputCost + outputCost;
}

/**
 * Calculates 'Opportunity Savings'
 */
export function calculateAiSavings(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const actual = calculateAiCost(model, inputTokens, outputTokens);
  const baseline = calculateAiCost(SAVINGS_BASELINE_MODEL, inputTokens, outputTokens);
  return Math.max(0, baseline - actual);
}
