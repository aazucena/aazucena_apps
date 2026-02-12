/**
 * Generic Force-Directed Graph Component
 * D3.js-powered network visualization for relationships between any entities.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { GenericNetworkData, BaseNode, BaseLink } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

/**
 * Internal type for D3 Simulation support without 'any'
 */
type SimulationNode<T> = T & d3.SimulationNodeDatum;
type SimulationLink<TNode, TLink> = Omit<TLink, 'source' | 'target'> & {
  source: SimulationNode<TNode> | string | number;
  target: SimulationNode<TNode> | string | number;
} & d3.SimulationLinkDatum<SimulationNode<TNode>>;

export interface ForceDirectedGraphProps<
  TNode extends BaseNode = BaseNode,
  TLink extends BaseLink<string> = BaseLink<string>,
> {
  /** The network data (nodes and links) */
  data: GenericNetworkData<TNode, TLink>;
  /** Property on the node to use for grouping (defaults to 'group') */
  groupKey?: keyof TNode;
  /** Map of group names to Hex colors */
  colorMap?: Record<string, string>;
  /** Height of the visualization */
  height?: number;
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when a node is clicked */
  onNodeClick?: (node: TNode) => void;
  className?: string;
}

export function ForceDirectedGraph<TNode extends BaseNode, TLink extends BaseLink<string>>({
  data,
  groupKey = 'group' as keyof TNode,
  colorMap = {},
  height = 600,
  exportFileName = 'network-graph',
  onNodeClick,
  className,
}: ForceDirectedGraphProps<TNode, TLink>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const groupValue = String(d[groupKey] || '');
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
  }, [data, width, height, groupKey, colorMap, onNodeClick]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl transition-colors cursor-move"
      />
    </div>
  );
}
