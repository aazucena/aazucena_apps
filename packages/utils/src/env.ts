/**
 * Environment Utilities
 * Meta-framework agnostic development mode detection
 */

// Internal helper (use dom.ts isBrowser for public API)
const _isBrowser = typeof window !== 'undefined';

/**
 * Check if running in development mode
 * Works across Next.js, Astro, Vite, and other build tools
 *
 * @returns true if in development mode, false otherwise
 */
export function isDevelopment(): boolean {
  // Build-time constant - bundlers will replace this at build time
  // This works in Next.js, Astro, Vite, and other modern bundlers
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return !isDevelopment();
}

/**
 * Get current environment name
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof process !== 'undefined') {
    const env = process.env.NODE_ENV;
    if (env === 'test') return 'test';
    if (env === 'production') return 'production';
  }
  return 'development';
}

/**
 * Development-only logger
 * Only logs in development mode, no-op in production
 */
export const devLog = {
  log: (...args: unknown[]) => {
    if (isDevelopment() && _isBrowser) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment() && _isBrowser) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDevelopment() && _isBrowser) {
      console.error(...args);
    }
  },
};
