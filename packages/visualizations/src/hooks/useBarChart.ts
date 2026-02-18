import { useEffect } from 'react';
import * as d3 from 'd3';
import type { BarChartData } from '@aazucena/types';

export interface UseBarChartOptions {
  width: number;
  height: number;
  horizontal: boolean;
  racing: boolean;
  color: string;
  onBarClick?: (item: any) => void;
}

export function useBarChart<T extends BarChartData>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, horizontal, racing, color, onBarClick }: UseBarChartOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    if (!racing) svg.selectAll('*').remove();

    const margin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: horizontal ? 120 : 60,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let g = svg.select<SVGGElement>('g.main-group');
    if (g.empty()) {
      g = svg
        .append('g')
        .attr('class', 'main-group')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }

    const t = d3.transition().duration(750).ease(d3.easeCubicOut);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const tooltip = d3
      .select('body')
      .selectAll('.viz-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'viz-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.85)')
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('font-size', '11px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100);

    if (horizontal) {
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (item) => item.value) || 0])
        .range([0, innerWidth]);

      const y = d3
        .scaleBand()
        .range([0, innerHeight])
        .domain(data.map((item) => item.label))
        .padding(0.2);

      const xAxis = g
        .selectAll('.x-axis')
        .data([0])
        .join('g')
        .attr('class', 'x-axis text-[10px] text-muted-foreground')
        .attr('transform', `translate(0,${innerHeight})`);
      xAxis.transition(t as any).call(d3.axisBottom(x).ticks(5).tickSizeOuter(0) as any);

      const yAxis = g
        .selectAll('.y-axis')
        .data([0])
        .join('g')
        .attr('class', 'y-axis text-[10px] text-muted-foreground');
      yAxis.transition(t as any).call(d3.axisLeft(y).tickSizeOuter(0) as any);

      g.selectAll('rect')
        .data(data, (d: any) => d.label)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('y', (d) => y(d.label) || 0)
              .attr('x', 0)
              .attr('height', y.bandwidth())
              .attr('width', 0)
              .attr('fill', (d) => (racing ? colorScale(d.label) : color))
              .attr('rx', 4),
          (update) => update,
          (exit) =>
            exit
              .transition(t as any)
              .attr('width', 0)
              .remove(),
        )
        .transition(t as any)
        .attr('y', (d) => y(d.label) || 0)
        .attr('width', (d) => x(d.value))
        .attr('height', y.bandwidth())
        .attr('fill', (d) => (racing ? colorScale(d.label) : color));
    } else {
      const x = d3
        .scaleBand()
        .range([0, innerWidth])
        .domain(data.map((item) => item.label))
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (item) => item.value) || 0])
        .range([innerHeight, 0]);

      const xAxis = g
        .selectAll('.x-axis')
        .data([0])
        .join('g')
        .attr('class', 'x-axis text-[10px] text-muted-foreground')
        .attr('transform', `translate(0,${innerHeight})`);
      xAxis.transition(t as any).call(d3.axisBottom(x).tickSizeOuter(0) as any);

      const yAxis = g
        .selectAll('.y-axis')
        .data([0])
        .join('g')
        .attr('class', 'y-axis text-[10px] text-muted-foreground');
      yAxis.transition(t as any).call(d3.axisLeft(y).ticks(5).tickSizeOuter(0) as any);

      g.selectAll('rect')
        .data(data, (d: any) => d.label)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('x', (d) => x(d.label) || 0)
              .attr('y', innerHeight)
              .attr('width', x.bandwidth())
              .attr('height', 0)
              .attr('fill', color)
              .attr('rx', 4),
          (update) => update,
          (exit) =>
            exit
              .transition(t as any)
              .attr('height', 0)
              .attr('y', innerHeight)
              .remove(),
        )
        .transition(t as any)
        .attr('x', (d) => x(d.label) || 0)
        .attr('y', (d) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => innerHeight - y(d.value));
    }

    g.selectAll('rect')
      .on('mouseenter', (event, d: any) => {
        d3.select(event.currentTarget).attr('opacity', 0.8);
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.label}</strong>: ${d.value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mousemove', (event) => {
        tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 28 + 'px');
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('opacity', 1);
        tooltip.style('opacity', 0);
      })
      .on('click', (_event, d: any) => onBarClick?.(d));

    return () => {
      if (!racing) d3.selectAll('.viz-tooltip').remove();
    };
  }, [svgRef, data, width, height, color, horizontal, racing, onBarClick]);
}
