import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import { sentryNextConfigOptions } from '@aazucena/config/sentry/nextjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('./package.json') as { version: string };

const nextConfig: NextConfig = {
  experimental: {
    // Persist the Turbopack module graph to disk — routes only compile once
    // across restarts. Without this, all 14 transpilePackages are re-traversed
    // on every `pnpm dev`, causing the 57s cold-compile spike on first request.
    turbopackFileSystemCacheForDev: true,
  },
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
  async headers() {
    const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN ?? 'https://aazucena.com';
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: allowedOrigin },
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

export default withSentryConfig(
  nextConfig,
  sentryNextConfigOptions({
    org: process.env.SENTRY_ORG!,
    project: process.env.SENTRY_PROJECT ?? 'analytics',
  }),
);
