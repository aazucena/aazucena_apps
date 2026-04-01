import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import { sentryNextConfigOptions } from '@aazucena/config/sentry/nextjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('./package.json') as { version: string };

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  webpack(config) {
    // Mirror Turbopack's resolveExtensions for webpack dev mode:
    // allows workspace packages that export .js paths to be resolved to .ts/.tsx source.
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
  // Turbopack resolves workspace TypeScript packages natively — transpilePackages
  // is only needed for webpack (production builds). Keeping it in dev forces every
  // workspace package through Next.js's full compilation pipeline on cold start,
  // multiplying Turbopack's first-compile time significantly.
  ...(isDev
    ? {}
    : {
        transpilePackages: [
          '@aazucena/analytics',
          '@aazucena/api',
          '@aazucena/constants',
          '@aazucena/context',
          '@aazucena/hooks',
          '@aazucena/icons',
          '@aazucena/stores',
          '@aazucena/types',
          '@aazucena/ui',
          '@aazucena/utils',
          '@aazucena/visualizations',
        ],
      }),
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-secret-key',
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_PORT: process.env.PORT || '3001',
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

// Skip Sentry instrumentation in dev — it wraps every module compilation with
// source-map generation and SDK injection, adding seconds to each cold-start.
// Sentry events are not sent in dev anyway (no DSN in local .env).
export default isDev
  ? nextConfig
  : withSentryConfig(
      nextConfig,
      sentryNextConfigOptions({
        org: process.env.SENTRY_ORG!,
        project: process.env.SENTRY_PROJECT ?? 'analytics',
      }),
    );
