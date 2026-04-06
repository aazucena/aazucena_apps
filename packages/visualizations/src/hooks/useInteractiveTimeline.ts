import { useEffect } from 'react';
import * as d3 from 'd3';
import type { TimelineEvent } from '../d3/InteractiveTimeline';

export interface UseInteractiveTimelineOptions {
  width: number;
  height: number;
  colorMap: Record<string, string>;
  /** Field name to use as the swim-lane group key. @default 'type' */
  laneKey?: string;
  onEventClick?: (event: any) => void;
  /** Called on bar mouseenter/mouseleave with the event and SVG-relative position */
  onEventHover?: (event: any | null, pos: { x: number; y: number } | null) => void;
}

export function useInteractiveTimeline<T extends TimelineEvent>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  {
    width,
    height,
    colorMap,
    laneKey = 'type',
    onEventClick,
    onEventHover,
  }: UseInteractiveTimelineOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const parsedData = data
      .map((d) => ({
        ...d,
        _date: new Date(d.date),
        _endDate: d.endDate ? new Date(d.endDate) : new Date(d.date),
        _lane: String((d as any)[laneKey] || 'default'),
      }))
      .sort((a, b) => a._date.getTime() - b._date.getTime());

    // Time scale
    const x = d3
      .scaleTime()
      .domain([
        d3.min(parsedData, (d) => d._date) || new Date(),
        d3.max(parsedData, (d) => d._endDate) || new Date(),
      ])
      .range([0, innerWidth]);

    // Swim-lane scale — one band per unique laneKey value
    const laneNames = [...new Set(parsedData.map((d) => d._lane))];
    const yScale = d3.scaleBand().domain(laneNames).range([0, innerHeight]).paddingInner(0.3);

    // Lane background stripes + left labels
    laneNames.forEach((lane) => {
      const laneY = yScale(lane) ?? 0;
      const bandH = yScale.bandwidth();

      g.append('rect')
        .attr('x', 0)
        .attr('y', laneY)
        .attr('width', innerWidth)
        .attr('height', bandH)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.03)
        .attr('rx', 4);

      g.append('text')
        .attr('x', -8)
        .attr('y', laneY + bandH / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.6)
        .text(lane.charAt(0).toUpperCase() + lane.slice(1));
    });

    // X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: (typeof parsedData)[0]) => colorMap[d._lane] || defaultColors(d._lane);

    const bars = g
      .selectAll('rect.event')
      .data(parsedData)
      .join('rect')
      .attr('class', 'event')
      .attr('x', (d) => x(d._date))
      .attr('y', (d) => yScale(d._lane) ?? 0)
      .attr('width', (d) => Math.max(x(d._endDate) - x(d._date), 10))
      .attr('height', yScale.bandwidth())
      .attr('fill', getColor)
      .attr('rx', 4)
      .style('cursor', onEventClick || onEventHover ? 'pointer' : 'default');

    bars.append('title').text((d) => `${d.name}: ${d._date.toLocaleDateString()}`);

    // Event name labels inside bars — hidden when bar too narrow
    g.selectAll('text.event-label')
      .data(parsedData)
      .join('text')
      .attr('class', 'event-label')
      .attr('x', (d) => x(d._date) + 6)
      .attr('y', (d) => (yScale(d._lane) ?? 0) + yScale.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '9px')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .text((d) => {
        const barW = Math.max(x(d._endDate) - x(d._date), 0);
        if (barW < 40) return '';
        const maxChars = Math.floor(barW / 6);
        return d.name.length > maxChars ? d.name.slice(0, maxChars - 1) + '…' : d.name;
      });

    if (onEventClick) {
      bars.on('click', (_event, d) => onEventClick(d as any));
    }

    if (onEventHover && svgRef.current) {
      const svgEl = svgRef.current;
      bars
        .on('mouseenter', function (e, d) {
          const cr = svgEl.getBoundingClientRect();
          const er = (e.currentTarget as SVGRectElement).getBoundingClientRect();
          onEventHover(d as any, {
            x: er.left - cr.left + er.width / 2,
            y: er.top - cr.top,
          });
        })
        .on('mouseleave', () => onEventHover(null, null));
    }
  }, [svgRef, data, width, height, colorMap, laneKey, onEventClick, onEventHover]);
}
