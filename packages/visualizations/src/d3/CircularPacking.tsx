/**
 * Generic Circular Packing Component
 * D3.js-powered hierarchical bubble chart.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { CircularPackingNode } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface CircularPackingProps<T extends CircularPackingNode = CircularPackingNode> {
  data: T;
  height?: number;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  onNodeClick?: (node: T) => void;
  className?: string;
}

export function CircularPacking<T extends CircularPackingNode>({
  data,
  height = 600,
  colorMap = {},
  exportFileName = 'circular-packing',
  onNodeClick,
  className,
}: CircularPackingProps<T>) {
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

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 1)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const pack = d3.pack<T>().size([width, height]).padding(3);

    const packedData = pack(root);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: d3.HierarchyCircularNode<T>) => {
      const category = d.data.category || '';
      return colorMap[category] || defaultColors(category);
    };

    const nodes = g
      .selectAll('g')
      .data(packedData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', (d) => (d.children ? 'default' : 'pointer'));

    nodes
      .append('circle')
      .attr('cx', (d) => d.x - width / 2)
      .attr('cy', (d) => d.y - height / 2)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => getColor(d))
      .attr('fill-opacity', (d) => (d.children ? 0.1 : 0.6))
      .attr('stroke', (d) => (d.children ? 'none' : 'white'))
      .attr('stroke-width', 1)
      .on('mouseenter', function () {
        d3.select(this).attr('fill-opacity', 0.8);
      })
      .on('mouseleave', function (event, d) {
        d3.select(this).attr('fill-opacity', d.children ? 0.1 : 0.6);
      })
      .on('click', (_event, d) => onNodeClick?.(d.data));

    nodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (d) => d.x - width / 2)
      .attr('y', (d) => d.y - height / 2)
      .attr('dy', '0.35em')
      .style('pointer-events', 'none')
      .style('fill', 'currentColor')
      .style('font-size', (d) => Math.min(d.r / 2, 12) + 'px')
      .style('font-weight', '600')
      .style('opacity', (d) => (d.r > 10 ? 1 : 0)) // Hide labels on tiny circles
      .text((d) => d.data.name);
  }, [data, width, height, colorMap, onNodeClick]);

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
