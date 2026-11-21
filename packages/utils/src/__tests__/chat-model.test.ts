import { describe, expect, it } from 'vitest';
import { resolveChatModel } from '../ai';

describe('resolveChatModel', () => {
  it('uses the default model when none is sent', () => {
    expect(resolveChatModel(undefined)).toEqual({ ok: true, id: 'anthropic/claude-sonnet-5.5' });
    expect(resolveChatModel(null)).toEqual({ ok: true, id: 'anthropic/claude-sonnet-5.5' });
  });

  it('accepts a catalogue model', () => {
    expect(resolveChatModel('anthropic/claude-haiku-5.5')).toEqual({
      ok: true,
      id: 'anthropic/claude-haiku-5.5',
    });
  });

  it('rejects a model outside the catalogue', () => {
    expect(resolveChatModel('openai/gpt-4o')).toEqual({ ok: false });
    expect(resolveChatModel('anthropic/claude-3-5-sonnet')).toEqual({ ok: false });
    expect(resolveChatModel(7)).toEqual({ ok: false });
  });
});
