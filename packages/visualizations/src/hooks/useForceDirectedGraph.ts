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
  /** D3 forceManyBody strength — more negative = stronger repulsion. @default -400 */
  chargeStrength?: number;
  /** Preferred link length in pixels. @default 120 */
  linkDistance?: number;
  /** Collision avoidance radius. @default 12 */
  collisionRadius?: number;
  /** When set, dims nodes whose id is NOT in this Set. Pass null/undefined for no filtering. */
  highlightIds?: Set<string> | null;
}

export function useForceDirectedGraph<TNode extends BaseNode, TLink extends BaseLink<string>>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: { nodes: TNode[]; links: TLink[] },
  {
    width,
    height,
    groupKey,
    colorMap,
    onNodeClick,
    chargeStrength = -400,
    linkDistance = 120,
    collisionRadius = 12,
    highlightIds,
  }: UseForceDirectedGraphOptions,
) {
  // Main simulation effect
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

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: TNode) => {
      const groupValue = String(d[groupKey as keyof TNode] || '');
      return colorMap[groupValue] || defaultColors(groupValue);
    };

    const simulation = d3
      .forceSimulation<SimulationNode<TNode>>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode<TNode>, SimulationLink<TNode, TLink>>(links)
          .id((d) => d.id)
          .distance((d: any) => linkDistance / Math.sqrt(d.value || 1))
          .strength((d: any) => Math.min((d.value || 1) / 12, 0.8)),
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3
          .forceCollide()
          .radius((d: any) => collisionRadius + Math.sqrt(d.size || d.value || 1) * 4),
      );

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

    // Link color — same category = category color, cross-category = neutral gray
    const getLinkColor = (l: any) => {
      const srcId = typeof l.source === 'string' ? l.source : (l.source as any)?.id;
      const tgtId = typeof l.target === 'string' ? l.target : (l.target as any)?.id;
      const srcNode = data.nodes.find((n) => n.id === srcId);
      const tgtNode = data.nodes.find((n) => n.id === tgtId);
      if (!srcNode || !tgtNode) return '#94a3b8';
      const srcGroup = String(srcNode[groupKey as keyof TNode] || '');
      const tgtGroup = String(tgtNode[groupKey as keyof TNode] || '');
      if (srcGroup === tgtGroup) return colorMap[srcGroup] || defaultColors(srcGroup);
      return '#94a3b8';
    };

    const link = g
      .append('g')
      .selectAll<SVGLineElement, SimulationLink<TNode, TLink>>('line')
      .data(links)
      .join('line')
      .attr('stroke', (d: any) => getLinkColor(d))
      .attr('stroke-opacity', (d: any) => Math.min(0.25 + (d.value || 1) * 0.08, 0.5))
      .attr('stroke-width', (d: any) => 0.8 + Math.sqrt(d.value || 1) * 0.8)
      .attr('stroke-linecap', 'round');

    // Node groups (g.node-group) — drag attached to group, not circle
    const node = g
      .append('g')
      .selectAll<SVGGElement, SimulationNode<TNode>>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .style('cursor', onNodeClick ? 'pointer' : 'default')
      .call(
        d3
          .drag<SVGGElement, SimulationNode<TNode>>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      )
      .on('click', (_event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    // Circles — sized by `size` field (skill frequency) then `value`, else fixed
    node
      .append('circle')
      .attr('r', (d) => 6 + Math.sqrt((d as any).size || (d as any).value || 1) * 4)
      .attr('fill', (d) => getColor(d))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Hover: expand, highlight connected links/nodes, fade unconnected
    node
      .on('mouseenter', function (_event, d) {
        const connectedIds = new Set<string>([d.id]);
        link
          .style('stroke-opacity', (l: any) => {
            const srcId = typeof l.source === 'string' ? l.source : (l.source as any)?.id;
            const tgtId = typeof l.target === 'string' ? l.target : (l.target as any)?.id;
            if (srcId === d.id || tgtId === d.id) {
              if (srcId) connectedIds.add(srcId);
              if (tgtId) connectedIds.add(tgtId);
              return 0.9;
            }
            return 0.05;
          })
          .style('stroke-width', (l: any) => {
            const srcId = typeof l.source === 'string' ? l.source : (l.source as any)?.id;
            const tgtId = typeof l.target === 'string' ? l.target : (l.target as any)?.id;
            if (srcId === d.id || tgtId === d.id) return (0.8 + Math.sqrt(l.value || 1) * 0.8) * 2;
            return 0.8 + Math.sqrt(l.value || 1) * 0.8;
          });

        // Expand hovered circle
        d3.select(this)
          .select('circle')
          .transition()
          .attr('r', 9 + Math.sqrt((d as any).size || (d as any).value || 1) * 4);

        node.style('opacity', (n) => (connectedIds.has(n.id) ? 1 : 0.2));
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .attr('r', 6 + Math.sqrt((d as any).size || (d as any).value || 1) * 4);

        link
          .style('stroke-opacity', (l: any) => Math.min(0.25 + (l.value || 1) * 0.08, 0.5))
          .style('stroke-width', (l: any) => 0.8 + Math.sqrt(l.value || 1) * 0.8);

        node.style('opacity', 1);
      });

    // Tooltip via native title element
    node.append('title').text((d) => d.name);

    // White halo background for label readability
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', (d) => -(9 + Math.sqrt((d as any).size || (d as any).value || 1) * 4))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('pointer-events', 'none')
      .attr('opacity', 0.9)
      .text((d) => d.name);

    // Foreground label (dark text for readability)
    node
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('y', (d) => -(9 + Math.sqrt((d as any).size || (d as any).value || 1) * 4))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#1f2937')
      .attr('pointer-events', 'none')
      .text((d) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [
    svgRef,
    data,
    width,
    height,
    groupKey,
    colorMap,
    onNodeClick,
    chargeStrength,
    linkDistance,
    collisionRadius,
  ]);

  // Separate highlight effect — runs without restarting simulation
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const nodeGroups = svg.selectAll<SVGGElement, SimulationNode<TNode>>('g.node-group');
    if (nodeGroups.empty()) return;

    if (!highlightIds || highlightIds.size === 0) {
      nodeGroups.style('opacity', 1);
      nodeGroups.select('circle').attr('stroke', '#ffffff').attr('stroke-width', 2);
      return;
    }

    nodeGroups.each(function (d) {
      const isMatch = highlightIds.has(d.id);
      d3.select(this)
        .transition()
        .duration(300)
        .style('opacity', isMatch ? 1 : 0.1);
      d3.select(this)
        .select('circle')
        .transition()
        .duration(300)
        .attr('stroke', isMatch ? '#3b82f6' : '#ffffff')
        .attr('stroke-width', isMatch ? 4 : 2);
    });
  }, [svgRef, highlightIds]);
}
