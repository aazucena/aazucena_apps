/**
 * Generic Interactive Timeline Component
 * D3.js-powered chronological visualization for any time-based events or data.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { BaseNode } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface TimelineEvent extends BaseNode {
  date: Date | string;
  endDate?: Date | string;
}

export interface InteractiveTimelineProps<T extends TimelineEvent = TimelineEvent> {
  /** The chronological data events */
  data: T[];
  /** Map of categories to Hex colors */
  colorMap?: Record<string, string>;
  /** Height of the visualization */
  height?: number;
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when an event is clicked */
  onEventClick?: (event: T) => void;
  className?: string;
}

export function InteractiveTimeline<T extends TimelineEvent>({
  data,
  colorMap = {},
  height = 400,
  exportFileName = 'timeline-visual',
  onEventClick,
  className,
}: InteractiveTimelineProps<T>) {
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

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const parsedData = data
      .map((d) => ({
        ...d,
        _date: new Date(d.date),
        _endDate: d.endDate ? new Date(d.endDate) : new Date(d.date),
      }))
      .sort((a, b) => a._date.getTime() - b._date.getTime());

    const x = d3
      .scaleTime()
      .domain([
        d3.min(parsedData, (d) => d._date) || new Date(),
        d3.max(parsedData, (d) => d._endDate) || new Date(),
      ])
      .range([0, innerWidth]);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: any) =>
      colorMap[d.category || ''] || defaultColors(d.category || 'default');

    g.selectAll('rect')
      .data(parsedData)
      .join('rect')
      .attr('x', (d) => x(d._date))
      .attr('y', (_d, i) => (i * 30) % innerHeight)
      .attr('width', (d) => Math.max(x(d._endDate) - x(d._date), 10))
      .attr('height', 20)
      .attr('fill', getColor)
      .attr('rx', 4)
      .style('cursor', onEventClick ? 'pointer' : 'default')
      .on('click', (_event, d) => {
        if (onEventClick) onEventClick(d as any);
      })
      .append('title')
      .text((d) => `${d.name}: ${d._date.toLocaleDateString()}`);

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height, colorMap, onEventClick]);

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
