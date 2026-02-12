/**
 * Generic Line Chart Component
 * D3.js-powered line chart for time-series or sequential data.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { GenericTimeSeriesStep } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface LineChartProps<T extends GenericTimeSeriesStep = GenericTimeSeriesStep> {
  data: T[];
  height?: number;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  className?: string;
}

export function LineChart<T extends GenericTimeSeriesStep>({
  data,
  height = 400,
  colorMap = {},
  exportFileName = 'line-chart',
  className,
}: LineChartProps<T>) {
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

  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const keys = Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(Object.values(d.values))) || 0])
      .nice()
      .range([innerHeight, 0]);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5));
    g.append('g').call(d3.axisLeft(y));

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    keys.forEach((key) => {
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colorMap[key] || defaultColors(key))
        .attr('stroke-width', 2)
        .attr(
          'd',
          d3
            .line<T>()
            .x((d) => x(new Date(d.timestamp)))
            .y((d) => y(d.values[key] || 0))
            .curve(d3.curveMonotoneX),
        );
    });
  }, [data, width, height, colorMap]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl"
      />
    </div>
  );
}
