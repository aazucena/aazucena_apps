import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { GenericNetworkData, BaseNode, BaseLink } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useForceDirectedGraph } from '../hooks/useForceDirectedGraph';

export interface ForceDirectedGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericNetworkData<BaseNode, BaseLink<string>>;
  title?: string;
  description?: string;
  groupKey?: string;
  colorMap?: Record<string, string>;
  height?: number;
  exportFileName?: string;
  onNodeClick?: (node: any) => void;
}

export const ForceDirectedGraph = forwardRef<HTMLDivElement, ForceDirectedGraphProps>(
  (
    {
      data,
      title = 'Network Analysis',
      description,
      groupKey = 'group',
      colorMap = {},
      height = 600,
      exportFileName = 'network-graph',
      onNodeClick,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useForceDirectedGraph(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      groupKey,
      colorMap,
      onNodeClick,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          <ChartHeader>
            <div>
              <ChartTitle>{title}</ChartTitle>
              {description && <ChartDescription>{description}</ChartDescription>}
            </div>
            <ChartToolbar svgRef={svgRef} data={data.nodes} fileName={exportFileName} />
          </ChartHeader>

          <ChartContent className="p-0">
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground transition-colors cursor-move"
            />
          </ChartContent>
        </div>
      </ChartContainer>
    );
  },
);

ForceDirectedGraph.displayName = 'ForceDirectedGraph';
