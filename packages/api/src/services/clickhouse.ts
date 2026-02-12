/**
 * [API] : ClickHouse_Telemetry_Client
 * Low-level drivers for high-fidelity signal ingestion and dashboard extraction.
 * Includes singleton protection for development hot-reloads.
 *
 * Meta-Framework Agnostic: Works with Next.js, Astro, Remix, etc.
 * Configuration must be provided via initClickHouseClients() at app initialization.
 */

import { createClient } from '@clickhouse/client-web';

/**
 * ClickHouse Configuration Interface
 * Must be provided by the consuming application (Next.js, Astro, etc.)
 */
export interface ClickHouseClientConfig {
  /** ClickHouse host URL (e.g., http://localhost:8123) */
  host: string;
  /** Username for authentication */
  username: string;
  /** Password for authentication */
  password: string;
  /** Database name */
  database: string;
  /** Optional ClickHouse settings */
  clickhouse_settings?: Record<string, unknown>;
}

export interface ClickHouseConfig {
  /** Dashboard viewer client config (SELECT-only) */
  viewer: ClickHouseClientConfig;
  /** Telemetry ingestion client config (INSERT-only) */
  ingest: ClickHouseClientConfig;
  /** Plausible analytics client config (optional) */
  plausible?: ClickHouseClientConfig;
}

// Type for the web client returned by createClient
type CHClient = ReturnType<typeof createClient>;

// Singleton protection for development
const globalForClickHouse = global as unknown as {
  viewerClient?: CHClient;
  ingestClient?: CHClient;
  plausibleClient?: CHClient;
  configInitialized?: boolean;
};

/**
 * Initialize ClickHouse clients with configuration
 * Call this once at app initialization with environment variables from your framework.
 *
 * @example Next.js
 * ```ts
 * initClickHouseClients({
 *   viewer: {
 *     host: process.env.CLICKHOUSE_HOST!,
 *     username: process.env.CLICKHOUSE_VIEWER_USER!,
 *     password: process.env.CLICKHOUSE_VIEWER_PASSWORD!,
 *     database: process.env.CLICKHOUSE_DB!,
 *   },
 *   ingest: {
 *     host: process.env.CLICKHOUSE_HOST!,
 *     username: process.env.CLICKHOUSE_INGEST_USER!,
 *     password: process.env.CLICKHOUSE_INGEST_PASSWORD!,
 *     database: process.env.CLICKHOUSE_DB!,
 *     clickhouse_settings: {
 *       async_insert: 1,
 *       wait_for_async_insert: 0,
 *     },
 *   },
 *   plausible: {
 *     host: process.env.PLAUSIBLE_CLICKHOUSE_HOST!,
 *     username: process.env.PLAUSIBLE_CLICKHOUSE_USER!,
 *     password: process.env.PLAUSIBLE_CLICKHOUSE_PASSWORD!,
 *     database: process.env.PLAUSIBLE_CLICKHOUSE_DB!,
 *   },
 * });
 * ```
 *
 * @example Astro
 * ```ts
 * initClickHouseClients({
 *   viewer: {
 *     host: import.meta.env.CLICKHOUSE_HOST,
 *     username: import.meta.env.CLICKHOUSE_VIEWER_USER,
 *     password: import.meta.env.CLICKHOUSE_VIEWER_PASSWORD,
 *     database: import.meta.env.CLICKHOUSE_DB,
 *   },
 *   ingest: {
 *     host: import.meta.env.CLICKHOUSE_HOST,
 *     username: import.meta.env.CLICKHOUSE_INGEST_USER,
 *     password: import.meta.env.CLICKHOUSE_INGEST_PASSWORD,
 *     database: import.meta.env.CLICKHOUSE_DB,
 *     clickhouse_settings: {
 *       async_insert: 1,
 *       wait_for_async_insert: 0,
 *     },
 *   },
 * });
 * ```
 */
export function initClickHouseClients(config: ClickHouseConfig): void {
  // Create viewer client
  if (!globalForClickHouse.viewerClient) {
    globalForClickHouse.viewerClient = createClient(config.viewer);
  }

  // Create ingest client
  if (!globalForClickHouse.ingestClient) {
    globalForClickHouse.ingestClient = createClient(config.ingest);
  }

  // Create plausible client (optional)
  if (config.plausible && !globalForClickHouse.plausibleClient) {
    globalForClickHouse.plausibleClient = createClient(config.plausible);
  }

  globalForClickHouse.configInitialized = true;
}

/**
 * Get the dashboard viewer client (SELECT-only on analytics database)
 * @throws Error if clients not initialized via initClickHouseClients()
 */
export function getViewerClient(): CHClient {
  if (!globalForClickHouse.viewerClient) {
    throw new Error(
      'ClickHouse viewer client not initialized. Call initClickHouseClients() at app initialization.',
    );
  }
  return globalForClickHouse.viewerClient;
}

/**
 * Get the telemetry ingestion client (INSERT-only on buffer tables)
 * @throws Error if clients not initialized via initClickHouseClients()
 */
export function getIngestClient(): CHClient {
  if (!globalForClickHouse.ingestClient) {
    throw new Error(
      'ClickHouse ingest client not initialized. Call initClickHouseClients() at app initialization.',
    );
  }
  return globalForClickHouse.ingestClient;
}

/**
 * Get the Plausible analytics client
 * @throws Error if clients not initialized or plausible not configured
 */
export function getPlausibleClient(): CHClient {
  if (!globalForClickHouse.plausibleClient) {
    throw new Error(
      'ClickHouse plausible client not initialized. Ensure plausible config is provided to initClickHouseClients().',
    );
  }
  return globalForClickHouse.plausibleClient;
}

/**
 * Check if ClickHouse clients have been initialized
 */
export function isClickHouseInitialized(): boolean {
  return !!globalForClickHouse.configInitialized;
}

/**
 * Legacy exports for backward compatibility
 * @deprecated Use getViewerClient(), getIngestClient(), getPlausibleClient() instead
 */
export const viewerClient = new Proxy({} as CHClient, {
  get: (_, prop) => {
    const client = getViewerClient();
    return (client as any)[prop];
  },
});

export const ingestClient = new Proxy({} as CHClient, {
  get: (_, prop) => {
    const client = getIngestClient();
    return (client as any)[prop];
  },
});

export const plausibleClient = new Proxy({} as CHClient, {
  get: (_, prop) => {
    const client = getPlausibleClient();
    return (client as any)[prop];
  },
});
