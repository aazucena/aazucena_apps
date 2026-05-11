import { useEffect } from 'react';
import * as d3 from 'd3';
import type { TreemapNode } from '@aazucena/types';

export interface UseTreemapOptions {
  width: number;
  height: number;
  onNodeClick?: (node: any) => void;
}

export function useTreemap<T extends TreemapNode>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T,
  { width, height, onNodeClick }: UseTreemapOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap<any>().size([width, height]).padding(4)(root);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const leaf = svg
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    leaf
      .append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => color(d.parent?.data.name || d.data.name))
      .attr('rx', 4)
      .style('cursor', onNodeClick ? 'pointer' : 'default')
      .on('click', (_e, d) => onNodeClick?.(d.data as T));

    leaf
      .append('text')
      .attr('x', 5)
      .attr('y', 15)
      .attr('fill', '#fff')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text((d: any) => d.data.name);
  }, [svgRef, data, width, height, onNodeClick]);
}
