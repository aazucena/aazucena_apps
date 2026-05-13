import { mainClickhouseClient as clickhouse } from '@/lib/services';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    searchParams.get('range'); // reserved for future filtering

    // 1. Fetch time-series data grouped by month and event type
    // We use toStartOfMonth for the long-term trend
    const resultSet = await clickhouse.query({
      query: `
        SELECT 
          toStartOfMonth(timestamp) as date,
          event,
          count() as count
        FROM telemetry_events
        GROUP BY date, event
        ORDER BY date ASC
      `,
      format: 'JSONEachRow',
      abort_signal: request.signal,
    });

    const rawRows = (await resultSet.json()) as any[];

    // 2. Pivot the data: [ {date, event, count}, ... ] -> [ {date, "Page View": 5, "Error": 2}, ... ]
    const pivotedMap = new Map<string, any>();

    rawRows.forEach((row) => {
      const dateKey = row.date.split('T')[0]; // YYYY-MM-DD
      if (!pivotedMap.has(dateKey)) {
        pivotedMap.set(dateKey, { date: dateKey });
      }
      const entry = pivotedMap.get(dateKey);
      entry[row.event] = Number(row.count);
    });

    const streamData = Array.from(pivotedMap.values());

    // 3. Fetch daily totals for the heatmap (last 365 days)
    const dailyResult = await clickhouse.query({
      query: `
        SELECT
          toDate(timestamp) as date,
          count() as count
        FROM telemetry_events
        WHERE timestamp >= now() - INTERVAL 365 DAY
        GROUP BY date
        ORDER BY date ASC
      `,
      format: 'JSONEachRow',
      abort_signal: request.signal,
    });
    const dailyRows = (await dailyResult.json()) as Array<{ date: string; count: string }>;
    const heatmapData = dailyRows.map((r) => ({
      date: r.date,
      count: Number(r.count),
    }));

    return NextResponse.json({
      success: true,
      data: {
        stream: streamData,
        heatmap: heatmapData,
      },
    });
  } catch (error) {
    console.error('[STATS_TRENDS_ERROR]', error);
    return NextResponse.json({ error: 'FAILED_TO_FETCH_TRENDS' }, { status: 500 });
  }
}
