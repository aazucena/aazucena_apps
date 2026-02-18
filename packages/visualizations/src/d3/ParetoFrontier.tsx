import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import type { ParetoData, GenericPoint } from '@aazucena/types';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
} from '../common/ChartContainer.js';
import { ChartToolbar } from '../common/ChartToolbar.js';
import { useParetoFrontier } from '../hooks/useParetoFrontier.js';

export interface ParetoFrontierProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ParetoData<GenericPoint>;
  title?: string;
  description?: string;
  height?: number;
  objectives?: { x: 'max' | 'min'; y: 'max' | 'min' };
  exportFileName?: string;
  onPointClick?: (point: GenericPoint) => void;
}

export const ParetoFrontier = forwardRef<HTMLDivElement, ParetoFrontierProps>(
  (
    {
      data,
      title = 'Optimization Analysis',
      description,
      height = 500,
      objectives = { x: 'max', y: 'max' },
      exportFileName = 'pareto-frontier',
      onPointClick,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    const frontierPoints = useMemo(() => {
      const sorted = [...data.points].sort((a, b) =>
        objectives.x === 'max' ? b.x - a.x : a.x - b.x,
      );

      const frontier: GenericPoint[] = [];
      let currentBestY = objectives.y === 'max' ? -Infinity : Infinity;

      for (const p of sorted) {
        const isBetter = objectives.y === 'max' ? p.y > currentBestY : p.y < currentBestY;
        if (isBetter) {
          frontier.push(p);
          currentBestY = p.y;
        }
      }
      return frontier;
    }, [data.points, objectives]);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) setWidth(containerRef.current.clientWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useParetoFrontier(svgRef, data, {
      width,
      height: height - 80, // Adjusted for header
      frontierPoints,
      onPointClick,
    });

    return (
      <ChartContainer ref={ref} className={className} style={{ height }} {...props}>
        <div ref={containerRef} className="flex flex-col h-full">
          <ChartHeader>
            <div>
              <ChartTitle>{title}</ChartTitle>
              {description && <ChartDescription>{description}</ChartDescription>}
            </div>
            <ChartToolbar svgRef={svgRef} data={data.points} fileName={exportFileName} />
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

ParetoFrontier.displayName = 'ParetoFrontier';
