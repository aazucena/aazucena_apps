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

    const fetchSchema = async () => {
      try {
        const headers: Record<string, string> = {};
        if (secretKey) headers['x-secret-key'] = secretKey;

        const res = await fetch(`${baseUrl}/api/brain/schema`, { headers });
        if (!res.ok) return;
        const data = await res.json();
        setFetchedGraphData(data);
      } catch {
        // Silently fail
      }
    };
    fetchSchema();
  }, [baseUrl, secretKey, initialGraphData]);

  return initialGraphData || fetchedGraphData;
}
