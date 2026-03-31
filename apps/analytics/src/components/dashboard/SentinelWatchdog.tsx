'use client';

import React from 'react';
import { useSentinel } from '@/hooks/useTelemetry';
import { Shield, DangerTriangle, XCircle, CheckCircle, Info } from '@aazucena/icons';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SentinelWatchdog() {
  const { data: health, isLoading } = useSentinel();

  const status = health?.summary?.overall_status || 'NOMINAL';
  const alerts = health?.alerts || [];

  return (
    <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-lg transition-all duration-500">
      {/* STATUS HEADER */}
      <div
        className={cn(
          'px-8 py-6 flex items-center justify-between border-b transition-colors duration-500',
          status === 'CRITICAL'
            ? 'bg-rose-500/10 border-rose-500/20'
            : status === 'WARNING'
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20',
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500',
              status === 'CRITICAL'
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                : status === 'WARNING'
                  ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]',
            )}
          >
            {status === 'CRITICAL' ? (
              <XCircle size={24} />
            ) : status === 'WARNING' ? (
              <DangerTriangle size={24} />
            ) : (
              <Shield size={24} />
            )}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">
              Sentinel_Watchdog_v1
            </div>
            <div
              className={cn(
                'text-xl font-black tracking-tighter uppercase',
                status === 'CRITICAL'
                  ? 'text-rose-500'
                  : status === 'WARNING'
                    ? 'text-amber-500'
                    : 'text-emerald-500',
              )}
            >
              {status === 'NOMINAL' ? 'System_Nominal' : `${status}_INTERRUPT`}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
              Active_Alerts
            </span>
            <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {alerts.length}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
              Neural_State
            </span>
            <span className="text-sm font-mono font-bold text-emerald-500 uppercase">ONLINE</span>
          </div>
        </div>
      </div>

      {/* ALERT FEED */}
      <div className="p-6">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 flex flex-col items-center text-center gap-3"
            >
              <CheckCircle size={32} className="text-zinc-200 dark:text-zinc-800" />
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] max-w-[200px]">
                No threshold violations detected within the current audit horizon.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert: any) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    'p-4 rounded-2xl border flex items-center justify-between group transition-all',
                    alert.level === 'CRITICAL'
                      ? 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30'
                      : 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30',
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        alert.level === 'CRITICAL'
                          ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                          : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
                      )}
                    />
                    <div>
                      <div className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {alert.metric}
                      </div>
                      <div className="text-[9px] text-zinc-500 uppercase mt-0.5">
                        Violation:{' '}
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          {alert.value}
                        </span>{' '}
                        / Limit: {alert.threshold}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[8px] font-black uppercase text-zinc-500 hover:text-primary-500">
                      Audit_Logs
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info size={12} className="text-zinc-400" />
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
            {isLoading ? 'Recalibrating_Thresholds...' : 'Real-time health evaluation active.'}
          </span>
        </div>
        <div className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
          PULSE_INTERVAL: 15S
        </div>
      </div>
    </div>
  );
}
