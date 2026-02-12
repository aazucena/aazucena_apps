/**
 * Generic Radial Gauge Component
 * D3.js-powered circular visualization for single-metric telemetry.
 * Optimized for real-time updates (CPU, Memory, Integrity).
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';

export interface RadialGaugeProps {
  /** Current value (0 to max) */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Label shown in the center */
  label?: string;
  /** Color of the active arc */
  color?: string;
  /** Size of the gauge */
  size?: number;
  /** Thickness of the ring */
  thickness?: number;
  className?: string;
}

export function RadialGauge({
  value,
  max = 100,
  label,
  color = 'var(--color-primary, #3b82f6)',
  size = 200,
  thickness = 20,
  className,
}: RadialGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const percentage = Math.min(Math.max(value / max, 0), 1);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = size / 2;
    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const arc = d3
      .arc<any>()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(0)
      .cornerRadius(thickness / 2);

    // Background track
    g.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('d', arc)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.1);

    // Foreground value arc
    g.append('path')
      .datum({ endAngle: percentage * 2 * Math.PI })
      .attr('d', arc)
      .attr('fill', color)
      .attr('class', 'value-arc')
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut);

    // Value text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', label ? '-0.2em' : '0.35em')
      .attr('class', 'text-2xl font-black fill-current')
      .text(`${Math.round(percentage * 100)}%`);

    if (label) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .attr('class', 'text-[10px] font-bold uppercase tracking-widest fill-muted-foreground')
        .text(label);
    }
  }, [value, max, percentage, color, size, thickness, label]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className={cn('text-foreground transition-all', className)}
    />
  );
}
