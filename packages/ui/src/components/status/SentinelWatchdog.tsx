/**
 * SentinelWatchdog Component
 * Visual watchdog for system health and active alerts.
 */

import React from 'react';
import { useSentinel } from '@aazucena/hooks';
import { Shield, DangerTriangle, XCircle, CheckCircle, Info } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SentinelWatchdog() {
  const { data: health, isLoading } = useSentinel(true); // Default to live for watchdog

  const status = (health as any)?.summary?.overall_status || 'NOMINAL';
  const alerts = (health as any)?.alerts || [];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white/50 shadow-lg backdrop-blur-md transition-all duration-500 dark:border-zinc-800 dark:bg-zinc-900/30">
      {/* STATUS HEADER */}
      <div
        className={cn(
          'flex items-center justify-between border-b px-8 py-6 transition-colors duration-500',
          status === 'CRITICAL'
            ? 'border-rose-500/20 bg-rose-500/10'
            : status === 'WARNING'
              ? 'border-amber-500/20 bg-amber-500/10'
              : 'border-emerald-500/20 bg-emerald-500/10',
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500',
              status === 'CRITICAL'
                ? 'animate-pulse bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
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
            <div className="mb-1 text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
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

        <div className="hidden items-center gap-6 md:flex">
          <div className="col flex flex-col items-end">
            <span className="text-[8px] font-black tracking-widest text-zinc-400 uppercase">
              Active_Alerts
            </span>
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {alerts.length}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black tracking-widest text-zinc-400 uppercase">
              Neural_State
            </span>
            <span className="font-mono text-sm font-bold text-emerald-500 uppercase">ONLINE</span>
          </div>
        </div>
      </div>

      {/* ALERT FEED */}
      <div className="min-h-[200px] p-6">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <CheckCircle size={32} className="text-zinc-200 dark:text-zinc-800" />
              <p className="max-w-[200px] font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
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
                    'group flex items-center justify-between rounded-2xl border p-4 transition-all',
                    alert.level === 'CRITICAL'
                      ? 'border-rose-500/10 bg-rose-500/5 hover:border-rose-500/30'
                      : 'border-amber-500/10 bg-amber-500/5 hover:border-amber-500/30',
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        alert.level === 'CRITICAL'
                          ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                          : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
                      )}
                    />
                    <div>
                      <div className="font-mono text-[10px] font-black tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
                        {alert.metric}
                      </div>
                      <div className="mt-0.5 text-[9px] text-zinc-500 uppercase">
                        Violation:{' '}
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          {alert.value}
                        </span>{' '}
                        / Limit: {alert.threshold}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-8 py-4 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <Info size={12} className="text-zinc-400" />
          <span className="font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
            {isLoading ? 'Recalibrating_Thresholds...' : 'Real-time health evaluation active.'}
          </span>
        </div>
        <div className="text-[8px] font-black tracking-tighter text-zinc-400 uppercase">
          PULSE_INTERVAL: 15S
        </div>
      </div>
    </div>
  );
}
