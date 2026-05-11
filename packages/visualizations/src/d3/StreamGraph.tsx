import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { GenericTimeSeriesStep } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useStreamGraph } from '../hooks/useStreamGraph';

export interface StreamGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  data: GenericTimeSeriesStep[];
  title?: string;
  description?: string;
  colorMap?: Record<string, string>;
  height?: number;
  /** Pixels reserved for the chart header. Subtracted from SVG draw height. @default 80 */
  headerOffset?: number;
  exportFileName?: string;
  onLayerClick?: (key: string) => void;
  /** Suppress the ChartHeader — recovers ~80px of canvas height */
  hideHeader?: boolean;
}

export const StreamGraph = forwardRef<HTMLDivElement, StreamGraphProps>(
  (
    {
      data,
      title = 'Stream Analysis',
      description,
      colorMap = {},
      height = 400,
      headerOffset = 80,
      exportFileName = 'stream-graph',
      onLayerClick,
      hideHeader = false,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (containerRef.current) setWidth(containerRef.current.clientWidth);
        }, 150);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const effectiveOffset = hideHeader ? 0 : headerOffset;

    useStreamGraph(svgRef, data, {
      width,
      height: height - effectiveOffset,
      colorMap,
      onLayerClick,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          {!hideHeader && (
            <ChartHeader>
              <div>
                <ChartTitle>{title}</ChartTitle>
                {description && <ChartDescription>{description}</ChartDescription>}
              </div>
              <ChartToolbar svgRef={svgRef} data={data} fileName={exportFileName} />
            </ChartHeader>
          )}

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

StreamGraph.displayName = 'StreamGraph';
