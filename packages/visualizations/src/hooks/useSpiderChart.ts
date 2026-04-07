import { useEffect } from 'react';
import * as d3 from 'd3';
import type { SpiderChartData } from '@aazucena/types';

export interface UseSpiderChartOptions {
  width: number;
  height: number;
  maxValue: number;
  colorMap: Record<string, string>;
  onBlobClick?: (item: any) => void;
}

export function useSpiderChart<T extends SpiderChartData>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  { width, height, maxValue, colorMap, onBlobClick }: UseSpiderChartOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    const allAxes = data[0]?.axes.map((d) => d.axis) || [];
    const totalAxes = allAxes.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Auto-compute maxValue — journey data uses raw counts, not percentages
    const computedMax =
      maxValue === 100
        ? Math.ceil(Math.max(...data.flatMap((d) => d.axes.map((a) => a.value)), 1) * 1.15)
        : maxValue;

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, computedMax]);

    const isSingle = data.length === 1;
    const TICKS = 5;

    // ── Grid circles — dashed, visible ───────────────────────────────────────
    for (let i = 1; i <= TICKS; i++) {
      const r = (radius / TICKS) * i;

      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');

      // Tick value label
      g.append('text')
        .attr('x', 5)
        .attr('y', -r)
        .attr('fill', '#9ca3af')
        .attr('font-size', '10px')
        .text(Math.round((computedMax / TICKS) * i));
    }

    // ── Axes ──────────────────────────────────────────────────────────────────
    allAxes.forEach((category, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#d1d5db')
        .attr('stroke-width', 1);

      const labelDist = radius + 25;
      g.append('text')
        .attr('x', Math.cos(angle) * labelDist)
        .attr('y', Math.sin(angle) * labelDist)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#4b5563')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(category);
    });

    // ── Color scale ───────────────────────────────────────────────────────────
    const defaultColors = d3
      .scaleOrdinal<string, string>(d3.schemeTableau10)
      .domain(data.map((d) => d.name));
    const getColor = (name: string) => colorMap[name] || defaultColors(name);

    // ── Blobs ─────────────────────────────────────────────────────────────────
    const radarLine = d3
      .lineRadial<any>()
      .radius((d) => rScale(d.value))
      .angle((_d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    data.forEach((yearData) => {
      const color = getColor(yearData.name);
      const fillOpacity = isSingle ? 0.4 : 0.15;
      const strokeWidth = isSingle ? 3 : 2;
      const dotR = isSingle ? 5 : 3;

      const blobG = g.append('g').attr('class', 'radarWrapper');

      blobG
        .append('path')
        .attr('d', radarLine(yearData.axes))
        .style('fill', color)
        .style('fill-opacity', fillOpacity)
        .style('stroke', color)
        .style('stroke-width', strokeWidth)
        .style('stroke-linejoin', 'round')
        .style('cursor', onBlobClick ? 'pointer' : 'default')
        .on('click', (_event) => {
          if (onBlobClick) onBlobClick(yearData);
        });

      // Dot points at each axis value
      yearData.axes.forEach((axisData, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = rScale(axisData.value);
        const cx = Math.cos(angle) * r;
        const cy = Math.sin(angle) * r;

        blobG
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', dotR)
          .attr('fill', color)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('mouseenter', function () {
            d3.select(this)
              .transition()
              .attr('r', dotR + 2);
            g.append('text')
              .attr('class', 'radar-tooltip')
              .attr('x', cx)
              .attr('y', cy - 14)
              .attr('text-anchor', 'middle')
              .attr('fill', '#111827')
              .attr('font-size', '12px')
              .attr('font-weight', '700')
              .text(`${axisData.value} skills`);
          })
          .on('mouseleave', function () {
            d3.select(this).transition().attr('r', dotR);
            g.selectAll('.radar-tooltip').remove();
          });
      });
    });

    // ── Legend ────────────────────────────────────────────────────────────────
    if (isSingle && data[0]) {
      // Single year: large centred year label at top
      g.append('text')
        .attr('x', 0)
        .attr('y', -radius - 38)
        .attr('text-anchor', 'middle')
        .attr('fill', getColor(data[0].name))
        .attr('font-size', '24px')
        .attr('font-weight', '900')
        .text(data[0].name);
    } else {
      // Compare mode: right-side year+rect legend
      const legendX = radius + 40;
      const legendY = -radius;
      const legendG = g.append('g').attr('transform', `translate(${legendX},${legendY})`);
      data.forEach((d, i) => {
        const item = legendG.append('g').attr('transform', `translate(0,${i * 22})`);
        item
          .append('rect')
          .attr('width', 16)
          .attr('height', 8)
          .attr('rx', 2)
          .attr('fill', getColor(d.name));
        item
          .append('text')
          .attr('x', 22)
          .attr('y', 8)
          .attr('fill', '#374151')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .text(d.name);
      });
    }
  }, [svgRef, data, width, height, maxValue, colorMap, onBlobClick]);
}
