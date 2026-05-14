// apps/analytics/src/app/api/stats/traffic/route.ts
import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Page view filter: exclude Next.js internals, API routes, and static assets.
    // The log drain captures all proxy requests; we only want HTML page navigations.
    const pageViewFilter = `
      path NOT LIKE '/_next/%'
      AND path NOT LIKE '/api/%'
      AND path NOT LIKE '/favicon%'
      AND path NOT REGEXP '\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map)$'
    `;

    // Visitor approximation: hash of ua+country+city per day.
    // The log drain has no session/cookie identifier — this is the closest proxy
    // for deduplicating the same person across multiple page views.
    const visitorFingerprint = `cityHash64(concat(ua, country, city))`;

    // 1. Aggregated KPIs (Last 30 days)
    const summaryQuery = `
      SELECT
        uniq(${visitorFingerprint}) as total_visitors,
        count() as total_pageviews,
        countIf(referer = '') as direct_traffic
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
        AND ${pageViewFilter}
    `;

    // 2. Traffic Trends (Daily)
    const trendsQuery = `
      SELECT
        toStartOfDay(timestamp) as date,
        uniq(${visitorFingerprint}) as visitors,
        count() as pageviews
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
        AND ${pageViewFilter}
      GROUP BY date
      ORDER BY date ASC
    `;

    // 3. Top Countries (Full list for Map)
    const geoQuery = `
      SELECT
        country,
        uniq(${visitorFingerprint}) as visitors
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
        AND country != ''
        AND ${pageViewFilter}
      GROUP BY country
      ORDER BY visitors DESC
    `;

    const [summaryRes, trendsRes, geoRes] = await Promise.all([
      mainClickhouseClient.query({
        query: summaryQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: trendsQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: geoQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
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
