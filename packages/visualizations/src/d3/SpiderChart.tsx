import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { SpiderChartData } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useSpiderChart } from '../hooks/useSpiderChart';

export interface SpiderChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SpiderChartData[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  height?: number;
  maxValue?: number;
  exportFileName?: string;
  onBlobClick?: (item: SpiderChartData) => void;
  /** Suppress the ChartHeader — recovers ~80px of canvas height */
  hideHeader?: boolean;
  /** Render year slider + Animate/Stop + Compare/Individual controls below the SVG */
  showYearControls?: boolean;
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
      hideHeader = false,
      showYearControls = false,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    // Year controls state — only active when showYearControls=true
    const allYears = showYearControls
      ? data
          .map((d) => Number(d.name))
          .filter((y) => !isNaN(y))
          .sort((a, b) => a - b)
      : [];
    const [currentYear, setCurrentYear] = useState<number>(allYears.at(-1) ?? 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    // Keep currentYear valid when data changes
    useEffect(() => {
      if (allYears.length > 0 && !allYears.includes(currentYear)) {
        setCurrentYear(allYears.at(-1) ?? 0);
      }
    }, [data]);

    const displayData =
      showYearControls && !showComparison && !isAnimating
        ? data.filter((d) => Number(d.name) === currentYear)
        : data;

    const animateYears = () => {
      if (isAnimating) {
        setIsAnimating(false);
        return;
      }
      if (allYears.length === 0) return;
      setIsAnimating(true);
      setShowComparison(false);
      let idx = 0;
      const step = () => {
        if (idx >= allYears.length) {
          setIsAnimating(false);
          return;
        }
        setCurrentYear(allYears[idx]!);
        idx++;
        setTimeout(step, 800);
      };
      step();
    };

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const svgHeight = hideHeader ? height : height - 80;

    useSpiderChart(svgRef, displayData, {
      width,
      height: svgHeight,
      maxValue,
      colorMap,
      onBlobClick,
    });

    const header = !hideHeader && (
      <ChartHeader>
        <div>
          <ChartTitle>{title}</ChartTitle>
          {description && <ChartDescription>{description}</ChartDescription>}
        </div>
        <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName} />
      </ChartHeader>
    );

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          {header}

          <ChartContent>
            <svg
              ref={svgRef}
              width={width}
              height="100%"
              className="w-full h-full text-foreground"
            />
          </ChartContent>

          {showYearControls && allYears.length > 1 && (
            <div className="flex flex-wrap items-center gap-3 px-4 pb-4 pt-2">
              <button
                onClick={animateYears}
                className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                {isAnimating ? 'Stop' : 'Animate'}
              </button>
              <button
                onClick={() => {
                  setShowComparison((v) => !v);
                  setIsAnimating(false);
                }}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {showComparison ? 'Individual' : 'Compare All'}
              </button>
              <input
                type="range"
                min={allYears[0]}
                max={allYears.at(-1)}
                step={1}
                value={currentYear}
                disabled={isAnimating || showComparison}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="flex-1 accent-blue-600 disabled:opacity-40"
              />
              <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                {currentYear}
              </span>
            </div>
          )}
        </div>
      </ChartContainer>
    );
  },
);

SpiderChart.displayName = 'SpiderChart';
