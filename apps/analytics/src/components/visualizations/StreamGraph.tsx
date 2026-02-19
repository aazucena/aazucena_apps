'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import * as d3 from 'd3';
import { ExportControls } from '@/components/common/ExportControls';

export interface StreamGraphStep {
  date: Date;
  [category: string]: any;
}

interface StreamGraphProps {
  data: StreamGraphStep[];
}

const COLOR_PALETTE = ['#22d3ee', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#6366f1'];

export function StreamGraph({ data }: StreamGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });

  const visibleCategories = useSelector(
    (state: RootState) => state.dashboard.filters.visibleCategories,
  );

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    return data.map((step) => {
      const filteredStep: any = { date: step.date };
      const keysToUse =
        !visibleCategories || visibleCategories.length === 0
          ? Object.keys(data[0] || {}).filter((k) => k !== 'date')
          : visibleCategories;

      keysToUse.forEach((key) => {
        filteredStep[key] = step[key] || 0;
      });
      return filteredStep;
    });
  }, [data, visibleCategories]);

  const { keys, colorScale } = useMemo(() => {
    if (!filteredData.length) return { keys: [], colorScale: null };
    const k = Object.keys(filteredData[0] || {}).filter((k) => k !== 'date');
    const cs = d3.scaleOrdinal<string>().domain(k).range(COLOR_PALETTE);
    return { keys: k, colorScale: cs };
  }, [filteredData]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current)
        setDimensions({ width: containerRef.current.clientWidth, height: 500 });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !filteredData.length || !colorScale || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.date) as [Date, Date])
      .range([0, width]);
    const stack = d3.stack().keys(keys).offset(d3.stackOffsetSilhouette);
    const series = stack(filteredData);
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(series, (l) => d3.min(l, (d) => d[0])) || -100,
        d3.max(series, (l) => d3.max(l, (d) => d[1])) || 100,
      ])
      .range([height, 0]);

    const area = d3
      .area<any>()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveBasis);

    g.selectAll('.layer')
      .data(series)
      .enter()
      .append('path')
      .attr('d', area)
      .attr('fill', (d) => colorScale(d.key))
      .attr('fill-opacity', 0.6)
      .style('filter', 'url(#glow)')
      .on('mouseenter', function () {
        d3.selectAll('path').attr('fill-opacity', 0.2);
        d3.select(this).attr('fill-opacity', 1);
      })
      .on('mouseleave', () => d3.selectAll('path').attr('fill-opacity', 0.6));

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 100)
      .tickSize(-height)
      .tickPadding(10);
    const gX = g.append('g').attr('transform', `translate(0,${height})`).call(xAxis);
    gX.select('.domain').remove();
    gX.selectAll('.tick line').attr('stroke', 'var(--chart-grid)');
    gX.selectAll('.tick text')
      .attr('fill', 'var(--chart-axis)')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-size', '10px');
  }, [filteredData, dimensions, keys, colorScale]);

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="absolute top-0 right-0 z-10">
        <ExportControls svgRef={svgRef} fileName="system-momentum" />
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full overflow-visible"
      />
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {keys.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              style={{ backgroundColor: colorScale!(key) }}
            ></div>
            <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
