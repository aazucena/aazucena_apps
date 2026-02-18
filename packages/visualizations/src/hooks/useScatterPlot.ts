import { useEffect } from 'react';
import * as d3 from 'd3';
import type { ScatterPlotPoint } from '@aazucena/types';

export interface UseScatterPlotOptions {
  width: number;
  height: number;
  xAxisLabel: string;
  yAxisLabel: string;
  colorMap: Record<string, string>;
  onPointClick?: (point: any) => void;
}

export function useScatterPlot<T extends ScatterPlotPoint>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, xAxisLabel, yAxisLabel, colorMap, onPointClick }: UseScatterPlotOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y) as [number, number])
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
      .text(xAxisLabel);

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
      .text(yAxisLabel);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: T) => colorMap[d.category || ''] || defaultColors(d.category || 'default');

    // Draw Points
    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', (d) => d.r || 5)
      .attr('fill', getColor)
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', onPointClick ? 'pointer' : 'default')
      .on('mouseenter', function (_e, d: T) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d.r || 5) * 1.5)
          .attr('opacity', 1);
      })
      .on('mouseleave', function (_e, d: T) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.r || 5)
          .attr('opacity', 0.7);
      })
      .on('click', (_e, d) => onPointClick?.(d))
      .append('title')
      .text((d) => `${d.name || ''}: (${d.x}, ${d.y})`);
  }, [svgRef, data, width, height, xAxisLabel, yAxisLabel, colorMap, onPointClick]);
}
