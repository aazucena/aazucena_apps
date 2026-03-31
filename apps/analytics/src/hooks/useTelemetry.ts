'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateLastSync } from '@/store';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useSystemSummary as _useSystemSummary,
  useTrendAnalysis as _useTrendAnalysis,
  useTelemetryStream as _useTelemetryStream,
  useMusicStats as _useMusicStats,
  useSentinel as _useSentinel,
} from '@aazucena/hooks';

export function useSystemSummary() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  const dispatch = useDispatch();
  const query = _useSystemSummary({ isLive });
  useEffect(() => {
    if (query.data) dispatch(updateLastSync());
  }, [query.data, dispatch]);
  return query;
}

export function useTrendAnalysis() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  const timeRange = useSelector((state: RootState) => state.dashboard.filters.timeRange);
  const query = _useTrendAnalysis(timeRange, { isLive });

  // Transform to @aazucena/types package formats (GenericTimeSeriesStep / GenericHeatmapCell)
  if (query.data) {
    return {
      ...query,
      data: {
        stream:
          (query.data as any).stream?.map((d: any) => {
            const { date, ...rest } = d;
            return { timestamp: new Date(date), values: rest as Record<string, number> };
          }) ?? [],
        heatmap:
          (query.data as any).heatmap?.map((d: any) => ({
            date: new Date(d.date),
            value: d.count ?? d.value ?? 0,
            category: d.category,
          })) ?? [],
      },
    };
  }
  return query;
}

export function useTelemetryStream() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return _useTelemetryStream({ isLive });
}

export function useMusicStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return _useMusicStats({ isLive });
}

export function useSentinel() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return _useSentinel({ isLive });
}

// Journey and Plausible hooks — not yet in @aazucena/hooks, kept local

export function usePlausibleStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery({
    queryKey: ['plausible-stats'],
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/stats/plausible', { signal });
      if (!res.ok) throw new Error('FAILED_PLAUSIBLE_FETCH');
      const json = await res.json();
      return json.data.map((d: any) => ({ ...d, date: new Date(d.date) }));
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? 60000 : false,
  });
}

export function useJourneys() {
  return useQuery({
    queryKey: ['user-journeys'],
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/stats/journeys', { signal });
      if (!res.ok) throw new Error('FAILED_JOURNEYS_FETCH');
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60000,
  });
}

export function useJourneyDetail(sessionId: string | null) {
  return useQuery({
    queryKey: ['user-journey-detail', sessionId],
    queryFn: async ({ signal }) => {
      if (!sessionId) return null;
      const res = await fetch(`/api/stats/journeys?sessionId=${sessionId}`, { signal });
      if (!res.ok) throw new Error('FAILED_JOURNEY_DETAIL_FETCH');
      const json = await res.json();
      return json.data;
    },
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
  });
}
