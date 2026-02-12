/**
 * Generic Pie/Donut Chart Component
 * D3.js-powered circular visualization for distributions.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { PieChartData } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface PieChartProps<T extends PieChartData = PieChartData> {
  data: T[];
  height?: number;
  innerRadius?: number; // > 0 for donut chart
  exportFileName?: string;
  onSliceClick?: (item: T) => void;
  className?: string;
}

export function PieChart<T extends PieChartData>({
  data,
  height = 400,
  innerRadius = 0,
  exportFileName = 'pie-chart',
  onSliceClick,
  className,
}: PieChartProps<T>) {
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

    const radius = Math.min(width, height) / 2 - 40;
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const pie = d3.pie<T>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<T>>().innerRadius(innerRadius).outerRadius(radius);

    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color || color(d.data.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', onSliceClick ? 'pointer' : 'default')
      .on('click', (_e, d) => onSliceClick?.(d.data));

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text((d) => (d.data.value > 5 ? d.data.label : ''));
  }, [data, width, height, innerRadius, onSliceClick]);

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
