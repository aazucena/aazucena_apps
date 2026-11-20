'use client';

import React, { useMemo, useEffect, useState } from 'react';
import * as topojson from 'topojson-client';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { StreamGraph, ChoroplethMap, chartTheme } from '@aazucena/visualizations';
import { Panel, PanelBody, PanelHeader, Progress, Tabs, TabsList, TabsTrigger } from '@aazucena/ui';
import { PageHeader } from '@/components/common/PageHeader';
import { useTrafficStats } from '@/hooks/useTraffic';
import type { GenericTimeSeriesStep, MapRegion } from '@aazucena/types';

// Module-level singleton — parsed once per app lifetime, survives navigations
let cachedGeoJson: any = null;
let geoJsonPromise: Promise<any> | null = null;

function loadGeoJson(): Promise<any> {
  if (cachedGeoJson) return Promise.resolve(cachedGeoJson);
  if (geoJsonPromise) return geoJsonPromise;
  geoJsonPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then((r) => r.json())
    .then((topo) => {
      const geo = topojson.feature(topo, topo.objects.countries) as any;
      cachedGeoJson = {
        ...geo,
        features: geo.features.map((f: any) => ({ ...f, id: f.properties?.name ?? f.id })),
      };
      return cachedGeoJson;
    });
  return geoJsonPromise;
}

// Top countries by web traffic: ISO 2-letter → natural earth name
const ISO2_TO_NAME: Record<string, string> = {
  US: 'United States of America',
  GB: 'United Kingdom',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  AU: 'Australia',
  IN: 'India',
  BR: 'Brazil',
  MX: 'Mexico',
  NL: 'Netherlands',
  SE: 'Sweden',
  CH: 'Switzerland',
  SG: 'Singapore',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  NZ: 'New Zealand',
  IT: 'Italy',
  ES: 'Spain',
  PL: 'Poland',
  RU: 'Russia',
  CN: 'China',
  KR: 'South Korea',
  UA: 'Ukraine',
  IE: 'Ireland',
  PT: 'Portugal',
  AT: 'Austria',
  BE: 'Belgium',
  CZ: 'Czech Republic',
  AR: 'Argentina',
};

export default function TrafficPage() {
  const dispatch = useDispatch();
  const { data: stats, isLoading } = useTrafficStats();
  const [geoJson, setGeoJson] = useState<any>(null);
  const [metric, setMetric] = useState('visitors');

  useEffect(() => {
    dispatch(setCategoryPreset('SYSTEM'));
  }, [dispatch]);

  // Use module-level cache — fetch + parse runs only once per app lifetime
  useEffect(() => {
    loadGeoJson().then(setGeoJson);
  }, []);

  // Wide-format GenericTimeSeriesStep[] for StreamGraph
  const chartData = useMemo((): GenericTimeSeriesStep[] => {
    if (!stats?.trends) return [];
    return (stats.trends as any[]).map((d) => ({
      timestamp: new Date(d.date),
      values: {
        'Unique Visitors': d.visitors ?? 0,
        'Total Pageviews': d.pageviews ?? 0,
      },
    }));
  }, [stats]);

  const geo = useMemo(
    () =>
      ((stats?.geo as { country: string; visitors: number }[] | undefined) ?? [])
        .slice()
        .sort((a, b) => b.visitors - a.visitors),
    [stats],
  );
  const geoTotal = geo.reduce((n, g) => n + (g.visitors ?? 0), 0);
  const share = (n: number) => (geoTotal ? Math.round((n / geoTotal) * 100) : 0);
  const top = geo.slice(0, 4);
  const rest = geo.slice(4);
  const restTotal = rest.reduce((n, g) => n + (g.visitors ?? 0), 0);
  const topRegions = [
    ...top.map((g) => ({ name: g.country || 'Unknown', value: g.visitors })),
    ...(rest.length ? [{ name: `Other · ${rest.length}`, value: restTotal }] : []),
  ];
  const visitors = stats?.summary?.total_visitors ?? 0;
  const direct = stats?.summary?.direct_traffic ?? 0;

  // MapRegion[] for ChoroplethMap — match by country name via ISO2_TO_NAME lookup
  const mapData = useMemo((): MapRegion[] => {
    if (!stats?.geo) return [];
    return (stats.geo as any[]).map((d) => ({
      id: ISO2_TO_NAME[d.country] ?? d.country,
      value: d.visitors ?? 0,
      name: d.country,
    }));
  }, [stats]);

  const metricHasData = metric === 'visitors';

  return (
    <>
      <PageHeader title="TRAFFIC_CENTER" meta="Audience Engagement & Reach Intelligence" />

      {/* KPI strip */}
      <div className="grid grid-cols-1 divide-y divide-rule overflow-hidden rounded-card border border-rule bg-panel md:grid-cols-3 md:divide-y-0 lg:grid-cols-5 lg:divide-x">
        <MetricCard
          className="rounded-none border-0"
          label="Unique Visitors · 30D"
          value={stats?.summary?.total_visitors?.toLocaleString() || '0'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Total Pageviews · 30D"
          value={stats?.summary?.total_pageviews?.toLocaleString() || '0'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Direct Traffic"
          value={direct.toLocaleString()}
          description={
            visitors ? `${Math.round((direct / visitors) * 100)}% OF VISITORS` : undefined
          }
        />
        <MetricCard
          className="rounded-none border-0"
          label="Countries"
          value={geo.length ? String(geo.length) : '—'}
        />
        <MetricCard
          className="rounded-none border-0"
          label="Top Region"
          value={top[0] ? `${top[0].country} · ${share(top[0].visitors)}%` : '—'}
        />
      </div>

      {/* Hero map */}
      <Panel
        label="GEOSPATIAL_IDENTITY_MAP // 30D"
        status={stats ? 'live' : 'idle'}
        className="overflow-hidden"
      >
        <PanelBody className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Tabs value={metric} onValueChange={setMetric}>
              <TabsList aria-label="Map metric">
                <TabsTrigger value="visitors">VISITORS</TabsTrigger>
                <TabsTrigger value="pageviews">PAGEVIEWS</TabsTrigger>
                <TabsTrigger value="sessions">SESSIONS</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="micro-label flex items-center gap-2 text-muted-foreground">
              LOW
              {chartTheme.seq.map((c) => (
                <span key={c} aria-hidden className="h-2.5 w-5" style={{ backgroundColor: c }} />
              ))}
              HIGH
            </div>
          </div>
          {geoJson && (
            <ChoroplethMap
              data={metricHasData ? mapData : []}
              geoJson={geoJson}
              height={380}
              hideHeader
              unit="visitors"
              className="bg-transparent"
            />
          )}
          {!metricHasData && (
            <p className="micro-label text-muted-foreground">
              — {metric.toUpperCase()} BY REGION NOT INGESTED YET
            </p>
          )}
        </PanelBody>
      </Panel>

      {/* Top regions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {topRegions.map((r, idx) => (
          <Panel key={r.name} className="px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="micro-label text-muted-foreground">
                {String(idx + 1).padStart(2, '0')} · {r.name.toUpperCase()}
              </span>
              <span className="micro-label">{share(r.value)}%</span>
            </div>
            <div className="mt-1 font-mono text-2xl font-light tabular-nums">
              {r.value.toLocaleString()}
            </div>
            <Progress
              value={share(r.value)}
              size="xs"
              aria-label={`${r.name} share of visitors`}
              className="mt-3"
            />
          </Panel>
        ))}
        {topRegions.length === 0 && (
          <div className="micro-label col-span-full rounded-card border border-rule bg-panel py-6 text-center text-muted-foreground">
            No geographic data ingested yet.
          </div>
        )}
      </div>

      {/* Trend */}
      <Panel>
        <PanelHeader
          label="TRAFFIC_VELOCITY // SOURCE: VERCEL_ANALYTICS"
          status={isLoading ? 'idle' : 'none'}
        />
        <StreamGraph data={chartData} height={300} hideHeader />
      </Panel>
    </>
  );
}
