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

    useStreamGraph(svgRef, data, {
      width,
      height: height - headerOffset,
      colorMap,
      onLayerClick,
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

StreamGraph.displayName = 'StreamGraph';
