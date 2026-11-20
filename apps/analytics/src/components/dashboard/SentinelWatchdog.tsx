'use client';

import React from 'react';
import { useSentinel } from '@/hooks/useTelemetry';
import { Panel, PanelBody } from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SentinelWatchdog() {
  const { data: health, isLoading } = useSentinel();

  const status = health?.summary?.overall_status || 'NOMINAL';
  const alerts = health?.alerts || [];

  const panelStatus = status === 'CRITICAL' ? 'alert' : status === 'WARNING' ? 'live' : 'idle';
  const statusMark = status === 'CRITICAL' ? '▲' : status === 'WARNING' ? '◆' : 'OK';
  const statusTone =
    status === 'CRITICAL' ? 'text-alert' : status === 'WARNING' ? 'text-warning' : 'text-success';

  return (
    <Panel label="SENTINEL_WATCHDOG_V1" status={panelStatus} className="flex flex-col">
      <PanelBody className="flex flex-1 flex-col gap-4">
        <div className={cn('micro-label flex items-center gap-2', statusTone)}>
          <span aria-hidden>{statusMark}</span>
          {status === 'NOMINAL' ? 'System_Nominal' : `${status}_INTERRUPT`}
        </div>

        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="micro-label text-muted-foreground"
            >
              No threshold violations detected within the current audit horizon.
            </motion.p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert: any) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'border-l-2 bg-state px-3 py-2',
                    alert.level === 'CRITICAL' ? 'border-alert' : 'border-warning',
                  )}
                >
                  <div
                    className={cn(
                      'micro-label flex items-center gap-2',
                      alert.level === 'CRITICAL' ? 'text-alert' : 'text-warning',
                    )}
                  >
                    <span aria-hidden>{alert.level === 'CRITICAL' ? '▲' : '◆'}</span>
                    {alert.metric}
                  </div>
                  <div className="mt-1 font-mono text-xs text-foreground">
                    Violation: {alert.value} / Limit: {alert.threshold}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <dl className="mt-auto space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <dt className="micro-label text-muted-foreground">Active_Alerts</dt>
            <dd className="tabular-nums">{alerts.length}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="micro-label text-muted-foreground">Pulse_Interval</dt>
            <dd className="tabular-nums">15s</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="micro-label text-muted-foreground">Evaluation</dt>
            <dd>{isLoading ? 'recalibrating' : 'real-time'}</dd>
          </div>
        </dl>
      </PanelBody>
    </Panel>
  );
}
