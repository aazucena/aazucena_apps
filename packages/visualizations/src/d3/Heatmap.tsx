import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { GenericHeatmapCell } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useHeatmap } from '../hooks/useHeatmap.js';

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericHeatmapCell[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  baseColor?: string;
  height?: number;
  /** Pixels reserved for the chart header. Subtracted from SVG draw height. @default 80 */
  headerOffset?: number;
  exportFileName?: string;
  onCellClick?: (cell: GenericHeatmapCell) => void;
}

export const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      data,
      title = 'Activity Heatmap',
      description,
      colorMap = {},
      baseColor = '#3b82f6',
      height = 200,
      headerOffset = 80,
      exportFileName = 'activity-heatmap',
      onCellClick,
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

    useHeatmap(svgRef, data, {
      width,
      height: height - headerOffset,
      colorMap,
      baseColor,
      onCellClick,
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

Heatmap.displayName = 'Heatmap';
