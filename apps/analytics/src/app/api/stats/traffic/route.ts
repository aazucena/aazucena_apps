// apps/analytics/src/app/api/stats/traffic/route.ts
import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Diagnostic: show top paths in the DB to verify what's actually stored.
    // Remove once geo + path data is confirmed correct.
    const pathSampleQuery = `
      SELECT path, project_id, count() as hits
      FROM analytics.vercel_analytics_events
      WHERE timestamp >= subtractDays(now(), 30)
      GROUP BY path, project_id
      ORDER BY hits DESC
      LIMIT 20
    `;
    const pathSampleRes = await mainClickhouseClient.query({
      query: pathSampleQuery,
      format: 'JSONEachRow',
      abort_signal: req.signal,
    });
    const pathSample = await pathSampleRes.json();
    console.warn('[TrafficStats] path sample:', JSON.stringify(pathSample));

    // Page view filter: exclude Next.js internals, API routes, and static assets.
    // The log drain captures all proxy requests; we only want HTML page navigations.
    const pageViewFilter = `
      path NOT LIKE '/_next/%'
      AND path NOT LIKE '/api/%'
      AND path NOT LIKE '/favicon%'
      AND path NOT LIKE '%.js'
      AND path NOT LIKE '%.css'
      AND path NOT LIKE '%.png'
      AND path NOT LIKE '%.ico'
      AND path NOT LIKE '%.svg'
      AND path NOT LIKE '%.woff2'
    `;

    // Visitor approximation: hash of ua per day.
    // Vercel log drain has no geo or session data — ua is the only available signal
    // for deduplicating the same person across multiple page views.
    const visitorFingerprint = `cityHash64(ua)`;

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
