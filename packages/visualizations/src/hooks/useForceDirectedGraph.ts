import { useEffect } from 'react';
import * as d3 from 'd3';
import type { BaseNode, BaseLink } from '@aazucena/types';

/**
 * Internal type for D3 Simulation support without 'any'
 */
type SimulationNode<T> = T & d3.SimulationNodeDatum;
type SimulationLink<TNode, TLink> = Omit<TLink, 'source' | 'target'> & {
  source: SimulationNode<TNode> | string | number;
  target: SimulationNode<TNode> | string | number;
} & d3.SimulationLinkDatum<SimulationNode<TNode>>;

export interface UseForceDirectedGraphOptions {
  width: number;
  height: number;
  groupKey: string;
  colorMap: Record<string, string>;
  onNodeClick?: (node: any) => void;
}

export function useForceDirectedGraph<TNode extends BaseNode, TLink extends BaseLink<string>>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: { nodes: TNode[]; links: TLink[] },
  { width, height, groupKey, colorMap, onNodeClick }: UseForceDirectedGraphOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create copies for simulation
    const nodes: SimulationNode<TNode>[] = data.nodes.map((d) => ({ ...d }));
    const links: SimulationLink<TNode, TLink>[] = data.links.map((d) => ({
      ...d,
      source: d.source,
      target: d.target,
    })) as any;

    const simulation = d3
      .forceSimulation<SimulationNode<TNode>>(nodes)
      .force(
        'link',
        d3.forceLink<SimulationNode<TNode>, SimulationLink<TNode, TLink>>(links).id((d) => d.id),
      )
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: TNode) => {
      const groupValue = String(d[groupKey as keyof TNode] || '');
      return colorMap[groupValue] || defaultColors(groupValue);
    };

    const g = svg.append('g');

    // Zoom behavior
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        }),
    );

    const link = g
      .append('g')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.2)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value || 1));

    const node = g
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => 8 + (d.value || 0))
      .attr('fill', (d) => getColor(d))
      .style('cursor', onNodeClick ? 'pointer' : 'default')
      .on('click', (_event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    node.append('title').text((d) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d) => d.x || 0).attr('cy', (d) => d.y || 0);
    });

    return () => {
      simulation.stop();
    };
  }, [svgRef, data, width, height, groupKey, colorMap, onNodeClick]);
}
