import * as Sentry from "@sentry/astro";
import { getBaseClientConfig } from "@aazucena/config/sentry/client";

const environment = import.meta.env.PUBLIC_VERCEL_ENV || "development";

Sentry.init({
  ...getBaseClientConfig({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment,
  }),
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
      autoInject: environment === "preview",
    }),
  ],
  enableLogs: true,
  replaysOnErrorSampleRate: environment === "production" ? 0.1 : 1.0,
});
