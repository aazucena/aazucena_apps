/**
 * Skills Sankey Diagram Component
 * D3.js-powered Sankey diagram showing skill category transitions over time
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { visibleCategoriesStore } from '../store';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, type SankeyNode as D3SankeyNode, type SankeyLink as D3SankeyLink } from 'd3-sankey';
import type { SankeyData } from '../transformers';
import { ExportControls } from '../ui/ExportControls';

interface SankeyDiagramProps {
  data: SankeyData;
}

interface NodeExtra extends D3SankeyNode<{}, {}> {
  id: string;
  name: string;
}

interface LinkExtra extends D3SankeyLink<{}, {}> {
  value: number;
}

export function SankeyDiagram({ data }: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 800 });
  const globalVisibleCategories = useStore(visibleCategoriesStore);

  // Filtered data based on global store
  const filteredData = useMemo(() => {
    if (!globalVisibleCategories) return data;
    
    // Filter nodes: Categories must be visible, Skills must belong to visible categories
    // IDs: cat_Name, skill_Name, exp_Name, prj_Name, edu_Name, group_Name
    const visibleNodes = data.nodes.filter(n => {
      if (n.id.startsWith('cat_')) {
        return globalVisibleCategories.has(n.name);
      }
      if (n.id.startsWith('skill_') || n.id.startsWith('group_')) {
        // Find the category for this skill/group
        // We look at incoming links from category nodes
        const incomingLink = data.links.find(l => l.target === n.id && l.source.startsWith('cat_'));
        if (incomingLink) {
          const catNode = data.nodes.find(node => node.id === incomingLink.source);
          return catNode && globalVisibleCategories.has(catNode.name);
        }
        return true; // Fallback
      }
      return true; // Entities (exp_, prj_, edu_) usually visible if linked
    });

    const nodeIds = new Set(visibleNodes.map(n => n.id));
    const visibleLinks = data.links.filter(l => 
      nodeIds.has(l.source as string) && nodeIds.has(l.target as string)
    );

    return { nodes: visibleNodes, links: visibleLinks };
  }, [data, globalVisibleCategories]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 800,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !filteredData.nodes.length || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for d3-sankey
    const nodes = filteredData.nodes.map(n => ({ ...n }));
    const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));
    
    const links = filteredData.links.map(l => ({
      source: nodeMap.get(l.source as string)!,
      target: nodeMap.get(l.target as string)!,
      value: l.value
    })).filter(l => l.source !== undefined && l.target !== undefined);

    if (links.length === 0) return;

    const sankeyLayout = sankey<any, any>()
      .nodeWidth(24)
      .nodePadding(16)
      .extent([[0, 0], [width, height]]);

    const { nodes: layoutNodes, links: layoutLinks } = sankeyLayout({
      nodes,
      links
    });

    // Color logic
    const categoryColor = d3.scaleOrdinal(d3.schemeTableau10);
    
    const getNodeColor = (d: any) => {
      if (d.id.startsWith('cat_')) {
        return categoryColor(d.name);
      }
      if (d.id.startsWith('skill_') || d.id.startsWith('group_')) {
        // Inherit color from source category
        const incomingLink = layoutLinks.find((l: any) => l.target.id === d.id);
        if (incomingLink) return categoryColor((incomingLink.source as any).name);
        return '#94a3b8';
      }
      // Color-code entities by type
      if (d.id.startsWith('exp_')) {
        return '#3b82f6'; // Blue for Experience
      }
      if (d.id.startsWith('prj_')) {
        return '#a855f7'; // Purple for Projects
      }
      if (d.id.startsWith('edu_')) {
        return '#10b981'; // Emerald for Education
      }
      return '#cbd5e1';
    };

    // Draw links
    g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.25)
      .selectAll('path')
      .data(layoutLinks)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => getNodeColor(d.source))
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .style('mix-blend-mode', 'multiply')
      .on('mouseenter', function(event, d: any) {
        d3.select(this).attr('stroke-opacity', 0.5);
        // Highlight path
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Usage count: ${d.value}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', function() {
        d3.select(this).attr('stroke-opacity', 0.25);
        tooltip.style('opacity', 0);
      });

    // Tooltip div
    const tooltip = d3.select('body').append('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100);

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(layoutNodes)
      .enter()
      .append('g');

    node.append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => Math.max(d.y1 - d.y0, 2))
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', getNodeColor)
      .attr('rx', 4)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseenter', function(event, d: any) {
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Total connections: ${d.value}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseleave', () => tooltip.style('opacity', 0));

    // Add labels
    node.append('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .attr('font-size', '12px')
      .attr('font-weight', (d: any) => d.id.startsWith('cat_') || d.id.startsWith('exp_') || d.id.startsWith('prj_') || d.id.startsWith('edu_') ? '700' : '400')
      .attr('fill', 'currentColor')
      .text((d: any) => d.name)
      .each(function(d: any) {
        // Hide labels for very small middle nodes to reduce clutter
        if (d.id.startsWith('skill_') && (d.y1 - d.y0) < 12) {
          d3.select(this).style('opacity', 0.3).style('font-size', '10px');
        }
      });

    // Cleanup tooltip on unmount
    return () => {
      d3.selectAll('.sankey-tooltip').remove();
    };
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden p-4">
      <div className="absolute top-4 right-4 z-10 p-4">
        <ExportControls svgRef={svgRef} fileName="skill-impact-flow" />
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 rounded-3xl p-4"
      />
      <div className="mt-4 flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Experience</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Education</span>
        </div>
      </div>
    </div>
  );
}
