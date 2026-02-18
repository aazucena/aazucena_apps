import { useEffect } from 'react';
import * as d3 from 'd3';
import type { TimelineEvent } from '../d3/InteractiveTimeline.js';

export interface UseInteractiveTimelineOptions {
  width: number;
  height: number;
  colorMap: Record<string, string>;
  onEventClick?: (event: any) => void;
}

export function useInteractiveTimeline<T extends TimelineEvent>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, colorMap, onEventClick }: UseInteractiveTimelineOptions,
) {
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

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

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
  }, [svgRef, data, width, height, colorMap, onEventClick]);
}
