import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context/telemetry';

/**
 * AI Intelligence Stats Data Structure
 */
export interface AiIntelligenceStats {
  summary: {
    total_cost_usd?: number;
    total_tokens?: number;
    avg_latency_ms?: number;
    total_requests?: number;
  };
  trends: Array<{
    date: string;
    cost: number;
    tokens: number;
    model: string;
  }>;
  models: Array<{
    model: string;
    requests: number;
    cost: number;
    avg_latency: number;
  }>;
}

/**
 * Hook Configuration
 */
export interface UseAiIntelligenceOptions {
  /**
   * Enable live polling
   */
  isLive?: boolean;
  /**
   * Custom polling interval in milliseconds
   * @default 15000 (15 seconds)
   */
  pollingInterval?: number;
  /**
   * Enable the query
   * @default true
   */
  enabled?: boolean;
}

/**
 * useAiIntelligence
 * Framework-agnostic hook to fetch AI intelligence metrics
 * (LLM spend, tokens, latency, model usage)
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAiIntelligence({ isLive: true });
 *
 * if (data) {
 *   console.log(`Total Cost: $${data.summary.total_cost_usd}`);
 *   console.log(`Total Tokens: ${data.summary.total_tokens}`);
 * }
 * ```
 */
export function useAiIntelligence(
  options: UseAiIntelligenceOptions = {},
): UseQueryResult<AiIntelligenceStats> {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval, enabled = true } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['ai-intelligence-stats', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.ai ?? '/api/stats/ai'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_AI_STATS_FETCH');
      const json = await res.json();
      return json.data as AiIntelligenceStats;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? interval : false,
    enabled,
  });
}
