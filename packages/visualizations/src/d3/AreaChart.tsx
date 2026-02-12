/**
 * Generic Area Chart Component
 * D3.js-powered area chart for visualizing volume or cumulative data over time.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { AreaChartPoint } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface AreaChartProps<T extends AreaChartPoint = AreaChartPoint> {
  data: T[];
  height?: number;
  color?: string;
  fillOpacity?: number;
  exportFileName?: string;
  className?: string;
}

export function AreaChart<T extends AreaChartPoint>({
  data,
  height = 400,
  color = 'var(--color-primary, #3b82f6)',
  fillOpacity = 0.3,
  exportFileName = 'area-chart',
  className,
}: AreaChartProps<T>) {
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

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Area generator
    const area = d3
      .area<T>()
      .x((d) => x(d.x))
      .y0(innerHeight)
      .y1((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    // Line generator (for the top edge)
    const line = d3
      .line<T>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append('path')
      .datum(data)
      .attr('fill', color)
      .attr('fill-opacity', fillOpacity)
      .attr('d', area);

    // Draw Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Axes
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));
  }, [data, width, height, color, fillOpacity]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl transition-colors"
      />
    </div>
  );
}
