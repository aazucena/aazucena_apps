/**
 * Interactive Timeline Component
 * D3.js-powered horizontal timeline showing career progression
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { TimelineNode } from '../transformers';
import { ExportControls } from '../ui/ExportControls';
import { calculateDetailedDuration } from '../transformers';
interface InteractiveTimelineProps {
  data: TimelineNode[];
  hideHeader?: boolean;
}

export function InteractiveTimeline({ data, hideHeader = false }: InteractiveTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TimelineNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 900 });
  const [filter, setFilter] = useState<'all' | 'experience' | 'education'>('all');
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    anchor: 'top',
    xOffset: 'center' as 'left' | 'right' | 'center',
  });

  const filterOptions = [
    { id: 'all', label: 'All', icon: '✨', activeClass: 'bg-indigo-600 shadow-indigo-200', textActive: 'text-white' },
    { id: 'experience', label: 'Experience', icon: '💼', activeClass: 'bg-blue-600 shadow-blue-200', textActive: 'text-white' },
    { id: 'education', label: 'Education', icon: '🎓', activeClass: 'bg-green-600 shadow-green-200', textActive: 'text-white' },
  ];

  // Timeout ref for tooltip persistence
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 400,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Timeline Rendering
  useEffect(() => {
    if (!svgRef.current || !data.length || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 80, right: 80, bottom: 80, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Filter and sort data
    const filteredData = data.filter((d) => {
      if (filter === 'all') return true;
      return d.type === filter;
    });

    if (filteredData.length === 0) return;

    const sortedData = [...filteredData].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Create time scale
    const timeScale = d3
      .scaleTime()
      .domain([sortedData[0]?.date!, new Date()])
      .range([0, width]);

    // Lane packing for collision detection
    const lanes: number[] = [];
    
    // Configuration for collision logic
    const LABEL_Right_Buffer = 40; // Estimated pixels label extends to the right
    const LABEL_Left_Buffer = 40;  // Estimated pixels label extends to the left (logo + text)
    const NODE_Gap = 40;           // Minimum gap between nodes

    // Pre-process data for staggering
    let maxLane = 0;
    const processedData = sortedData.map((d) => {
      const startX = timeScale(d.date);
      const endX = timeScale(d.endDate);
      const barWidth = Math.max(endX - startX, 28);
      const visualRightEdge = startX + Math.max(barWidth, LABEL_Right_Buffer);

      let lane = 0;
      while (true) {
        const prevNodeRightEdge = lanes[lane];
        if (prevNodeRightEdge === undefined || (startX - LABEL_Left_Buffer) > (prevNodeRightEdge + NODE_Gap)) {
          lanes[lane] = visualRightEdge;
          break;
        }
        lane++;
      }

      if (lane > maxLane) maxLane = lane;

      // Correct alternating logic: 0, -100, 100, -200, 200...
      let yOffset = 0;
      if (lane > 0) {
        const level = Math.ceil(lane / 2);
        const sign = lane % 2 === 1 ? -1 : 1;
        yOffset = level * sign * 110; // Slightly more gap
      }

      return { ...d, yOffset };
    });

    // Dynamically adjust container height based on lanes
    const requiredHeight = Math.max(400, (Math.ceil(maxLane / 2) + 1) * 220);
    if (dimensions.height !== requiredHeight) {
      setDimensions(prev => ({ ...prev, height: requiredHeight }));
      return; // Re-run with new dimensions
    }

    // Create main group
    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate vertical center - now truly centered
    const centerY = height / 2;

    // Add Today marker
    const todayX = timeScale(new Date());
    if (todayX <= width && todayX >= 0) {
      const todayGroup = mainGroup.append('g').attr('class', 'today-marker');
      
      todayGroup.append('line')
        .attr('x1', todayX)
        .attr('y1', 0)
        .attr('x2', todayX)
        .attr('y2', height)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');

      todayGroup.append('text')
        .attr('x', todayX)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text('TODAY');
    }

    // Draw timeline line
    mainGroup.append('line')
      .attr('x1', 0)
      .attr('y1', centerY)
      .attr('x2', width)
      .attr('y2', centerY)
      .attr('stroke', 'url(#timeline-gradient)')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round');

    // Define gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'timeline-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6');
    gradient.append('stop').attr('offset', '50%').attr('stop-color', '#a855f7');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ec4899');

    // Draw nodes
    const nodes = mainGroup
      .selectAll('.timeline-node')
      .data(processedData)
      .enter()
      .append('g')
      .attr('class', 'timeline-node')
      .attr('transform', (d) => `translate(${timeScale(d.date)},${centerY + d.yOffset})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        const relativeX = rect.left - containerRect.left;
        const relativeY = rect.top - containerRect.top;

        // Smart anchor logic
        const anchor = d.yOffset > 0 ? 'bottom' : 'top';
        const xOffset =
          relativeX < 150 ? 'left' : relativeX > containerRect.width - 150 ? 'right' : 'center';

        setTooltipPosition({ x: relativeX, y: relativeY, anchor, xOffset });
        setHoveredNode(d);

        d3.select(event.currentTarget).select('circle').transition().attr('r', 18);
        d3.select(event.currentTarget).select('rect').transition().attr('height', 24).attr('y', -12);
      })
      .on('mouseleave', (event) => {
        tooltipTimeoutRef.current = setTimeout(() => {
          setHoveredNode(null);
          if (svgRef.current) {
            d3.select(svgRef.current).selectAll('.timeline-node circle').transition().attr('r', 14);
            d3.select(svgRef.current).selectAll('.timeline-node rect').transition().attr('height', 20).attr('y', -10);
          }
        }, 300);
      })
      .on('click', (event, d) => {
        if (d.type === 'experience' && d.slug) {
          window.location.href = `/experiences/${d.slug}`;
        }
      });

    // Duration bars
    nodes
      .append('rect')
      .attr('x', 0)
      .attr('y', -10)
      .attr('width', (d) => {
        const endX = timeScale(d.endDate);
        const startX = timeScale(d.date);
        return Math.max(endX - startX, 28);
      })
      .attr('height', 20)
      .attr('rx', 10)
      .attr('fill', (d) => (d.type === 'education' ? '#10b981' : '#3b82f6'))
      .attr('opacity', 0.2);

    // Connecting lines
    nodes
      .filter((d) => d.yOffset !== 0)
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', (d) => -d.yOffset)
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 4')
      .attr('opacity', 0.6);

    // Node circles
    nodes
      .append('circle')
      .attr('r', 14)
      .attr('fill', (d) => (d.type === 'education' ? '#10b981' : '#3b82f6'))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 4)
      .attr('class', 'shadow-sm');

    // Logo/Icon positioning based on stagger direction
    nodes
      .append('foreignObject')
      .attr('x', -24)
      .attr('y', (d) => (d.yOffset >= 0 ? 30 : -80))
      .attr('width', 48)
      .attr('height', 48)
      .append('xhtml:div')
      .attr('class', (d) => {
        const baseClass = 'w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white';
        if (d.type === 'education') {
          return `${baseClass} bg-gradient-to-br from-green-400 to-green-600 text-white text-2xl`;
        }
        return `${baseClass} bg-gradient-to-br ${d.logoGradient} text-white`;
      })
      .html((d) => {
        if (d.type === 'education') return '🎓';
        if (d.logo && (d.logo.startsWith('http') || d.logo.startsWith('/'))) {
          return `<img src="${d.logo}" alt="${d.company}" class="w-full h-full object-cover rounded-full" />`;
        }
        return d.logo || '';
      });

    // Subtitle positioning
    nodes
      .append('text')
      .attr('y', (d) => (d.yOffset >= 0 ? 95 : -95))
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('class', 'uppercase tracking-wider')
      .text((d) => d.subtitle);

    // Current position indicator
    const currentNode = processedData.find((d) => d.isCurrent);
    if (currentNode) {
      const indicatorY = centerY + currentNode.yOffset + (currentNode.yOffset >= 0 ? 120 : -120);
      mainGroup
        .append('text')
        .attr('x', timeScale(currentNode.date))
        .attr('y', indicatorY)
        .attr('text-anchor', 'middle')
        .attr('fill', '#10b981')
        .attr('font-size', '12px')
        .attr('font-weight', '900')
        .attr('class', 'uppercase tracking-widest')
        .text('Present Day');
    }

    // Add time axis
    const timeAxis = d3
      .axisBottom(timeScale)
      .ticks(Math.min(processedData.length, 10))
      .tickFormat((d) => d3.timeFormat('%Y')(d as Date));

    mainGroup
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(timeAxis)
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        mainGroup.attr('transform', `translate(${event.transform.x + margin.left},${event.transform.y + margin.top}) scale(${event.transform.k})`);
      });

    svg.call(zoom as any);
    zoomBehaviorRef.current = zoom;

  }, [data, dimensions, filter]);

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideHeader && (
          <div className="text-center mb-8 *:text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Career Timeline
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Interactive journey through my professional experience
            </p>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id as 'all' | 'experience' | 'education')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                filter === opt.id
                  ? `${opt.activeClass} ${opt.textActive} shadow-lg dark:shadow-none`
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        <div ref={containerRef} className="relative bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-4 overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => {
                if (svgRef.current && zoomBehaviorRef.current) {
                  d3.select(svgRef.current)
                    .transition()
                    .call(zoomBehaviorRef.current.scaleBy as any, 1.2);
                }
              }}
              className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 cursor-pointer"
              title="Zoom In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button
              onClick={() => {
                if (svgRef.current && zoomBehaviorRef.current) {
                  d3.select(svgRef.current)
                    .transition()
                    .call(zoomBehaviorRef.current.scaleBy as any, 0.8);
                }
              }}
              className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 cursor-pointer"
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button
              onClick={() => {
                if (svgRef.current && zoomBehaviorRef.current) {
                  d3.select(svgRef.current)
                    .transition()
                    .call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity);
                }
              }}
              className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 cursor-pointer"
              title="Reset Zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <ExportControls svgRef={svgRef} fileName="career-journey-timeline" />
          </div>

          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full touch-none"
            style={{ overflow: 'visible' }}
          />

          {/* Tooltip */}
          {hoveredNode && (
            <div
              className="absolute z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 pointer-events-auto transition-all duration-200 ease-out"
              style={{
                top: tooltipPosition.anchor === 'top' ? tooltipPosition.y - 10 : tooltipPosition.y + 10,
                left:
                  tooltipPosition.xOffset === 'left'
                    ? tooltipPosition.x
                    : tooltipPosition.xOffset === 'right'
                    ? tooltipPosition.x - 300
                    : tooltipPosition.x - 150,
                transform: tooltipPosition.anchor === 'top' ? 'translateY(-100%)' : 'translateY(0)',
                maxWidth: '300px',
                minWidth: '240px',
              }}
              onMouseEnter={() => {
                if (tooltipTimeoutRef.current) {
                  clearTimeout(tooltipTimeoutRef.current);
                  tooltipTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => {
                setHoveredNode(null);
                // Also reset visual state
                if (svgRef.current) {
                  d3.select(svgRef.current).selectAll('.timeline-node circle').transition().attr('r', 14);
                  d3.select(svgRef.current).selectAll('.timeline-node rect').transition().attr('height', 20).attr('y', -10);
                }
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  hoveredNode.type === 'education' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {hoveredNode.type}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  {calculateDetailedDuration(hoveredNode.date, hoveredNode.endDate)}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                {hoveredNode.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {hoveredNode.subtitle}
              </p>

              {hoveredNode.skills && hoveredNode.skills.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex flex-wrap gap-1">
                    {hoveredNode.skills.slice(0, 5).map((skill, idx) => {
                      const skillName = typeof skill === 'string' ? skill : (skill as any).name || 'Unknown';
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-[10px] rounded-full ${
                            hoveredNode.type === 'education'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {skillName}
                        </span>
                      );
                    })}
                    {hoveredNode.skills.length > 5 && (
                      <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 text-[10px] rounded-full">
                        +{hoveredNode.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {hoveredNode.type === 'experience' && hoveredNode.slug && (
                <a 
                  href={`/experiences/${hoveredNode.slug}`}
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1 hover:underline cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Click to view details <span>→</span>
                </a>
              )}
              
              {hoveredNode.type === 'education' && (
                <div className="mt-2 space-y-1">
                  {hoveredNode.field && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Field:</span> {hoveredNode.field}
                    </p>
                  )}
                  {hoveredNode.gpa && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">GPA:</span> {hoveredNode.gpa.toFixed(2)}
                    </p>
                  )}
                  {hoveredNode.honors && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      🏆 {hoveredNode.honors}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200 dark:shadow-none"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Work Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600 shadow-sm shadow-green-200 dark:shadow-none"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Education</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Hover over nodes to see details • Scroll to zoom • Drag to pan • Click blue nodes for full experience
          </p>
        </div>
      </div>
    </div>
  );
}
