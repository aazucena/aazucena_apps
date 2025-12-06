import * as Sentry from "@sentry/astro";

const PUBLIC_VERCEL_ENV = import.meta.env.PUBLIC_VERCEL_ENV || 'development';


Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
      // Control feedback widget visibility via environment variable
      autoInject: PUBLIC_VERCEL_ENV === 'preview'
    }),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: PUBLIC_VERCEL_ENV === 'production' ? 0.1 : 1.0,
  // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: PUBLIC_VERCEL_ENV === 'production' ? 0.1 : 1.0,
});