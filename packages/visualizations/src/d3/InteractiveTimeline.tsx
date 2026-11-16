import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { BaseNode } from '@aazucena/types';
import { ChartContainer } from '../common/ChartContainer';
import { useInteractiveTimeline } from '../hooks/useInteractiveTimeline';
import { categorical, chartControl, chartControlOn } from '../theme';
import { cn } from '@aazucena/utils';

export interface TimelineEvent extends BaseNode {
  date: Date | string;
  endDate?: Date | string;
  /** Secondary label shown below the node (e.g. company, institution) */
  subtitle?: string;
  /** Avatar / logo image URL — falls back to name initials if omitted */
  avatarUrl?: string;
  /** Alt text for avatarUrl */
  avatarAlt?: string;
}

export interface InteractiveTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TimelineEvent[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  height?: number;
  exportFileName?: string;
  onEventClick?: (event: TimelineEvent) => void;
  /** Suppress the built-in header */
  hideHeader?: boolean;
  /**
   * Field name used as the swim-lane / filter grouping key.
   * Journey data uses 'type' (values: 'experience' | 'education').
   * @default 'type'
   */
  laneKey?: string;
  /** Show All / per-type filter buttons. @default true */
  showFilter?: boolean;
  /** Called on node mouseenter/mouseleave with event + SVG-relative position */
  onEventHover?: (event: TimelineEvent | null, pos: { x: number; y: number } | null) => void;
  /**
   * Render prop for an absolute-positioned hover popup.
   * Package owns positioning; caller owns content.
   */
  hoverPopup?: (
    event: TimelineEvent | null,
    pos: { x: number; y: number } | null,
  ) => React.ReactNode;
}

// ── Zoom button ──────────────────────────────────────────────────────────────
function ZoomBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(chartControl, 'border border-(--rule) bg-(--panel) font-mono')}
    >
      {children}
    </button>
  );
}

export const InteractiveTimeline = forwardRef<HTMLDivElement, InteractiveTimelineProps>(
  (
    {
      data,
      colorMap = {},
      height: heightProp = 500,
      onEventClick,
      hideHeader = false,
      laneKey = 'type',
      showFilter = true,
      onEventHover,
      hoverPopup,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(heightProp);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
    const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number } | null>(null);

    // Unique lane values for filter buttons
    const laneValues = [
      ...new Set(data.map((d) => String((d as any)[laneKey] || '')).filter(Boolean)),
    ];

    // Filtered data
    const filteredData =
      activeFilter === 'all'
        ? data
        : data.filter((d) => String((d as any)[laneKey]) === activeFilter);

    // UI chrome heights (filter pills + legend) that sit outside the SVG drawing area
    const pillsVisible = showFilter && laneValues.length > 1;
    const legendVisible = laneValues.length > 0;
    const uiOverhead = (pillsVisible ? 56 : 0) + (legendVisible ? 48 : 0);

    // The hook draws at svgHeight; the container is svgHeight + uiOverhead
    const svgHeight = Math.max(300, height - uiOverhead);

    // When hook reports required SVG height, store total container height in state
    const onHeightChange = useCallback((h: number) => setHeight(h + uiOverhead), [uiOverhead]);

    // Hover state
    const handleEventHover = useCallback(
      (event: TimelineEvent | null, pos: { x: number; y: number } | null) => {
        setHoveredEvent(event);
        setHoveredPos(pos);
        onEventHover?.(event, pos);
      },
      [onEventHover],
    );

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useInteractiveTimeline(svgRef, filteredData, {
      width,
      height: svgHeight,
      colorMap,
      laneKey,
      onEventClick,
      onEventHover: hoverPopup || onEventHover ? handleEventHover : undefined,
      onHeightChange,
      zoomRef,
    });

    const zoomBy = (factor: number) => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current)
          .transition()
          .call(zoomRef.current.scaleBy as any, factor);
      }
    };
    const zoomReset = () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current)
          .transition()
          .call(zoomRef.current.transform as any, d3.zoomIdentity);
      }
    };

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="relative flex flex-col h-full">
          {/* Filter pills */}
          {showFilter && laneValues.length > 1 && (
            <div className="flex flex-wrap gap-2 px-4 pt-4">
              {['all', ...laneValues].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setActiveFilter(v)}
                  aria-pressed={activeFilter === v}
                  className={cn(
                    chartControl,
                    'border border-(--rule) px-3 capitalize',
                    activeFilter === v && chartControlOn,
                  )}
                >
                  {v === 'all' ? 'All' : v}
                </button>
              ))}
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-1.5">
            <ZoomBtn onClick={() => zoomBy(1.25)} title="Zoom In">
              +
            </ZoomBtn>
            <ZoomBtn onClick={() => zoomBy(0.8)} title="Zoom Out">
              −
            </ZoomBtn>
            <ZoomBtn onClick={zoomReset} title="Reset">
              ↺
            </ZoomBtn>
          </div>

          {/* SVG */}
          <div className="relative flex-1 min-h-0">
            <svg
              ref={svgRef}
              width={width}
              height={svgHeight}
              className="w-full touch-none text-foreground"
              style={{ overflow: 'visible' }}
            />

            {/* Hover popup overlay */}
            {hoverPopup && (
              <div className="pointer-events-none absolute inset-0">
                {hoverPopup(hoveredEvent, hoveredPos)}
              </div>
            )}
          </div>

          {/* Legend */}
          {laneValues.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 px-4 pb-4 pt-2">
              {laneValues.map((v) => {
                const color =
                  colorMap[v] ?? categorical[laneValues.indexOf(v) % categorical.length];
                return (
                  <div key={v} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs capitalize text-(--muted-foreground)">{v}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ChartContainer>
    );
  },
);

InteractiveTimeline.displayName = 'InteractiveTimeline';
