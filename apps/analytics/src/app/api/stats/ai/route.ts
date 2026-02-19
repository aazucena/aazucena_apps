import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export async function GET() {
  try {
    // 1. KPI Summary (Last 24 hours) from Daily MV
    const summaryQuery = `
      SELECT
        sum(total_cost_usd) AS total_spend,
        avgMerge(avg_latency_ms) AS avg_latency,
        sum(input_tokens + output_tokens) AS total_tokens,
        sum(total_calls) AS total_inferences,
        sum(total_savings_usd) AS total_savings
      FROM analytics.daily_ai_summary
      WHERE event_date >= subtractDays(today(), 1)
    `;

    // 2. Spend by Model (Distribution) from Daily MV
    const modelDistributionQuery = `
      SELECT
        model,
        sum(total_cost_usd) AS spend,
        sum(total_savings_usd) AS savings,
        sum(total_calls) AS inferences,
        avgMerge(avg_latency_ms) AS latency
      FROM analytics.daily_ai_summary
      WHERE event_date >= subtractDays(today(), 7)
      GROUP BY model
      ORDER BY spend DESC
    `;

    // 3. Spend by Agent (New Granularity) from Daily MV
    const agentDistributionQuery = `
      SELECT
        agent_name,
        sum(total_cost_usd) AS spend,
        sum(total_calls) AS inferences,
        avgMerge(avg_latency_ms) AS latency
      FROM analytics.daily_ai_summary
      WHERE event_date >= subtractDays(today(), 7)
      GROUP BY agent_name
      ORDER BY spend DESC
    `;

    // 4. Time Series: Daily Spend & Savings (Last 30 days) from Daily MV
    const spendHistoryQuery = `
      SELECT
        event_date AS date,
        'Actual_Spend' AS category,
        sum(total_cost_usd) AS value
      FROM analytics.daily_ai_summary
      WHERE event_date >= subtractDays(today(), 30)
      GROUP BY date, category
      
      UNION ALL
      
      SELECT
        event_date AS date,
        'Opportunity_Savings' AS category,
        sum(total_savings_usd) AS value
      FROM analytics.daily_ai_summary
      WHERE event_date >= subtractDays(today(), 30)
      GROUP BY date, category
      ORDER BY date ASC
    `;

    const [summaryRes, distRes, agentRes, historyRes] = await Promise.all([
      mainClickhouseClient.query({ query: summaryQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: modelDistributionQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: agentDistributionQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: spendHistoryQuery, format: 'JSONEachRow' }),
    ]);

    const summary = await summaryRes.json();
    const distribution = await distRes.json();
    const agents = await agentRes.json();
    const history = await historyRes.json();

    return NextResponse.json({
      data: {
        summary: summary[0] || {
          total_spend: 0,
          avg_latency: 0,
          total_tokens: 0,
          total_inferences: 0,
        },
        distribution,
        agents,
        history: history.map((h: any) => ({ ...h, date: new Date(h.date) })),
      },
    });
  } catch (error) {
    console.error('[AI-Stats-API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI stats' }, { status: 500 });
  }
}
