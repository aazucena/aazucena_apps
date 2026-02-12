/**
 * [API] : Strapi_CMS_Client
 * Consolidated fetcher for Strapi v5 with recursive sanitization and error handling.
 *
 * Meta-Framework Agnostic: Works with Next.js, Astro, Remix, etc.
 * Configuration must be provided via setStrapiConfig() at app initialization.
 */

import qs from 'qs';
import { sanitizeStrapiData } from '@aazucena/utils';

/**
 * Strapi Configuration Interface
 * Must be provided by the consuming application (Next.js, Astro, etc.)
 */
export interface StrapiConfig {
  /** Strapi base URL (e.g., http://localhost:1337 or https://cms.aazucena.com) */
  url: string;
  /** API endpoint prefix (default: /api) */
  apiEndpoint?: string;
  /** Strapi API token for authentication */
  token: string;
}

/**
 * Global Strapi configuration (singleton)
 * Set once at application initialization via setStrapiConfig()
 */
let globalConfig: StrapiConfig | null = null;

/**
 * Set global Strapi configuration
 * Call this once at app initialization with environment variables from your framework.
 *
 * @example Next.js
 * ```ts
 * setStrapiConfig({
 *   url: process.env.STRAPI_URL!,
 *   apiEndpoint: process.env.STRAPI_API_ENDPOINT || '/api',
 *   token: process.env.STRAPI_API_TOKEN!,
 * });
 * ```
 *
 * @example Astro
 * ```ts
 * setStrapiConfig({
 *   url: import.meta.env.STRAPI_URL,
 *   apiEndpoint: import.meta.env.STRAPI_API_ENDPOINT || '/api',
 *   token: import.meta.env.STRAPI_API_TOKEN,
 * });
 * ```
 */
export function setStrapiConfig(config: StrapiConfig): void {
  globalConfig = {
    ...config,
    apiEndpoint: config.apiEndpoint || '/api',
  };
}

/**
 * Get current Strapi configuration
 * Returns null if not initialized
 */
export function getStrapiConfig(): StrapiConfig | null {
  return globalConfig;
}

/**
 * Validate Strapi configuration
 * @internal
 */
function validateConfig(config?: StrapiConfig | null): config is StrapiConfig {
  const activeConfig = config || globalConfig;

  if (!activeConfig) {
    console.error('Strapi config is not set. Call setStrapiConfig() at app initialization.');
    return false;
  }

  if (!activeConfig.url) {
    console.error('Strapi URL is not defined in config');
    return false;
  }

  if (!activeConfig.token) {
    console.error('Strapi API Token is not defined in config');
    return false;
  }

  return true;
}

export async function fetchStrapi<T>(
  endpoint: string,
  options?: {
    query?: unknown;
    cache?: RequestCache;
    method?: string;
    body?: string;
    config?: StrapiConfig;
  },
): Promise<{ data: T; meta?: unknown }> {
  const activeConfig = options?.config || globalConfig;
  if (!validateConfig(activeConfig)) {
    throw new Error('Strapi configuration is invalid');
  }

  const queryString = options?.query ? qs.stringify(options.query, { encodeValuesOnly: true }) : '';
  const url = `${activeConfig.url}${activeConfig.apiEndpoint}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      Authorization: `Bearer ${activeConfig.token}`,
      'Content-Type': 'application/json',
    },
    body: options?.body,
    cache: options?.cache || 'no-store',
  });

  const rawData = await res.json();
  const data = sanitizeStrapiData(rawData) as any;

  if (!res.ok) {
    throw new Error(`STRAPI_REQUEST_FAILED: ${res.status}`);
  }

  return data;
}

export async function updateStrapiEntry<T>(
  endpoint: string,
  id: string | number,
  data: unknown,
  config?: StrapiConfig,
): Promise<{ data: T }> {
  const activeConfig = config || globalConfig;
  if (!validateConfig(activeConfig)) {
    throw new Error('Strapi configuration is invalid');
  }

  const url = `${activeConfig.url}${activeConfig.apiEndpoint}/${endpoint}/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${activeConfig.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(`STRAPI_UPDATE_FAILED: ${res.status}`);
  return responseData;
}
