import { useEffect } from 'react';
import * as d3 from 'd3';
import type { ParetoData, GenericPoint } from '@aazucena/types';

export interface UseParetoFrontierOptions {
  width: number;
  height: number;
  frontierPoints: any[];
  onPointClick?: (point: any) => void;
}

export function useParetoFrontier<T extends GenericPoint>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: ParetoData<T>,
  { width, height, frontierPoints, onPointClick }: UseParetoFrontierOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.points.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data.points, (d) => d.x) as [number, number])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data.points, (d) => d.y) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .append('text')
      .attr('x', innerWidth)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .text(data.xAxisLabel);

    g.append('g')
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
      .append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text(data.yAxisLabel);

    // Draw non-frontier points
    g.selectAll('.dot-base')
      .data(data.points)
      .join('circle')
      .attr('class', 'dot-base')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 4)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.2);

    // Draw the frontier line
    const line = d3
      .line<T>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveStepAfter);

    g.append('path')
      .datum(frontierPoints)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary, #3b82f6)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('d', line);

    // Draw frontier points (High-impact)
    g.selectAll('.dot-frontier')
      .data(frontierPoints)
      .join('circle')
      .attr('class', 'dot-frontier')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 6)
      .attr('fill', 'var(--color-primary, #3b82f6)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', onPointClick ? 'pointer' : 'default')
      .on('click', (_event, d) => onPointClick?.(d))
      .append('title')
      .text((d) => `${d.name}: ${d.x}, ${d.y} (Optimal)`);
  }, [svgRef, data, width, height, frontierPoints, onPointClick]);
}
