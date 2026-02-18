/**
 * Shadow and Elevation Tokens
 * Optimized for high-fidelity material depth.
 */

export const shadows = {
  /** Tier 01: Very subtle, interactive feedback only. */
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  /** Tier 02: Standard component elevation (Cards). */
  md: '0 4px 12px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -2px rgba(0, 0, 0, 0.08)',
  /** Tier 03: Distinct surface separation (Sidebars, Menus). */
  lg: '0 12px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 12px -4px rgba(0, 0, 0, 0.1)',
  /** Tier 04: Floating elements (Modals, Popovers). */
  xl: '0 20px 40px -8px rgba(0, 0, 0, 0.25), 0 8px 20px -8px rgba(0, 0, 0, 0.15)',
  /** Tier 05: Global system priority (Toasts, Alerts). */
  '2xl': '0 32px 64px -12px rgba(0, 0, 0, 0.35)',
  /** Inset depth for form fields and wells. */
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;
