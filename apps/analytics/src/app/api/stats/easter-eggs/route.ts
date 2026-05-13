import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const summaryQuery = `
      SELECT
        count() AS total_completions,
        uniq(egg_id) AS unique_eggs,
        avg(completion_time_ms) AS avg_completion_ms,
        avg(attempt_count) AS avg_attempts
      FROM analytics.easter_egg_completions
    `;

    const byEggQuery = `
      SELECT
        egg_id,
        egg_name,
        count() AS completions,
        avg(completion_time_ms) AS avg_ms,
        avg(attempt_count) AS avg_attempts
      FROM analytics.easter_egg_completions
      GROUP BY egg_id, egg_name
      ORDER BY completions DESC
    `;

    const byTriggerQuery = `
      SELECT
        trigger_type,
        count() AS completions
      FROM analytics.easter_egg_completions
      GROUP BY trigger_type
      ORDER BY completions DESC
    `;

    const trendQuery = `
      SELECT
        toStartOfDay(timestamp) AS date,
        count() AS completions
      FROM analytics.easter_egg_completions
      WHERE timestamp >= subtractDays(now(), 30)
      GROUP BY date
      ORDER BY date ASC
    `;

    const recentQuery = `
      SELECT
        egg_id,
        egg_name,
        trigger_type,
        completion_time_ms,
        attempt_count,
        country,
        device_type,
        timestamp
      FROM analytics.easter_egg_completions
      ORDER BY timestamp DESC
      LIMIT 20
    `;

    const [summaryRes, byEggRes, byTriggerRes, trendRes, recentRes] = await Promise.all([
      mainClickhouseClient.query({
        query: summaryQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: byEggQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: byTriggerQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: trendQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: recentQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
    ]);

    const [summary] = (await summaryRes.json()) as any[];
    const byEgg = (await byEggRes.json()) as any[];
    const byTrigger = (await byTriggerRes.json()) as any[];
    const trend = (await trendRes.json()) as any[];
    const recent = (await recentRes.json()) as any[];

    return NextResponse.json({
      data: {
        summary: summary ?? {
          total_completions: 0,
          unique_eggs: 0,
          avg_completion_ms: 0,
          avg_attempts: 0,
        },
        byEgg,
        byTrigger,
        trend,
        recent,
      },
    });
  } catch (error) {
    console.error('[EasterEggs] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
