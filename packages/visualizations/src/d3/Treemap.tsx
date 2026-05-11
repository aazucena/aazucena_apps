import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { TreemapNode } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useTreemap } from '../hooks/useTreemap';

export interface TreemapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreemapNode;
  title?: string;
  description?: string;
  height?: number;
  exportFileName?: string;
  onNodeClick?: (node: TreemapNode) => void;
}

export const Treemap = forwardRef<HTMLDivElement, TreemapProps>(
  (
    {
      data,
      title = 'Hierarchical Analysis',
      description,
      height = 500,
      exportFileName = 'treemap',
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

    useTreemap(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
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
            <ChartToolbar svgRef={svgRef} fileName={exportFileName} />
          </ChartHeader>

          <ChartContent>
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground"
            />
          </ChartContent>
        </div>
      </ChartContainer>
    );
  },
);

Treemap.displayName = 'Treemap';
