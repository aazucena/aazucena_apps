import { useQuery } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

/**
 * Hook to fetch Core Web Vitals and general performance metrics
 */
export function usePerformanceStats(isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['performance-stats', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/performance`, { headers });
      if (!res.ok) throw new Error('FAILED_PERFORMANCE_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 10000 : false,
  });
}

/**
 * Hook to fetch traffic statistics
 */
export function useTrafficStats(isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['traffic-stats', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/traffic`, { headers });
      if (!res.ok) throw new Error('FAILED_TRAFFIC_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 30000 : false,
  });
}

/**
 * Hook to fetch music playback statistics
 */
export function useMusicStats(isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['music-stats', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/music`, { headers });
      if (!res.ok) throw new Error('FAILED_MUSIC_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 15000 : false,
  });
}
