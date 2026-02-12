/**
 * Generic Dendrogram Component
 * D3.js-powered tree visualization for hierarchical data.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { DendrogramNode } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface DendrogramProps<T extends DendrogramNode = DendrogramNode> {
  data: T;
  height?: number;
  direction?: 'horizontal' | 'vertical' | 'radial';
  color?: string;
  exportFileName?: string;
  onNodeClick?: (node: T) => void;
  className?: string;
}

export function Dendrogram<T extends DendrogramNode>({
  data,
  height = 600,
  direction = 'horizontal',
  color = 'var(--color-primary, #3b82f6)',
  exportFileName = 'dendrogram',
  onNodeClick,
  className,
}: DendrogramProps<T>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) setWidth(containerRef.current.clientWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || width === 0 || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy<T>(data);

    // Layout Logic
    let treeLayout;
    if (direction === 'radial') {
      const radius = Math.min(innerWidth, innerHeight) / 2;
      g.attr('transform', `translate(${width / 2},${height / 2})`);
      treeLayout = d3.cluster<T>().size([2 * Math.PI, radius - 100]);
    } else if (direction === 'vertical') {
      treeLayout = d3.cluster<T>().size([innerWidth, innerHeight - 100]);
    } else {
      treeLayout = d3.cluster<T>().size([innerHeight, innerWidth - 200]);
    }

    treeLayout(root);

    // Draw Links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d: any) =>
            direction === 'vertical'
              ? d.x
              : direction === 'radial'
                ? Math.cos(d.x - Math.PI / 2) * d.y
                : d.y,
          )
          .y((d: any) =>
            direction === 'vertical'
              ? d.y
              : direction === 'radial'
                ? Math.sin(d.x - Math.PI / 2) * d.y
                : d.x,
          ) as any,
      );

    // Draw Nodes
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', (d: any) => {
        if (direction === 'vertical') return `translate(${d.x},${d.y})`;
        if (direction === 'radial')
          return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`;
        return `translate(${d.y},${d.x})`;
      });

    node
      .append('circle')
      .attr('r', 4)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', onNodeClick ? 'pointer' : 'default')
      .on('click', (_e, d) => onNodeClick?.(d.data as T));

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => (d.children ? -8 : 8))
      .attr('text-anchor', (d: any) => {
        if (direction === 'radial') return d.x < Math.PI === !d.children ? 'start' : 'end';
        return d.children ? 'end' : 'start';
      })
      .attr('transform', (d: any) =>
        direction === 'radial' && d.x >= Math.PI ? 'rotate(180)' : null,
      )
      .text((d) => d.data.name)
      .style('font-size', '10px')
      .style('font-weight', '500')
      .attr('fill', 'currentColor')
      .clone(true)
      .lower()
      .attr('stroke', 'var(--color-background, #fff)')
      .attr('stroke-width', 3);
  }, [data, width, height, direction, color, onNodeClick]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl transition-colors"
      />
    </div>
  );
}
