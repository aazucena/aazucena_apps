'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { StreamGraph } from '@/components/visualizations/StreamGraph';
import { CreditCard, Zap, Activity, Chip, Database, TrendingUp } from '@mynaui/icons-react';
import { useAiStats } from '@/hooks/useAiStats';

export default function AiCostCenterPage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading } = useAiStats();

  useEffect(() => {
    dispatch(setCategoryPreset('PERFORMANCE')); // Use high-integrity preset
  }, [dispatch]);

  const totalSpendNum = stats?.summary?.total_spend || 0;
  const totalSpend = totalSpendNum.toFixed(4);
  const totalSavingsNum = stats?.summary?.total_savings || 0;
  const totalSavings = totalSavingsNum.toFixed(4);
  const _avgLatency = stats?.summary?.avg_latency?.toFixed(0) || '0';
  const totalTokens = stats?.summary?.total_tokens?.toLocaleString() || '0';

  // Calculate Monthly Projection (24h burn * 30)
  const monthlyProjection = (totalSpendNum * 30).toFixed(2);

  // Calculate Efficiency Score (Savings / (Spend + Savings))
  const efficiencyScore =
    totalSpendNum + totalSavingsNum > 0
      ? ((totalSavingsNum / (totalSpendNum + totalSavingsNum)) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-3">
            COST_CENTER<span className="text-primary-500">_INTEL</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold text-wrap">
            Financial Ledger & Model Resource Consumption
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full shrink-0 self-start">
          <TrendingUp size={14} className="text-primary-500" />
          <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
            Budget_Audit_Active
          </span>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          label="Total Spend (24h)"
          value={`$${totalSpend}`}
          description="EST_REAL_TIME_BURN"
          variant="secondary"
          icon={<CreditCard size={24} />}
        />
        <MetricCard
          label="Efficiency Score"
          value={`${efficiencyScore}%`}
          description="FISCAL_OPTIMIZATION"
          variant="success"
          icon={<TrendingUp size={24} />}
        />
        <MetricCard
          label="Fiscal Savings"
          value={`$${totalSavings}`}
          description="OPPORTUNITY_GAIN"
          icon={<Zap size={24} />}
        />
        <MetricCard
          label="Token Volume"
          value={totalTokens}
          description="TOTAL_IN_OUT_FLUX"
          icon={<Database size={24} />}
        />
        <MetricCard
          label="Monthly Projection"
          value={`$${monthlyProjection}`}
          description="EST_30_DAY_RUN_RATE"
          icon={<Chip size={24} />}
        />
      </div>

      {/* SPEND HISTORY GRAPH */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Activity size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Spend Velocity Dynamics
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
            {isLoading ? 'CALCULATING_LEDGER...' : 'Unit: USD ($)'}
          </span>
        </div>
        <div className="min-h-[400px]">
          <StreamGraph data={stats?.history || []} />
        </div>
      </div>

      {/* AGENT & MODEL DISTRIBUTION GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* MODEL DISTRIBUTION TABLE */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
          <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Model Efficiency Audit
            </h3>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              7_Day_Analysis
            </span>
          </div>

          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Model_ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Inferences
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Actual_Spend
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Fiscal_Savings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {(stats?.distribution || []).map((model: any) => (
                  <tr
                    key={model.model}
                    className="group hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-500 group-hover:scale-125 transition-transform" />
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm font-mono truncate max-w-[150px]">
                            {model.model.split('/').pop()}
                          </div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-mono opacity-60">
                            {model.model.split('/')[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {model.inferences.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-black text-primary-500">
                        ${model.spend.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xs font-black text-emerald-500">
                          ${(model.savings || 0).toFixed(4)}
                        </span>
                        <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{
                              width: `${Math.min(((model.savings || 0) / (stats.summary.total_savings || 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!stats?.distribution || stats.distribution.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-20 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] italic"
                    >
                      Fiscal telemetry ingestion pending...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AGENT DISTRIBUTION TABLE */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
          <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Agent Resource Allocation
            </h3>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              7_Day_Analysis
            </span>
          </div>

          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Agent_Identity
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Inferences
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">
                    Total_Spend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {(stats?.agents || []).map((agent: any) => (
                  <tr
                    key={agent.agent_name}
                    className="group hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary-500 group-hover:scale-125 transition-transform" />
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm font-mono">
                            {agent.agent_name}
                          </div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-mono opacity-60">
                            Neural_Node
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {agent.inferences.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xs font-black text-secondary-500">
                          ${agent.spend.toFixed(4)}
                        </span>
                        <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-secondary-500"
                            style={{
                              width: `${Math.min((agent.spend / (stats.summary.total_spend || 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!stats?.agents || stats.agents.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-20 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] italic"
                    >
                      Agent fiscal mapping pending...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
