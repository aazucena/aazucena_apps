import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { BaseNode } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useInteractiveTimeline } from '../hooks/useInteractiveTimeline';

export interface TimelineEvent extends BaseNode {
  date: Date | string;
  endDate?: Date | string;
}

export interface InteractiveTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TimelineEvent[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  height?: number;
  exportFileName?: string;
  onEventClick?: (event: TimelineEvent) => void;
  /** Suppress the ChartHeader — recovers ~80px of canvas height */
  hideHeader?: boolean;
  /**
   * Field name used as the swim-lane grouping key.
   * Journey data uses `'type'` (values: 'experience' | 'education').
   * @default 'type'
   */
  laneKey?: string;
  /** Called on bar mouseenter/mouseleave with event + SVG-relative position */
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

export const InteractiveTimeline = forwardRef<HTMLDivElement, InteractiveTimelineProps>(
  (
    {
      data,
      title = 'Chronological Journey',
      description,
      colorMap = {},
      height = 400,
      exportFileName = 'timeline-visual',
      onEventClick,
      hideHeader = false,
      laneKey = 'type',
      onEventHover,
      hoverPopup,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    // Internal hover state — fed from hook callback into hoverPopup render prop
    const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
    const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number } | null>(null);

    const handleEventHover = (
      event: TimelineEvent | null,
      pos: { x: number; y: number } | null,
    ) => {
      setHoveredEvent(event);
      setHoveredPos(pos);
      onEventHover?.(event, pos);
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

    useInteractiveTimeline(svgRef, data, {
      width,
      height: svgHeight,
      colorMap,
      laneKey,
      onEventClick,
      onEventHover: hoverPopup || onEventHover ? handleEventHover : undefined,
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

    const svgEl = (
      <svg ref={svgRef} width={width} height="100%" className="w-full h-full text-foreground" />
    );

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          {header}

          <ChartContent className={hoverPopup ? 'relative p-0' : undefined}>
            {hoverPopup ? (
              <div className="relative w-full h-full">
                {svgEl}
                <div className="pointer-events-none absolute inset-0">
                  {hoverPopup(hoveredEvent, hoveredPos)}
                </div>
              </div>
            ) : (
              svgEl
            )}
          </ChartContent>
        </div>
      </ChartContainer>
    );
  },
);

InteractiveTimeline.displayName = 'InteractiveTimeline';
