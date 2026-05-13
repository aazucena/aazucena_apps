'use client';

import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setCategoryPreset } from '@/store';
import type { GenericTimeSeriesStep } from '@aazucena/types';

// 1. Core Layout Components
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { SentinelWatchdog } from '@/components/dashboard/SentinelWatchdog';
import { MetricCard } from '@/components/widgets/MetricCard';
import { TelemetryFeed } from '@/components/logs/TelemetryFeed';

// 2. D3 Visualizations — from @aazucena/visualizations
import { Heatmap, StreamGraph } from '@aazucena/visualizations';

// 3. Icons (Using MyNaui)
import {
  Eye,
  Music as MusicNote,
  Activity,
  DangerTriangle as Bug,
  TrendingUp,
  ClockCircle as History,
} from '@aazucena/icons';

// 4. Telemetry Hooks
import { useSystemSummary, useTrendAnalysis, useTelemetryStream } from '@/hooks/useTelemetry';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { searchQuery, visibleCategories } = useSelector(
    (state: RootState) => state.dashboard.filters,
  );

  // Initialize Hooks
  const { data: summary } = useSystemSummary();
  const { data: trends, isLoading: trendsLoading } = useTrendAnalysis();
  const { data: logs, isLoading: logsLoading } = useTelemetryStream();

  useEffect(() => {
    dispatch(setCategoryPreset('OVERVIEW'));
  }, [dispatch]);

  const categories = ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'];

  // Filter stream by visibleCategories — package StreamGraph is framework-agnostic (no Redux reads)
  const filteredStream = useMemo((): GenericTimeSeriesStep[] => {
    const stream = (trends?.stream as GenericTimeSeriesStep[] | undefined) ?? [];
    if (!visibleCategories?.length) return stream;
    return stream.map((step) => ({
      ...step,
      values: Object.fromEntries(
        Object.entries(step.values).filter(([k]) => visibleCategories.includes(k)),
      ),
    }));
  }, [trends?.stream, visibleCategories]);

  return (
    <div className="space-y-10 pb-20">
      {/* SECTION 1: HEADER & FILTERS */}
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
            AZUCENA_LYTICS<span className="text-primary-500">_v1</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Systems Telemetry & Engineering Intelligence Terminal
          </p>
        </div>

        <DashboardFilters categories={categories} />
      </div>

      {/* SECTION 1.5: SENTINEL WATCHDOG */}
      <SentinelWatchdog />

      {/* SECTION 2: KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Unique Entities"
          value={summary?.visitors?.toLocaleString() || '0'}
          description="+14% SIGNAL_STRENGTH"
          icon={<Eye size={24} />}
        />
        <MetricCard
          label="Signal Streams"
          value={summary?.music_plays?.toLocaleString() || '0'}
          description="AVG_45S_PLAYBACK"
          icon={<MusicNote size={24} />}
        />
        <MetricCard
          label="Core Integrity"
          value={summary?.api_health || '100%'}
          description="LATENCY_42MS_STABLE"
          icon={<Activity size={24} />}
        />
        <MetricCard
          label="Total Errors"
          value={summary?.errors?.toLocaleString() || '0'}
          variant="secondary"
          description="EXCEPTION_TRACE_ACTIVE"
          icon={<Bug size={24} />}
        />
      </div>

      {/* SECTION 3: TREND ANALYSIS */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
                Velocity Dynamics
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
              {trendsLoading ? 'SYNCING_METRICS...' : 'Mode: Time_Series_Inference'}
            </span>
          </div>
          <div className="min-h-[450px]">
            <StreamGraph data={filteredStream} />
          </div>
        </div>

        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                <Activity size={18} />
              </div>
              <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
                Interaction Density
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
              Horizon: 120_Month_Audit
            </span>
          </div>
          <div className="min-h-[400px]">
            <Heatmap data={(trends?.heatmap as any) || []} height={360} />
          </div>
        </div>
      </div>

      {/* SECTION 4: RECENT ACTIVITY FEED */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden transition-all duration-300">
        <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500">
              <History size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Raw Telemetry Logs
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
              {logsLoading ? 'STREAM_CONNECTING...' : 'Stream_Buffer: Active'}
            </span>
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        <div className="p-8">
          <TelemetryFeed logs={logs || []} filter={searchQuery} />
        </div>
      </div>
    </div>
  );
}
