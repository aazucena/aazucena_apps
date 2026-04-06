import * as Sentry from "@sentry/astro";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { getBaseServerConfig } from "@aazucena/config/sentry/server";

const environment = process.env.PUBLIC_VERCEL_ENV || "development";

Sentry.init({
  ...getBaseServerConfig({
    dsn: process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN || "",
    environment,
  }),
  integrations: [nodeProfilingIntegration()],
  enableLogs: true,
});
