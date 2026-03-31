import React, { forwardRef, useRef, useState, useEffect } from 'react';
import type { MapRegion } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer';
import { ChartToolbar } from '../common/ChartToolbar';
import { useChoroplethMap } from '../hooks/useChoroplethMap';

export interface ChoroplethMapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: MapRegion[];
  geoJson: any;
  title?: string;
  description?: string;
  height?: number;
  colors?: [string, string];
  exportFileName?: string;
  onRegionClick?: (region: MapRegion) => void;
}

export const ChoroplethMap = forwardRef<HTMLDivElement, ChoroplethMapProps>(
  (
    {
      data,
      geoJson,
      title = 'Geospatial Analysis',
      description,
      height = 500,
      colors = ['#e2e8f0', '#3b82f6'],
      exportFileName = 'choropleth-map',
      onRegionClick,
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

    useChoroplethMap(svgRef, data, geoJson, {
      width,
      height: height - 80, // Adjusted for header
      colors,
      onRegionClick,
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

ChoroplethMap.displayName = 'ChoroplethMap';
