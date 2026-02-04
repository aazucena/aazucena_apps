// apps/analytics/src/hooks/useTraffic.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TrafficStatsData {
  summary: {
    total_visitors: number;
    total_pageviews: number;
    direct_traffic: number;
  };
  trends: { date: string; visitors: number; pageviews: number; }[];
  geo: { country: string; visitors: number; }[];
}

export function useTrafficStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery<TrafficStatsData>({
    queryKey: ['traffic-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/traffic');
      if (!res.ok) throw new Error('FAILED_TRAFFIC_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 30000 : false,
  });
}
