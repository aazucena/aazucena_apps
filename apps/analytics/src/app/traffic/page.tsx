// apps/analytics/src/app/traffic/page.tsx
'use client';

import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { StreamGraph } from '@/components/visualizations/StreamGraph';
import { useTrafficStats } from '@/hooks/useTraffic';
import { Globe, Users, Eye, ArrowUpRight } from '@mynaui/icons-react';
import { ChoroplethMap } from '@/components/visualizations/ChoroplethMap';

export default function TrafficPage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading } = useTrafficStats();

  useEffect(() => {
    dispatch(setCategoryPreset('SYSTEM'));
  }, [dispatch]);

  const chartData = useMemo(() => {
    if (!stats?.trends) return [];

    const normalized: any[] = [];
    stats.trends.forEach((d) => {
      normalized.push({
        date: new Date(d.date),
        value: d.visitors,
        category: 'Unique Visitors',
      });
      normalized.push({
        date: new Date(d.date),
        value: d.pageviews,
        category: 'Total Pageviews',
      });
    });
    return normalized;
  }, [stats]);

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
            TRAFFIC_CENTER
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Audience Engagement & Reach Intelligence
          </p>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Unique Visitors (30d)"
          value={stats?.summary?.total_visitors?.toLocaleString() || '0'}
          description="DISTINCT_SESSIONS"
          icon={<Users size={24} />}
        />
        <MetricCard
          label="Total Pageviews (30d)"
          value={stats?.summary?.total_pageviews?.toLocaleString() || '0'}
          description="EXPOSURE_COUNT"
          variant="secondary"
          icon={<Eye size={24} />}
        />
        <MetricCard
          label="Direct Traffic"
          value={stats?.summary?.direct_traffic?.toLocaleString() || '0'}
          description="NO_REFERRER_EXPOSURE"
          icon={<ArrowUpRight size={24} />}
        />
      </div>

      {/* TREND GRAPH */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Globe size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Traffic Velocity
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
            {isLoading ? 'SYNCING_TRAFFIC_DATA...' : 'Source: Vercel_Analytics'}
          </span>
        </div>
        <div className="min-h-[450px]">
          <StreamGraph data={chartData} />
        </div>
      </div>

      {/* GEOSPATIAL MAP */}
      <ChoroplethMap data={stats?.geo || []} />

      {/* GEOSPATIAL TABLE (Simplified) */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 px-2">
          Global Distribution (Top 10)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats?.geo?.map((g, idx) => (
            <div
              key={g.country || idx}
              className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between"
            >
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                {g.country || 'Unknown'}
              </span>
              <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {g.visitors}
              </span>
            </div>
          ))}
          {(!stats?.geo || stats.geo.length === 0) && (
            <div className="col-span-full py-10 text-center text-zinc-500 font-mono text-xs uppercase">
              No geographic data ingested yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
