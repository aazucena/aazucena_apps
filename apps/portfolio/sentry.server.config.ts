import * as Sentry from "@sentry/astro";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

const PUBLIC_VERCEL_ENV = process.env.PUBLIC_VERCEL_ENV || "development";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN,
  enabled: PUBLIC_VERCEL_ENV === "production",
  // Adds request headers and IP for users, for more info visit: for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: PUBLIC_VERCEL_ENV === "production" ? 0.1 : 1.0,
  // Define how many user sessions have profiling enabled.
  profileSessionSampleRate: PUBLIC_VERCEL_ENV === "production" ? 0.1 : 1.0,
});
