/**
 * Shared Sentry Client-Side Configuration Base
 * Optimized for Browser/Astro/Next.js frontend environments.
 */

export interface SentryClientOptions {
  dsn: string;
  environment: string;
  release?: string;
  sampleRate?: number;
}

export const getBaseClientConfig = (options: SentryClientOptions) => {
  const isProduction = options.environment === 'production';
  const isPreview = options.environment === 'preview';

  return {
    dsn: options.dsn,
    environment: options.environment,
    release: options.release,
    enabled: isProduction || isPreview,

    // Performance Monitoring
    tracesSampleRate: options.sampleRate ?? (isProduction ? 0.1 : 1.0),

    // Privacy & Security
    sendDefaultPii: true,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Shared metadata
    initialScope: {
      tags: {
        'deployment.env': options.environment,
        'runtime.type': 'browser',
      },
    },
  };
};
