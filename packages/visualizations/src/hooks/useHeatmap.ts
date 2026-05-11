import { useEffect } from 'react';
import * as d3 from 'd3';
import { Info } from 'luxon';
import type { GenericHeatmapCell } from '@aazucena/types';

export interface UseHeatmapOptions {
  width: number;
  colorMap: Record<string, string>;
  onCellClick?: (cell: GenericHeatmapCell) => void;
  onCellHover?: (cell: GenericHeatmapCell | null) => void;
  /** Called whenever the required SVG height changes (dynamic based on cell size) */
  onHeightChange?: (height: number) => void;
}

const MAX_CELL_SIZE = 35;
const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

/** Compute the SVG height for a given cell size */
export function heatmapHeight(cellSize: number): number {
  return 12 * cellSize + MARGIN.top + MARGIN.bottom;
}

/** Compute the cell size for a given container width and year count */
export function heatmapCellSize(containerWidth: number, yearCount: number): number {
  const available = containerWidth - MARGIN.left - MARGIN.right;
  return Math.min(MAX_CELL_SIZE, available / Math.max(yearCount, 1));
}

export function useHeatmap<T extends GenericHeatmapCell>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, colorMap, onCellClick, onCellHover, onHeightChange }: UseHeatmapOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const months = Info.months('short');

    // Derive unique years from data
    const years = Array.from(new Set(data.map((d) => new Date(d.date).getFullYear()))).sort(
      (a, b) => a - b,
    );

    const cellSize = heatmapCellSize(width, years.length);
    const svgHeight = heatmapHeight(cellSize);

    // Notify parent of height so it can resize the SVG container
    onHeightChange?.(svgHeight);

    const innerWidth = width - MARGIN.left - MARGIN.right;
    const gridWidth = years.length * cellSize;
    const xOffset = Math.max(0, (innerWidth - gridWidth) / 2);

    const maxCount = d3.max(data, (d) => d.value) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxCount]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('height', svgHeight);

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left + xOffset},${MARGIN.top})`);

    // Year labels (X-axis, above grid)
    g.selectAll('.year-label')
      .data(years)
      .enter()
      .append('text')
      .attr('class', 'year-label')
      .attr('x', (_d, i) => i * cellSize + cellSize / 2)
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('font-size', Math.max(10, Math.min(12, cellSize * 0.4)))
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text((d) => d);

    // Month labels (Y-axis, left of grid)
    months.forEach((month, i) => {
      g.append('text')
        .attr('x', -10)
        .attr('y', i * cellSize + cellSize / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-size', Math.max(9, Math.min(11, cellSize * 0.36)))
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(month);
    });

    // Build a lookup: "YYYY-M" → data cell
    const dataMap = new Map<string, T>();
    data.forEach((d) => {
      const dt = new Date(d.date);
      dataMap.set(`${dt.getFullYear()}-${dt.getMonth()}`, d);
    });

    // Generate all year×month combinations
    type GridCell = { year: number; month: number; data: T | null };
    const gridCells: GridCell[] = [];
    years.forEach((year) => {
      for (let month = 0; month < 12; month++) {
        gridCells.push({ year, month, data: dataMap.get(`${year}-${month}`) ?? null });
      }
    });

    const getRectColor = (cell: GridCell) => {
      if (!cell.data || cell.data.value === 0) return '#f3f4f6';
      const cat = cell.data.category;
      if (cat && colorMap[cat]) return colorMap[cat];
      return colorScale(cell.data.value);
    };

    // Draw cells
    const rects = g
      .selectAll<SVGRectElement, GridCell>('.cell')
      .data(gridCells)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => years.indexOf(d.year) * cellSize)
      .attr('y', (d) => d.month * cellSize)
      .attr('width', Math.max(1, cellSize - 2))
      .attr('height', Math.max(1, cellSize - 2))
      .attr('rx', Math.max(2, cellSize * 0.08))
      .attr('fill', getRectColor)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 0.5)
      .style('cursor', (d) => (d.data && onCellClick ? 'pointer' : 'default'));

    // Tooltips
    rects.append('title').text((d) => {
      if (!d.data || d.data.value === 0) return `${months[d.month]} ${d.year}: no activity`;
      return `${months[d.month]} ${d.year}: ${d.data.value} active skills`;
    });

    // Hover / click interactions
    if (onCellHover || onCellClick) {
      rects
        .on('mouseenter', function (_event, d) {
          if (!d.data || d.data.value === 0) return;
          d3.select(this).attr('stroke', '#3b82f6').attr('stroke-width', 2);
          onCellHover?.(d.data);
        })
        .on('mouseleave', function (_event, d) {
          d3.select(this).attr('stroke', '#e5e7eb').attr('stroke-width', 0.5);
          if (d.data && d.data.value > 0) onCellHover?.(null);
        })
        .on('click', (_event, d) => {
          if (d.data && onCellClick) onCellClick(d.data);
        });
    }
  }, [svgRef, data, width, colorMap, onCellClick, onCellHover, onHeightChange]);
}
