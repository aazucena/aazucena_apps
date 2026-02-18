import { type ThemeVibeRegistry, vibes } from '../themes/registry.js';
import { isBrowser, resolveVibeId, writeThemeConfig } from './_theme-core.js';

// ---------------------------------------------------------------------------
// Tracked properties — so resetVibe only removes what it set
// ---------------------------------------------------------------------------

const TRACKED_ATTR = 'data-vibe-props';

function trackProps(root: HTMLElement, props: string[]): void {
  root.setAttribute(TRACKED_ATTR, props.join(','));
}

function getTrackedProps(root: HTMLElement): string[] {
  const raw = root.getAttribute(TRACKED_ATTR);
  return raw ? raw.split(',').filter(Boolean) : [];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Dynamically applies a vibe's tokens to :root at runtime.
 * Falls back to 'default' if the vibe id is not found in the registry.
 * No-ops in SSR / non-browser environments.
 *
 * @param vibeId - The vibe to apply (e.g. 'cyberpunk', 'halloween')
 * @param mode   - 'light' | 'dark' (default: 'dark')
 *
 * @example
 * applyVibe('cyberpunk');
 * applyVibe('halloween', 'light');
 */
export function applyVibe(vibeId: string | keyof ThemeVibeRegistry, mode: 'light' | 'dark' = 'dark'): void {
  if (!isBrowser()) return;

  const vibe = vibes[resolveVibeId(vibeId)] ?? vibes['default'] ?? Object.values(vibes)[0];
  if (!vibe) return;

  const root = document.documentElement;
  const applied = writeThemeConfig(vibe[mode], root);

  trackProps(root, applied);
  root.setAttribute('data-vibe', vibe.id);
}

/**
 * Removes only the CSS custom properties that were set by `applyVibe`,
 * leaving any other inline styles on <html> untouched.
 */
export function resetVibe(): void {
  if (!isBrowser()) return;

  const root = document.documentElement;
  const props = getTrackedProps(root);

  props.forEach((prop) => root.style.removeProperty(prop));
  root.removeAttribute('data-vibe');
  root.removeAttribute(TRACKED_ATTR);
}

/**
 * Returns the currently active vibe id, or 'default' if none has been applied.
 */
export function getActiveVibe(): string {
  if (!isBrowser()) return 'default';
  return document.documentElement.getAttribute('data-vibe') ?? 'default';
}

/**
 * Returns true if a vibe id exists in the registry.
 */
export function isValidVibe(vibeId: string): vibeId is keyof ThemeVibeRegistry {
  return Object.prototype.hasOwnProperty.call(vibes, vibeId);
}
