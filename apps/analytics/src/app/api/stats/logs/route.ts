import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resultSet = await clickhouse.query({
      query: `
        SELECT 
          id,
          event,
          timestamp,
          url,
          session_id as sessionId,
          country,
          data
        FROM analytics_events
        ORDER BY timestamp DESC
        LIMIT 100
      `,
      format: 'JSONEachRow',
    });

    const rawLogs = await resultSet.json() as any[];

    // Parse the 'data' string back into JSON objects
    const logs = rawLogs.map(log => ({
      ...log,
      data: log.data ? JSON.parse(log.data) : {}
    }));

    return NextResponse.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('[STATS_LOGS_ERROR]', error);
    return NextResponse.json({ error: 'FAILED_TO_FETCH_LOGS' }, { status: 500 });
  }
}
