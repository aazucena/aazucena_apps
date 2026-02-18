/**
 * Internal shared primitives for apply-theme and theme-manager.
 * Not exported from the package index — internal use only.
 */

import { kebabCase, forEach } from 'lodash-es';
import { fontFamilies } from '../tokens/typography.js';
import { vibes } from '../themes/registry.js';
import type { SystemThemeConfig } from '@aazucena/types';

// ---------------------------------------------------------------------------
// Environment guard
// ---------------------------------------------------------------------------

/**
 * Returns true only in a real browser context.
 * Rejects SSR (no `window`), jsdom/happy-dom (no real `CSSStyleDeclaration`),
 * and environments where `document.documentElement` is unavailable.
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.documentElement instanceof HTMLElement
  );
}

// ---------------------------------------------------------------------------
// Value sanitization
// ---------------------------------------------------------------------------

/**
 * Blocks legacy IE `expression(...)`, javascript: URIs, and HTML-injection
 * attempts from reaching the DOM as CSS custom property values.
 */
const UNSAFE_CSS_PATTERN = /expression\s*\(|javascript\s*:|<\s*script|data\s*:/i;

export function sanitizeCssValue(value: string, context = '[design-system]'): string {
  if (UNSAFE_CSS_PATTERN.test(value)) {
    console.warn(`${context} Blocked unsafe CSS value: "${value}"`);
    return '';
  }
  return value;
}

// ---------------------------------------------------------------------------
// Vibe registry lookup
// ---------------------------------------------------------------------------

/**
 * Returns a safe vibe id constrained to known registry keys.
 * Prevents prototype pollution via arbitrary string lookups.
 */
export function resolveVibeId(vibeId: string): string {
  return Object.prototype.hasOwnProperty.call(vibes, vibeId) ? vibeId : 'default';
}

// ---------------------------------------------------------------------------
// Core config writer
// ---------------------------------------------------------------------------

/**
 * Writes a SystemThemeConfig's tokens as CSS custom properties onto a target
 * element. Returns the list of property names that were set, so callers can
 * track and later remove exactly what they wrote.
 */
export function writeThemeConfig(config: SystemThemeConfig, target: HTMLElement, context = '[design-system]'): string[] {
  const applied: string[] = [];

  function set(prop: string, value: string): void {
    const safe = sanitizeCssValue(value, context);
    if (!safe) return;
    target.style.setProperty(prop, safe);
    applied.push(prop);
  }

  // Colors
  forEach(config.colors, (value, key) => {
    set(`--${kebabCase(key)}`, value as string);
  });

  // Effects
  set('--backdrop-blur', config.effects.backdropBlur);
  set('--shadow', config.effects.shadow);
  if (config.effects.glowColor) set('--glow-color', config.effects.glowColor);
  if (config.effects.cardBlur) set('--card-blur', config.effects.cardBlur);
  forEach(config.effects.borderRadius, (value, key) => {
    set(`--radius-${key}`, value);
  });

  // Typography
  const hFont = fontFamilies[config.typography.headingFont].join(', ');
  const bFont = fontFamilies[config.typography.bodyFont].join(', ');
  set('--font-heading', hFont);
  set('--font-body', bFont);
  forEach(config.typography, (value, key) => {
    if (key !== 'headingFont' && key !== 'bodyFont') {
      set(`--font-${kebabCase(key)}`, value as string);
    }
  });

  if (config.customClass) {
    set('--custom-class', config.customClass);
  }

  return applied;
}
