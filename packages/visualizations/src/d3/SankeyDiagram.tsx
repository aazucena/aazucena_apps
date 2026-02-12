/**
 * Generic Sankey Diagram Component
 * D3.js-powered Sankey diagram for visualizing flows between any data nodes.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import type { GenericNetworkData, BaseNode, BaseLink } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';
import { cn } from '@aazucena/utils';

export interface SankeyDiagramProps<
  TNode extends BaseNode = BaseNode,
  TLink extends BaseLink<string> = BaseLink<string>,
> {
  /** The flow data (nodes and links) */
  data: GenericNetworkData<TNode, TLink>;
  /** Optional set of visible groups/categories to filter the view */
  visibleGroups?: Set<string> | null;
  /** Property on the node to use for grouping/filtering (defaults to 'type') */
  groupKey?: keyof TNode;
  /** Map of group/type names to Hex colors */
  colorMap?: Record<string, string>;
  /** Optional legend configuration */
  legend?: Array<{ label: string; color: string }>;
  /** Height of the visualization */
  height?: number;
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when a node is clicked */
  onNodeClick?: (node: TNode) => void;
  className?: string;
}

export function SankeyDiagram<TNode extends BaseNode, TLink extends BaseLink<string>>({
  data,
  visibleGroups,
  groupKey = 'type' as keyof TNode,
  colorMap = {},
  legend = [],
  height = 600,
  exportFileName = 'data-flow',
  onNodeClick,
  className,
}: SankeyDiagramProps<TNode, TLink>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const filteredData = useMemo(() => {
    if (!visibleGroups) return data;

    const visibleNodes = data.nodes.filter((n) => {
      const groupValue = String(n[groupKey] || '');
      return visibleGroups.has(groupValue);
    });

    const nodeIds = new Set(visibleNodes.map((n) => n.id));
    const visibleLinks = data.links.filter(
      (l) => nodeIds.has(String(l.source)) && nodeIds.has(String(l.target)),
    );

    return { nodes: visibleNodes, links: visibleLinks };
  }, [data, visibleGroups, groupKey]);

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
    if (!svgRef.current || !filteredData.nodes.length || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const nodes = filteredData.nodes.map((n) => ({ ...n }));
    const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

    const links = filteredData.links
      .map((l) => ({
        source: nodeMap.get(String(l.source)),
        target: nodeMap.get(String(l.target)),
        value: l.value,
      }))
      .filter((l) => l.source !== undefined && l.target !== undefined);

    if (links.length === 0) return;

    const sankeyLayout = sankey<any, any>()
      .nodeWidth(24)
      .nodePadding(16)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    const { nodes: layoutNodes, links: layoutLinks } = sankeyLayout({
      nodes,
      links,
    });

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: any) => {
      const groupValue = String(d[groupKey] || '');
      return colorMap[groupValue] || defaultColors(groupValue);
    };

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

    g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.2)
      .selectAll('path')
      .data(layoutLinks)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => getColor(d.source))
      .attr('stroke-width', (d: any) => Math.max(1, d.width || 0))
      .on('mouseenter', function (event, d: any) {
        d3.select(this).attr('stroke-opacity', 0.5);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Value: ${d.value}`,
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-opacity', 0.2);
        tooltip.style('opacity', 0);
      });

    const node = g.append('g').selectAll('g').data(layoutNodes).enter().append('g');

    node
      .append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => Math.max(d.y1 - d.y0, 2))
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => getColor(d))
      .attr('rx', 4)
      .attr('stroke', '#fff')
      .style('cursor', onNodeClick ? 'pointer' : 'default')
      .on('click', (_event, d: any) => {
        if (onNodeClick) onNodeClick(d);
      })
      .on('mouseenter', (event, d: any) => {
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Total: ${d.value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseleave', () => tooltip.style('opacity', 0));

    node
      .append('text')
      .attr('x', (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 8 : d.x0 - 8))
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => (d.x0 < innerWidth / 2 ? 'start' : 'end'))
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', 'currentColor')
      .text((d: any) => d.name);

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [filteredData, width, height, groupKey, colorMap, onNodeClick]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl p-4"
      />
      {legend.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {legend.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
