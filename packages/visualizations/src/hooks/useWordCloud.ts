import { useEffect } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import type { WordCloudData } from '@aazucena/types';

export interface UseWordCloudOptions {
  width: number;
  height: number;
  minFontSize: number;
  maxFontSize: number;
  colorMap: Record<string, string>;
  onWordClick?: (word: any) => void;
}

export function useWordCloud<T extends WordCloudData>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, minFontSize, maxFontSize, colorMap, onWordClick }: UseWordCloudOptions,
) {
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
  }, [svgRef, data, width, height, minFontSize, maxFontSize, colorMap, onWordClick]);
}
