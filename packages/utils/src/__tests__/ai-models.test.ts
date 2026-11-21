import {
  CLAUDE_MODELS,
  DEFAULT_CHAT_MODEL,
  SAVINGS_BASELINE_MODEL,
  isChatModel,
  isPriced,
  priceFor,
} from '@aazucena/constants';
import { describe, expect, it } from 'vitest';
import { calculateAiCost, calculateAiSavings } from '../math';

describe('Claude model catalogue', () => {
  it('offers three Claude models, one per role', () => {
    expect(CLAUDE_MODELS.map((m) => m.role)).toEqual(['deep', 'default', 'fast']);
    for (const m of CLAUDE_MODELS) expect(m.id.startsWith('anthropic/')).toBe(true);
  });

  it('prices every catalogue model', () => {
    for (const m of CLAUDE_MODELS) {
      expect(isPriced(m.id)).toBe(true);
      expect(priceFor(m.id)).toEqual(m.price);
    }
  });

  it('keeps the default and the baseline in the catalogue', () => {
    expect(isChatModel(DEFAULT_CHAT_MODEL)).toBe(true);
    expect(isChatModel(SAVINGS_BASELINE_MODEL)).toBe(true);
  });

  it('rejects ids outside the catalogue', () => {
    expect(isChatModel('openai/gpt-4o')).toBe(false);
    expect(isChatModel('')).toBe(false);
    expect(isChatModel(42)).toBe(false);
  });

  it('prices ids case-insensitively', () => {
    expect(priceFor('Anthropic/Claude-Sonnet-5.5')).toEqual({ in: 2, out: 10 });
  });

  it('prices the retired picker id', () => {
    expect(priceFor('anthropic/claude-3-5-sonnet')).toEqual({ in: 3, out: 15 });
  });

  it('costs unknown models nothing', () => {
    expect(calculateAiCost('mystery/model', 1e6, 1e6)).toBe(0);
    expect(isPriced('mystery/model')).toBe(false);
  });

  it('calculates cost per million tokens', () => {
    expect(calculateAiCost('anthropic/claude-sonnet-5.5', 1_000_000, 500_000)).toBe(7);
  });

  it('savings never go negative', () => {
    expect(calculateAiSavings('anthropic/claude-3-opus', 1e6, 1e6)).toBe(0);
    expect(calculateAiSavings('anthropic/claude-haiku-5.5', 1e6, 1e6)).toBeCloseTo(23.4);
  });
});
