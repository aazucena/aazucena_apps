import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

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
  const { baseUrl, secretKey } = useTelemetryConfig();
  const { isLive = false, pollingInterval = 15000, enabled = true } = options;

  return useQuery({
    queryKey: ['ai-intelligence-stats', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/ai`, { headers });
      if (!res.ok) throw new Error('FAILED_AI_STATS_FETCH');
      const json = await res.json();
      return json.data as AiIntelligenceStats;
    },
    refetchInterval: isLive ? pollingInterval : false,
    enabled,
  });
}
