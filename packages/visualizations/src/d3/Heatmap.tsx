/**
 * Generic Heatmap Component
 * D3.js-powered activity heatmap for any time-series data.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { GenericHeatmapCell } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface HeatmapProps<T extends GenericHeatmapCell = GenericHeatmapCell> {
  /** The time-series data cells */
  data: T[];
  /** Map of categories to Hex colors */
  colorMap?: Record<string, string>;
  /** Default base color for the heatmap */
  baseColor?: string;
  /** Height of the visualization */
  height?: number;
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when a cell is clicked */
  onCellClick?: (cell: T) => void;
  className?: string;
}

export function Heatmap<T extends GenericHeatmapCell>({
  data,
  colorMap = {},
  baseColor = '#3b82f6',
  height = 200,
  exportFileName = 'activity-heatmap',
  onCellClick,
  className,
}: HeatmapProps<T>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Basic Heatmap Grid Implementation
    const cellSize = Math.min(innerWidth / 53, innerHeight / 7);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, d3.max(data, (d) => d.value) || 10])
      .range(['#f1f5f9', baseColor]);

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', cellSize - 2)
      .attr('height', cellSize - 2)
      .attr('x', (_d, i) => Math.floor(i / 7) * cellSize)
      .attr('y', (_d, i) => (i % 7) * cellSize)
      .attr('fill', (d) =>
        d.category ? colorMap[d.category] || colorScale(d.value) : colorScale(d.value),
      )
      .attr('rx', 2)
      .style('cursor', onCellClick ? 'pointer' : 'default')
      .on('click', (_event, d) => onCellClick?.(d));

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height, colorMap, baseColor, onCellClick]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-2xl transition-colors"
      />
    </div>
  );
}
