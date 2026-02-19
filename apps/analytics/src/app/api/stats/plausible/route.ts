// apps/analytics/src/app/api/stats/plausible/route.ts
import { NextResponse } from 'next/server';
import { plausibleClickhouseClient } from '@/lib/services/clickhouse';

export const dynamic = 'force-dynamic'; // Ensure no caching for real-time stats

export async function GET() {
  try {
    // Query for daily aggregate stats from Plausible
    // We aggregate from the 'events' table for the last 30 days.
    const query = `
      SELECT
        toStartOfDay(timestamp) as date,
        uniq(user_id) as visitors, -- Plausible uses a hashed user_id for visitor tracking
        count() as pageviews,
        -- duration is not always present on pageview events (mostly on custom events or pings), 
        -- so we might need a more complex session query for accurate duration.
        -- For basic traffic, visitors and pageviews are key.
        countIf(name = 'pageview') as pageviews_only
      FROM events
      WHERE timestamp >= subtractDays(now(), 30)
      GROUP BY date
      ORDER BY date ASC
    `;

    const result = await plausibleClickhouseClient.query({
      query: query,
      format: 'JSONEachRow',
    });

    const data = await result.json();

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[PlausibleStats] Error fetching stats:', error);
    return NextResponse.json(
      {
        message:
          'Failed to fetch Plausible stats. Ensure Plausible ClickHouse is running and accessible.',
      },
      { status: 500 },
    );
  }
}
