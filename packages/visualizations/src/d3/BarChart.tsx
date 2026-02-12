/**
 * Generic Bar Chart Component
 * D3.js-powered bar chart for comparing categorical values.
 * Supports: Horizontal/Vertical modes, Interactivity, and Racing Animation.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { BarChartData } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface BarChartProps<T extends BarChartData = BarChartData> {
  data: T[];
  height?: number;
  color?: string;
  horizontal?: boolean;
  racing?: boolean; // Enable racing animation
  exportFileName?: string;
  onBarClick?: (item: T) => void;
  className?: string;
}

export function BarChart<T extends BarChartData>({
  data,
  height = 400,
  color = 'var(--color-primary, #3b82f6)',
  horizontal = false,
  racing = false,
  exportFileName = 'bar-chart',
  onBarClick,
  className,
}: BarChartProps<T>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) setWidth(containerRef.current.clientWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    // Only clear if not racing to allow smooth transitions
    if (!racing) svg.selectAll('*').remove();

    const margin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: horizontal ? 100 : 60,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create or select main group
    let g = svg.select<SVGGElement>('g.main-group');
    if (g.empty()) {
      g = svg
        .append('g')
        .attr('class', 'main-group')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }

    const t = d3.transition().duration(750).ease(d3.easeCubicOut);

    // Color scale for racing mode diversity
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // Tooltip
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
        .domain(data.sort((a, b) => (racing ? b.value - a.value : 0)).map((item) => item.label))
        .padding(0.2);

      // Draw Axes
      const xAxis = g
        .selectAll('.x-axis')
        .data([0])
        .join('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`);
      xAxis.transition(t as any).call(d3.axisBottom(x) as any);

      const yAxis = g.selectAll('.y-axis').data([0]).join('g').attr('class', 'y-axis');
      yAxis.transition(t as any).call(d3.axisLeft(y) as any);

      // Draw Bars
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

      // Add interactivity to bars
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
    } else {
      // Vertical Logic
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
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`);
      xAxis.call(d3.axisBottom(x) as any);

      const yAxis = g.selectAll('.y-axis').data([0]).join('g').attr('class', 'y-axis');
      yAxis.transition(t as any).call(d3.axisLeft(y) as any);

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

      // Add interactivity (same logic as horizontal)
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
    }

    return () => {
      // Don't remove tooltip here if it's shared, but for now we clean up
      if (!racing) d3.selectAll('.viz-tooltip').remove();
    };
  }, [data, width, height, color, horizontal, racing, onBarClick]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl transition-colors"
      />
    </div>
  );
}
