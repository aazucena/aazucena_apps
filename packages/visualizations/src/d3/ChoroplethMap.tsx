/**
 * Generic Choropleth Map Component
 * D3.js-powered geospatial visualization.
 * Requires valid GeoJSON data to function.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@aazucena/utils';
import type { MapRegion } from '@aazucena/types';
import { ExportControls } from '../common/ExportControls.js';

export interface ChoroplethMapProps {
  /** The map data (ISO codes and values) */
  data: MapRegion[];
  /** GeoJSON feature collection for the map geometry */
  geoJson: any;
  /** Height of the visualization */
  height?: number;
  /** Color scale range [low, high] */
  colors?: [string, string];
  /** Filename for exported assets */
  exportFileName?: string;
  /** Optional callback when a region is clicked */
  onRegionClick?: (region: MapRegion) => void;
  className?: string;
}

export function ChoroplethMap({
  data,
  geoJson,
  height = 500,
  colors = ['#e2e8f0', '#3b82f6'],
  exportFileName = 'choropleth-map',
  onRegionClick,
  className,
}: ChoroplethMapProps) {
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
  }, [data, geoJson, width, height, colors, onRegionClick]);

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
