import { useEffect } from 'react';
import * as d3 from 'd3';
import type { GenericTimeSeriesStep } from '@aazucena/types';

export interface UseLineChartOptions {
  width: number;
  height: number;
  visibleKeys: Set<string>;
  scaleType: 'linear' | 'log';
  showGrid: boolean;
  showPoints: boolean;
  colorMap: Record<string, string>;
  allKeys: string[];
}

export function useLineChart<T extends GenericTimeSeriesStep>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  {
    width,
    height,
    visibleKeys,
    scaleType,
    showGrid,
    showPoints,
    colorMap,
    allKeys,
  }: UseLineChartOptions,
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
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const visibleMax =
      d3.max(data, (d) =>
        d3.max(
          Object.entries(d.values)
            .filter(([key]) => visibleKeys.has(key))
            .map(([, val]) => val),
        ),
      ) || 0;

    const y = (scaleType === 'log' ? d3.scaleLog() : d3.scaleLinear())
      .domain([scaleType === 'log' ? 1 : 0, visibleMax])
      .nice()
      .range([innerHeight, 0]);

    if (showGrid) {
      g.append('g')
        .attr('class', 'grid opacity-[0.05]')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(5)
            .tickSize(-innerHeight)
            .tickFormat(() => ''),
        );

      g.append('g')
        .attr('class', 'grid opacity-[0.05]')
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => ''),
        );
    }

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    g.append('g')
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    allKeys.forEach((key) => {
      if (!visibleKeys.has(key)) return;
      const color = colorMap[key] || defaultColors(key);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr(
          'd',
          d3
            .line<T>()
            .x((d) => x(new Date(d.timestamp)))
            .y((d) => y(Math.max(scaleType === 'log' ? 1 : 0, d.values[key] || 0)))
            .curve(d3.curveMonotoneX),
        );

      if (showPoints) {
        g.selectAll(`.dot-${key}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('class', `dot-${key}`)
          .attr('cx', (d) => x(new Date(d.timestamp)))
          .attr('cy', (d) => y(Math.max(scaleType === 'log' ? 1 : 0, d.values[key] || 0)))
          .attr('r', 3)
          .attr('fill', color)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
      }
    });
  }, [
    svgRef,
    data,
    width,
    height,
    visibleKeys,
    scaleType,
    showGrid,
    showPoints,
    colorMap,
    allKeys,
  ]);
}
