/**
 * Generic Treemap Component
 * D3.js-powered hierarchical visualization for nested data.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { TreemapNode } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface TreemapProps<T extends TreemapNode = TreemapNode> {
  data: T;
  height?: number;
  exportFileName?: string;
  onNodeClick?: (node: T) => void;
  className?: string;
}

export function Treemap<T extends TreemapNode>({
  data,
  height = 500,
  exportFileName = 'treemap',
  onNodeClick,
  className,
}: TreemapProps<T>) {
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
  }, [data, width, height, onNodeClick]);

  return (
    <div ref={containerRef} className={cn('w-full relative group', className)}>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName={exportFileName} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-3xl"
      />
    </div>
  );
}
