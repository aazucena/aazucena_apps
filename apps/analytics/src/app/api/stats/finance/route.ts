// apps/analytics/src/app/api/stats/finance/route.ts
import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Aggregated KPIs
    const summaryQuery = `
      SELECT
        sum(amount) as total_revenue,
        avg(amount) as avg_transaction,
        count() as transaction_count
      FROM analytics.financial_ledger
      WHERE status = 'SUCCEEDED'
    `;

    // 2. Revenue Trends (Daily)
    const trendsQuery = `
      SELECT
        toStartOfDay(timestamp) as date,
        sum(amount) as revenue,
        provider
      FROM analytics.financial_ledger
      WHERE status = 'SUCCEEDED'
      GROUP BY date, provider
      ORDER BY date ASC
    `;

    // 3. Recent Transactions
    const historyQuery = `
      SELECT
        timestamp,
        transaction_id,
        provider,
        amount,
        currency,
        type,
        customer_email,
        metadata
      FROM analytics.financial_ledger
      ORDER BY timestamp DESC
      LIMIT 20
    `;

    const [summaryRes, trendsRes, historyRes] = await Promise.all([
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
        query: historyQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
    ]);

    const summaryData = await summaryRes.json();
    const trendsData = await trendsRes.json();
    const historyData = await historyRes.json();

    return NextResponse.json({
      data: {
        summary: summaryData[0] || { total_revenue: 0, avg_transaction: 0, transaction_count: 0 },
        trends: trendsData,
        history: historyData,
      },
    });
  } catch (error) {
    console.error('[FinanceStats] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
