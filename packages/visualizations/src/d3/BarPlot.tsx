import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { GenericPoint } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useBarPlot } from '../hooks/useBarPlot';

export interface BarPlotProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericPoint[];
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  binCount?: number;
  exportFileName?: string;
}

export const BarPlot = forwardRef<HTMLDivElement, BarPlotProps>(
  (
    {
      data,
      title = 'Distribution Analysis',
      description,
      height = 400,
      color = 'var(--color-primary, #3b82f6)',
      binCount = 20,
      exportFileName = 'bar-plot',
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

    useBarPlot(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      color,
      binCount,
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

BarPlot.displayName = 'BarPlot';
