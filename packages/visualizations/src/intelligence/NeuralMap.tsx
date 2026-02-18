import React, { forwardRef, useMemo } from 'react';
import { ArrowRight } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { useTelemetryConfig } from '@aazucena/context';
import { NEURAL_MAP_FALLBACK_NODES } from '@aazucena/constants';
import { NeuralNode } from './NeuralNode.js';
import { useNeuralSchema } from '../hooks/useNeuralSchema.js';

export interface NeuralMapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of trajectory steps with rewards */
  steps: any[];
  /** Current active step index */
  currentStepIndex: number;
  /** Optional graph structure (nodes/edges) override */
  graphData?: { nodes: any[]; edges: any[] };
}

export const NeuralMap = forwardRef<HTMLDivElement, NeuralMapProps>(
  ({ steps, currentStepIndex, graphData: initialGraphData, className, ...props }, ref) => {
    const { baseUrl, secretKey } = useTelemetryConfig();
    const graphData = useNeuralSchema({ baseUrl, secretKey, initialGraphData });

    const nodes = useMemo(() => {
      if (graphData.nodes.length > 0) return graphData.nodes;
      return NEURAL_MAP_FALLBACK_NODES;
    }, [graphData]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full h-full flex items-center justify-start sm:justify-center gap-4 lg:gap-8 p-6 overflow-x-auto overflow-y-hidden scrollbar-none',
          className,
        )}
        {...props}
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
  },
);

NeuralMap.displayName = 'NeuralMap';
