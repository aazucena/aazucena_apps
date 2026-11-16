import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@aazucena/utils';
import type { BarChartData } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useBarChart } from '../hooks/useBarChart';
import { Zap } from '@aazucena/icons';
import { chartControl, chartControlOn, chartMicro, chartTheme } from '../theme';

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartData[];
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  horizontal?: boolean;
  racing?: boolean;
  /** Pixels reserved for the chart header. Subtracted from SVG draw height. @default 80 */
  headerOffset?: number;
  exportFileName?: string;
  onBarClick?: (item: BarChartData) => void;
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data: initialData,
      title = 'Comparison',
      description,
      height = 400,
      color = chartTheme.series[0],
      horizontal: initialHorizontal = false,
      racing: initialRacing = false,
      headerOffset = 80,
      exportFileName = 'bar-chart',
      onBarClick,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [horizontal, setHorizontal] = useState(initialHorizontal);
    const [racing, setRacing] = useState(initialRacing);
    const [sortType, setSortType] = useState<'none' | 'value' | 'label'>('none');

    const data = useMemo<BarChartData[]>(() => {
      const sorted = [...initialData];
      if (sortType === 'value') {
        sorted.sort((a, b) => b.value - a.value);
      } else if (sortType === 'label') {
        sorted.sort((a, b) => a.label.localeCompare(b.label));
      }
      return sorted;
    }, [initialData, sortType]);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useBarChart(svgRef, data, {
      width,
      height: height - headerOffset,
      horizontal,
      racing,
      color,
      onBarClick,
    });

    const toggleSort = () => {
      setSortType((prev) => (prev === 'none' ? 'value' : prev === 'value' ? 'label' : 'none'));
    };

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
                onClick={toggleSort}
                className={cn(chartControl, chartMicro, 'px-2')}
                title="Toggle Sorting (None/Value/Label)"
              >
                Sort: {sortType}
              </button>
              <button
                type="button"
                onClick={() => setHorizontal(!horizontal)}
                className={cn(chartControl, chartMicro, 'px-2')}
                title="Toggle Orientation"
              >
                {horizontal ? 'Vertical' : 'Horizontal'}
              </button>
              <button
                type="button"
                onClick={() => setRacing(!racing)}
                aria-pressed={racing}
                aria-label="Toggle Racing Animation"
                className={cn(chartControl, racing && chartControlOn)}
                title="Toggle Racing Animation"
              >
                <Zap size={14} aria-hidden="true" />
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
        </div>
      </ChartContainer>
    );
  },
);

BarChart.displayName = 'BarChart';
