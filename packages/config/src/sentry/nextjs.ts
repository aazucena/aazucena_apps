/**
 * Shared Sentry Configuration for Next.js
 * Centralizes error tracking and performance monitoring.
 */

export const sharedSentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
};

export interface SentryNextOptions {
  /** Sentry organization slug */
  org: string;
  /** Sentry project slug */
  project: string;
  /** Override DSN (falls back to NEXT_PUBLIC_SENTRY_DSN env var) */
  dsn?: string;
}

/**
 * sentryNextConfigOptions - Returns Sentry Next.js build-time options.
 * Pass org and project explicitly to avoid hardcoding them in the package.
 *
 * @example
 * // sentry.config.ts
 * import { sentryNextConfigOptions } from '@aazucena/config/sentry/nextjs';
 * export default sentryNextConfigOptions({
 *   org: process.env.SENTRY_ORG!,
 *   project: process.env.SENTRY_PROJECT!,
 * });
 */
export const sentryNextConfigOptions = (opts: SentryNextOptions) => ({
  silent: true,
  org: opts.org,
  project: opts.project,
  ...(opts.dsn ? { dsn: opts.dsn } : {}),
});
