import { createClient } from '@clickhouse/client';

const globalForClickHouse = global as unknown as { clickhouse: any };

export const clickhouse = globalForClickHouse.clickhouse || createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'admin',
  password: process.env.CLICKHOUSE_PASSWORD || 'clickhouse',
  database: process.env.CLICKHOUSE_DB || 'analytics',
});

if (process.env.NODE_ENV !== 'production') globalForClickHouse.clickhouse = clickhouse;
