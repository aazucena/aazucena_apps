/**
 * Generic Scatter Plot Component
 * D3.js-powered scatter plot for visualizing relationships between two variables.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { ScatterPlotPoint } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface ScatterPlotProps<T extends ScatterPlotPoint = ScatterPlotPoint> {
  data: T[];
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  onPointClick?: (point: T) => void;
  className?: string;
}

export function ScatterPlot<T extends ScatterPlotPoint>({
  data,
  height = 500,
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis',
  colorMap = {},
  exportFileName = 'scatter-plot',
  onPointClick,
  className,
}: ScatterPlotProps<T>) {
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

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', innerWidth)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .text(xAxisLabel);

    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(yAxisLabel);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: T) => colorMap[d.category || ''] || defaultColors(d.category || 'default');

    // Draw Points
    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', (d) => d.r || 5)
      .attr('fill', getColor)
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', onPointClick ? 'pointer' : 'default')
      .on('mouseenter', function (_e, d: T) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d.r || 5) * 1.5)
          .attr('opacity', 1);
      })
      .on('mouseleave', function (_e, d: T) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.r || 5)
          .attr('opacity', 0.7);
      })
      .on('click', (_e, d) => onPointClick?.(d))
      .append('title')
      .text((d) => `${d.name || ''}: (${d.x}, ${d.y})`);
  }, [data, width, height, xAxisLabel, yAxisLabel, colorMap, onPointClick]);

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
