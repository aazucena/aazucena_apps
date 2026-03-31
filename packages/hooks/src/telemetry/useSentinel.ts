import { useQuery } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

export interface UseSentinelOptions {
  isLive?: boolean;
  pollingInterval?: number;
}

/**
 * Hook to fetch the Sentinel health status and active alerts
 */
export function useSentinel(options: UseSentinelOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['sentinel-status', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.sentinel ?? '/api/stats/sentinel'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_SENTINEL_FETCH');
      const json = await res.json();
      return json;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? interval : false,
  });
}
