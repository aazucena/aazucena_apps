import * as Sentry from '@sentry/nextjs';
import { getBaseClientConfig } from '@aazucena/config/sentry/client';

Sentry.init(
  getBaseClientConfig({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
    environment: process.env.NODE_ENV ?? 'development',
  }),
);
