import { useQuery } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

export interface UsePerformanceOptions {
  isLive?: boolean;
  pollingInterval?: number;
}

/**
 * Hook to fetch Core Web Vitals and general performance metrics
 */
export function usePerformanceStats(options: UsePerformanceOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['performance-stats', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.performance ?? '/api/stats/performance'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_PERFORMANCE_FETCH');
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? interval : false,
  });
}

/**
 * Hook to fetch traffic statistics
 */
export function useTrafficStats(options: UsePerformanceOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['traffic-stats', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.traffic ?? '/api/stats/traffic'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_TRAFFIC_FETCH');
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? interval : false,
  });
}

/**
 * Hook to fetch music playback statistics
 */
export function useMusicStats(options: UsePerformanceOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['music-stats', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.music ?? '/api/stats/music'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_MUSIC_FETCH');
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? interval : false,
  });
}
