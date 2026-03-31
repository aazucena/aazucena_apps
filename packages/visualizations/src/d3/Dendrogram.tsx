import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { DendrogramNode } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useDendrogram } from '../hooks/useDendrogram';

export interface DendrogramProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DendrogramNode;
  title?: string;
  description?: string;
  height?: number;
  direction?: 'horizontal' | 'vertical' | 'radial';
  color?: string;
  exportFileName?: string;
  onNodeClick?: (node: DendrogramNode) => void;
}

export const Dendrogram = forwardRef<HTMLDivElement, DendrogramProps>(
  (
    {
      data,
      title = 'Hierarchical Tree',
      description,
      height = 600,
      direction = 'horizontal',
      color = 'var(--color-primary, #3b82f6)',
      exportFileName = 'dendrogram',
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

    useDendrogram(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      direction,
      color,
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

Dendrogram.displayName = 'Dendrogram';
