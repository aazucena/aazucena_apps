'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTrafficStats as _useTrafficStats } from '@aazucena/hooks';

interface TrafficStatsData {
  summary: {
    total_visitors: number;
    total_pageviews: number;
    direct_traffic: number;
  };
  trends: { date: string; visitors: number; pageviews: number }[];
  geo: { country: string; visitors: number }[];
}

export function useTrafficStats(): UseQueryResult<TrafficStatsData> {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return _useTrafficStats({ isLive }) as UseQueryResult<TrafficStatsData>;
}
