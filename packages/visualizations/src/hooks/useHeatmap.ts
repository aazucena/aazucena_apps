import { useEffect } from 'react';
import * as d3 from 'd3';
import type { GenericHeatmapCell } from '@aazucena/types';

export interface UseHeatmapOptions {
  width: number;
  height: number;
  colorMap: Record<string, string>;
  baseColor: string;
  startDate?: Date;
  endDate?: Date;
  onCellClick?: (cell: any) => void;
  onCellHover?: (cell: GenericHeatmapCell | null) => void;
}

interface CalendarDay {
  date: Date;
  value: number;
  category?: string;
  weekIndex: number;
  dayOfWeek: number;
}

export function useHeatmap<T extends GenericHeatmapCell>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  {
    width,
    height,
    colorMap,
    baseColor,
    startDate,
    endDate,
    onCellClick,
    onCellHover,
  }: UseHeatmapOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || height === 0) return;

    // Build a lookup map keyed by ISO date string (YYYY-MM-DD)
    const dataMap = new Map<string, T>();
    data.forEach((d) => {
      const key = new Date(d.date).toISOString().slice(0, 10);
      dataMap.set(key, d);
    });

    // Resolve range — default to last 90 days if not provided
    const rangeEnd = endDate ? new Date(endDate) : new Date();
    rangeEnd.setHours(0, 0, 0, 0);
    const rangeEnd90 = new Date(rangeEnd);
    rangeEnd90.setDate(rangeEnd90.getDate() - 89);
    const rangeStart = startDate ? new Date(startDate) : rangeEnd90;
    rangeStart.setHours(0, 0, 0, 0);
    // Rewind to the nearest preceding Sunday for clean column alignment
    rangeStart.setDate(rangeStart.getDate() - rangeStart.getDay());

    // Generate all calendar days from rangeStart → rangeEnd
    const allDays: CalendarDay[] = [];
    const cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      const key = cursor.toISOString().slice(0, 10);
      const found = dataMap.get(key);
      allDays.push({
        date: new Date(cursor),
        value: found ? found.value : 0,
        category: found?.category,
        weekIndex: Math.floor(
          (cursor.getTime() - rangeStart.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ),
        dayOfWeek: cursor.getDay(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 16, bottom: 24, left: 16 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const lastDay = allDays[allDays.length - 1];
    const totalWeeks = lastDay ? lastDay.weekIndex + 1 : 53;

    const cellSize = Math.min(innerWidth / totalWeeks, innerHeight / 7);
    const cellGap = Math.max(2, cellSize * 0.12);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, d3.max(allDays, (d) => d.value) || 1])
      .range(['#e2e8f0', baseColor])
      .clamp(true);

    // Month label markers along the top
    const monthsDrawn = new Set<string>();
    allDays.forEach((d) => {
      if (d.date.getDate() === 1 || (d.dayOfWeek === 0 && d.date.getDate() <= 7)) {
        const monthKey = `${d.date.getFullYear()}-${d.date.getMonth()}`;
        if (!monthsDrawn.has(monthKey)) {
          monthsDrawn.add(monthKey);
          g.append('text')
            .attr('x', d.weekIndex * cellSize)
            .attr('y', -6)
            .attr('font-size', Math.max(9, cellSize * 0.55))
            .attr('fill', 'currentColor')
            .attr('opacity', 0.5)
            .text(d.date.toLocaleString('default', { month: 'short' }));
        }
      }
    });

    // Day-of-week labels (Mon, Wed, Fri)
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((label, i) => {
      if (i % 2 === 0) return; // only odd rows to avoid crowding
      g.append('text')
        .attr('x', totalWeeks * cellSize + 4)
        .attr('y', i * cellSize + cellSize * 0.75)
        .attr('font-size', Math.max(8, cellSize * 0.5))
        .attr('fill', 'currentColor')
        .attr('opacity', 0.4)
        .text(label);
    });

    // Cells
    g.selectAll('rect')
      .data(allDays)
      .enter()
      .append('rect')
      .attr('width', Math.max(1, cellSize - cellGap))
      .attr('height', Math.max(1, cellSize - cellGap))
      .attr('x', (d) => d.weekIndex * cellSize)
      .attr('y', (d) => d.dayOfWeek * cellSize)
      .attr('fill', (d) =>
        d.category ? colorMap[d.category] || colorScale(d.value) : colorScale(d.value),
      )
      .attr('rx', Math.max(1, cellSize * 0.15))
      .style('cursor', onCellClick ? 'pointer' : 'default')
      .append('title')
      .text(
        (d) =>
          `${d.date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}: ${d.value} events`,
      );

    if (onCellClick || onCellHover) {
      g.selectAll<SVGRectElement, CalendarDay>('rect')
        .on('click', (_event, d) => {
          if (onCellClick) {
            const original = dataMap.get(d.date.toISOString().slice(0, 10));
            if (original) onCellClick(original);
          }
        })
        .on('mouseenter', (_event, d) => {
          if (onCellHover) {
            const original = dataMap.get(d.date.toISOString().slice(0, 10));
            onCellHover(original ?? null);
          }
          // Highlight hovered cell
          d3.select(_event.currentTarget as SVGRectElement)
            .attr('stroke', 'currentColor')
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.8);
        })
        .on('mouseleave', (_event) => {
          if (onCellHover) onCellHover(null);
          d3.select(_event.currentTarget as SVGRectElement)
            .attr('stroke', null)
            .attr('stroke-width', null)
            .attr('stroke-opacity', null);
        });
    }
  }, [
    svgRef,
    data,
    width,
    height,
    colorMap,
    baseColor,
    startDate,
    endDate,
    onCellClick,
    onCellHover,
  ]);
}
