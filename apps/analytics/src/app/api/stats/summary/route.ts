import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Execute summary query
    const resultSet = await clickhouse.query({
      query: `
        SELECT 
          count() as total_events,
          uniq(session_id) as total_visitors,
          countIf(event = 'Music Play') as total_music_plays,
          countIf(event = 'Error') as total_errors
        FROM analytics_events
      `,
      format: 'JSONEachRow',
    });

    const [data] = await resultSet.json() as any[];

    // 2. Prepare default values if table is empty
    const stats = data || {
      total_events: 0,
      total_visitors: 0,
      total_music_plays: 0,
      total_errors: 0
    };

    // 3. Calculate derived metrics
    const apiHealth = stats.total_events > 0 
      ? (((stats.total_events - stats.total_errors) / stats.total_events) * 100).toFixed(1)
      : '100.0';

    return NextResponse.json({
      success: true,
      data: {
        visitors: stats.total_visitors,
        music_plays: stats.total_music_plays,
        api_health: `${apiHealth}%`,
        errors: stats.total_errors,
        total_signals: stats.total_events
      }
    });

  } catch (error) {
    console.error('[STATS_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'FAILED_TO_FETCH_SUMMARY' }, { status: 500 });
  }
}
