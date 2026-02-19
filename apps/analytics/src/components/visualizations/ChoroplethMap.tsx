'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportControls } from '@/components/common/ExportControls';

interface GeoData {
  country: string; // ISO 2-letter code
  visitors: number;
}

interface ChoroplethMapProps {
  data: GeoData[];
}

export function ChoroplethMap({ data }: ChoroplethMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const [worldData, setWorldData] = useState<any>(null);

  // 1. Fetch World Map Data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((res) => res.json())
      .then((json) => {
        setWorldData(json);
      });
  }, []);

  // 2. Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 500,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Render Map
  useEffect(() => {
    if (!svgRef.current || !worldData || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    const projection = d3
      .geoMercator()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const countries = topojson.feature(worldData, worldData.objects.countries) as any;

    // Create a map for quick lookup
    const visitorMap = new Map(data.map((d) => [d.country, d.visitors]));
    const maxVisitors = d3.max(data, (d) => d.visitors) || 1;

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, Math.log10(maxVisitors + 1)]); // Log scale for better visibility of small values

    const g = svg.append('g');

    // Draw Countries
    g.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        // Note: topojson-client world-atlas properties vary.
        // We might need a mapping if ClickHouse gives ISO codes and TopoJSON gives names/numbers.
        // For this prototype, we'll try to match by name or common properties if available.
        // Typically world-atlas v2 has 'name' in properties.
        const countryName = d.properties.name;
        // ISO mapping would be better, but let's use what we have.
        // Since ClickHouse geo data from Vercel is ISO codes, we need a mapping.
        // For now, let's just color based on existence if we can't find an exact match.
        const count = visitorMap.get(d.id) || visitorMap.get(countryName) || 0;
        return count > 0 ? colorScale(Math.log10(count + 1)) : 'var(--chart-bg-empty, #18181b)';
      })
      .attr('stroke', 'var(--chart-grid, #27272a)')
      .attr('stroke-width', 0.5)
      .on('mouseenter', function (event, d: any) {
        d3.select(this).attr('stroke', '#10b981').attr('stroke-width', 1.5);
        const countryName = d.properties.name;
        const count = visitorMap.get(d.id) || visitorMap.get(countryName) || 0;

        const [x, y] = d3.pointer(event);
        setHoveredCountry({
          name: countryName,
          count: count,
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mousemove', function (event) {
        setHoveredCountry((prev) =>
          prev ? { ...prev, x: event.clientX, y: event.clientY } : null,
        );
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', 'var(--chart-grid, #27272a)').attr('stroke-width', 0.5);
        setHoveredCountry(null);
      });

    // Zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);
  }, [worldData, data, dimensions]);

  return (
    <div className="w-full relative bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="absolute top-8 left-8 z-10">
        <h3 className="text-xs font-black text-zinc-100 uppercase tracking-[0.3em]">
          Geospatial_Identity_Map
        </h3>
        <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">
          Global Reach Intelligence
        </p>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <ExportControls svgRef={svgRef} fileName="global-traffic-distribution" />
      </div>

      <div ref={containerRef} className="w-full h-[500px] cursor-crosshair">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
        />
      </div>

      {/* TOOLTIP */}
      <AnimatePresence>
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              left: hoveredCountry.x + 20,
              top: hoveredCountry.y + 20,
              pointerEvents: 'none',
            }}
            className="z-50 bg-zinc-900/90 border border-primary-500/30 backdrop-blur-xl p-4 rounded-2xl shadow-2xl"
          >
            <div className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">
              {hoveredCountry.name}
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tighter">
              {hoveredCountry.count.toLocaleString()}{' '}
              <span className="text-[10px] text-zinc-500 uppercase tracking-normal">Signals</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEGEND */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-2">
        <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
          Engagement_Density
        </div>
        <div className="flex items-center gap-1">
          <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-zinc-900 to-blue-500 border border-zinc-800" />
          <span className="text-[8px] font-mono text-zinc-600 uppercase">High</span>
        </div>
      </div>
    </div>
  );
}
