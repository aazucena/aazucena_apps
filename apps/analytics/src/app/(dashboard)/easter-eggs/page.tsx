'use client';

import React, { useEffect } from 'react';
import { StateNote } from '@/components/common/StateNote';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { Panel, PanelBody, PanelHeader, Button } from '@aazucena/ui';
import { categorical } from '@aazucena/visualizations';
import { PageHeader } from '@/components/common/PageHeader';
import { RankBar } from '@/components/common/RankBar';
import { StackedColumns } from '@/components/common/StackedColumns';
import { MetricCard } from '@/components/widgets/MetricCard';
import { useEasterEggs } from '@/hooks/useEasterEggs';

// ─── Constants ───────────────────────────────────────────────────────────────

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

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EasterEggsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch, isFetching } = useEasterEggs();

  useEffect(() => {
    dispatch(setCategoryPreset('SYSTEM'));
  }, [dispatch]);

  const stats = data?.data;
  const eggs = stats?.byEgg ?? [];
  const triggers = stats?.byTrigger ?? [];
  const trend = stats?.trend ?? [];
  const recent = stats?.recent ?? [];
  const maxEggCount = Math.max(...eggs.map((e) => e.completions), 1);
  const maxTrigger = Math.max(...triggers.map((t) => t.completions), 1);
  const topTrigger = triggers[0];
  const dash = (v: string) => (isLoading ? '—' : v);

  const header = (
    <PageHeader
      title="EASTER_EGGS"
      meta="Hidden Feature Unlock Intelligence & Trigger Analytics"
      actions={
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'SYNCING' : 'SYNC'}
        </Button>
      }
    />
  );

  if (error) {
    return (
      <>
        {header}
        <StateNote kind="fault">Easter egg feed offline. The stats fetch failed.</StateNote>
      </>
    );
  }

  return (
    <>
      {header}

      <div className="divide-rule border-rule bg-panel grid grid-cols-1 divide-y overflow-hidden rounded-card border md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
        <MetricCard
          className="rounded-none border-0"
          label="Total Unlocks"
          value={dash((stats?.summary?.total_completions ?? 0).toLocaleString())}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Unique Eggs"
          value={dash((stats?.summary?.unique_eggs ?? 0).toString())}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Avg Unlock Time"
          value={dash(formatMs(stats?.summary?.avg_completion_ms ?? 0))}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Top Trigger"
          value={dash(
            TRIGGER_LABELS[topTrigger?.trigger_type ?? ''] ?? topTrigger?.trigger_type ?? '—',
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          label={`EGG LEADERBOARD // COMPLETIONS${eggs.length ? ` // ${eggs.length} EGGS` : ''}`}
        >
          {isLoading ? (
            <StateNote kind="empty">Loading eggs…</StateNote>
          ) : eggs.length === 0 ? (
            <StateNote kind="empty">No eggs discovered yet.</StateNote>
          ) : (
            <div className="flex flex-col gap-3">
              {eggs.map((egg) => (
                <RankBar
                  key={egg.egg_id}
                  label={egg.egg_name}
                  hint={`${formatMs(egg.avg_ms)} avg unlock time`}
                  percent={(egg.completions / maxEggCount) * 100}
                  value={egg.completions.toLocaleString()}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel label={`BY TRIGGER${triggers.length ? ` // ${triggers.length} TYPES` : ''}`}>
          {isLoading ? (
            <StateNote kind="empty">Scanning…</StateNote>
          ) : triggers.length === 0 ? (
            <StateNote kind="empty">No trigger data.</StateNote>
          ) : (
            <div className="flex flex-col gap-3">
              {triggers.map((t, i) => (
                <RankBar
                  key={t.trigger_type}
                  label={TRIGGER_LABELS[t.trigger_type] ?? t.trigger_type}
                  color={categorical[i % categorical.length]}
                  percent={(t.completions / maxTrigger) * 100}
                  value={t.completions.toLocaleString()}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel label="30-DAY UNLOCK TREND // DAILY COMPLETIONS">
          {isLoading ? (
            <StateNote kind="empty">Loading trend…</StateNote>
          ) : trend.length === 0 ? (
            <StateNote kind="empty">No trend data.</StateNote>
          ) : (
            <>
              <StackedColumns
                height={220}
                summary={`Daily unlock completions from ${formatDay(trend[0]!.date)} to ${formatDay(
                  trend[trend.length - 1]!.date,
                )}`}
                data={trend.map((d) => ({
                  key: d.date,
                  label: formatDay(d.date),
                  segments: [{ name: 'Completions', value: d.completions }],
                }))}
              />
              <div className="micro-label text-muted-foreground flex justify-between pt-1">
                <span>{formatDay(trend[0]!.date)}</span>
                <span>{formatDay(trend[trend.length - 1]!.date)}</span>
              </div>
            </>
          )}
        </Panel>

        <div className="bg-panel rounded-card flex flex-col">
          <PanelHeader
            label={`RECENT UNLOCKS${recent.length ? ` // LAST ${recent.length}` : ''}`}
          />
          <PanelBody
            className="max-h-72 overflow-y-auto"
            tabIndex={0}
            role="region"
            aria-label="RECENT UNLOCKS"
          >
            {isLoading ? (
              <StateNote kind="empty">Loading feed…</StateNote>
            ) : recent.length === 0 ? (
              <StateNote kind="empty">No recent unlocks.</StateNote>
            ) : (
              <ul className="divide-rule flex flex-col divide-y">
                {recent.map((item, i) => (
                  <li
                    key={`${item.egg_id}-${item.timestamp}-${i}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">{item.egg_name}</p>
                      <p className="micro-label text-muted-foreground truncate">
                        {TRIGGER_LABELS[item.trigger_type] ?? item.trigger_type} //{' '}
                        {item.country || 'Unknown'} · {item.device_type || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-muted-foreground shrink-0 text-right font-mono text-xs tabular-nums">
                      <p>{formatWhen(item.timestamp)}</p>
                      <p>{formatMs(item.completion_time_ms)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PanelBody>
        </div>
      </div>
    </>
  );
}
