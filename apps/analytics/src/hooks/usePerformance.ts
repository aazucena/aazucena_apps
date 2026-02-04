// apps/analytics/src/hooks/usePerformance.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface PerformanceStatsData {
  summary: {
    lcp_p75?: number;
    cls_avg?: number;
    total_metrics?: number;
    good_metrics?: number;
  };
  history: { date: string; value: number; metric: string; }[];
  integrity: { service: string; status: string; latency_ms: number; timestamp: string; }[];
  errors: {
    summary: {
      total_errors?: number;
      fatal_errors?: number;
      regular_errors?: number;
      warning_errors?: number;
    };
    top: {
      issue_id: string;
      message: string;
      level: string;
      count: number;
      sentry_url: string;
      culprit?: string | null; // Added culprit property
    }[];
  };
}

/**
 * Hook to fetch Core Web Vitals and general performance metrics from ClickHouse
 */
export function usePerformanceStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery<PerformanceStatsData>({
    queryKey: ['performance-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/performance');
      if (!res.ok) throw new Error('FAILED_PERFORMANCE_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 10000 : false,
  });
}
