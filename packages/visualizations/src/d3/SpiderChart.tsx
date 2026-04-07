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
    // Extra room for the year controls section so it isn't clipped by ChartContainer overflow-hidden
    const controlsVisible = showYearControls && allYears.length > 1;
    const containerHeight = height + (controlsVisible ? 100 : 0);

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
      <ChartContainer
        ref={ref}
        className={className}
        style={{ height: containerHeight }}
        {...props}
      >
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
            <div className="my-4 flex flex-col items-center gap-4 px-4 pb-2 sm:flex-row">
              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={animateYears}
                  disabled={isAnimating && false /* toggle allowed */}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    isAnimating
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {isAnimating ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                  {isAnimating ? 'Playing…' : 'Animate'}
                </button>

                <button
                  onClick={() => {
                    setShowComparison((v) => !v);
                    setIsAnimating(false);
                  }}
                  disabled={isAnimating}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                    showComparison
                      ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  {showComparison ? 'Individual' : 'Compare'}
                </button>
              </div>

              {/* Slider row — fades when compare is active */}
              <div
                className={`flex w-full flex-1 items-center gap-3 transition-opacity duration-300 sm:w-auto ${
                  showComparison ? 'pointer-events-none opacity-30' : 'opacity-100'
                }`}
              >
                <span className="w-10 text-right text-[10px] font-bold text-gray-400">
                  {allYears[0]}
                </span>
                <input
                  type="range"
                  min={allYears[0]}
                  max={allYears.at(-1)}
                  step={1}
                  value={currentYear}
                  disabled={isAnimating || showComparison}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
                />
                <span className="w-10 text-[10px] font-bold text-gray-400">{allYears.at(-1)}</span>
              </div>

              {/* Current year badge — hidden in compare mode */}
              {!showComparison && (
                <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1 dark:border-blue-800 dark:bg-blue-900/30">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {currentYear}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </ChartContainer>
    );
  },
);

SpiderChart.displayName = 'SpiderChart';
