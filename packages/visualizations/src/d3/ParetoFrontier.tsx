/**
 * Generic Pareto Frontier Component
 * D3.js-powered visualization for multi-objective optimization trade-offs.
 * Highlights the "Optimal" solutions in a dataset.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { ParetoData, GenericPoint } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface ParetoFrontierProps<T extends GenericPoint = GenericPoint> {
  data: ParetoData<T>;
  height?: number;
  /** Whether to maximize or minimize the objectives (defaults to max/max) */
  objectives?: { x: 'max' | 'min'; y: 'max' | 'min' };
  exportFileName?: string;
  onPointClick?: (point: T) => void;
  className?: string;
}

export function ParetoFrontier<T extends GenericPoint>({
  data,
  height = 500,
  objectives = { x: 'max', y: 'max' },
  exportFileName = 'pareto-frontier',
  onPointClick,
  className,
}: ParetoFrontierProps<T>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Logic to calculate the Pareto Frontier (the set of non-dominated points)
  const frontierPoints = useMemo(() => {
    const sorted = [...data.points].sort((a, b) =>
      objectives.x === 'max' ? b.x - a.x : a.x - b.x,
    );

    const frontier: T[] = [];
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

  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.points.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data.points, (d) => d.x) as [number, number])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data.points, (d) => d.y) as [number, number])
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
      .text(data.xAxisLabel);

    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(data.yAxisLabel);

    // Draw non-frontier points
    g.selectAll('.dot-base')
      .data(data.points)
      .join('circle')
      .attr('class', 'dot-base')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 4)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.2);

    // Draw the frontier line
    const line = d3
      .line<T>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveStepAfter);

    g.append('path')
      .datum(frontierPoints)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary, #3b82f6)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('d', line);

    // Draw frontier points (High-impact)
    g.selectAll('.dot-frontier')
      .data(frontierPoints)
      .join('circle')
      .attr('class', 'dot-frontier')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 6)
      .attr('fill', 'var(--color-primary, #3b82f6)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', onPointClick ? 'pointer' : 'default')
      .on('click', (_event, d) => onPointClick?.(d))
      .append('title')
      .text((d) => `${d.name}: ${d.x}, ${d.y} (Optimal)`);

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height, frontierPoints, onPointClick]);

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
