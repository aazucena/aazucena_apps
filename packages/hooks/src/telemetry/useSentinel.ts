import { useQuery } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

/**
 * Hook to fetch the Sentinel health status and active alerts
 */
export function useSentinel(isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['sentinel-status', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/sentinel`, { headers });
      if (!res.ok) throw new Error('FAILED_SENTINEL_FETCH');
      const json = await res.json();
      return json;
    },
    refetchInterval: isLive ? 15000 : false,
  });
}
