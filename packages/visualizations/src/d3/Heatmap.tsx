import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { GenericHeatmapCell } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useHeatmap } from '../hooks/useHeatmap';

const toInputValue = (d: Date) => d.toISOString().slice(0, 10);

const parseInputDate = (value: string): Date => {
  const parts = value.split('-').map(Number);
  return new Date(parts[0]!, parts[1]! - 1, parts[2]);
};

const threeMonthsAgo = (): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d;
};

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericHeatmapCell[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  baseColor?: string;
  height?: number;
  exportFileName?: string;
  onCellClick?: (cell: GenericHeatmapCell) => void;
  /** Called on cell mouseenter/mouseleave — null on leave */
  onCellHover?: (cell: GenericHeatmapCell | null) => void;
  /** Suppress the ChartHeader — recovers ~80px of canvas height */
  hideHeader?: boolean;
  /**
   * Render prop for a right-side info panel.
   * When provided, the chart uses a 3/4 + 1/4 grid layout.
   * The hovered cell is passed — null when no cell is hovered.
   */
  infoPanel?: (hoveredCell: GenericHeatmapCell | null) => React.ReactNode;
}

export const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      data,
      title = 'Activity Heatmap',
      description,
      colorMap = {},
      baseColor = '#3b82f6',
      height = 320,
      exportFileName = 'activity-heatmap',
      onCellClick,
      onCellHover,
      hideHeader = false,
      infoPanel,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [startDate, setStartDate] = useState<Date>(threeMonthsAgo);
    const [endDate, setEndDate] = useState<Date>(() => new Date());
    const [hoveredCell, setHoveredCell] = useState<GenericHeatmapCell | null>(null);

    useEffect(() => {
      const el = svgContainerRef.current;
      if (!el) return;
      let timer: ReturnType<typeof setTimeout>;
      const ro = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setDimensions({ width: el.clientWidth, height: el.clientHeight });
        }, 150);
      });
      ro.observe(el);
      setDimensions({ width: el.clientWidth, height: el.clientHeight });
      return () => {
        clearTimeout(timer);
        ro.disconnect();
      };
    }, []);

    const handleCellHover = (cell: GenericHeatmapCell | null) => {
      setHoveredCell(cell);
      onCellHover?.(cell);
    };

    useHeatmap(svgRef, data, {
      width: dimensions.width,
      height: dimensions.height,
      colorMap,
      baseColor,
      startDate,
      endDate,
      onCellClick,
      onCellHover: infoPanel || onCellHover ? handleCellHover : undefined,
    });

    const today = toInputValue(new Date());

    const dateControls = (
      <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName}>
        <input
          type="date"
          value={toInputValue(startDate)}
          max={toInputValue(endDate)}
          onChange={(e) => e.target.value && setStartDate(parseInputDate(e.target.value))}
          className="text-[10px] font-mono bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-primary-500/50 cursor-pointer"
        />
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">→</span>
        <input
          type="date"
          value={toInputValue(endDate)}
          min={toInputValue(startDate)}
          max={today}
          onChange={(e) => e.target.value && setEndDate(parseInputDate(e.target.value))}
          className="text-[10px] font-mono bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-primary-500/50 cursor-pointer"
        />
      </ChartToolbar>
    );

    const svgElement = (
      <div ref={svgContainerRef} className="w-full h-full">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="text-foreground"
        />
      </div>
    );

    // When infoPanel is provided, wrap in a 4-column grid (3 chart + 1 panel)
    if (infoPanel) {
      return (
        <div ref={ref} className={className} style={{ height }} {...props}>
          {!hideHeader && (
            <ChartHeader>
              <div>
                <ChartTitle>{title}</ChartTitle>
                {description && <ChartDescription>{description}</ChartDescription>}
              </div>
              {dateControls}
            </ChartHeader>
          )}
          <div
            className="grid gap-1 rounded-3xl bg-accent/5 lg:grid-cols-4"
            style={{ height: hideHeader ? height : height - 60 }}
          >
            <div className="lg:col-span-3 overflow-hidden">{svgElement}</div>
            <div className="lg:col-span-1 overflow-y-auto p-4">{infoPanel(hoveredCell)}</div>
          </div>
        </div>
      );
    }

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div className="flex flex-col h-full">
          {!hideHeader && (
            <ChartHeader>
              <div>
                <ChartTitle>{title}</ChartTitle>
                {description && <ChartDescription>{description}</ChartDescription>}
              </div>
              {dateControls}
            </ChartHeader>
          )}

          <ChartContent>{svgElement}</ChartContent>
        </div>
      </ChartContainer>
    );
  },
);

Heatmap.displayName = 'Heatmap';
