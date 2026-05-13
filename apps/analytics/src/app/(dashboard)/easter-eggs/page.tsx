'use client';

import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { Star, Zap, Clock9 as Clock, Refresh, XCircle } from '@aazucena/icons';
import { cn } from '@/lib/utils';
import {
  useEasterEggs,
  type EggBreakdown,
  type TriggerBreakdown,
  type RecentCompletion,
} from '@/hooks/useEasterEggs';

// ─── Constants ───────────────────────────────────────────────────────────────

const TRIGGER_STYLES: Record<string, string> = {
  konami: 'bg-violet-500/10 text-violet-500',
  click_sequence: 'bg-sky-500/10 text-sky-500',
  terminal_command: 'bg-emerald-500/10 text-emerald-500',
  idle: 'bg-amber-500/10 text-amber-500',
  cursor_pattern: 'bg-rose-500/10 text-rose-500',
  rive: 'bg-indigo-500/10 text-indigo-500',
};

const TRIGGER_LABELS: Record<string, string> = {
  konami: 'Konami Code',
  click_sequence: 'Click Sequence',
  terminal_command: 'Terminal Cmd',
  idle: 'Idle Trigger',
  cursor_pattern: 'Cursor Pattern',
  rive: 'Rive Interaction',
};

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ data }: { data: { date: string; completions: number }[] }) {
  const points = useMemo(() => {
    if (data.length < 2) return '';
    const max = Math.max(...data.map((d) => d.completions), 1);
    const w = 300;
    const h = 48;
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (d.completions / max) * h;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data]);

  if (!points) {
    return (
      <div className="h-12 flex items-center justify-center text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
        No_Trend_Data
      </div>
    );
  }

  return (
    <svg viewBox="0 0 300 48" className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-primary-500"
      />
    </svg>
  );
}

// ─── Bar chart row ────────────────────────────────────────────────────────────

function EggBar({ egg, max }: { egg: EggBreakdown; max: number }) {
  const pct = max > 0 ? (egg.completions / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase truncate max-w-[180px]">
          {egg.egg_name}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-zinc-400">{formatMs(egg.avg_ms)} avg</span>
          <span className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 w-6 text-right">
            {egg.completions}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Recent feed row ──────────────────────────────────────────────────────────

function RecentRow({ item }: { item: RecentCompletion }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
      <div className="w-7 h-7 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
        <Star size={12} className="text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 truncate">
          {item.egg_name}
        </p>
        <p className="text-[9px] font-mono text-zinc-400">
          {item.country || 'Unknown'} · {item.device_type || 'Unknown'}
        </p>
      </div>
      <span
        className={cn(
          'text-[8px] font-black uppercase px-2 py-0.5 rounded-full shrink-0',
          TRIGGER_STYLES[item.trigger_type] ?? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400',
        )}
      >
        {TRIGGER_LABELS[item.trigger_type] ?? item.trigger_type}
      </span>
      <div className="text-right shrink-0">
        <p className="text-[9px] font-mono text-zinc-500">{formatMs(item.completion_time_ms)}</p>
        <p className="text-[8px] font-mono text-zinc-400">
          {new Date(item.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EasterEggsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch, isFetching } = useEasterEggs();

  useEffect(() => {
    dispatch(setCategoryPreset('SYSTEM'));
  }, [dispatch]);

  const stats = data?.data;
  const maxEggCount = stats?.byEgg?.[0]?.completions ?? 1;
  const topTrigger = stats?.byTrigger?.[0];

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-rose-500 font-mono text-xs uppercase">
        <XCircle className="mr-2" size={16} /> Easter_Egg_Feed_Offline
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase flex items-center gap-3">
            EASTER<span className="text-primary-500">_EGGS</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Hidden Feature Unlock Intelligence & Trigger Analytics
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-zinc-500 disabled:opacity-50"
        >
          <Refresh size={12} className={cn(isFetching && 'animate-spin')} />
          Sync
        </button>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Unlocks',
            value: isLoading ? '—' : (stats?.summary?.total_completions ?? 0).toLocaleString(),
            color: 'text-zinc-900 dark:text-zinc-100',
            icon: <Star size={16} className="text-primary-500" />,
          },
          {
            label: 'Unique Eggs',
            value: isLoading ? '—' : (stats?.summary?.unique_eggs ?? 0).toString(),
            color: 'text-primary-500',
            icon: <Zap size={16} className="text-primary-500" />,
          },
          {
            label: 'Avg Unlock Time',
            value: isLoading ? '—' : formatMs(stats?.summary?.avg_completion_ms ?? 0),
            color: 'text-zinc-900 dark:text-zinc-100',
            icon: <Clock size={16} className="text-primary-500" />,
          },
          {
            label: 'Top Trigger',
            value: isLoading
              ? '—'
              : (TRIGGER_LABELS[topTrigger?.trigger_type ?? ''] ??
                topTrigger?.trigger_type ??
                'N/A'),
            color: 'text-zinc-900 dark:text-zinc-100',
            icon: <Star size={16} className="text-primary-500" />,
          },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                {label}
              </p>
            </div>
            <p className={cn('text-3xl font-black tracking-tighter', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Egg leaderboard */}
        <div className="xl:col-span-2 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Star size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                Egg Leaderboard
              </p>
              <p className="text-[9px] font-mono text-zinc-400 uppercase">
                Completions by hidden feature
              </p>
            </div>
          </div>
          {isLoading ? (
            <div className="py-12 text-center font-mono text-xs text-zinc-500 uppercase animate-pulse tracking-widest">
              Decrypting_Eggs...
            </div>
          ) : stats?.byEgg?.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-zinc-400 uppercase tracking-widest">
              No_Eggs_Discovered_Yet
            </div>
          ) : (
            <div className="space-y-5">
              {stats?.byEgg?.map((egg) => (
                <EggBar key={egg.egg_id} egg={egg} max={maxEggCount} />
              ))}
            </div>
          )}
        </div>

        {/* Trigger type breakdown */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Zap size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                By Trigger
              </p>
              <p className="text-[9px] font-mono text-zinc-400 uppercase">How they found it</p>
            </div>
          </div>
          {isLoading ? (
            <div className="py-12 text-center font-mono text-xs text-zinc-500 uppercase animate-pulse tracking-widest">
              Scanning...
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.byTrigger?.map((t: TriggerBreakdown) => (
                <div key={t.trigger_type} className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[9px] font-black uppercase px-2.5 py-1 rounded-full',
                      TRIGGER_STYLES[t.trigger_type] ??
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-400',
                    )}
                  >
                    {TRIGGER_LABELS[t.trigger_type] ?? t.trigger_type}
                  </span>
                  <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 font-mono">
                    {t.completions}
                  </span>
                </div>
              ))}
              {(!stats?.byTrigger || stats.byTrigger.length === 0) && (
                <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest py-8 text-center">
                  No_Data
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trend + Recent feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 30-day trend sparkline */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                30-Day Unlock Trend
              </p>
              <p className="text-[9px] font-mono text-zinc-400 uppercase">Daily completions</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-12 animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          ) : (
            <Sparkline data={stats?.trend ?? []} />
          )}
          {stats?.trend && stats.trend.length > 0 && (
            <div className="flex justify-between mt-3">
              <span className="text-[8px] font-mono text-zinc-400">
                {new Date(stats.trend[0].date).toLocaleDateString()}
              </span>
              <span className="text-[8px] font-mono text-zinc-400">
                {new Date(stats.trend[stats.trend.length - 1].date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Recent completions feed */}
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md flex flex-col">
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Star size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                Recent Unlocks
              </p>
              <p className="text-[9px] font-mono text-zinc-400 uppercase">Last 20 completions</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-64">
            {isLoading ? (
              <div className="py-12 text-center font-mono text-xs text-zinc-500 uppercase animate-pulse tracking-widest">
                Loading_Feed...
              </div>
            ) : stats?.recent?.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-zinc-400 uppercase tracking-widest">
                No_Recent_Unlocks
              </div>
            ) : (
              stats?.recent?.map((item, i) => (
                <RecentRow key={`${item.egg_id}-${item.timestamp}-${i}`} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
