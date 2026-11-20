import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { AVRA_TOKENS, cn } from '../dom';

describe('cn with Avra tokens', () => {
  it.each([
    [['p-panel', 'p-0'], 'p-0'],
    [['px-panel', 'px-4'], 'px-4'],
    [['gap-gutter', 'gap-4'], 'gap-4'],
    [['h-control', 'h-8'], 'h-8'],
    [['rounded-card', 'rounded-control'], 'rounded-control'],
    [['bg-panel', 'bg-state'], 'bg-state'],
    [['border-rule', 'border-rule-strong'], 'border-rule-strong'],
    [['text-muted-foreground', 'text-alert'], 'text-alert'],
    [['text-signal', 'text-sm'], 'text-signal text-sm'],
    [['bg-signal-subtle', 'text-signal'], 'bg-signal-subtle text-signal'],
  ])('cn(%j) -> %s', (inputs, expected) => {
    expect(cn(...inputs)).toBe(expected);
  });

  it('knows every colour token in ui globals.css', () => {
    const css = readFileSync(resolve(__dirname, '../../../ui/src/styles/globals.css'), 'utf8');
    const names = [...css.matchAll(/--color-([a-z0-9-]+):/g)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(AVRA_TOKENS.color).toContain(name);
  });
});
