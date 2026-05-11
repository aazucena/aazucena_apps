import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { GenericTimeSeriesStep } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
  ChartFooter,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useChartState } from '../hooks/useChartState';
import { useLineChart } from '../hooks/useLineChart';
import { Refresh, Dots, Activity } from '@aazucena/icons';

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericTimeSeriesStep[];
  title?: string;
  description?: string;
  height?: number;
  colorMap?: Record<string, string>;
  /**
   * Pixels reserved for header + footer (legend).
   * Subtracted from SVG draw height. @default 120
   */
  headerOffset?: number;
  exportFileName?: string;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      title = 'Trends',
      description,
      height = 400,
      colorMap = {},
      headerOffset = 120,
      exportFileName = 'line-chart',
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    const allKeys = useMemo(() => {
      return Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));
    }, [data]);

    const {
      visibleKeys,
      toggleKey,
      resetVisibility,
      scaleType,
      setScaleType,
      showGrid,
      setShowGrid,
      showPoints,
      setShowPoints,
    } = useChartState(allKeys);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useLineChart(svgRef, data, {
      width,
      height: height - headerOffset,
      visibleKeys,
      scaleType,
      showGrid,
      showPoints,
      colorMap,
      allKeys,
    });

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          <ChartHeader>
            <div>
              <ChartTitle>{title}</ChartTitle>
              {description && <ChartDescription>{description}</ChartDescription>}
            </div>
            <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName}>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  'p-1 rounded md transition-colors',
                  showGrid ? 'bg-primary/20 text-primary' : 'hover:bg-white/10',
                )}
                title="Toggle Grid"
              >
                <Activity size={14} />
              </button>
              <button
                onClick={() => setShowPoints(!showPoints)}
                className={cn(
                  'p-1 rounded md transition-colors',
                  showPoints ? 'bg-primary/20 text-primary' : 'hover:bg-white/10',
                )}
                title="Toggle Points"
              >
                <Dots size={14} />
              </button>
              <button
                onClick={() => setScaleType(scaleType === 'linear' ? 'log' : 'linear')}
                className="px-2 py-1 rounded md hover:bg-white/10 text-[10px] font-bold uppercase transition-colors"
                title="Toggle Linear/Log Scale"
              >
                {scaleType}
              </button>
              <button
                onClick={resetVisibility}
                className="p-1 rounded md hover:bg-white/10 transition-colors"
                title="Reset View"
              >
                <Refresh size={14} />
              </button>
            </ChartToolbar>
          </ChartHeader>

          <ChartContent>
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground"
            />
          </ChartContent>

          <ChartFooter>
            <div className="flex flex-wrap gap-4">
              {allKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => toggleKey(key)}
                  className={cn(
                    'flex items-center gap-2 transition-all duration-200 group/item',
                    !visibleKeys.has(key) && 'opacity-30 grayscale',
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full shadow-sm group-hover/item:scale-125 transition-transform"
                    style={{ backgroundColor: colorMap[key] || defaultColors(key) }}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">{key}</span>
                </button>
              ))}
            </div>
          </ChartFooter>
        </div>
      </ChartContainer>
    );
  },
);

LineChart.displayName = 'LineChart';
