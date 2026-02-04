// apps/analytics/src/app/api/stats/performance/route.ts
import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export async function GET() {
  try {
    // 1. Fetch KPI Summary (Last 24 hours) from Daily MVs
    const summaryQuery = `
      SELECT
        quantilesMerge(0.75, 0.90, 0.99)(vitals_state)[1] AS lcp_p75,
        avgMerge(avg_latency) AS cls_avg,
        sum(total_samples) AS total_metrics,
        sum(good_samples) AS good_metrics
      FROM analytics.daily_performance_vitals
      WHERE event_date >= subtractDays(today(), 1)
    `;

    // 2. Fetch Latency History for the graph (Hourly) from Hourly MVs
    const historyQuery = `
      SELECT
        event_hour AS date,
        avg_latency AS value,
        metric_name AS metric
      FROM analytics.hourly_performance_vitals
      WHERE metric_name IN ('LCP', 'FCP', 'TTFB')
        AND event_hour >= subtractDays(now(), 7)
      ORDER BY date ASC
    `;

    // 3. Error Summary (from Sentry webhooks)
    const errorSummaryQuery = `
      SELECT
        count() AS total_errors,
        countIf(level = 'fatal') AS fatal_errors,
        countIf(level = 'error') AS regular_errors,
        countIf(level = 'warning') AS warning_errors
      FROM analytics.error_traces
      WHERE timestamp >= subtractHours(now(), 24)
    `;

    // 4. Top 5 Recent Errors (from Sentry webhooks)
    const topErrorsQuery = `
      SELECT
        issue_id,
        message,
        level,
        culprit,
        count() AS count,
        anyLast(sentry_url) AS sentry_url
      FROM analytics.error_traces
      WHERE timestamp >= subtractHours(now(), 24)
      GROUP BY issue_id, message, level, culprit
      ORDER BY count DESC, level DESC
      LIMIT 5
    `;

    // Execute all queries in parallel
    const [summaryResult, historyResult, errorSummaryResult, topErrorsResult] = await Promise.all([
      mainClickhouseClient.query({ query: summaryQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: historyQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: errorSummaryQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: topErrorsQuery, format: 'JSONEachRow' }),
    ]);

    const summaryData = await summaryResult.json();
    const historyData = await historyResult.json();
    const errorSummaryData = await errorSummaryResult.json();
    const topErrorsData = await topErrorsResult.json();

    // 5. System Integrity (Health Checks)
    const integrityQuery = `
      SELECT
        service,
        status,
        latency_ms,
        timestamp
      FROM analytics.system_integrity
      ORDER BY timestamp DESC
      LIMIT 10
    `;
    const integrityResult = await mainClickhouseClient.query({ query: integrityQuery, format: 'JSONEachRow' });
    const integrityData = await integrityResult.json();

    return NextResponse.json({
      data: {
        summary: summaryData[0] || {},
        history: historyData,
        integrity: integrityData,
        errors: {
          summary: errorSummaryData[0] || {},
          top: topErrorsData,
        },
      }
    });
  } catch (error) {
    console.error('Performance Stats Fetch Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}