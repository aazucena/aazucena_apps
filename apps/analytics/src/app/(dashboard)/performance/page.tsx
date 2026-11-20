'use client';

import React, { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { setCategoryPreset } from '@/store';
import { Badge, Panel, PanelBody, PanelHeader } from '@aazucena/ui';
import { StreamGraph } from '@aazucena/visualizations';
import type { GenericTimeSeriesStep } from '@aazucena/types';
import { ExternalLink } from '@aazucena/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { usePerformanceStats } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';

type Band = 'good' | 'needs' | 'poor';

interface Vital {
  key: string;
  label: string;
  /** Good / poor thresholds in the metric's own unit. */
  good: number;
  poor: number;
  /** Text for the threshold legend. */
  legend: string;
  /** True when the value is not a P75, so the bands need a caveat. */
  note?: boolean;
  format: (n: number) => string;
}

const VITALS: Vital[] = [
  {
    key: 'LCP',
    label: 'LCP (P75)',
    good: 2500,
    poor: 4000,
    legend: 'GOOD ≤ 2.5 · POOR > 4',
    format: (n) => `${(n / 1000).toFixed(1)}s`,
  },
  {
    key: 'INP',
    note: true,
    label: 'INP (LATEST)',
    good: 200,
    poor: 500,
    legend: 'GOOD ≤ 200 · POOR > 500',
    format: (n) => `${Math.round(n)}ms`,
  },
  {
    key: 'CLS',
    note: true,
    label: 'CLS (AVG)',
    good: 0.1,
    poor: 0.25,
    legend: 'GOOD ≤ 0.1 · POOR > 0.25',
    format: (n) => n.toFixed(2),
  },
];

const bandOf = (v: Vital, n: number): Band =>
  n <= v.good ? 'good' : n <= v.poor ? 'needs' : 'poor';

const BAND_COPY: Record<Band, { text: string; tone: string }> = {
  good: { text: 'GOOD', tone: 'text-success' },
  needs: { text: '◆ NEEDS WORK', tone: 'text-warning' },
  poor: { text: '▲ POOR', tone: 'text-alert' },
};

/** Sparkline over three threshold bands: good (bottom), needs work, poor (top). */
function BandChart({ vital, points }: { vital: Vital; points: number[] }) {
  const W = 300;
  const H = 80;
  const max = vital.poor * 1.5;
  const y = (n: number) => H - Math.min(n / max, 1) * H;
  const yGood = y(vital.good);
  const yPoor = y(vital.poor);
  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${((i / Math.max(points.length - 1, 1)) * W).toFixed(1)},${y(p).toFixed(1)}`,
    )
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${vital.key} trend over the good, needs-work and poor bands`}
      className="h-20 w-full"
    >
      <rect x="0" y="0" width={W} height={yPoor} className="fill-alert/10" />
      <rect x="0" y={yPoor} width={W} height={yGood - yPoor} className="fill-warning/10" />
      <rect x="0" y={yGood} width={W} height={H - yGood} className="fill-success/10" />
      <line x1="0" x2={W} y1={yPoor} y2={yPoor} className="stroke-rule" strokeWidth="1" />
      <line x1="0" x2={W} y1={yGood} y2={yGood} className="stroke-rule" strokeWidth="1" />
      {points.length > 1 && (
        <path
          d={path}
          fill="none"
          className="stroke-signal"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

const levelMarker = (level: string) =>
  level === 'fatal' || level === 'error'
    ? { glyph: '▲', tone: 'text-alert' }
    : level === 'warning'
      ? { glyph: '◆', tone: 'text-warning' }
      : { glyph: '●', tone: 'text-signal' };

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

  const seriesFor = (key: string): number[] =>
    ((stats?.history as { date: string; value: number; metric: string }[] | undefined) ?? [])
      .filter((d) => d.metric?.toUpperCase() === key)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .map((d) => d.value ?? 0);

  const summaryValue = (key: string): number | undefined => {
    if (key === 'LCP') return stats?.summary?.lcp_p75 || undefined;
    if (key === 'CLS') return stats?.summary?.cls_avg ?? undefined;
    const s = seriesFor(key);
    return s.length ? s[s.length - 1] : undefined;
  };

  const totalErrors = stats?.errors?.summary?.total_errors || 0;
  const fatalErrors = stats?.errors?.summary?.fatal_errors || 0;
  const topErrors = stats?.errors?.top ?? [];

  const services = useMemo(() => {
    const unique: Record<string, any> = {};
    (stats?.integrity ?? []).forEach((current: any) => {
      if (!unique[current.service]) unique[current.service] = current;
    });
    return Object.values(unique);
  }, [stats]);
  const upCount = services.filter((s: any) => s.status === 'UP').length;

  return (
    <>
      <PageHeader
        title="SYSTEM_INTEGRITY"
        meta="Real-time Infrastructure & Experience Monitoring"
        actions={
          <Badge variant="cyber" animated>
            LIVE_STREAM_ACTIVE
          </Badge>
        }
      />

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {VITALS.map((v) => {
          const value = summaryValue(v.key);
          const band = value === undefined ? undefined : bandOf(v, value);
          return (
            <Panel key={v.key} label={v.label} status={isLoading ? 'idle' : 'none'}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-4xl font-light tabular-nums">
                  {value === undefined ? '—' : v.format(value)}
                </span>
                {band && (
                  <span className={cn('micro-label', BAND_COPY[band].tone)}>
                    {BAND_COPY[band].text}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <BandChart vital={v} points={seriesFor(v.key)} />
              </div>
              <div className="micro-label mt-2 text-muted-foreground">{v.legend}</div>
              {v.note && (
                <div className="micro-label text-muted-foreground">
                  Banded against P75 thresholds.
                </div>
              )}
            </Panel>
          );
        })}
      </div>

      {/* Traces and heartbeats */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Panel status={totalErrors > 0 ? 'alert' : 'none'}>
          <PanelHeader label="ERROR_TRACES // 24H">
            <span className="micro-label text-muted-foreground">
              {totalErrors > 0 ? `▲ ${totalErrors}` : totalErrors} · FATAL {fatalErrors}
            </span>
          </PanelHeader>
          <div>
            {topErrors.length > 0 ? (
              <ul className="divide-y divide-rule">
                {topErrors.map((error, idx) => {
                  const m = levelMarker(error.level);
                  return (
                    <li
                      key={error.issue_id || idx}
                      className="flex items-start gap-3 px-panel py-3"
                    >
                      <span aria-hidden className={cn('mt-0.5 text-xs', m.tone)}>
                        {m.glyph}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs break-words">{error.message}</p>
                        <p className="micro-label mt-1 truncate text-muted-foreground">
                          <span className="sr-only">{error.level}: </span>
                          {error.culprit || 'unknown culprit'}
                        </p>
                        {error.sentry_url && (
                          <Link
                            href={error.sentry_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="micro-label mt-1 inline-flex items-center gap-1 text-signal hover:underline"
                          >
                            View in Sentry <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                      <span className="micro-label text-muted-foreground">×{error.count}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="micro-label px-panel py-8 text-center text-muted-foreground">
                No error traces detected. System nominal.
              </p>
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader label="SERVICE HEARTBEATS">
            <span className="micro-label text-muted-foreground">
              {services.length ? `${upCount} / ${services.length} OK` : '—'}
            </span>
          </PanelHeader>
          <PanelBody>
            {services.length === 0 ? (
              <p className="micro-label py-8 text-center text-muted-foreground">
                No heartbeat signals detected...
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((item: any, idx: number) => {
                  const state =
                    item.status === 'UP'
                      ? {
                          text: 'HTTP_OK',
                          tone: 'text-success',
                          line: 'bg-signal',
                          tile: 'border-rule',
                        }
                      : item.status === 'DEGRADED'
                        ? {
                            text: '◆ SLOW',
                            tone: 'text-warning',
                            line: 'bg-warning',
                            tile: 'border-warning',
                          }
                        : {
                            text: '▲ DOWN',
                            tone: 'text-alert',
                            line: 'bg-alert',
                            tile: 'border-alert',
                          };
                  return (
                    <div
                      key={item.service || idx}
                      className={cn(
                        'flex flex-col gap-3 rounded-control border bg-state p-3',
                        state.tile,
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="micro-label truncate">
                          {String(item.service).replace(/-/g, '_').toUpperCase()}
                        </span>
                        <span className={cn('micro-label shrink-0', state.tone)}>{state.text}</span>
                      </div>
                      <div aria-hidden className={cn('h-px w-full', state.line)} />
                      <div className="micro-label flex items-center justify-between text-muted-foreground">
                        <span>{item.latency_ms}ms</span>
                        <span>
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </PanelBody>
        </Panel>
      </div>

      {/* Vitals velocity */}
      <Panel>
        <PanelHeader
          label="CORE_WEB_VITALS_VELOCITY // SOURCE: CLICKHOUSE_TELEMETRY"
          status={isLoading ? 'idle' : 'none'}
        />
        <StreamGraph data={latencyData} height={300} hideHeader />
      </Panel>
    </>
  );
}
