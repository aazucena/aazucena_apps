import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { PieChartData } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { usePieChart } from '../hooks/usePieChart';

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PieChartData[];
  title?: string;
  description?: string;
  height?: number;
  innerRadius?: number;
  exportFileName?: string;
  onSliceClick?: (item: PieChartData) => void;
}

export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      title = 'Distribution Analysis',
      description,
      height = 400,
      innerRadius = 0,
      exportFileName = 'pie-chart',
      onSliceClick,
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

    usePieChart(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      innerRadius,
      onSliceClick,
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

PieChart.displayName = 'PieChart';
