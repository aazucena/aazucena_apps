import { mainClickhouseClient as clickhouse } from '@/lib/services';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

/**
 * 🌐 PUBLIC HEALTH API
 * Provides a sanitized, unauthenticated view of system integrity.
 */
export async function GET() {
  try {
    const healthQuery = `
      SELECT
        service,
        status,
        latency_ms,
        timestamp
      FROM analytics.system_integrity
      WHERE timestamp >= subtractMinutes(now(), 15)
      ORDER BY timestamp DESC
      LIMIT 20
    `;

    const resultSet = await clickhouse.query({ query: healthQuery, format: 'JSONEachRow' });
    const rawData = (await resultSet.json()) as any[];

    // Sanitize and group by service (show only latest status per service)
    const services: Record<string, any> = {};
    rawData.forEach((item) => {
      if (!services[item.service]) {
        services[item.service] = {
          status: item.status,
          latency: item.latency_ms,
          last_pulse: item.timestamp,
        };
      }
    });

    // No rows within the window = monitoring gap, not "all good"
    const serviceCount = Object.keys(services).length;
    const allUp = serviceCount > 0 && Object.values(services).every((s) => s.status === 'UP');
    const someDown = Object.values(services).some((s) => s.status === 'DOWN');

    return NextResponse.json(
      {
        success: true,
        system: {
          overall:
            serviceCount === 0
              ? 'MAINTENANCE'
              : someDown
                ? 'DEGRADED'
                : allUp
                  ? 'OPERATIONAL'
                  : 'MAINTENANCE',
          label:
            serviceCount === 0
              ? 'No Signal — Monitoring Gap'
              : someDown
                ? 'Partial Outage'
                : allUp
                  ? 'All Systems Functional'
                  : 'Under Observation',
          timestamp: new Date().toISOString(),
        },
        services,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      },
    );
  } catch (error) {
    console.error('[PUBLIC_HEALTH_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        system: { overall: 'UNKNOWN', label: 'Health Check Unavailable' },
      },
      { status: 500 },
    );
  }
}
