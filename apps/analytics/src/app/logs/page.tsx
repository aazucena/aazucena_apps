'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setCategoryPreset } from '@/store';
import { TelemetryFeed } from '@/components/logs/TelemetryFeed';
import { Terminal, Hand as Fingerprint, Globe, ClockCircle } from '@mynaui/icons-react';
import { useTelemetryStream, useSystemSummary } from '@/hooks/useTelemetry';

export default function LogsPage() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.dashboard.filters.searchQuery);

  // Initialize Hooks
  const { data: logs, isLoading: logsLoading } = useTelemetryStream();
  const { data: summary } = useSystemSummary();

  useEffect(() => {
    dispatch(setCategoryPreset('LOGS'));
  }, [dispatch]);

  return (
    <div className="space-y-10 pb-20 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
          TELEMETRY_STREAM
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
          Live Event Ingestion & Error Trace
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <Terminal size={20} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {summary?.total_signals?.toLocaleString() || '0'}
            </div>
            <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Total Signals</div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <Fingerprint size={20} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {summary?.visitors?.toLocaleString() || '0'}
            </div>
            <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Active Sessions</div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <Globe size={20} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">14</div>
            <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Global Regions</div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <ClockCircle size={20} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">42ms</div>
            <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Trace Latency</div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN FEED */}
      <div className="flex-1 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-300">
        <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest">
              {logsLoading ? 'STREAM_INITIALIZING...' : 'Live Ingestion Buffer'}
            </span>
          </div>
          <div className="flex gap-2">
             <span className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-[9px] font-mono text-zinc-500 font-bold uppercase">FILTER: {searchQuery || 'NULL'}</span>
          </div>
        </div>

        <div className="flex-1 p-0 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
            <TelemetryFeed 
              scrollable={false}
              logs={logs || []} 
              filter={searchQuery} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}