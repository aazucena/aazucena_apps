import { useEffect } from 'react';
import * as d3 from 'd3';
import type { GenericPoint } from '@aazucena/types';

export interface UseBarPlotOptions {
  width: number;
  height: number;
  color: string;
  binCount: number;
}

export function useBarPlot<T extends GenericPoint>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, color, binCount }: UseBarPlotOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([0, innerWidth]);

    const histogram = d3
      .bin<T, number>()
      .value((d) => d.x)
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(binCount));

    const bins = histogram(data);

    const y = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(bins, (d) => d.length) || 0]);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    g.append('g')
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));

    g.selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', 1)
      .attr('transform', (d) => `translate(${x(d.x0 || 0)},${y(d.length)})`)
      .attr('width', (d) => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr('height', (d) => innerHeight - y(d.length))
      .style('fill', color);
  }, [svgRef, data, width, height, color, binCount]);
}
