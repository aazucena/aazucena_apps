// apps/analytics/src/lib/strapi.ts
import { validateStrapiToken } from './utils/strapi';

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
validateStrapiToken(STRAPI_TOKEN);

export * from './utils/strapi';
