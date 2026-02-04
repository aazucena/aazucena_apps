/**
 * Strapi CMS API Client (Analytics)
 *
 * Production-ready client for fetching data from Strapi v5 CMS
 * Uses Build/SSR token for secure server-side operations
 */

import qs from 'qs';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_ENDPOINT = process.env.STRAPI_API_ENDPOINT || '/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Validates the presence of the Strapi API token.
 * This mirrors the logic in the portfolio app but uses process.env.
 */
export function validateStrapiToken(token: string | undefined = STRAPI_TOKEN): boolean {
  if (token) return true;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('STRAPI_API_TOKEN is required in production environment');
  } else {
    console.warn(
      '[Strapi] No STRAPI_API_TOKEN found in environment variables.',
      'API calls will fail. Using fallback data.',
      'Set STRAPI_API_TOKEN in your .env file to fetch from CMS.'
    );
  }
  return false;
}

// ============================================================================
// Types
// ============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

export interface StrapiQueryOptions {
  populate?: string | string[] | Record<string, any>;
  fields?: string[];
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  locale?: string;
  publicationState?: 'live' | 'preview';
}

export interface FetchOptions {
  query?: StrapiQueryOptions;
  cache?: RequestCache;
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildQueryString(query?: StrapiQueryOptions): string {
  if (!query) return '';
  return qs.stringify(query, { encodeValuesOnly: true });
}

function handleStrapiError(status: number, error: any): never {
  const strapiError: StrapiError = {
    status,
    name: error?.error?.name || 'StrapiError',
    message: error?.error?.message || 'An error occurred while fetching data from Strapi',
    details: error?.error?.details,
  };
  console.error('[Strapi API Error]', strapiError);
  throw strapiError;
}

function fetchUrl(endpoint: string) {
  return `${STRAPI_URL}${STRAPI_API_ENDPOINT}/${endpoint}`;
}

/**
 * Recursively sanitizes data by replacing null values with safe defaults
 * Mirrors portfolio logic exactly.
 */
function sanitizeData(data: any): any {
  if (data === null || data === undefined) return data;
  if (data.data !== undefined) return { ...data, data: sanitizeData(data.data) };
  if (Array.isArray(data)) return data.map(sanitizeData);
  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        if (key === 'sort') sanitized[key] = 0;
        else if (key === 'metaRobots') sanitized[key] = 'index, follow';
        else if (key === 'metaViewport') sanitized[key] = 'width=device-width, initial-scale=1.0';
        else if (key === 'availabilityStatus') sanitized[key] = 'Open to Opportunities';
        else if (key === 'timezone') sanitized[key] = 'America/Edmonton';
        else if (key === 'relatedLinks') sanitized[key] = [];
        else sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }
  return data;
}

// ============================================================================
// Core API Functions
// ============================================================================

export async function fetchStrapi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  const queryString = buildQueryString(options?.query);
  const url = fetchUrl(`${endpoint}${queryString ? `?${queryString}` : ''}`);
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: options?.cache || 'no-store',
    });

    const rawData = await res.json();
    const data = sanitizeData(rawData);

    if (!res.ok) {
      handleStrapiError(res.status, data);
    }

    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) throw error;
    console.error('[Strapi Fetch Error]', error);
    throw new Error(`Failed to fetch from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchStrapiById<T>(
  endpoint: string,
  id: string | number,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  return fetchStrapi(`${endpoint}/${id}`, options);
}

export async function createStrapiEntry<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<StrapiResponse<T>> {
  const url = fetchUrl(endpoint);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    const responseData = await res.json();
    if (!res.ok) handleStrapiError(res.status, responseData);
    return responseData;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) throw error;
    console.error('[Strapi Create Error]', error);
    throw new Error(`Failed to create entry in Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateStrapiEntry<T>(
  endpoint: string,
  id: string | number,
  data: Record<string, any>
): Promise<StrapiResponse<T>> {
  const url = fetchUrl(`${endpoint}/${id}`);
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    const responseData = await res.json();
    if (!res.ok) handleStrapiError(res.status, responseData);
    return responseData;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) throw error;
    console.error('[Strapi Update Error]', error);
    throw new Error(`Failed to update entry in Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteStrapiEntry<T>(
  endpoint: string,
  id: string | number
): Promise<StrapiResponse<T>> {
  const url = fetchUrl(`${endpoint}/${id}`);
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) handleStrapiError(res.status, data);
    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) throw error;
    console.error('[Strapi Delete Error]', error);
    throw new Error(`Failed to delete entry from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getStrapiMediaUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${STRAPI_URL}${path}`;
}

export async function checkStrapiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_URL}/_health`, { cache: 'no-store' });
    return res.ok;
  } catch (error) {
    console.error('[Strapi Health Check Failed]', error);
    return false;
  }
}
