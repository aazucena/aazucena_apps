import { initClickHouseClients, viewerClient, ingestClient, plausibleClient } from '@aazucena/api';

// Initialize with analytics app environment variables
initClickHouseClients({
  viewer: {
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_VIEWER_USER || 'dashboard_viewer',
    password: process.env.CLICKHOUSE_VIEWER_PASSWORD,
    database: process.env.CLICKHOUSE_DB || 'analytics',
    clickhouse_settings: {
      // Kill the query server-side if the HTTP connection closes (client navigated away)
      cancel_http_readonly_queries_on_client_close: 1,
      // Hard cap: no SELECT query should run longer than 25s
      max_execution_time: 25,
    },
  },
  ingest: {
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_INGEST_USER || 'telemetry_ingest',
    password: process.env.CLICKHOUSE_INGEST_PASSWORD,
    database: process.env.CLICKHOUSE_DB || 'analytics',
    clickhouse_settings: {
      async_insert: 1,
      wait_for_async_insert: 0,
    },
  },
  plausible: {
    host: process.env.PLAUSIBLE_CLICKHOUSE_HOST || 'http://aazucena-plausible-clickhouse:8123',
    username: process.env.PLAUSIBLE_CLICKHOUSE_USER || 'default',
    password: process.env.PLAUSIBLE_CLICKHOUSE_PASSWORD || '',
    database: process.env.PLAUSIBLE_CLICKHOUSE_DB || 'plausible_events_db',
  },
});

// Backwards-compat aliases — all API routes use these names
// Cast to any to match original any-typed clients (preserves query().json() returning any)
export const mainClickhouseClient = viewerClient as any;
export const ingestClickhouseClient = ingestClient as any;
export const plausibleClickhouseClient = plausibleClient as any;
