'use client';

import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setCategoryPreset } from '@/store';
import type { GenericTimeSeriesStep } from '@aazucena/types';

// 1. Core Layout Components
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { SentinelWatchdog } from '@/components/dashboard/SentinelWatchdog';
import { MetricCard } from '@/components/widgets/MetricCard';
import { TelemetryFeed } from '@/components/logs/TelemetryFeed';

// 2. D3 Visualizations — from @aazucena/visualizations
import { Heatmap, StreamGraph } from '@aazucena/visualizations';
import { Panel, PanelBody } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';
import { StateNote } from '@/components/common/StateNote';

// 4. Telemetry Hooks
import { useSystemSummary, useTrendAnalysis, useTelemetryStream } from '@/hooks/useTelemetry';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { searchQuery, visibleCategories } = useSelector(
    (state: RootState) => state.dashboard.filters,
  );

  // Initialize Hooks
  const { data: summary, error: summaryError } = useSystemSummary();
  const { data: trends, isLoading: trendsLoading, error: trendsError } = useTrendAnalysis();
  const { data: logs, isLoading: logsLoading, error: logsError } = useTelemetryStream();
  const kpi = (value: string | undefined) => (summaryError ? '—' : value || '0');

  useEffect(() => {
    dispatch(setCategoryPreset('OVERVIEW'));
  }, [dispatch]);

  const categories = ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'];

  // Filter stream by visibleCategories — package StreamGraph is framework-agnostic (no Redux reads)
  const filteredStream = useMemo((): GenericTimeSeriesStep[] => {
    const stream = (trends?.stream as GenericTimeSeriesStep[] | undefined) ?? [];
    if (!visibleCategories?.length) return stream;
    return stream.map((step) => ({
      ...step,
      values: Object.fromEntries(
        Object.entries(step.values).filter(([k]) => visibleCategories.includes(k)),
      ),
    }));
  }, [trends?.stream, visibleCategories]);

  return (
    <>
      <PageHeader
        title="AZUCENA_LYTICS_v1"
        meta="Systems Telemetry & Engineering Intelligence Terminal"
      />

      <DashboardFilters categories={categories} />

      {summaryError && (
        <StateNote kind="fault">System summary unavailable. The fetch failed.</StateNote>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-1 divide-y divide-rule overflow-hidden rounded-card border border-rule bg-panel md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
        <MetricCard
          className="rounded-none border-0"
          label="Unique Entities"
          value={kpi(summary?.visitors?.toLocaleString())}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Signal Streams"
          value={kpi(summary?.music_plays?.toLocaleString())}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Core Integrity"
          value={summaryError ? '—' : summary?.api_health || '—'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Total Errors"
          value={kpi(summary?.errors?.toLocaleString())}
          description="EXCEPTION_TRACE_ACTIVE"
        />
      </div>

      {/* Row visuals */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          label="VELOCITY_DYNAMICS // TIME_SERIES_INFERENCE"
          status={trendsLoading ? 'idle' : 'live'}
        >
          <PanelBody className="p-0">
            {trendsError ? (
              <StateNote kind="fault">Trend data unavailable. The fetch failed.</StateNote>
            ) : (
              <StreamGraph data={filteredStream} height={250} hideHeader />
            )}
          </PanelBody>
        </Panel>

        <Panel label="INTERACTION_DENSITY // HORIZON: 120_MONTH_AUDIT">
          <PanelBody className="p-0">
            {trendsError ? (
              <StateNote kind="fault">Trend data unavailable. The fetch failed.</StateNote>
            ) : (
              <Heatmap data={(trends?.heatmap as any) || []} height={200} hideHeader />
            )}
          </PanelBody>
        </Panel>
      </div>

      {/* Row feed */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel label="RAW TELEMETRY LOGS" status={logsLoading ? 'idle' : 'live'}>
          <PanelBody>
            {logsError ? (
              <StateNote kind="fault">Telemetry feed unavailable. The fetch failed.</StateNote>
            ) : (
              <TelemetryFeed logs={logs || []} filter={searchQuery} />
            )}
          </PanelBody>
        </Panel>

        <SentinelWatchdog />
      </div>
    </>
  );
}
