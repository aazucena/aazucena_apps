import { useEffect } from 'react';
import * as d3 from 'd3';
import { categoricalScale, chartTheme, labelOn } from '../theme';
import type { PieChartData } from '@aazucena/types';

export interface UsePieChartOptions {
  width: number;
  height: number;
  innerRadius: number;
  onSliceClick?: (item: any) => void;
}

export function usePieChart<T extends PieChartData>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, innerRadius, onSliceClick }: UsePieChartOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height) / 2 - 40;
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const color = categoricalScale();
    const fillOf = (d: T) => d.color || color(d.label);

    const pie = d3.pie<T>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<T>>().innerRadius(innerRadius).outerRadius(radius);

    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => fillOf(d.data))
      .attr('stroke', chartTheme.separator)
      .attr('stroke-width', 2)
      .style('cursor', onSliceClick ? 'pointer' : 'default')
      .on('click', (_e, d) => onSliceClick?.(d.data));

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => labelOn(fillOf(d.data)))
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text((d) => (d.data.value > 5 ? d.data.label : ''));
  }, [svgRef, data, width, height, innerRadius, onSliceClick]);
}
