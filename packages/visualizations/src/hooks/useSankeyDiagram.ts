import { useEffect } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import type { BaseNode, BaseLink } from '@aazucena/types';

export interface UseSankeyDiagramOptions {
  width: number;
  height: number;
  groupKey: string;
  colorMap: Record<string, string>;
  onNodeClick?: (node: any) => void;
}

export function useSankeyDiagram<TNode extends BaseNode, TLink extends BaseLink<string>>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: { nodes: TNode[]; links: TLink[] },
  { width, height, groupKey, colorMap, onNodeClick }: UseSankeyDiagramOptions,
) {
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const nodes = data.nodes.map((n) => ({ ...n }));
    const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

    const links = data.links
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
      .attr('stroke-opacity', 0.25)
      .selectAll('path')
      .data(layoutLinks)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => getColor(d.source))
      .attr('stroke-width', (d: any) => Math.max(1, d.width || 0))
      .style('mix-blend-mode', 'multiply')
      .on('mouseenter', function (event, d: any) {
        d3.select(this).attr('stroke-opacity', 0.5);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Usage count: ${d.value}`,
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-opacity', 0.25);
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
      .attr('stroke-width', 0.5)
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
      .attr('font-size', '12px')
      .attr('font-weight', (d: any) => {
        const id = String(d.id || '');
        return id.startsWith('cat_') ||
          id.startsWith('exp_') ||
          id.startsWith('prj_') ||
          id.startsWith('edu_')
          ? '700'
          : '400';
      })
      .attr('fill', 'currentColor')
      .text((d: any) => d.name)
      .each(function (d: any) {
        // Fade very small skill labels to reduce clutter
        if (String(d.id || '').startsWith('skill_') && d.y1 - d.y0 < 12) {
          d3.select(this).style('opacity', 0.3).attr('font-size', '10px');
        }
      });

    return () => {
      d3.selectAll('.viz-tooltip').remove();
    };
  }, [svgRef, data, width, height, groupKey, colorMap, onNodeClick]);
}
