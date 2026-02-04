'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateLastSync } from '@/store';
import { useEffect } from 'react';

/**
 * Hook to fetch high-level system metrics (KPIs)
 */
export function useSystemSummary() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['system-summary'],
    queryFn: async () => {
      const res = await fetch('/api/stats/summary');
      if (!res.ok) throw new Error('FAILED_SUMMARY_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 10000 : false, // Poll every 10s if live
  });

  // Track the last sync time in Redux
  useEffect(() => {
    if (query.data) dispatch(updateLastSync());
  }, [query.data, dispatch]);

  return query;
}

/**
 * Hook to fetch time-series trend data for D3 charts
 */
export function useTrendAnalysis() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  const timeRange = useSelector((state: RootState) => state.dashboard.filters.timeRange);

  return useQuery({
    queryKey: ['system-trends', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/stats/trends?range=${timeRange}`);
      if (!res.ok) throw new Error('FAILED_TRENDS_FETCH');
      const json = await res.json();
      
      // Normalize dates for D3 immediately
      return {
        stream: json.data.stream.map((d: any) => ({ ...d, date: new Date(d.date) })),
        heatmap: json.data.heatmap.map((d: any) => ({ ...d, date: new Date(d.date) })),
      };
    },
    refetchInterval: isLive ? 30000 : false, // Poll every 30s for heavy charts
  });
}

/**
 * Hook to fetch the raw telemetry log stream
 */
export function useTelemetryStream() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery({
    queryKey: ['telemetry-stream'],
    queryFn: async () => {
      const res = await fetch('/api/stats/logs');
      if (!res.ok) throw new Error('FAILED_LOGS_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 5000 : false, // Poll every 5s for the live feed
  });
}

/**
 * Hook to fetch music playback statistics
 */
export function useMusicStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery({
    queryKey: ['music-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/music');
      if (!res.ok) throw new Error('FAILED_MUSIC_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 15000 : false, // Poll every 15s
  });
}

/**
 * Hook to fetch Plausible Analytics traffic stats
 */
export function usePlausibleStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery({
    queryKey: ['plausible-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/plausible');
      if (!res.ok) throw new Error('FAILED_PLAUSIBLE_FETCH');
      const json = await res.json();
      
      // Normalize dates
      return json.data.map((d: any) => ({
        ...d,
        date: new Date(d.date),
      }));
    },
    refetchInterval: isLive ? 60000 : false, // Poll every 60s (traffic updates slower)
  });
}

/**
 * Hook to fetch the list of recent user journeys
 */
export function useJourneys() {
  return useQuery({
    queryKey: ['user-journeys'],
    queryFn: async () => {
      const res = await fetch('/api/stats/journeys');
      if (!res.ok) throw new Error('FAILED_JOURNEYS_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

/**
 * Hook to fetch details for a specific user journey
 */
export function useJourneyDetail(sessionId: string | null) {
  return useQuery({
    queryKey: ['user-journey-detail', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const res = await fetch(`/api/stats/journeys?sessionId=${sessionId}`);
      if (!res.ok) throw new Error('FAILED_JOURNEY_DETAIL_FETCH');
      const json = await res.json();
      return json.data;
    },
    enabled: !!sessionId,
  });
}

/**
 * Hook to fetch the Sentinel health status and active alerts
 */
export function useSentinel() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery({
    queryKey: ['sentinel-status'],
    queryFn: async () => {
      const res = await fetch('/api/stats/sentinel');
      if (!res.ok) throw new Error('FAILED_SENTINEL_FETCH');
      const json = await res.json();
      return json;
    },
    refetchInterval: isLive ? 15000 : false, // Check health every 15s if live
  });
}
