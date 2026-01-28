'use client';

import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { StreamGraph } from '@/components/visualizations/StreamGraph';
import { Activity, Servers as Server, Zap, Database } from '@mynaui/icons-react';
import { MOCK_PERFORMANCE_METRICS, MOCK_LATENCY_HISTORY } from '@/lib/data/mock';

export default function PerformancePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCategoryPreset('PERFORMANCE'));
  }, [dispatch]);

  const latencyData = useMemo(() => 
    MOCK_LATENCY_HISTORY.map(d => ({ ...d, date: new Date(d.date) })), 
  []);

  return (
    <div className="space-y-10 pb-20">
      
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
          SYSTEM_INTEGRITY
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
          Infrastructure Health & Resource Consumption
        </p>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="API Latency" 
          value="42ms" 
          description="OPTIMAL_RANGE" 
          icon={<Zap size={24} />} 
        />
        <MetricCard 
          label="Database IOPS" 
          value="1.2k" 
          description="WRITE_HEAVY_LOAD" 
          icon={<Database size={24} />} 
        />
        <MetricCard 
          label="Memory Usage" 
          value="64%" 
          description="WARN_THRESHOLD_60" 
          variant="secondary"
          icon={<Server size={24} />} 
        />
        <MetricCard 
          label="Uptime" 
          value="99.99%" 
          description="30_DAY_WINDOW" 
          icon={<Activity size={24} />} 
        />
      </div>

      {/* LATENCY GRAPH */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-300">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Activity size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">Response Latency</h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">Metric: ms</span>
        </div>
        <div className="min-h-[450px]">
          <StreamGraph data={latencyData} />
        </div>
      </div>

      {/* RESOURCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Regional Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300">us-east-1</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[65%]" />
                </div>
                <span className="text-xs font-bold text-zinc-500">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300">eu-west-1</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[25%]" />
                </div>
                <span className="text-xs font-bold text-zinc-500">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300">ap-northeast</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[10%]" />
                </div>
                <span className="text-xs font-bold text-zinc-500">10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Cache Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-black text-emerald-500">94.2%</div>
              <div className="text-[9px] font-mono uppercase text-zinc-500 mt-1">Hit Rate</div>
            </div>
            <div className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-black text-zinc-700 dark:text-zinc-300">1.8GB</div>
              <div className="text-[9px] font-mono uppercase text-zinc-500 mt-1">Memory Used</div>
            </div>
            <div className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-black text-zinc-700 dark:text-zinc-300">12k</div>
              <div className="text-[9px] font-mono uppercase text-zinc-500 mt-1">Keys</div>
            </div>
            <div className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-black text-zinc-700 dark:text-zinc-300">24h</div>
              <div className="text-[9px] font-mono uppercase text-zinc-500 mt-1">Avg TTL</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
