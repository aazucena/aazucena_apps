'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setCategoryPreset } from '@/store';
import { Button, Input, Panel, PanelHeader, ToggleGroup, ToggleGroupItem } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';
import { MetricCard } from '@/components/widgets/MetricCard';
import { TelemetryFeed, type LogEntry } from '@/components/logs/TelemetryFeed';
import { useTelemetryStream, useSystemSummary } from '@/hooks/useTelemetry';

type Level = 'all' | 'info' | 'warn' | 'error';

/** Same mapping as the feed's markers: Error is alert, Form Submit is warning, the rest info. */
const levelOf = (log: LogEntry): Exclude<Level, 'all'> =>
  log.event === 'Error' ? 'error' : log.event === 'Form Submit' ? 'warn' : 'info';

export default function LogsPage() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.dashboard.filters.searchQuery);
  const [level, setLevel] = useState<Level>('all');
  const [query, setQuery] = useState('');
  // Pausing freezes a snapshot of the buffer; resuming drops it.
  const [frozen, setFrozen] = useState<LogEntry[] | null>(null);
  const paused = frozen !== null;

  // Initialize Hooks
  const { data: logs, isLoading: logsLoading } = useTelemetryStream();
  const { data: summary } = useSystemSummary();

  useEffect(() => {
    dispatch(setCategoryPreset('LOGS'));
  }, [dispatch]);

  const live: LogEntry[] = logs || [];
  const buffer = frozen ?? live;
  const shown = level === 'all' ? buffer : buffer.filter((l) => levelOf(l) === level);
  const errors = buffer.filter((l) => levelOf(l) === 'error').length;
  const warns = buffer.filter((l) => levelOf(l) === 'warn').length;

  return (
    <>
      <PageHeader
        title="TELEMETRY_STREAM"
        meta="Live Event Ingestion & Error Trace"
        actions={
          <div className="grid grid-cols-2 divide-x divide-rule overflow-hidden rounded-card border border-rule bg-panel sm:grid-cols-4">
            <MetricCard
              className="rounded-none border-0 px-4 py-1"
              label="Total Signals"
              value={summary?.total_signals?.toLocaleString() || '0'}
            />
            <MetricCard
              className="rounded-none border-0 px-4 py-1"
              label="Active Sessions"
              value={summary?.visitors?.toLocaleString() || '0'}
            />
            <MetricCard
              className="rounded-none border-0 px-4 py-1"
              label="Global Regions"
              value="—"
            />
            <MetricCard
              className="rounded-none border-0 px-4 py-1"
              label="Trace Latency"
              value="—"
            />
          </div>
        }
      />

      {/* Full-height console */}
      <Panel className="h-[calc(100dvh-11rem)] min-h-[420px] overflow-hidden">
        <PanelHeader
          label="LIVE INGESTION BUFFER"
          status={logsLoading ? 'idle' : paused ? 'idle' : 'live'}
        />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-3 border-b border-rule px-panel py-3">
            <ToggleGroup
              type="single"
              value={level}
              onValueChange={(v) => v && setLevel(v as Level)}
              aria-label="Log level"
              className="border-rule bg-panel gap-0 border p-0.5"
            >
              <ToggleGroupItem
                value="all"
                aria-label="All levels"
                className="font-mono text-[10px] tracking-[0.2em] uppercase font-normal text-muted-foreground data-[state=on]:bg-signal data-[state=on]:text-signal-foreground"
              >
                ALL
              </ToggleGroupItem>
              <ToggleGroupItem
                value="info"
                aria-label="Info only"
                className="font-mono text-[10px] tracking-[0.2em] uppercase font-normal text-muted-foreground data-[state=on]:bg-state data-[state=on]:text-foreground"
              >
                <span aria-hidden className="text-signal">
                  ●
                </span>{' '}
                INFO
              </ToggleGroupItem>
              <ToggleGroupItem
                value="warn"
                aria-label="Warnings only"
                className="font-mono text-[10px] tracking-[0.2em] uppercase font-normal text-muted-foreground data-[state=on]:bg-state data-[state=on]:text-foreground"
              >
                <span aria-hidden className="text-warning">
                  ◆
                </span>{' '}
                WARN
              </ToggleGroupItem>
              <ToggleGroupItem
                value="error"
                aria-label="Errors only"
                className="font-mono text-[10px] tracking-[0.2em] uppercase font-normal text-muted-foreground data-[state=on]:bg-state data-[state=on]:text-foreground"
              >
                <span aria-hidden className="text-alert">
                  ▲
                </span>{' '}
                ERROR
              </ToggleGroupItem>
            </ToggleGroup>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by event or session…"
              aria-label="Filter log events"
              className="min-w-48 flex-1"
            />
            <Button variant="outline" size="sm" onClick={() => setFrozen(paused ? null : live)}>
              {paused ? 'Resume stream' : 'Pause stream'}
            </Button>
          </div>

          <div className="micro-label grid grid-cols-[4.5rem_1rem_minmax(0,8rem)_minmax(0,1fr)_auto] gap-3 border-b border-rule bg-state px-panel py-2 text-muted-foreground">
            <span>TIME</span>
            <span aria-hidden />
            <span>EVENT</span>
            <span>URL</span>
            <span>SESSION</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-panel">
            <TelemetryFeed scrollable={false} logs={shown} filter={query || searchQuery} />
          </div>

          <div className="micro-label flex items-center justify-between gap-3 border-t border-rule px-panel py-2 text-muted-foreground">
            <span className={paused ? undefined : 'text-signal'}>
              {paused ? 'PAUSED' : '● STREAMING'} · {shown.length} OF {buffer.length}
            </span>
            <span>
              <span className="text-alert">▲</span> {errors} ·{' '}
              <span className="text-warning">◆</span> {warns}
            </span>
          </div>
        </div>
      </Panel>
    </>
  );
}
