import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { SpiderChartData } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useSpiderChart } from '../hooks/useSpiderChart.js';

export interface SpiderChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SpiderChartData[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  height?: number;
  maxValue?: number;
  exportFileName?: string;
  onBlobClick?: (item: SpiderChartData) => void;
}

export const SpiderChart = forwardRef<HTMLDivElement, SpiderChartProps>(
  (
    {
      data,
      title = 'Multi-Dimensional Analysis',
      description,
      colorMap = {},
      height = 500,
      maxValue = 100,
      exportFileName = 'spider-chart',
      onBlobClick,
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

    useSpiderChart(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      maxValue,
      colorMap,
      onBlobClick,
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

SpiderChart.displayName = 'SpiderChart';
