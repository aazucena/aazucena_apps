import { type ThemeVibeRegistry, vibes } from '../themes/registry';
import { resolveVibeId, writeThemeConfig } from './_theme-core';

export type VibeChangeCallback = (vibeId: string, mode: 'light' | 'dark') => void;

// SSR-safe no-op element for server-side instantiation
const NOOP_ELEMENT = {
  style: { setProperty: () => {}, removeProperty: () => {}, length: 0 },
  setAttribute: () => {},
  removeAttribute: () => {},
  getAttribute: () => null,
} as unknown as HTMLElement;

/**
 * Instance-based theme manager. Targets a specific HTMLElement rather than
 * always writing to document.documentElement.
 *
 * Primary use case: Storybook decorators, where each story canvas needs
 * its own isolated vibe without affecting :root or adjacent stories.
 *
 * For app-level global usage, prefer the functional API (applyVibe / resetVibe).
 *
 * @example — Storybook decorator
 * const manager = new ThemeManager(canvasElement);
 * manager.apply('cyberpunk', 'dark');
 * manager.onChange((vibe, mode) => console.log(vibe, mode));
 * // on story teardown:
 * manager.destroy();
 */
export class ThemeManager {
  private readonly target: HTMLElement;
  private currentVibe: string = 'default';
  private currentMode: 'light' | 'dark' = 'dark';
  private trackedProps: string[] = [];
  private listeners: Set<VibeChangeCallback> = new Set();

  /**
   * @param target - The element to apply CSS custom properties on.
   *                 Defaults to document.documentElement if not provided.
   */
  constructor(target?: HTMLElement) {
    if (target) {
      this.target = target;
    } else if (typeof document !== 'undefined') {
      this.target = document.documentElement;
    } else {
      this.target = NOOP_ELEMENT;
    }
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Applies a vibe to the target element.
   * Falls back to 'default' if the vibeId is not in the registry.
   */
  apply(vibeId: string | keyof ThemeVibeRegistry, mode: 'light' | 'dark' = 'dark'): this {
    const vibe = vibes[resolveVibeId(vibeId)] ?? vibes['default'] ?? Object.values(vibes)[0];
    if (!vibe) return this;

    this.trackedProps = writeThemeConfig(vibe[mode], this.target, '[ThemeManager]');
    this.target.setAttribute('data-vibe', vibe.id);

    this.currentVibe = vibe.id;
    this.currentMode = mode;
    this.listeners.forEach((cb) => cb(this.currentVibe, this.currentMode));

    return this;
  }

  /**
   * Removes only the CSS vars set by this instance from the target element.
   * Does not affect any other inline styles.
   */
  reset(): this {
    this.trackedProps.forEach((prop) => this.target.style.removeProperty(prop));
    this.target.removeAttribute('data-vibe');
    this.trackedProps = [];
    return this;
  }

  /** Returns the currently active vibe id. */
  getVibe(): string {
    return this.currentVibe;
  }

  /** Returns the currently active mode. */
  getMode(): 'light' | 'dark' {
    return this.currentMode;
  }

  /**
   * Subscribes to vibe changes. Returns an unsubscribe function.
   *
   * @example
   * const unsub = manager.onChange((vibe, mode) => console.log(vibe, mode));
   * unsub(); // unsubscribe
   */
  onChange(callback: VibeChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Resets the target and removes all listeners. Call in Storybook teardown
   * to avoid memory leaks across hot reloads.
   */
  destroy(): void {
    this.reset();
    this.listeners.clear();
  }
}
