import { useEffect } from 'react';
import * as d3 from 'd3';
import type { GenericHeatmapCell } from '@aazucena/types';

export interface UseHeatmapOptions {
  width: number;
  height: number;
  colorMap: Record<string, string>;
  baseColor: string;
  onCellClick?: (cell: any) => void;
}

export function useHeatmap<T extends GenericHeatmapCell>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, colorMap, baseColor, onCellClick }: UseHeatmapOptions,
) {
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
  }, [svgRef, data, width, height, colorMap, baseColor, onCellClick]);
}
