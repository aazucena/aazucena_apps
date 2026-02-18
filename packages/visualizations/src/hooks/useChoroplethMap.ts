import { useEffect } from 'react';
import * as d3 from 'd3';
import type { MapRegion } from '@aazucena/types';

export interface UseChoroplethMapOptions {
  width: number;
  height: number;
  colors: [string, string];
  onRegionClick?: (region: any) => void;
}

export function useChoroplethMap(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: MapRegion[],
  geoJson: any,
  { width, height, colors, onRegionClick }: UseChoroplethMapOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !geoJson) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3
      .geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, d3.max(data, (d) => d.value) || 100])
      .range(colors);

    // Create a map for fast lookup
    const dataMap = new Map(data.map((d) => [d.id, d]));

    const g = svg.append('g');

    g.selectAll('path')
      .data(geoJson.features)
      .join('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const regionData = dataMap.get(d.id);
        return regionData ? colorScale(regionData.value) : '#f1f5f9';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('cursor', onRegionClick ? 'pointer' : 'default')
      .on('mouseenter', function () {
        d3.select(this).attr('opacity', 0.8).attr('stroke-width', 1.5);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1).attr('stroke-width', 0.5);
      })
      .on('click', (_e, d: any) => {
        const regionData = dataMap.get(d.id);
        if (regionData && onRegionClick) onRegionClick(regionData);
      })
      .append('title')
      .text((d: any) => {
        const regionData = dataMap.get(d.id);
        return `${d.properties.name}: ${regionData ? regionData.value : 'N/A'}`;
      });
  }, [svgRef, data, geoJson, width, height, colors, onRegionClick]);
}
