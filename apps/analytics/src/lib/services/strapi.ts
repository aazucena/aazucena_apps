// apps/analytics/src/lib/services/strapi.ts
import qs from 'qs';

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchStrapiOptions extends RequestInit {
  query?: Record<string, any>;
}

export async function fetchStrapi(path: string, options: FetchStrapiOptions = {}) {
  const { query, ...fetchOptions } = options;

  const queryString = query ? qs.stringify(query, { encodeValuesOnly: true }) : '';
  const url = `${STRAPI_URL}/api/${path}${queryString ? `?${queryString}` : ''}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    ...((options.headers as any) || {}),
  };

  console.warn(`[Strapi] ${fetchOptions.method ?? 'GET'} ${STRAPI_URL}/api/${path}`);

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(`[Strapi API Error] ${res.status}: ${error}`);
    throw new Error(`STRAPI_REQUEST_FAILED: ${res.status}`);
  }

  return res.json();
}
