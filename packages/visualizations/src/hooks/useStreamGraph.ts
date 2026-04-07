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

    // Extra bottom margin houses the legend
    const LEGEND_ROW_H = 18;
    const keys = Array.from(new Set(data.flatMap((d) => Object.keys(d.values))));
    const legendRows = Math.ceil(keys.length / 5);
    const legendH = legendRows * LEGEND_ROW_H + 12;

    const margin = { top: 20, right: 30, bottom: 40 + legendH, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10).domain(keys);
    const getColor = (key: string) => colorMap[key] || defaultColors(key);

    // Tooltip
    const tooltip = d3
      .select('body')
      .selectAll('.stream-viz-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'stream-viz-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100);

    // Stream layers
    g.selectAll('.stream-layer')
      .data(layers)
      .join('path')
      .attr('class', 'stream-layer')
      .attr('d', area)
      .attr('fill', (d) => getColor(d.key))
      .attr('fill-opacity', 0.8)
      .attr('stroke', 'none')
      .style('cursor', onLayerClick ? 'pointer' : 'default')
      .on('mouseenter', function (_event, d) {
        d3.selectAll('.stream-layer').attr('fill-opacity', 0.25);
        d3.select(this).attr('fill-opacity', 1);
        tooltip.style('opacity', 1).text(d.key);
      })
      .on('mousemove', function (event) {
        tooltip.style('left', event.pageX + 12 + 'px').style('top', event.pageY - 32 + 'px');
      })
      .on('mouseleave', function () {
        d3.selectAll('.stream-layer').attr('fill-opacity', 0.8);
        tooltip.style('opacity', 0);
      })
      .on('click', (_event, d) => {
        if (onLayerClick) onLayerClick(d.key);
      });

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(keys.length, width / 80))
          .tickSizeOuter(0),
      )
      .call((ax) => ax.select('.domain').remove())
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px');

    // SVG legend — drawn below the x-axis within the bottom margin
    const legendG = g.append('g').attr('transform', `translate(0,${innerHeight + 36})`);
    const itemW = Math.min(140, innerWidth / 5);

    keys.forEach((key, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const lg = legendG
        .append('g')
        .attr('transform', `translate(${col * itemW},${row * LEGEND_ROW_H})`);

      lg.append('circle').attr('r', 5).attr('cx', 5).attr('cy', 0).attr('fill', getColor(key));
      lg.append('text')
        .attr('x', 14)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', 'currentColor')
        .text(key);
    });

    return () => {
      d3.selectAll('.stream-viz-tooltip').remove();
    };
  }, [svgRef, data, width, height, colorMap, onLayerClick]);
}
