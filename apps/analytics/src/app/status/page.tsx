'use client';

import React, { useEffect, useState } from 'react';
import { Shield } from '@aazucena/icons';
import { Panel, Skeleton } from '@aazucena/ui';
import { cn } from '@/lib/utils';

// Map raw service names (from system_integrity table) to human-readable display names.
// Add entries here whenever a service name in the DB doesn't match what you want shown.
const SERVICE_DISPLAY_NAMES: Record<string, string> = {
  // ClickHouse — main analytics OLAP database
  clickhouse: 'Analytics DB',
  'clickhouse-olap': 'ClickHouse OLAP',
};

function getDisplayName(name: string): string {
  return SERVICE_DISPLAY_NAMES[name] ?? name;
}

const DAYS = 90;

type Tone = 'ok' | 'warn' | 'alert';

const toneOf = (status: string): Tone =>
  status === 'UP' ? 'ok' : status === 'DEGRADED' ? 'warn' : 'alert';

const TONE_CELL: Record<Tone, string> = { ok: 'bg-success', warn: 'bg-warning', alert: 'bg-alert' };
const TONE_LABEL: Record<Tone, { text: string; cls: string }> = {
  ok: { text: 'OK OPERATIONAL', cls: 'text-success' },
  warn: { text: '◆ DEGRADED', cls: 'text-warning' },
  alert: { text: '▲ DOWN', cls: 'text-alert' },
};

/**
 * One cell per day for 90 days. The health endpoint reports only the current state,
 * so earlier days stay empty (`bg-state`) and today's cell carries the live status.
 */
function UptimeBar({ name, tone }: { name: string; tone: Tone }) {
  const summary = `${name}: ${
    tone === 'ok' ? 'operational' : tone === 'warn' ? 'degraded' : 'down'
  } today, no earlier history recorded`;
  return (
    <div role="img" aria-label={summary} className="flex h-6 w-full min-w-0 gap-px">
      {Array.from({ length: DAYS }, (_, d) => {
        const today = d === DAYS - 1;
        return (
          <span
            key={d}
            title={today ? `Today: ${tone}` : `${DAYS - 1 - d} days ago: no data`}
            className={cn('h-full min-w-0 flex-1', today ? TONE_CELL[tone] : 'bg-state')}
          />
        );
      })}
    </div>
  );
}

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
  const entries = Object.entries(data?.services || {}) as [string, any][];
  const total = entries.length;
  const upCount = entries.filter(([, svc]) => svc.status === 'UP').length;
  const notUp = total - upCount;
  const degradedCount = entries.filter(([, svc]) => svc.status === 'DEGRADED').length;
  const downCount = notUp - degradedCount;
  // Partial degradation is a warning; nothing up (or no data at all) is an alert.
  const bannerTone: Tone = isHealthy ? 'ok' : upCount > 0 ? 'warn' : 'alert';

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="micro-label flex h-14 items-center justify-between border-b border-rule px-6">
        <span>
          STATUS.AZUCENA <span className="text-muted-foreground">// PUBLIC</span>
        </span>
        {!loading && total > 0 && (
          <span>
            {downCount > 0 && <span className="text-alert">▲ {downCount} DOWN</span>}
            {downCount > 0 && degradedCount > 0 && ' · '}
            {degradedCount > 0 && <span className="text-warning">◆ {degradedCount} DEGRADED</span>}
            {notUp === 0 && <span className="text-success">OK</span>}
          </span>
        )}
      </div>

      <main className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-signal text-signal-foreground">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight">SYSTEM_INTEGRITY_LAB</h1>
              <p className="text-sm text-muted-foreground">
                Aldrin Azucena // Real-time Node Status
              </p>
            </div>
          </div>
          <span className="micro-label text-muted-foreground">Live Audit Horizon: 15M</span>
        </div>

        {/* Overall banner */}
        <Panel
          status={bannerTone === 'alert' && !loading ? 'alert' : 'none'}
          role="status"
          className={cn(
            'border px-5 py-4',
            loading || bannerTone === 'alert'
              ? 'border-rule'
              : bannerTone === 'ok'
                ? 'border-success'
                : 'border-warning',
          )}
        >
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className={cn(
                    'text-2xl leading-none',
                    bannerTone === 'ok' && 'text-success',
                    bannerTone === 'warn' && 'text-warning',
                    bannerTone === 'alert' && 'text-alert',
                  )}
                >
                  {bannerTone === 'ok' ? 'OK' : bannerTone === 'warn' ? '◆' : '▲'}
                </span>
                <div>
                  <div className="font-medium">{data?.system?.label || 'STATUS UNKNOWN'}</div>
                  <div className="text-sm text-muted-foreground">
                    {total
                      ? `${upCount} of ${total} nodes operational.`
                      : 'No service data reported.'}
                  </div>
                </div>
              </div>
              <span className="micro-label text-muted-foreground">UPTIME — · 30D</span>
            </div>
          )}
        </Panel>

        {/* Services */}
        <Panel className="overflow-hidden">
          <div className="micro-label grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_4rem_8rem] items-center gap-4 border-b border-rule bg-state px-5 py-2.5 text-muted-foreground sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_4rem_9rem]">
            <span>SERVICE</span>
            <span>LAST 90 DAYS</span>
            <span className="text-right">LATENCY</span>
            <span className="text-right">STATUS</span>
          </div>
          {loading ? (
            <div className="flex flex-col gap-3 p-5">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : total === 0 ? (
            <p className="micro-label p-8 text-center text-muted-foreground">
              No service data in the last 15 minutes
            </p>
          ) : (
            <ul className="divide-y divide-rule">
              {entries.map(([name, svc]) => {
                const tone = toneOf(svc.status);
                return (
                  <li
                    key={name}
                    className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_4rem_8rem] items-center gap-4 px-5 py-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_4rem_9rem]"
                  >
                    <span className="truncate text-sm font-medium">{getDisplayName(name)}</span>
                    <UptimeBar name={getDisplayName(name)} tone={tone} />
                    <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {svc.latency}ms
                    </span>
                    <span className={cn('micro-label text-right', TONE_LABEL[tone].cls)}>
                      {TONE_LABEL[tone].text}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="micro-label flex flex-wrap items-center justify-between gap-3 text-muted-foreground">
          <span>90 DAYS AGO</span>
          <span className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 bg-success" /> OK OPERATIONAL
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 bg-warning" /> ◆ DEGRADED
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 bg-alert" /> ▲ OUTAGE
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 bg-state" /> NO HISTORY YET
            </span>
          </span>
          <span>TODAY</span>
        </div>

        <div className="text-center">
          <a href="/" className="micro-label text-muted-foreground hover:text-signal">
            ← Back to Intelligence Terminal
          </a>
        </div>
      </main>
    </div>
  );
}
