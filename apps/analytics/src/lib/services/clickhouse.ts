import { createClient } from '@clickhouse/client-web';

// Using global to prevent re-creation of clients during Next.js hot-reloads in development
const globalForClickHouse = global as unknown as {
  mainClickhouseClient: any;
  ingestClickhouseClient: any;
  plausibleClickhouseClient: any;
};

/**
 * DASHBOARD VIEWER CLIENT
 * Restricted to SELECT-only on analytics database.
 */
export const mainClickhouseClient =
  globalForClickHouse.mainClickhouseClient ||
  createClient({
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_VIEWER_USER || 'dashboard_viewer',
    password: process.env.CLICKHOUSE_VIEWER_PASSWORD || 'viewer_secure_horizon_2026',
    database: process.env.CLICKHOUSE_DB || 'analytics',
  });

/**
 * TELEMETRY INGESTION CLIENT
 * Restricted to INSERT-only on buffer tables.
 */
export const ingestClickhouseClient =
  globalForClickHouse.ingestClickhouseClient ||
  createClient({
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_INGEST_USER || 'telemetry_ingest',
    password: process.env.CLICKHOUSE_INGEST_PASSWORD || 'ingest_secret_pulse_2026',
    database: process.env.CLICKHOUSE_DB || 'analytics',
    clickhouse_settings: {
      async_insert: 1,
      wait_for_async_insert: 0,
    },
  });

// --- Plausible Analytics ClickHouse Client ---
export const plausibleClickhouseClient =
  globalForClickHouse.plausibleClickhouseClient ||
  createClient({
    host: process.env.PLAUSIBLE_CLICKHOUSE_HOST || 'http://aazucena-plausible-clickhouse:8123',
    username: process.env.PLAUSIBLE_CLICKHOUSE_USER || 'default',
    password: process.env.PLAUSIBLE_CLICKHOUSE_PASSWORD || '',
    database: process.env.PLAUSIBLE_CLICKHOUSE_DB || 'plausible_events_db',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForClickHouse.mainClickhouseClient = mainClickhouseClient;
  globalForClickHouse.ingestClickhouseClient = ingestClickhouseClient;
  globalForClickHouse.plausibleClickhouseClient = plausibleClickhouseClient;
}
