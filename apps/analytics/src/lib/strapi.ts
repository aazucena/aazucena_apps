// apps/analytics/src/lib/strapi.ts
// Initializes the shared Strapi client with Next.js process.env config.
import { setStrapiConfig } from '@aazucena/api';

setStrapiConfig({
  url: process.env.STRAPI_URL || 'http://localhost:1337',
  apiEndpoint: process.env.STRAPI_API_ENDPOINT || '/api',
  token: process.env.STRAPI_API_TOKEN || '',
});

export * from '@aazucena/api';
