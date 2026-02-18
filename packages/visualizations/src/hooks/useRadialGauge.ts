import { useEffect } from 'react';
import * as d3 from 'd3';

export interface UseRadialGaugeOptions {
  size: number;
  thickness: number;
  percentage: number;
  color: string;
  label?: string;
}

export function useRadialGauge(
  svgRef: React.RefObject<SVGSVGElement | null>,
  { size, thickness, percentage, color, label }: UseRadialGaugeOptions,
) {
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
  }, [svgRef, size, thickness, percentage, color, label]);
}
