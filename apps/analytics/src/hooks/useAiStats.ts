'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Hook to fetch AI Intelligence metrics (Spend, Tokens, Latency) from ClickHouse
 */
export function useAiStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery({
    queryKey: ['ai-intelligence-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/ai');
      if (!res.ok) throw new Error('FAILED_AI_STATS_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 15000 : false, // Poll every 15s when live
  });
}
