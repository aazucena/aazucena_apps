import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@aazucena/utils';
import type { BarChartData } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useBarChart } from '../hooks/useBarChart.js';
import { Zap } from '@aazucena/icons';

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartData[];
  title?: string;
  description?: string;
  height?: number;
  color?: string;
  horizontal?: boolean;
  racing?: boolean;
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
      color = 'var(--color-primary, #3b82f6)',
      horizontal: initialHorizontal = false,
      racing: initialRacing = false,
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
      height: height - 80, // Adjusted for header
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
                onClick={toggleSort}
                className="px-2 py-1 rounded md hover:bg-white/10 text-[10px] font-bold uppercase transition-colors"
                title="Toggle Sorting (None/Value/Label)"
              >
                Sort: {sortType}
              </button>
              <button
                onClick={() => setHorizontal(!horizontal)}
                className="px-2 py-1 rounded md hover:bg-white/10 text-[10px] font-bold uppercase transition-colors"
                title="Toggle Orientation"
              >
                {horizontal ? 'Vertical' : 'Horizontal'}
              </button>
              <button
                onClick={() => setRacing(!racing)}
                className={cn(
                  'p-1 rounded md transition-colors',
                  racing ? 'bg-primary/20 text-primary' : 'hover:bg-white/10',
                )}
                title="Toggle Racing Animation"
              >
                <Zap size={14} />
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
