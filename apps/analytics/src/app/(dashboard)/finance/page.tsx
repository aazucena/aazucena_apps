// apps/analytics/src/app/finance/page.tsx
'use client';

import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { StreamGraph } from '@aazucena/visualizations';
import type { GenericTimeSeriesStep } from '@aazucena/types';
import { useFinanceStats } from '@/hooks/useFinance';
import { Database, CreditCard, Dollar, TrendingUp } from '@aazucena/icons';
import { cn } from '@/lib/utils';

export default function FinancePage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading } = useFinanceStats();

  useEffect(() => {
    dispatch(setCategoryPreset('INTELLIGENCE'));
  }, [dispatch]);

  // Group by date → GenericTimeSeriesStep[] (provider as category key)
  const chartData = useMemo((): GenericTimeSeriesStep[] => {
    if (!stats?.trends) return [];
    const map = new Map<string, Record<string, number>>();
    (stats.trends as any[]).forEach((d) => {
      const key = new Date(d.date).toISOString();
      if (!map.has(key)) map.set(key, {});
      map.get(key)![d.provider] = d.revenue ?? 0;
    });
    return Array.from(map.entries()).map(([date, values]) => ({
      timestamp: new Date(date),
      values,
    }));
  }, [stats]);

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
            FINANCIAL_LEDGER
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Revenue Performance & Capital Tracking
          </p>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Revenue"
          value={`$${stats?.summary?.total_revenue?.toLocaleString() || '0'}`}
          description="CUMULATIVE_EARNINGS"
          icon={<Dollar size={24} />}
        />
        <MetricCard
          label="Transaction Count"
          value={stats?.summary?.transaction_count?.toLocaleString() || '0'}
          description="TOTAL_EVENTS"
          variant="secondary"
          icon={<Database size={24} />}
        />
        <MetricCard
          label="Avg Transaction"
          value={`$${stats?.summary?.avg_transaction?.toFixed(2) || '0.00'}`}
          description="UNIT_ECONOMICS"
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* REVENUE GRAPH */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <CreditCard size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Revenue Velocity
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
            {isLoading ? 'SYNCING_LEDGER_DATA...' : 'Source: Multi_Provider_Webhooks'}
          </span>
        </div>
        <div className="min-h-[450px]">
          <StreamGraph data={chartData} />
        </div>
      </div>

      {/* TRANSACTION FEED */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 px-2">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase">
                <th className="py-4 px-4 font-black">Timestamp</th>
                <th className="py-4 px-4 font-black">Provider</th>
                <th className="py-4 px-4 font-black">Amount</th>
                <th className="py-4 px-4 font-black">Identifier</th>
                <th className="py-4 px-4 font-black text-right">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {stats?.history?.map((t, idx) => (
                <tr
                  key={t.transaction_id || idx}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                >
                  <td className="py-4 px-4 text-zinc-500 dark:text-zinc-400">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter',
                        t.provider === 'STRIPE'
                          ? 'bg-indigo-500/10 text-indigo-500'
                          : 'bg-sky-500/10 text-sky-500',
                      )}
                    >
                      {t.provider}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    ${t.amount.toFixed(2)} {t.currency}
                  </td>
                  <td className="py-4 px-4 text-zinc-400 text-[8px] truncate max-w-[150px]">
                    {t.transaction_id}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-zinc-500 dark:text-zinc-500 italic truncate max-w-[200px]">
                      {t.customer_email || 'anonymous_contributor'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.history || stats.history.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-zinc-500 font-mono text-xs uppercase"
                  >
                    No financial events detected yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
