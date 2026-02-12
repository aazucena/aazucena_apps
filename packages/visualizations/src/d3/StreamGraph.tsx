/**
 * Generic StreamGraph Component
 * D3.js-powered stacked area visualization for evolution of values over time.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { GenericTimeSeriesStep } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface StreamGraphProps<T extends GenericTimeSeriesStep = GenericTimeSeriesStep> {
  /** The time-series data */
  data: T[];
  /** Map of categories to Hex colors */
  colorMap?: Record<string, string>;
  /** Height of the visualization */
  height?: number;
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when a layer is clicked */
  onLayerClick?: (key: string) => void;
  className?: string;
}

export function StreamGraph<T extends GenericTimeSeriesStep>({
  data,
  colorMap = {},
  height = 400,
  exportFileName = 'stream-graph',
  onLayerClick,
  className,
}: StreamGraphProps<T>) {
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

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const keys = Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));

    const stack = d3
      .stack<T>()
      .keys(keys)
      .value((d, key) => d.values[key] || 0)
      .offset(d3.stackOffsetSilhouette)
      .order(d3.stackOrderNone);

    const layers = stack(data);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(layers, (l) => d3.min(l, (d) => d[0])) || 0,
        d3.max(layers, (l) => d3.max(l, (d) => d[1])) || 0,
      ])
      .range([innerHeight, 0]);

    const area = d3
      .area<any>()
      .x((d) => x(new Date(d.data.timestamp)))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    g.selectAll('path')
      .data(layers)
      .join('path')
      .attr('d', area)
      .attr('fill', (d) => colorMap[d.key] || defaultColors(d.key))
      .attr('stroke', 'none')
      .style('cursor', onLayerClick ? 'pointer' : 'default')
      .on('click', (_event, d) => {
        if (onLayerClick) onLayerClick(d.key);
      })
      .append('title')
      .text((d) => d.key);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5));

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height, colorMap, onLayerClick]);

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
