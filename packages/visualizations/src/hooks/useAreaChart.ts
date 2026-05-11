import { useEffect } from 'react';
import * as d3 from 'd3';
import type { AreaChartPoint } from '@aazucena/types';

export interface UseAreaChartOptions {
  width: number;
  height: number;
  color: string;
  fillOpacity: number;
}

export function useAreaChart<T extends AreaChartPoint>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, color, fillOpacity }: UseAreaChartOptions,
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

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Area generator
    const area = d3
      .area<T>()
      .x((d) => x(d.x))
      .y0(innerHeight)
      .y1((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    // Line generator (for the top edge)
    const line = d3
      .line<T>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append('path')
      .datum(data)
      .attr('fill', color)
      .attr('fill-opacity', fillOpacity)
      .attr('d', area);

    // Draw Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    g.append('g')
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  }, [svgRef, data, width, height, color, fillOpacity]);
}
