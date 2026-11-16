import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import { categoricalScale, chartControl, chartControlOn, chartMicro } from '../theme';
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

    const defaultColors = categoricalScale();

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
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                aria-pressed={showGrid}
                aria-label="Toggle Grid"
                className={cn(chartControl, showGrid && chartControlOn)}
                title="Toggle Grid"
              >
                <Activity size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setShowPoints(!showPoints)}
                aria-pressed={showPoints}
                aria-label="Toggle Points"
                className={cn(chartControl, showPoints && chartControlOn)}
                title="Toggle Points"
              >
                <Dots size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setScaleType(scaleType === 'linear' ? 'log' : 'linear')}
                className={cn(chartControl, chartMicro, 'px-2')}
                title="Toggle Linear/Log Scale"
              >
                {scaleType}
              </button>
              <button
                type="button"
                onClick={resetVisibility}
                aria-label="Reset View"
                className={chartControl}
                title="Reset View"
              >
                <Refresh size={14} aria-hidden="true" />
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
                  type="button"
                  onClick={() => toggleKey(key)}
                  aria-pressed={visibleKeys.has(key)}
                  className={cn(
                    chartControl,
                    chartMicro,
                    'px-2',
                    // Hidden series: hollow swatch and muted text, never a dimmed label
                    !visibleKeys.has(key) && 'text-(--muted-foreground) line-through',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full border-2"
                    style={{
                      borderColor: colorMap[key] || defaultColors(key),
                      backgroundColor: visibleKeys.has(key)
                        ? colorMap[key] || defaultColors(key)
                        : 'transparent',
                    }}
                  />
                  {key}
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
