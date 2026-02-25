import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

/**
 * Financial Stats Data Structure
 */
export interface FinancialStats {
  summary: {
    total_revenue: number;
    avg_transaction: number;
    transaction_count: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    provider: string;
  }>;
  history: Array<{
    timestamp: string;
    transaction_id: string;
    provider: string;
    amount: number;
    currency: string;
    type: string;
    customer_email: string;
    metadata: Record<string, string>;
  }>;
}

/**
 * Hook Configuration
 */
export interface UseFinancialOptions {
  /**
   * Enable live polling
   */
  isLive?: boolean;
  /**
   * Custom polling interval in milliseconds
   * @default 30000 (30 seconds)
   */
  pollingInterval?: number;
  /**
   * Enable the query
   * @default true
   */
  enabled?: boolean;
}

/**
 * useFinancial
 * Framework-agnostic hook to fetch financial stats
 * (Stripe and Ko-fi transaction data)
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useFinancial({ isLive: true });
 *
 * if (data) {
 *   console.log(`Total Revenue: $${data.summary.total_revenue}`);
 *   console.log(`Transactions: ${data.summary.transaction_count}`);
 * }
 * ```
 */
export function useFinancial(options: UseFinancialOptions = {}): UseQueryResult<FinancialStats> {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval, enabled = true } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 30000;

  return useQuery({
    queryKey: ['financial-stats', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.finance ?? '/api/stats/finance'}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('FAILED_FINANCE_FETCH');
      const json = await res.json();
      return json.data as FinancialStats;
    },
    refetchInterval: isLive ? interval : false,
    enabled,
  });
}
