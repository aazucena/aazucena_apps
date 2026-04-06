/**
 * [API] : Strapi_CMS_Client
 * Consolidated fetcher for Strapi v5 with recursive sanitization and error handling.
 *
 * Meta-Framework Agnostic: Works with Next.js, Astro, Remix, etc.
 * Configuration must be provided via setStrapiConfig() at app initialization.
 */

import qs from 'qs';
import { sanitizeStrapiData } from '@aazucena/utils';

// ---------------------------------------------------------------------------
// In-process response cache — survives Vite's per-request SSR module
// re-evaluation (Symbol.for is written to Node's global symbol registry,
// not to the module scope that Vite resets).
// Activated only when the caller passes cache: 'force-cache'.
// ---------------------------------------------------------------------------
const CACHE_SYM = Symbol.for('aazucena.strapi.fetch_cache');
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CacheEntry = { data: unknown; expiry: number };
type GlobalWithCache = typeof globalThis & { [CACHE_SYM]?: Map<string, CacheEntry> };

function getInternalCache(): Map<string, CacheEntry> {
  const g = globalThis as GlobalWithCache;
  if (!g[CACHE_SYM]) g[CACHE_SYM] = new Map();
  return g[CACHE_SYM];
}

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

  // In-process cache: skip the network when a valid entry exists
  const useCache = (options?.cache || 'no-store') === 'force-cache';
  if (useCache) {
    const cacheKey = `${options?.method || 'GET'}:${url}`;
    const cache = getInternalCache();
    const entry = cache.get(cacheKey);
    if (entry && Date.now() < entry.expiry) {
      return entry.data as { data: T; meta?: unknown };
    }
  }

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

  // Populate the in-process cache for the next request
  if (useCache) {
    const cacheKey = `${options?.method || 'GET'}:${url}`;
    getInternalCache().set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
  }

  return data;
}

export async function fetchStrapiById<T>(
  endpoint: string,
  id: string | number,
  options?: {
    query?: unknown;
    cache?: RequestCache;
    config?: StrapiConfig;
  },
): Promise<{ data: T; meta?: unknown }> {
  return fetchStrapi(`${endpoint}/${id}`, options);
}

export async function createStrapiEntry<T>(
  endpoint: string,
  data: unknown,
  config?: StrapiConfig,
): Promise<{ data: T }> {
  const activeConfig = config || globalConfig;
  if (!validateConfig(activeConfig)) {
    throw new Error('Strapi configuration is invalid');
  }

  const url = `${activeConfig.url}${activeConfig.apiEndpoint}/${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeConfig.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(`STRAPI_CREATE_FAILED: ${res.status}`);
  return responseData;
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

export async function deleteStrapiEntry<T>(
  endpoint: string,
  id: string | number,
  config?: StrapiConfig,
): Promise<{ data: T }> {
  const activeConfig = config || globalConfig;
  if (!validateConfig(activeConfig)) {
    throw new Error('Strapi configuration is invalid');
  }

  const url = `${activeConfig.url}${activeConfig.apiEndpoint}/${endpoint}/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${activeConfig.token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`STRAPI_DELETE_FAILED: ${res.status}`);
  return data;
}

export function getStrapiMediaUrl(path?: string, config?: StrapiConfig): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const activeConfig = config || globalConfig;
  if (!activeConfig) return path;
  return `${activeConfig.url}${path}`;
}

export async function checkStrapiHealth(config?: StrapiConfig): Promise<boolean> {
  const activeConfig = config || globalConfig;
  if (!activeConfig) return false;
  try {
    const res = await fetch(`${activeConfig.url}/_health`, { cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}
