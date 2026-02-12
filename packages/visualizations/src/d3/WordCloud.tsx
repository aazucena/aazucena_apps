/**
 * Generic WordCloud Component
 * D3.js-powered word cloud visualization using d3-cloud.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { cn } from '@aazucena/utils';
import type { WordCloudData } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface WordCloudProps<T extends WordCloudData = WordCloudData> {
  data: T[];
  height?: number;
  minFontSize?: number;
  maxFontSize?: number;
  colorMap?: Record<string, string>;
  exportFileName?: string;
  onWordClick?: (word: T) => void;
  className?: string;
}

export function WordCloud<T extends WordCloudData>({
  data,
  height = 400,
  minFontSize = 12,
  maxFontSize = 60,
  colorMap = {},
  exportFileName = 'word-cloud',
  onWordClick,
  className,
}: WordCloudProps<T>) {
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
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const fontScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.value) || 0, d3.max(data, (d) => d.value) || 0])
      .range([minFontSize, maxFontSize]);

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);

    const layout = cloud<T>()
      .size([width, height])
      .words(data.map((d) => ({ ...d })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font('Impact')
      .fontSize((d) => fontScale(d.value!))
      .on('end', (words) => {
        g.selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', (d: any) => `${d.size}px`)
          .style('font-family', 'Impact')
          .style('fill', (d: any) => colorMap[d.category || ''] || defaultColors(d.text))
          .attr('text-anchor', 'middle')
          .attr('transform', (d: any) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
          .text((d: any) => d.text!)
          .style('cursor', onWordClick ? 'pointer' : 'default')
          .on('click', (_event, d) => onWordClick?.(d as any));
      });

    layout.start();
  }, [data, width, height, minFontSize, maxFontSize, colorMap, onWordClick]);

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
