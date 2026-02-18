import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { BaseNode } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useInteractiveTimeline } from '../hooks/useInteractiveTimeline.js';

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
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useInteractiveTimeline(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      colorMap,
      onEventClick,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          <ChartHeader>
            <div>
              <ChartTitle>{title}</ChartTitle>
              {description && <ChartDescription>{description}</ChartDescription>}
            </div>
            <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName} />
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

InteractiveTimeline.displayName = 'InteractiveTimeline';
