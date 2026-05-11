'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAiIntelligence } from '@aazucena/hooks/telemetry';

/**
 * Hook to fetch AI Intelligence metrics (Spend, Tokens, Latency) from ClickHouse
 * Delegates to @aazucena/hooks useAiIntelligence — reads isLive from Redux.
 */
export function useAiStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return useAiIntelligence({ isLive });
}
