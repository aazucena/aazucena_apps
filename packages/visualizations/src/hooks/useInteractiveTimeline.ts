import { useEffect } from 'react';
import * as d3 from 'd3';
import type { TimelineEvent } from '../d3/InteractiveTimeline';

export interface UseInteractiveTimelineOptions {
  width: number;
  height: number;
  colorMap: Record<string, string>;
  laneKey?: string;
  onEventClick?: (event: any) => void;
  onEventHover?: (event: any | null, pos: { x: number; y: number } | null) => void;
  /** Called when the dynamic height changes due to lane count */
  onHeightChange?: (height: number) => void;
  /** Ref to store the D3 zoom behavior so the parent can call zoom in/out/reset */
  zoomRef?: React.MutableRefObject<d3.ZoomBehavior<SVGSVGElement, unknown> | null>;
}

// Lane-packing constants
const LABEL_BUFFER_RIGHT = 60;
const LABEL_BUFFER_LEFT = 50;
const NODE_GAP = 40;
const LANE_STEP = 110;

export function useInteractiveTimeline<T extends TimelineEvent>(
  svgRef: React.RefObject<SVGSVGElement | null>,
  data: T[],
  {
    width,
    height,
    colorMap,
    laneKey = 'type',
    onEventClick,
    onEventHover,
    onHeightChange,
    zoomRef,
  }: UseInteractiveTimelineOptions,
) {
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 80, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const defaultColors = d3.scaleOrdinal(d3.schemeTableau10);
    const getColor = (d: T) => {
      const lane = String((d as any)[laneKey] || '');
      return colorMap[lane] || defaultColors(lane);
    };

    // Parse and sort data
    const parsedData = [...data]
      .map((d) => ({
        ...d,
        _date: new Date(d.date),
        _endDate: d.endDate ? new Date(d.endDate) : new Date(),
        _lane: String((d as any)[laneKey] || ''),
      }))
      .sort((a, b) => a._date.getTime() - b._date.getTime());

    // Time scale
    const x = d3
      .scaleTime()
      .domain([d3.min(parsedData, (d) => d._date) || new Date(), new Date()])
      .range([0, innerWidth]);

    // ── Lane-packing collision avoidance ──────────────────────────────────────
    // Each entry gets assigned the lowest lane where its left edge clears
    // the previous node's visual right edge (label included).
    const lanes: number[] = [];
    let maxLane = 0;

    const processedData = parsedData.map((d) => {
      const startX = x(d._date);
      const barWidth = Math.max(x(d._endDate) - startX, 28);
      const visualRight = startX + Math.max(barWidth, LABEL_BUFFER_RIGHT);

      let lane = 0;
      while (true) {
        const prevRight = lanes[lane];
        if (prevRight === undefined || startX - LABEL_BUFFER_LEFT > prevRight + NODE_GAP) {
          lanes[lane] = visualRight;
          break;
        }
        lane++;
      }
      if (lane > maxLane) maxLane = lane;

      // Alternate above/below: lane 0 = center, lane 1 = -LANE_STEP, lane 2 = +LANE_STEP, …
      let yOffset = 0;
      if (lane > 0) {
        const level = Math.ceil(lane / 2);
        const sign = lane % 2 === 1 ? -1 : 1;
        yOffset = level * sign * LANE_STEP;
      }

      return { ...d, yOffset };
    });

    // Dynamic height based on lanes
    const requiredHeight = Math.max(
      400,
      (Math.ceil(maxLane / 2) + 1) * 220 + margin.top + margin.bottom,
    );
    if (requiredHeight !== height) {
      onHeightChange?.(requiredHeight);
      return; // Re-render with corrected height
    }

    // ── SVG setup ─────────────────────────────────────────────────────────────
    // Define gradient for the center line
    const defs = svg.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', 'timeline-line-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6');
    grad.append('stop').attr('offset', '50%').attr('stop-color', '#a855f7');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#ec4899');

    const mainGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const centerY = innerHeight / 2;

    // ── Axes ──────────────────────────────────────────────────────────────────
    mainGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(parsedData.length, 10))
          .tickFormat((d) => d3.timeFormat('%Y')(d as Date))
          .tickSizeOuter(0),
      )
      .call((g) => g.select('.domain').remove())
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // ── TODAY marker ──────────────────────────────────────────────────────────
    const todayX = x(new Date());
    if (todayX >= 0 && todayX <= innerWidth) {
      mainGroup
        .append('line')
        .attr('x1', todayX)
        .attr('y1', 0)
        .attr('x2', todayX)
        .attr('y2', innerHeight)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');
      mainGroup
        .append('text')
        .attr('x', todayX)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text('TODAY');
    }

    // ── Center timeline line ──────────────────────────────────────────────────
    mainGroup
      .append('line')
      .attr('x1', 0)
      .attr('y1', centerY)
      .attr('x2', innerWidth)
      .attr('y2', centerY)
      .attr('stroke', 'url(#timeline-line-gradient)')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round');

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const nodes = mainGroup
      .selectAll('.tl-node')
      .data(processedData)
      .enter()
      .append('g')
      .attr('class', 'tl-node')
      .attr('transform', (d) => `translate(${x(d._date)},${centerY + d.yOffset})`)
      .style('cursor', onEventClick || onEventHover ? 'pointer' : 'default');

    // Duration bar (semi-transparent rect)
    nodes
      .append('rect')
      .attr('x', 0)
      .attr('y', -10)
      .attr('width', (d) => Math.max(x(d._endDate) - x(d._date), 28))
      .attr('height', 20)
      .attr('rx', 10)
      .attr('fill', (d) => getColor(d as T))
      .attr('opacity', 0.2);

    // Connecting dashed line from node to center
    nodes
      .filter((d) => d.yOffset !== 0)
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', (d) => -d.yOffset)
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 4');

    // Circle node
    nodes
      .append('circle')
      .attr('r', 14)
      .attr('fill', (d) => getColor(d as T))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 4);

    // ── Avatar: logo image (44×44 circle) ────────────────────────────────────
    const AVATAR_SIZE = 44;
    const hasImageFn = (d: (typeof processedData)[number]) =>
      !!(d.avatarUrl && (d.avatarUrl.startsWith('http') || d.avatarUrl.startsWith('/')));

    nodes
      .filter((d) => hasImageFn(d))
      .append('foreignObject')
      .attr('x', -AVATAR_SIZE / 2)
      .attr('y', (d) => (d.yOffset >= 0 ? 30 : -30 - AVATAR_SIZE))
      .attr('width', AVATAR_SIZE)
      .attr('height', AVATAR_SIZE)
      .each(function (d) {
        d3.select(this)
          .append('xhtml:div')
          .attr(
            'class',
            'w-full h-full rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md',
          )
          .style('background-color', getColor(d as T) + '22')
          .append('xhtml:img')
          .attr('src', d.avatarUrl!)
          .attr('alt', d.avatarAlt || d.name)
          .attr('class', 'w-full h-full object-cover rounded-full');
      });

    // ── Avatar: text badge fallback (company / institution name) ─────────────
    // Wider pill so the full title fits — no initials abbreviation.
    const BADGE_W = 96;
    const BADGE_H = 40;

    nodes
      .filter((d) => !hasImageFn(d))
      .append('foreignObject')
      .attr('x', -BADGE_W / 2)
      .attr('y', (d) => (d.yOffset >= 0 ? 28 : -28 - BADGE_H))
      .attr('width', BADGE_W)
      .attr('height', BADGE_H)
      .each(function (d) {
        const label = d.avatarAlt || d.name;
        d3.select(this)
          .append('xhtml:div')
          .attr(
            'class',
            'w-full h-full rounded-xl flex items-center justify-center border-2 border-white shadow-md text-white text-center leading-tight',
          )
          .style('background-color', getColor(d as T))
          .style('font-size', '9px')
          .style('font-weight', '700')
          .style('padding', '2px 4px')
          .style('word-break', 'break-word')
          .text(label);
      });

    // Subtitle label (company / institution)
    nodes
      .filter((d) => !!d.subtitle)
      .append('text')
      .attr('y', (d) => (d.yOffset >= 0 ? 95 : -95))
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .text((d) => d.subtitle!);

    // ── Hover interactions ────────────────────────────────────────────────────
    if (onEventHover && svgRef.current) {
      const svgEl = svgRef.current;
      nodes
        .on('mouseenter', function (e, d) {
          d3.select(this).select('circle').transition().attr('r', 18);
          d3.select(this).select('rect').transition().attr('height', 24).attr('y', -12);

          if (onEventHover) {
            const cr = svgEl.getBoundingClientRect();
            const er = (e.currentTarget as SVGGElement).getBoundingClientRect();
            onEventHover(d as any, {
              x: er.left - cr.left + er.width / 2,
              y: er.top - cr.top,
            });
          }
        })
        .on('mouseleave', function () {
          d3.select(this).select('circle').transition().attr('r', 14);
          d3.select(this).select('rect').transition().attr('height', 20).attr('y', -10);
          onEventHover?.(null, null);
        });
    }

    if (onEventClick) {
      nodes.on('click', (_e, d) => onEventClick(d as any));
    }

    // ── Zoom ──────────────────────────────────────────────────────────────────
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 6])
      .on('zoom', (event) => {
        mainGroup.attr(
          'transform',
          `translate(${event.transform.x + margin.left},${event.transform.y + margin.top}) scale(${event.transform.k})`,
        );
      });

    svg.call(zoom);
    if (zoomRef) zoomRef.current = zoom;

    return () => {
      svg.on('.zoom', null);
    };
  }, [svgRef, data, width, height, colorMap, laneKey, onEventClick, onEventHover, onHeightChange]);
}
