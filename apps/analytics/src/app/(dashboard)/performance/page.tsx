// apps/analytics/src/app/performance/page.tsx
'use client';

import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import dynamic from 'next/dynamic';
const StreamGraph = dynamic(
  () =>
    import('@aazucena/visualizations/src/d3/StreamGraph').then((m) => ({ default: m.StreamGraph })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
    ),
  },
);
import type { GenericTimeSeriesStep } from '@aazucena/types';
// Corrected icon imports: Bug -> Activity, AlertTriangle -> DangerTriangle
import {
  Activity,
  Zap,
  Database,
  Globe,
  DangerTriangle,
  XCircle,
  ExternalLink,
} from '@aazucena/icons';
import { usePerformanceStats } from '@/hooks/usePerformance';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // cn imported from lib/utils

export default function PerformancePage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading } = usePerformanceStats();

  useEffect(() => {
    dispatch(setCategoryPreset('PERFORMANCE'));
  }, [dispatch]);

  // Group by timestamp → GenericTimeSeriesStep[] (metric name as category key)
  const latencyData = useMemo((): GenericTimeSeriesStep[] => {
    if (!stats?.history) return [];
    const map = new Map<string, Record<string, number>>();
    (stats.history as any[]).forEach((d) => {
      const key = new Date(d.date).toISOString();
      if (!map.has(key)) map.set(key, {});
      map.get(key)![d.metric] = d.value ?? d.p75 ?? 0;
    });
    return Array.from(map.entries()).map(([date, values]) => ({
      timestamp: new Date(date),
      values,
    }));
  }, [stats]);

  const lcpValue = stats?.summary?.lcp_p75
    ? `${(stats.summary.lcp_p75 / 1000).toFixed(2)}s`
    : '0.00s';
  const totalMetrics = stats?.summary?.total_metrics || 0;
  const goodMetrics = stats?.summary?.good_metrics || 0;
  const healthScore =
    totalMetrics > 0 ? `${((goodMetrics / totalMetrics) * 100).toFixed(0)}%` : '100%';

  const totalErrors = stats?.errors?.summary?.total_errors || 0;
  const fatalErrors = stats?.errors?.summary?.fatal_errors || 0;

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
            SYSTEM_INTEGRITY
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Real-time Infrastructure & Experience Monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            Live_Stream_Active
          </span>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {' '}
        {/* Changed to 5 columns */}
        <MetricCard
          label="LCP (P75)"
          value={lcpValue}
          description="TARGET < 2.5s"
          icon={<Zap size={24} />}
        />
        <MetricCard
          label="Signal Integrity"
          value={healthScore}
          description="PCT_GOOD_RATINGS"
          icon={<Activity size={24} />}
        />
        <MetricCard
          label="Metric Streams"
          value={stats?.summary?.total_metrics?.toLocaleString() || '0'}
          description="TOTAL_CWV_EVENTS"
          variant="secondary"
          icon={<Database size={24} />}
        />
        <MetricCard
          label="Total Errors (24h)"
          value={totalErrors.toLocaleString()}
          description="SENTRY_TRACE_COUNT"
          variant={totalErrors > 0 ? 'rose' : 'default'} // Highlight if errors present
          icon={<Activity size={24} />} // Changed Bug to Activity
        />
        <MetricCard
          label="Fatal Errors (24h)"
          value={fatalErrors.toLocaleString()}
          description="CRITICAL_INCIDENTS"
          variant={fatalErrors > 0 ? 'rose' : 'default'} // Highlight if fatal errors present
          icon={<XCircle size={24} />}
        />
      </div>

      {/* LATENCY GRAPH */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-300">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Activity size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Core Web Vitals Velocity
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
            {isLoading ? 'SYNCING_VITAL_SIGNS...' : 'Source: ClickHouse_Telemetry'}
          </span>
        </div>
        <div className="min-h-[450px]">
          <StreamGraph data={latencyData} />
        </div>
      </div>

      {/* TOP SENTRY ERRORS & SYSTEM INTEGRITY LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP SENTRY ERRORS */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 px-2 flex items-center gap-2">
            <Activity size={14} /> Top Sentry Traces (24h) {/* Changed Bug to Activity */}
          </h3>
          <div className="space-y-4">
            {stats?.errors?.top && stats.errors.top.length > 0 ? (
              stats.errors.top.map((error, idx) => (
                <div
                  key={error.issue_id || idx}
                  className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-start gap-3"
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                      error.level === 'fatal'
                        ? 'bg-rose-500 text-white'
                        : error.level === 'error'
                          ? 'bg-red-500 text-white'
                          : error.level === 'warning'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-400 text-white',
                    )}
                  >
                    {error.level === 'fatal' || error.level === 'error' ? (
                      <XCircle size={14} />
                    ) : (
                      <DangerTriangle size={14} />
                    )}{' '}
                    {/* Changed AlertTriangle to DangerTriangle */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {error.message}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                      {error.culprit || 'unknown culprit'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          'text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                          error.level === 'fatal'
                            ? 'bg-rose-500/10 text-rose-500'
                            : error.level === 'error'
                              ? 'bg-red-500/10 text-red-500'
                              : error.level === 'warning'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-zinc-500/10 text-zinc-500',
                        )}
                      >
                        {error.level}
                      </span>
                      <Link
                        href={error.sentry_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-mono font-bold text-primary-500 hover:underline flex items-center gap-1"
                      >
                        View in Sentry <ExternalLink size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                No error traces detected. System nominal.
              </div>
            )}
          </div>
        </div>

        {/* SYSTEM INTEGRITY LIST (Moved to second column) */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 px-2">
            Service Heartbeats
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {' '}
            {/* Adjusted to 1 column for better layout in half-width */}
            {(() => {
              // Deduplicate integrity logs by service name, keeping the latest one
              const uniqueServices = stats?.integrity?.reduce(
                (acc: any, current: any) => {
                  if (!acc[current.service]) {
                    acc[current.service] = current;
                  }
                  return acc;
                },
                {} as Record<string, any>,
              );

              const serviceList = Object.values(uniqueServices || {});

              if (serviceList.length === 0) {
                return (
                  <div className="col-span-full py-20 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    No heartbeat signals detected...
                  </div>
                );
              }

              return serviceList.map((item: any, idx: number) => {
                // Categorical icons for visual cues
                const isCore =
                  item.service.includes('cms') ||
                  item.service.includes('clickhouse') ||
                  item.service.includes('db');
                const Icon = isCore ? Database : item.service.includes('api') ? Globe : Zap;

                return (
                  <div
                    key={item.service || idx}
                    className="group p-6 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex flex-col gap-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-primary-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors',
                          item.status === 'UP'
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                            : item.status === 'DEGRADED'
                              ? 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                              : 'bg-rose-500/5 border-rose-500/20 text-rose-500',
                        )}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          {item.latency_ms}ms
                        </span>
                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" />{' '}
                        {/* cn removed here */}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
                        {item.service.replace('-', '_')}
                      </div>
                      <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-2">
                        {item.status}
                        <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 font-medium">
                          HTTP_OK
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                          Stability
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                          99.9% UPTIME
                        </span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                          Last Pulse
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
