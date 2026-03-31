'use client';

import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, Activity, Globe, Zap, Terminal } from '@aazucena/icons';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PublicStatusPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health/public')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const overall = data?.system?.overall || 'UNKNOWN';
  const isHealthy = overall === 'OPERATIONAL';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-primary-500/30">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-2xl">
            <Shield size={32} className="text-primary-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
            SYSTEM_INTEGRITY_LAB
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] font-bold">
            Aldrin Azucena // Real-time Node Status
          </p>
        </div>

        {/* OVERALL STATUS CARD */}
        <div
          className={cn(
            'p-10 rounded-[3rem] border transition-all duration-700 mb-10',
            loading
              ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 animate-pulse'
              : isHealthy
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]'
                : 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.05)]',
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                'text-5xl font-black tracking-[ -0.05em] uppercase mb-4',
                isHealthy ? 'text-emerald-500' : 'text-rose-500',
              )}
            >
              {loading ? 'SYNCING...' : data?.system?.label}
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]',
                  isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500',
                )}
              />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                Live Audit Horizon: 15m
              </span>
            </div>
          </div>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 animate-pulse"
                  />
                ))
            : Object.entries(data?.services || {}).map(([name, svc]: [string, any]) => (
                <div
                  key={name}
                  className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-primary-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-2xl flex items-center justify-center transition-colors',
                        svc.status === 'UP'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500',
                      )}
                    >
                      {name.includes('db') ? (
                        <Activity size={20} />
                      ) : name.includes('intel') ? (
                        <Terminal size={20} />
                      ) : (
                        <Globe size={20} />
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">
                        {name}
                      </div>
                      <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">
                        {svc.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black uppercase text-zinc-500 mb-0.5 tracking-tighter">
                      LATENCY
                    </div>
                    <div className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                      {svc.latency}ms
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* FOOTER METRICS */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-zinc-400" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest">
              Uptime: 99.9%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-zinc-400" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest">
              SLA: Guaranteed
            </span>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-[9px] font-black uppercase text-zinc-400 hover:text-primary-500 transition-colors tracking-[0.2em]"
          >
            ← Back to Intelligence Terminal
          </a>
        </div>
      </div>
    </div>
  );
}
