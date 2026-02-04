import { mainClickhouseClient as clickhouse } from '@/lib/services';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all';

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
    });

    const rawRows = await resultSet.json() as any[];

    // 2. Pivot the data: [ {date, event, count}, ... ] -> [ {date, "Page View": 5, "Error": 2}, ... ]
    const pivotedMap = new Map<string, any>();

    rawRows.forEach(row => {
      const dateKey = row.date.split('T')[0]; // YYYY-MM-DD
      if (!pivotedMap.has(dateKey)) {
        pivotedMap.set(dateKey, { date: dateKey });
      }
      const entry = pivotedMap.get(dateKey);
      entry[row.event] = Number(row.count);
    });

    const streamData = Array.from(pivotedMap.values());

    // 3. Prepare Heatmap specific data (Total counts per month)
    const heatmapData = streamData.map(d => {
      const { date, ...events } = d;
      const total = Object.values(events).reduce((sum: number, val: any) => sum + val, 0);
      return {
        date,
        count: total,
        categoryDistribution: events
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stream: streamData,
        heatmap: heatmapData
      }
    });

  } catch (error) {
    console.error('[STATS_TRENDS_ERROR]', error);
    return NextResponse.json({ error: 'FAILED_TO_FETCH_TRENDS' }, { status: 500 });
  }
}
