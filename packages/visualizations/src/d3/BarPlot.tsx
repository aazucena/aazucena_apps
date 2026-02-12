/**
 * Generic Bar Plot Component
 * D3.js-powered plot for continuous data distributions (Histogram-style).
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { GenericPoint } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface BarPlotProps<T extends GenericPoint = GenericPoint> {
  data: T[];
  height?: number;
  color?: string;
  binCount?: number;
  exportFileName?: string;
  className?: string;
}

export function BarPlot<T extends GenericPoint>({
  data,
  height = 400,
  color = 'var(--color-primary, #3b82f6)',
  binCount = 20,
  exportFileName = 'bar-plot',
  className,
}: BarPlotProps<T>) {
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

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([0, innerWidth]);

    const histogram = d3
      .bin<T, number>()
      .value((d) => d.x)
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(binCount));

    const bins = histogram(data);

    const y = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(bins, (d) => d.length) || 0]);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    g.selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', 1)
      .attr('transform', (d) => `translate(${x(d.x0 || 0)},${y(d.length)})`)
      .attr('width', (d) => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr('height', (d) => innerHeight - y(d.length))
      .style('fill', color);
  }, [data, width, height, color, binCount]);

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
