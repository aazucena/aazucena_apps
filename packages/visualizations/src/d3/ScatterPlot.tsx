import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { ScatterPlotPoint } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useScatterPlot } from '../hooks/useScatterPlot';

export interface ScatterPlotProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ScatterPlotPoint[];
  title?: string;
  description?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  onPointClick?: (point: ScatterPlotPoint) => void;
}

export const ScatterPlot = forwardRef<HTMLDivElement, ScatterPlotProps>(
  (
    {
      data,
      title = 'Correlation Analysis',
      description,
      height = 500,
      xAxisLabel = 'X Axis',
      yAxisLabel = 'Y Axis',
      colorMap = {},
      exportFileName = 'scatter-plot',
      onPointClick,
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

    useScatterPlot(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      xAxisLabel,
      yAxisLabel,
      colorMap,
      onPointClick,
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

ScatterPlot.displayName = 'ScatterPlot';
