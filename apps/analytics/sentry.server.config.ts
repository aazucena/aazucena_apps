import * as Sentry from '@sentry/nextjs';
import { getBaseServerConfig } from '@aazucena/config/sentry/server';

Sentry.init(
  getBaseServerConfig({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
    environment: process.env.NODE_ENV ?? 'development',
  }),
);
