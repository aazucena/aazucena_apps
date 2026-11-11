/**
 * Shared Sentry Server-Side Configuration Base
 * Optimized for Node.js/SSR/Edge runtimes.
 */

export interface SentryServerOptions {
  dsn: string;
  environment: string;
  release?: string;
}

export const getBaseServerConfig = (options: SentryServerOptions) => {
  const isProduction = options.environment === 'production';

  return {
    dsn: options.dsn,
    environment: options.environment,
    release: options.release,
    enabled: isProduction,

    // Server-side monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0,

    // Performance & Profiling (v11: profiles follow sampled traces)
    profileSessionSampleRate: isProduction ? 0.1 : 1.0,
    profileLifecycle: 'trace' as const,

    // Shared metadata
    initialScope: {
      tags: {
        'deployment.env': options.environment,
        'runtime.type': 'node',
      },
    },
  };
};
