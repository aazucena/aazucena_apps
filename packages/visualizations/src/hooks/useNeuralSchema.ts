import { useState, useEffect } from 'react';

export interface NeuralSchemaOptions {
  baseUrl: string;
  secretKey?: string;
  initialGraphData?: { nodes: any[]; edges: any[] };
}

export function useNeuralSchema({ baseUrl, secretKey, initialGraphData }: NeuralSchemaOptions) {
  const [fetchedGraphData, setFetchedGraphData] = useState<{
    nodes: any[];
    edges: any[];
  }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (initialGraphData) return;

    const controller = new AbortController();

    const fetchSchema = async () => {
      try {
        const headers: Record<string, string> = {};
        if (secretKey) headers['x-secret-key'] = secretKey;

        const res = await fetch(`${baseUrl}/api/brain/schema`, {
          headers,
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(3000)]),
        });
        if (!res.ok) return;
        const data = await res.json();
        setFetchedGraphData(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Silently fall through — NeuralMap uses NEURAL_MAP_FALLBACK_NODES
        }
      }
    };
    fetchSchema();

    return () => controller.abort();
  }, [baseUrl, secretKey, initialGraphData]);

  return initialGraphData || fetchedGraphData;
}
