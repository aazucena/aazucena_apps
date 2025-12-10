/**
 * Strapi CMS API Client
 *
 * Production-ready client for fetching data from Strapi v5 CMS
 * Uses Build/SSR token for secure server-side operations
 *
 * @see docs/strapi/16-api-tokens-setup.md
 */

import qs from 'qs';

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_ENDPOINT = import.meta.env.STRAPI_API_ENDPOINT || '/api';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

// Token validation: Required in production, optional in development
if (!STRAPI_TOKEN) {
  if (import.meta.env.PROD) {
    throw new Error('STRAPI_TOKEN is required in production environment');
  } else {
    console.warn(
      '[Strapi] No STRAPI_TOKEN found in environment variables.',
      'API calls will fail. Using fallback data.',
      'Set STRAPI_TOKEN in your .env file to fetch from CMS.'
    );
  }
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

/**
 * Build query string from Strapi query options using qs (Strapi recommended)
 *
 * Uses qs library to properly format nested objects and arrays for Strapi v5 API.
 * This ensures correct bracket notation for complex populate queries.
 *
 * @example
 * // Input: { populate: { author: { populate: 'avatar' } } }
 * // Output: populate[author][populate]=avatar
 */
function buildQueryString(query?: StrapiQueryOptions): string {
  if (!query) return '';

  const queryString = qs.stringify(query, {
    encodeValuesOnly: true, // Keeps brackets readable
  });

  return queryString;
}

/**
 * Handle Strapi API errors
 */
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

// ============================================================================
// Core API Functions
// ============================================================================

/**
 * Fetch data from Strapi API (server-side only)
 *
 * @example
 * // Fetch hero with all relations
 * const hero = await fetchStrapi('hero', {
 *   query: { populate: '*' }
 * });
 *
 * @example
 * // Fetch paginated posts with filters
 * const posts = await fetchStrapi('posts', {
 *   query: {
 *     populate: ['author', 'coverImage'],
 *     filters: { featured: true },
 *     sort: ['publishedAt:desc'],
 *     pagination: { page: 1, pageSize: 10 }
 *   }
 * });
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  const queryString = buildQueryString(options?.query);
  const url = `${STRAPI_URL}${STRAPI_API_ENDPOINT}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  console.log("🚀 ~ fetchStrapi ~ url:", url)

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: options?.cache || 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      handleStrapiError(res.status, data);
    }

    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error; // Re-throw Strapi errors
    }

    // Network or other errors
    console.error('[Strapi Fetch Error]', error);
    throw new Error(`Failed to fetch from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch a single entry by ID
 *
 * @example
 * const project = await fetchStrapiById('projects', '1', {
 *   query: { populate: '*' }
 * });
 */
export async function fetchStrapiById<T>(
  endpoint: string,
  id: string | number,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  return fetchStrapi(`${endpoint}/${id}`, options);
}

/**
 * Create an entry in Strapi (server-side only)
 *
 * @example
 * const submission = await createStrapiEntry('form-submissions', {
 *   formType: 'Contact',
 *   rawMessage: 'Hello!',
 *   email: 'user@example.com'
 * });
 */
export async function createStrapiEntry<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}${STRAPI_API_ENDPOINT}/${endpoint}`;

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

    if (!res.ok) {
      handleStrapiError(res.status, responseData);
    }

    return responseData;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error; // Re-throw Strapi errors
    }

    console.error('[Strapi Create Error]', error);
    throw new Error(`Failed to create entry in Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update an entry in Strapi (server-side only)
 *
 * @example
 * const updated = await updateStrapiEntry('projects', '1', {
 *   featured: true
 * });
 */
export async function updateStrapiEntry<T>(
  endpoint: string,
  id: string | number,
  data: Record<string, any>
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}${STRAPI_API_ENDPOINT}/${endpoint}/${id}`;

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

    if (!res.ok) {
      handleStrapiError(res.status, responseData);
    }

    return responseData;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    console.error('[Strapi Update Error]', error);
    throw new Error(`Failed to update entry in Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete an entry from Strapi (server-side only)
 *
 * @example
 * await deleteStrapiEntry('posts', '1');
 */
export async function deleteStrapiEntry<T>(
  endpoint: string,
  id: string | number
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}${STRAPI_API_ENDPOINT}/${endpoint}/${id}`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      handleStrapiError(res.status, data);
    }

    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    console.error('[Strapi Delete Error]', error);
    throw new Error(`Failed to delete entry from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Get the Strapi URL for a media file
 *
 * @example
 * const imageUrl = getStrapiMediaUrl(hero.data.image.url);
 */
export function getStrapiMediaUrl(path?: string): string {
  if (!path) return '';

  // If it's already a full URL (Cloudinary), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Otherwise, prepend Strapi URL
  return `${STRAPI_URL}${path}`;
}

/**
 * Check if the Strapi API is available
 */
export async function checkStrapiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_URL}/_health`, {
      cache: 'no-store',
    });
    return res.ok;
  } catch (error) {
    console.error('[Strapi Health Check Failed]', error);
    return false;
  }
}
