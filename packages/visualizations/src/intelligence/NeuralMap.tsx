/**
 * NeuralMap Component
 * Visualizes the brain's cognitive flow and AI decision path.
 * Decoupled from analytics origin via props and useTelemetryConfig.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { useTelemetryConfig } from '@aazucena/context';
import { NEURAL_MAP_FALLBACK_NODES } from '@aazucena/constants';
import { NeuralNode } from './NeuralNode.js';

export interface NeuralMapProps {
  /** Array of trajectory steps with rewards */
  steps: any[];
  /** Current active step index */
  currentStepIndex: number;
  /** Optional graph structure (nodes/edges) override */
  graphData?: { nodes: any[]; edges: any[] };
  /** Optional class name */
  className?: string;
}

export function NeuralMap({
  steps,
  currentStepIndex,
  graphData: initialGraphData,
  className,
}: NeuralMapProps) {
  const { baseUrl, secretKey } = useTelemetryConfig();
  const [fetchedGraphData, setFetchedGraphData] = useState<{
    nodes: any[];
    edges: any[];
  }>({
    nodes: [],
    edges: [],
  });

  // Fetch schema only if no manual graphData is provided
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
        // Silently fail, fallback to defaults
      }
    };
    fetchSchema();
  }, [baseUrl, secretKey, initialGraphData]);

  const nodes = useMemo(() => {
    const data = initialGraphData || fetchedGraphData;
    if (data.nodes.length > 0) return data.nodes;

    return NEURAL_MAP_FALLBACK_NODES;
  }, [fetchedGraphData, initialGraphData]);

  return (
    <div
      className={cn(
        'relative w-full h-full flex items-center justify-start sm:justify-center gap-4 lg:gap-8 p-6 overflow-x-auto overflow-y-hidden scrollbar-none',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none sticky left-0"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="flex items-center gap-4 lg:gap-8 min-w-max px-4">
        {nodes.map((node, i) => {
          const isActive = i === currentStepIndex;
          const isCompleted = i < currentStepIndex;

          const stepData = steps[i];
          const isFailed = stepData && stepData.reward < 0;

          return (
            <React.Fragment key={node.id}>
              <NeuralNode
                type={node.id}
                label={node.label}
                isActive={isActive}
                isCompleted={isCompleted}
                isFailed={isFailed}
              />
              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center shrink-0">
                  <ArrowRight
                    size={16}
                    className={
                      isFailed
                        ? 'text-rose-500'
                        : i < currentStepIndex
                          ? 'text-emerald-500'
                          : 'text-zinc-300 dark:text-zinc-800'
                    }
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
