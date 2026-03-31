// apps/analytics/src/app/traffic/page.tsx
'use client';

import React, { useMemo, useEffect, useState } from 'react';
import * as topojson from 'topojson-client';
import { useDispatch } from 'react-redux';
import { setCategoryPreset } from '@/store';
import { MetricCard } from '@/components/widgets/MetricCard';
import { StreamGraph, ChoroplethMap } from '@aazucena/visualizations';
import { useTrafficStats } from '@/hooks/useTraffic';
import { Globe, Users, Eye, ArrowUpRight } from '@aazucena/icons';
import type { GenericTimeSeriesStep, MapRegion } from '@aazucena/types';

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

  useEffect(() => {
    dispatch(setCategoryPreset('SYSTEM'));
  }, [dispatch]);

  // Fetch world atlas and convert TopoJSON → GeoJSON with name-based IDs for lookup
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(topo, topo.objects.countries) as any;
        setGeoJson({
          ...geo,
          features: geo.features.map((f: any) => ({ ...f, id: f.properties?.name ?? f.id })),
        });
      });
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

  // MapRegion[] for ChoroplethMap — match by country name via ISO2_TO_NAME lookup
  const mapData = useMemo((): MapRegion[] => {
    if (!stats?.geo) return [];
    return (stats.geo as any[]).map((d) => ({
      id: ISO2_TO_NAME[d.country] ?? d.country,
      value: d.visitors ?? 0,
      name: d.country,
    }));
  }, [stats]);

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">
            TRAFFIC_CENTER
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono mt-2 tracking-[0.3em] uppercase font-bold">
            Audience Engagement & Reach Intelligence
          </p>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Unique Visitors (30d)"
          value={stats?.summary?.total_visitors?.toLocaleString() || '0'}
          description="DISTINCT_SESSIONS"
          icon={<Users size={24} />}
        />
        <MetricCard
          label="Total Pageviews (30d)"
          value={stats?.summary?.total_pageviews?.toLocaleString() || '0'}
          description="EXPOSURE_COUNT"
          variant="secondary"
          icon={<Eye size={24} />}
        />
        <MetricCard
          label="Direct Traffic"
          value={stats?.summary?.direct_traffic?.toLocaleString() || '0'}
          description="NO_REFERRER_EXPOSURE"
          icon={<ArrowUpRight size={24} />}
        />
      </div>

      {/* TREND GRAPH */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Globe size={18} />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-[0.2em]">
              Traffic Velocity
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold">
            {isLoading ? 'SYNCING_TRAFFIC_DATA...' : 'Source: Vercel_Analytics'}
          </span>
        </div>
        <div className="min-h-[450px]">
          <StreamGraph data={chartData} />
        </div>
      </div>

      {/* GEOSPATIAL MAP */}
      {geoJson && (
        <ChoroplethMap
          data={mapData}
          geoJson={geoJson}
          title="Geospatial_Identity_Map"
          description="Global Reach Intelligence"
        />
      )}

      {/* GEOSPATIAL TABLE (Simplified) */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 px-2">
          Global Distribution (Top 10)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {(stats?.geo as any[])?.map((g, idx) => (
            <div
              key={g.country || idx}
              className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between"
            >
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                {g.country || 'Unknown'}
              </span>
              <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {g.visitors}
              </span>
            </div>
          ))}
          {(!stats?.geo || (stats.geo as any[]).length === 0) && (
            <div className="col-span-full py-10 text-center text-zinc-500 font-mono text-xs uppercase">
              No geographic data ingested yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
