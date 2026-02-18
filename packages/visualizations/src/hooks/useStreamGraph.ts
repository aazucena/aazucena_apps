import { useEffect } from 'react';
import * as d3 from 'd3';
import type { GenericTimeSeriesStep } from '@aazucena/types';

export interface UseStreamGraphOptions {
  width: number;
  height: number;
  colorMap: Record<string, string>;
  onLayerClick?: (key: string) => void;
}

export function useStreamGraph<T extends GenericTimeSeriesStep>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, colorMap, onLayerClick }: UseStreamGraphOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const keys = Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));

    const stack = d3
      .stack<T>()
      .keys(keys)
      .value((d, key) => d.values[key] || 0)
      .offset(d3.stackOffsetSilhouette)
      .order(d3.stackOrderNone);

    const layers = stack(data);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(layers, (l) => d3.min(l, (d) => d[0])) || 0,
        d3.max(layers, (l) => d3.max(l, (d) => d[1])) || 0,
      ])
      .range([innerHeight, 0]);

    const area = d3
      .area<any>()
      .x((d) => x(new Date(d.data.timestamp)))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    g.selectAll('path')
      .data(layers)
      .join('path')
      .attr('d', area)
      .attr('fill', (d) => colorMap[d.key] || defaultColors(d.key))
      .attr('stroke', 'none')
      .style('cursor', onLayerClick ? 'pointer' : 'default')
      .on('click', (_event, d) => {
        if (onLayerClick) onLayerClick(d.key);
      })
      .append('title')
      .text((d) => d.key);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'text-[10px] text-muted-foreground')
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
  }, [svgRef, data, width, height, colorMap, onLayerClick]);
}
