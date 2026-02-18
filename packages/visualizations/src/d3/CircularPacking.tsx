import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { CircularPackingNode } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useCircularPacking } from '../hooks/useCircularPacking.js';

export interface CircularPackingProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CircularPackingNode;
  title?: string;
  description?: string;
  height?: number;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  onNodeClick?: (node: CircularPackingNode) => void;
}

export const CircularPacking = forwardRef<HTMLDivElement, CircularPackingProps>(
  (
    {
      data,
      title = 'Bubble Analysis',
      description,
      height = 600,
      colorMap = {},
      exportFileName = 'circular-packing',
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

    useCircularPacking(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
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

CircularPacking.displayName = 'CircularPacking';
