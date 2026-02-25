import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { AreaChartPoint } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useAreaChart } from '../hooks/useAreaChart.js';

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AreaChartPoint[];
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  fillOpacity?: number;
  /** Pixels reserved for the chart header. Subtracted from SVG draw height. @default 80 */
  headerOffset?: number;
  exportFileName?: string;
}

export const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      title = 'Area Analysis',
      description,
      height = 400,
      color = 'var(--color-primary, #3b82f6)',
      fillOpacity = 0.3,
      headerOffset = 80,
      exportFileName = 'area-chart',
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

    useAreaChart(svgRef, data, {
      width,
      height: height - headerOffset,
      color,
      fillOpacity,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          <ChartHeader>
            <div>
              <ChartTitle>{title}</ChartTitle>
              {description && <ChartDescription>{description}</ChartDescription>}
            </div>
            <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName} />
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

AreaChart.displayName = 'AreaChart';
