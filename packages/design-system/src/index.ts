// Themes & Vibes
export * from './themes/registry';
export * from './themes/default';
export * from './themes/minimal';
export * from './themes/nature';
export * from './themes/cyberpunk';
export * from './themes/hoyoverse';
export * from './themes/glass';
export * from './themes/canada-day';
export * from './themes/autumn';
export * from './themes/northern-lights';
export * from './themes/valentines';
export * from './themes/halloween';
export * from './themes/st-patricks';
export * from './themes/easter';
export * from './themes/christmas';
export * from './themes/birthday';
export * from './themes/new-years';
export * from './themes/lunar-new-year';

// Tokens
export * from './tokens/index';

// Assets
export * from './assets/index';

// Tailwind Integration
// TEST 14: comment out tailwindPreset to test if tailwind.ts → CJS chain is the HomepageSection source
// export { default as tailwindPreset } from './tailwind';

// Runtime Theme Switching
export { applyVibe, resetVibe, getActiveVibe, isValidVibe } from './utils/apply-theme';
export { ThemeManager, type VibeChangeCallback } from './utils/theme-manager';
export { toHex } from './utils/color-converter';

// Platform Integrations
export * from './integrations/index';
