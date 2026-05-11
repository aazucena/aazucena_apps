import { mainClickhouseClient as clickhouse } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // 1. Fetch details for a specific session
      const resultSet = await clickhouse.query({
        query: `
          SELECT 
            id,
            event,
            timestamp,
            url,
            country,
            device_type,
            os,
            browser,
            data
          FROM analytics.telemetry_events
          WHERE sessionId = {sid:String}
          ORDER BY timestamp ASC
          LIMIT 1000
        `,
        query_params: { sid: sessionId },
        format: 'JSONEachRow',
        abort_signal: req.signal,
      });

      const rawEvents = (await resultSet.json()) as any[];
      const events = rawEvents.map((ev) => ({
        ...ev,
        data: ev.data && typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data,
      }));

      return NextResponse.json({
        success: true,
        data: {
          sessionId,
          events,
        },
      });
    }

    // 2. Fetch list of recent unique journeys
    const resultSet = await clickhouse.query({
      query: `
        SELECT 
          sessionId,
          count() as event_count,
          min(timestamp) as start_time,
          max(timestamp) as end_time,
          anyLast(country) as country,
          anyLast(device_type) as device,
          anyLast(browser) as browser,
          groupUniqArray(event) as unique_events
        FROM analytics.telemetry_events
        GROUP BY sessionId
        ORDER BY end_time DESC
        LIMIT 50
      `,
      format: 'JSONEachRow',
      abort_signal: req.signal,
    });

    const journeys = (await resultSet.json()) as any[];

    return NextResponse.json({
      success: true,
      data: journeys,
    });
  } catch (error) {
    console.error('[STATS_JOURNEYS_ERROR]', error);
    return NextResponse.json({ error: 'FAILED_TO_FETCH_JOURNEYS' }, { status: 500 });
  }
}
