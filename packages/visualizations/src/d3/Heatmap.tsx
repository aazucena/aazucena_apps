import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import type { GenericHeatmapCell } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useHeatmap, heatmapCellSize, heatmapHeight } from '../hooks/useHeatmap';

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericHeatmapCell[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  /** Maximum SVG height in px. Omit to size from the container width. */
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
      title = 'Skill Usage Heatmap',
      description,
      colorMap = {},
      height: heightProp,
      exportFileName = 'skill-heatmap',
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [svgHeight, setSvgHeight] = useState(heightProp ?? 300);
    const [hoveredCell, setHoveredCell] = useState<GenericHeatmapCell | null>(null);

    // Track container width only — height is dynamic from the hook
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver(() => setWidth(el.clientWidth));
      ro.observe(el);
      setWidth(el.clientWidth);
      return () => ro.disconnect();
    }, []);

    const handleHeightChange = useCallback((h: number) => {
      setSvgHeight(h);
    }, []);

    const handleCellHover = useCallback(
      (cell: GenericHeatmapCell | null) => {
        setHoveredCell(cell);
        onCellHover?.(cell);
      },
      [onCellHover],
    );

    useHeatmap(svgRef, data, {
      width,
      colorMap,
      onCellClick,
      onCellHover: infoPanel || onCellHover ? handleCellHover : undefined,
      onHeightChange: handleHeightChange,
      maxHeight: heightProp,
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

    if (infoPanel) {
      return (
        <div ref={ref} className={className} {...props}>
          {header}
          <div className="grid grid-cols-1 overflow-hidden rounded-[var(--radius-card,6px)] bg-(--panel) lg:grid-cols-4">
            {/* Heatmap — 3/4 width */}
            <div ref={containerRef} className="relative p-4 lg:col-span-3">
              <svg
                ref={svgRef}
                width={width}
                height={svgHeight}
                className="w-full text-(--foreground)"
              />
            </div>

            {/* Info panel — 1/4 width */}
            <div className="flex h-full flex-col lg:col-span-1">
              <div className="flex h-full flex-col border-t border-(--rule) p-(--panel-padding) lg:border-t-0 lg:border-l">
                {infoPanel(hoveredCell)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ChartContainer ref={ref} className={className} {...props}>
        <div className="flex flex-col h-full">
          {header}
          <ChartContent>
            <div ref={containerRef} className="w-full">
              <svg
                ref={svgRef}
                width={width}
                height={svgHeight}
                className="w-full text-foreground"
              />
            </div>
          </ChartContent>
        </div>
      </ChartContainer>
    );
  },
);

Heatmap.displayName = 'Heatmap';
