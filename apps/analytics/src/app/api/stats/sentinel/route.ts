import { mainClickhouseClient as clickhouse } from '@/lib/services';
import { NextResponse } from 'next/server';
import { SENTINEL_THRESHOLDS, SentinelAlert } from '@aazucena/constants';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Fetch current health data from MVs and Integrity tables
    const healthQuery = `
      SELECT
        -- 1.1 AI Costs (Today)
        (SELECT sum(total_cost_usd) FROM analytics.daily_ai_summary WHERE event_date = today()) as ai_cost,
        (SELECT avgMerge(avg_latency_ms) FROM analytics.daily_ai_summary WHERE event_date = today()) as ai_latency,
        
        -- 1.2 Performance (Last 24h)
        (SELECT quantilesMerge(0.75, 0.90, 0.99)(vitals_state)[1] FROM analytics.daily_performance_vitals WHERE event_date >= subtractDays(today(), 1) AND metric_name = 'LCP') as lcp_p75,
        
        -- 1.3 Errors (Last hour vs Last 24h)
        (SELECT count() FROM analytics.error_traces WHERE timestamp >= subtractHours(now(), 1)) as errors_1h,
        (SELECT countIf(level = 'fatal') FROM analytics.error_traces WHERE timestamp >= subtractHours(now(), 24)) as fatals_24h,
        
        -- 1.4 Service Integrity (Current)
        (SELECT countIf(status != 'UP') FROM analytics.system_integrity WHERE timestamp >= subtractMinutes(now(), 5)) as down_services,

        -- 1.5 Anomaly Detection (Today vs 7d Average)
        (SELECT count() FROM analytics.telemetry_events WHERE toDate(timestamp) = today()) as current_volume,
        (SELECT count() / 7 FROM analytics.telemetry_events WHERE toDate(timestamp) >= subtractDays(today(), 7) AND toDate(timestamp) < today()) as avg_volume
    `;

    const resultSet = await clickhouse.query({
      query: healthQuery,
      format: 'JSONEachRow',
      abort_signal: req.signal,
    });
    const [stats] = (await resultSet.json()) as any[];

    const alerts: SentinelAlert[] = [];
    const now = new Date().toISOString();

    // 2. Evaluate AI Cost
    // ... existing AI cost logic ...

    // ... other evaluation logic ...

    // 7. Anomaly: Traffic Drop
    const volumeThreshold = stats.avg_volume * 0.5; // Alert if volume is < 50% of average
    if (stats.avg_volume > 100 && stats.current_volume < volumeThreshold) {
      alerts.push({
        id: 'anomaly-traffic',
        metric: 'TRAFFIC_SIGNAL_ANOMALY',
        value: `${stats.current_volume} (vs ${Math.round(stats.avg_volume)} avg)`,
        threshold: Math.round(volumeThreshold),
        level: 'WARNING',
        timestamp: now,
      });
    }
    if (stats.ai_cost >= SENTINEL_THRESHOLDS.AI_COST_DAILY.CRITICAL) {
      alerts.push({
        id: 'ai-cost',
        metric: SENTINEL_THRESHOLDS.AI_COST_DAILY.LABEL,
        value: stats.ai_cost,
        threshold: SENTINEL_THRESHOLDS.AI_COST_DAILY.CRITICAL,
        level: 'CRITICAL',
        timestamp: now,
      });
    } else if (stats.ai_cost >= SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING) {
      alerts.push({
        id: 'ai-cost',
        metric: SENTINEL_THRESHOLDS.AI_COST_DAILY.LABEL,
        value: stats.ai_cost,
        threshold: SENTINEL_THRESHOLDS.AI_COST_DAILY.WARNING,
        level: 'WARNING',
        timestamp: now,
      });
    }

    // 3. Evaluate LCP Performance
    if (stats.lcp_p75 >= SENTINEL_THRESHOLDS.LCP_P75.CRITICAL) {
      alerts.push({
        id: 'perf-lcp',
        metric: SENTINEL_THRESHOLDS.LCP_P75.LABEL,
        value: stats.lcp_p75,
        threshold: SENTINEL_THRESHOLDS.LCP_P75.CRITICAL,
        level: 'CRITICAL',
        timestamp: now,
      });
    } else if (stats.lcp_p75 >= SENTINEL_THRESHOLDS.LCP_P75.WARNING) {
      alerts.push({
        id: 'perf-lcp',
        metric: SENTINEL_THRESHOLDS.LCP_P75.LABEL,
        value: stats.lcp_p75,
        threshold: SENTINEL_THRESHOLDS.LCP_P75.WARNING,
        level: 'WARNING',
        timestamp: now,
      });
    }

    // 4. Evaluate Hourly Errors
    if (stats.errors_1h >= SENTINEL_THRESHOLDS.ERROR_RATE_HOURLY.CRITICAL) {
      alerts.push({
        id: 'err-rate',
        metric: SENTINEL_THRESHOLDS.ERROR_RATE_HOURLY.LABEL,
        value: stats.errors_1h,
        threshold: SENTINEL_THRESHOLDS.ERROR_RATE_HOURLY.CRITICAL,
        level: 'CRITICAL',
        timestamp: now,
      });
    } else if (stats.errors_1h >= SENTINEL_THRESHOLDS.ERROR_RATE_HOURLY.WARNING) {
      alerts.push({
        id: 'err-rate',
        metric: SENTINEL_THRESHOLDS.ERROR_RATE_HOURLY.LABEL,
        value: stats.errors_1h,
        threshold: SENTINEL_THRESHOLDS.ERROR_RATE_HOURLY.WARNING,
        level: 'WARNING',
        timestamp: now,
      });
    }

    // 5. Evaluate Fatal Incidents
    if (stats.fatals_24h >= SENTINEL_THRESHOLDS.FATAL_INCIDENTS_24H.CRITICAL) {
      alerts.push({
        id: 'err-fatal',
        metric: SENTINEL_THRESHOLDS.FATAL_INCIDENTS_24H.LABEL,
        value: stats.fatals_24h,
        threshold: SENTINEL_THRESHOLDS.FATAL_INCIDENTS_24H.CRITICAL,
        level: 'CRITICAL',
        timestamp: now,
      });
    }

    // 6. Service Outages (Immediate Critical)
    if (stats.down_services > 0) {
      alerts.push({
        id: 'svc-integrity',
        metric: 'CORE_SERVICE_DISRUPTION',
        value: `${stats.down_services} NODES_OFFLINE`,
        threshold: 0,
        level: 'CRITICAL',
        timestamp: now,
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_alerts: alerts.length,
        critical_count: alerts.filter((a) => a.level === 'CRITICAL').length,
        warning_count: alerts.filter((a) => a.level === 'WARNING').length,
        overall_status: alerts.some((a) => a.level === 'CRITICAL')
          ? 'CRITICAL'
          : alerts.length > 0
            ? 'WARNING'
            : 'NOMINAL',
      },
      alerts,
    });
  } catch (error) {
    console.error('[STATS_SENTINEL_ERROR]', error);
    return NextResponse.json({ error: 'FAILED_TO_FETCH_SENTINEL_DATA' }, { status: 500 });
  }
}
