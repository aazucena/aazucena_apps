'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { usePerformanceStats as _usePerformanceStats } from '@aazucena/hooks/telemetry';

interface PerformanceStatsData {
  summary: {
    lcp_p75?: number;
    cls_avg?: number;
    total_metrics?: number;
    good_metrics?: number;
  };
  history: { date: string; value: number; metric: string }[];
  integrity: { service: string; status: string; latency_ms: number; timestamp: string }[];
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
      culprit?: string | null;
    }[];
  };
}

export function usePerformanceStats(): UseQueryResult<PerformanceStatsData> {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return _usePerformanceStats({ isLive }) as UseQueryResult<PerformanceStatsData>;
}
