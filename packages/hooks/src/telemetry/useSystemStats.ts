import { useQuery } from '@tanstack/react-query';
import { useTelemetryConfig } from '@aazucena/context';

/**
 * Hook to fetch high-level system metrics (KPIs)
 */
export function useSystemSummary(isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['system-summary', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/summary`, { headers });
      if (!res.ok) throw new Error('FAILED_SUMMARY_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 10000 : false,
  });
}

/**
 * Hook to fetch time-series trend data for D3 charts
 */
export function useTrendAnalysis(timeRange = '24h', isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['system-trends', timeRange, baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/trends?range=${timeRange}`, {
        headers,
      });
      if (!res.ok) throw new Error('FAILED_TRENDS_FETCH');
      const json = await res.json();

      // Normalize dates for D3 immediately
      return {
        stream: (json.data.stream || []).map((d: any) => ({
          ...d,
          date: new Date(d.date),
        })),
        heatmap: (json.data.heatmap || []).map((d: any) => ({
          ...d,
          date: new Date(d.date),
        })),
      };
    },
    refetchInterval: isLive ? 30000 : false,
  });
}

/**
 * Hook to fetch the raw telemetry log stream
 */
export function useTelemetryStream(isLive = false) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  return useQuery({
    queryKey: ['telemetry-stream', baseUrl],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (secretKey) headers['x-secret-key'] = secretKey;

      const res = await fetch(`${baseUrl}/api/stats/logs`, { headers });
      if (!res.ok) throw new Error('FAILED_LOGS_FETCH');
      const json = await res.json();
      return json.data || [];
    },
    refetchInterval: isLive ? 5000 : false,
  });
}
