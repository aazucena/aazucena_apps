/**
 * Generic Spider Chart (Radar) Component
 * D3.js-powered multi-variate data visualization.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { SpiderChartData } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface SpiderChartProps<T extends SpiderChartData = SpiderChartData> {
  /** The multi-dimensional data sets */
  data: T[];
  /** Map of data set names to Hex colors */
  colorMap?: Record<string, string>;
  /** Height of the visualization */
  height?: number;
  /** Max value for all axes (defaults to 100) */
  maxValue?: number;
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when a blob is clicked */
  onBlobClick?: (item: T) => void;
  className?: string;
}

export function SpiderChart<T extends SpiderChartData>({
  data,
  colorMap = {},
  height = 500,
  maxValue = 100,
  exportFileName = 'spider-chart',
  onBlobClick,
  className,
}: SpiderChartProps<T>) {
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

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const allAxes = data[0]?.axes.map((d) => d.axis) || [];
    const totalAxes = allAxes.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    // Draw grid
    const axisGrid = g.append('g').attr('class', 'axisWrapper');
    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, 6).reverse())
      .enter()
      .append('circle')
      .attr('r', (d) => (radius / 5) * d)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.1);

    // Draw axes
    const axis = axisGrid
      .selectAll('.axis')
      .data(allAxes)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (_d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.2);

    axis
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (_d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (_d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('fill', 'currentColor')
      .style('font-size', '10px')
      .text((d) => d);

    // Draw data blobs
    const radarLine = d3
      .lineRadial<any>()
      .radius((d) => rScale(d.value))
      .angle((_d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    const blobWrapper = g
      .selectAll('.radarWrapper')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'radarWrapper');

    blobWrapper
      .append('path')
      .attr('d', (d) => radarLine(d.axes))
      .style('fill', (d) => colorMap[d.name] || defaultColors(d.name))
      .style('fill-opacity', 0.3)
      .style('stroke', (d) => colorMap[d.name] || defaultColors(d.name))
      .style('stroke-width', 2)
      .style('cursor', onBlobClick ? 'pointer' : 'default')
      .on('click', (_event, d) => {
        if (onBlobClick) onBlobClick(d);
      });

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height, maxValue, colorMap, onBlobClick]);

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
