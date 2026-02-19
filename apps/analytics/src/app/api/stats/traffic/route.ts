// apps/analytics/src/app/api/stats/traffic/route.ts
import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Aggregated KPIs (Last 30 days)
    const summaryQuery = `
      SELECT
        uniq(id) as total_visitors,
        count() as total_pageviews,
        countIf(referer = '') as direct_traffic
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
    `;

    // 2. Traffic Trends (Daily)
    const trendsQuery = `
      SELECT
        toStartOfDay(timestamp) as date,
        uniq(id) as visitors,
        count() as pageviews
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
      GROUP BY date
      ORDER BY date ASC
    `;

    // 3. Top Countries (Full list for Map)
    const geoQuery = `
      SELECT
        country,
        uniq(id) as visitors
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
        AND country != ''
      GROUP BY country
      ORDER BY visitors DESC
    `;

    const [summaryRes, trendsRes, geoRes] = await Promise.all([
      mainClickhouseClient.query({ query: summaryQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: trendsQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: geoQuery, format: 'JSONEachRow' }),
    ]);

    const summaryData = await summaryRes.json();
    const trendsData = await trendsRes.json();
    const geoData = await geoRes.json();

    return NextResponse.json({
      data: {
        summary: summaryData[0] || { total_visitors: 0, total_pageviews: 0, direct_traffic: 0 },
        trends: trendsData,
        geo: geoData,
      },
    });
  } catch (error) {
    console.error('[TrafficStats] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
