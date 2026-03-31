import { useQuery } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

export interface UseSystemStatsOptions {
  isLive?: boolean;
  pollingInterval?: number;
}

/**
 * Hook to fetch high-level system metrics (KPIs)
 */
export function useSystemSummary(options: UseSystemStatsOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['system-summary', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.summary ?? '/api/stats/summary'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_SUMMARY_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? interval : false,
  });
}

/**
 * Hook to fetch time-series trend data for D3 charts.
 * Returns raw data — consumers are responsible for any field-level transformation.
 */
export function useTrendAnalysis(timeRange = '24h', options: UseSystemStatsOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['system-trends', timeRange, baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.trends ?? '/api/stats/trends'}?range=${timeRange}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_TRENDS_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? interval : false,
  });
}

/**
 * Hook to fetch the raw telemetry log stream
 */
export function useTelemetryStream(options: UseSystemStatsOptions = {}) {
  const { baseUrl, secretKey, endpoints, defaultPollingInterval } = useTelemetryConfig();
  const { isLive = false, pollingInterval } = options;
  const interval = pollingInterval ?? defaultPollingInterval ?? 15000;

  return useQuery({
    queryKey: ['telemetry-stream', baseUrl],
    queryFn: async ({ signal }) => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const url = `${baseUrl}${endpoints?.logs ?? '/api/stats/logs'}`;
      const res = await fetch(url, { headers, signal });
      if (!res.ok) throw new Error('FAILED_LOGS_FETCH');
      const json = await res.json();
      return json.data || [];
    },
    refetchInterval: isLive ? interval : false,
  });
}
