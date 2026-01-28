/**
 * Skills Heatmap Component
 * D3.js-powered heatmap showing intensity of skill usage month-by-month
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import * as d3 from 'd3';
import { Info } from 'luxon';
import { ExportControls } from '@/components/common/ExportControls';
import { motion, AnimatePresence } from 'framer-motion';

// Local Type Definition (to avoid broken relative imports)
export interface HeatmapCell {
  date: Date;
  count: number;
  category?: string;
  categoryDistribution?: Record<string, number>;
}

interface HeatmapProps {
  data: HeatmapCell[];
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Page View': 'bg-sky-500',
    'Interaction': 'bg-primary-500',
    'Music': 'bg-purple-500',
    'Form': 'bg-orange-500',
    'Error': 'bg-rose-500',
    'Other': 'bg-gray-500'
  };
  return colors[category] || 'bg-blue-500';
};

export function Heatmap({ data }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const [hoveredCell, setHoveredCell] = useState<{ cell: HeatmapCell; x: number; y: number } | null>(null);
  
  const visibleCategories = useSelector((state: RootState) => state.dashboard.filters.visibleCategories);

  // 1. Generate the padded data (Skeleton + Real Data)
  const paddedData = useMemo(() => {
    const result: HeatmapCell[] = [];
    const now = new Date();
    const startYear = now.getFullYear() - 10;
    const endYear = now.getFullYear();
    
    for (let y = startYear; y <= endYear; y++) {
      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(y, m, 1);
        const match = data.find(d =>
          d.date.getFullYear() === y && d.date.getMonth() === m
        );
        result.push(match || { date: monthDate, count: 0 });
      }
    }
    return result;
  }, [data]);

  const years = useMemo(() => {
    return Array.from(new Set(paddedData.map(d => d.date.getFullYear()))).sort((a, b) => a - b);
  }, [paddedData]);

  const filteredData = useMemo(() => {
    if (!visibleCategories || !paddedData.length) return paddedData;
    return paddedData.map(cell => {
      if (!cell.category || visibleCategories.includes(cell.category)) {
        return cell;
      }
      return { ...cell, count: 0, category: undefined };
    });
  }, [paddedData, visibleCategories]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const totalWidth = containerRef.current.clientWidth;
        const MARGIN_X = 120;
        const MAX_CELL_SIZE = 35;
        const availableWidth = totalWidth - MARGIN_X;
        const cellSize = Math.max(35, Math.min(MAX_CELL_SIZE, availableWidth / (years.length || 1)));
        const dynamicHeight = 12 * cellSize + 120;
        setDimensions({ width: totalWidth, height: Math.max(300, dynamicHeight) });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [years.length]);

  useEffect(() => {
    if (!svgRef.current || !filteredData.length || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    const months = Info.months('short');
    const cellSize = Math.min(35, width / (years.length || 1));
    const gridWidth = years.length * cellSize;
    const xOffset = (width - gridWidth) / 2;

    const g = svg.append('g').attr('transform', `translate(${margin.left + xOffset},${margin.top})`);
    
    const maxCount = d3.max(filteredData, d => d.count) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxCount]);

    // X-Axis Labels (Years)
    g.selectAll('.year-label')
      .data(years.filter((y, i) => i % 2 === 0))
      .enter()
      .append('text')
      .attr('x', (d) => years.indexOf(d) * cellSize + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--chart-axis)')
      .text(d => d);

    // Y-Axis Labels (Months)
    g.selectAll('.month-label')
      .data(months)
      .enter()
      .append('text')
      .attr('x', -10)
      .attr('y', (d, i) => i * cellSize + cellSize / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--chart-axis)')
      .text(d => d);

    // Cells
    g.selectAll('.cell')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('width', cellSize - 2)
      .attr('height', cellSize - 2)
      .attr('x', d => years.indexOf(d.date.getFullYear()) * cellSize)
      .attr('y', d => d.date.getMonth() * cellSize)
      .attr('rx', 2)
      .attr('fill', d => d.count === 0 ? 'transparent' : colorScale(d.count))
      .attr('stroke', 'var(--chart-grid)')
      .attr('stroke-width', 1)
      .on('mouseenter', function(event, d) {
        if (d.count === 0) return;
        d3.select(this).attr('stroke', '#10b981').attr('stroke-width', 2);
        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setHoveredCell({
            cell: d,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top
          });
        }
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).attr('stroke', 'var(--chart-grid)').attr('stroke-width', 1);
        setHoveredCell(null);
      });

  }, [filteredData, dimensions, years]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-xl">
        {/* Left Column: Heatmap */}
        <div ref={containerRef} className="lg:col-span-3 relative p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 bg-white dark:bg-zinc-950">
          <div className="absolute top-6 right-6 z-10">
            <ExportControls svgRef={svgRef} fileName="system-usage-intensity" />
          </div>

          <div style={{ minWidth: '1200px' }}>
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full overflow-visible"
            />
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="lg:col-span-1 flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50 p-8 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {hoveredCell ? (
              <motion.div
                key="hover-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
                    {d3.timeFormat('%B %Y')(hoveredCell.cell.date)}
                  </div>
                  <div className="text-[10px] text-primary-600 dark:text-primary-500 font-mono font-bold mt-2 uppercase tracking-[0.2em] bg-primary-500/5 py-1 px-3 rounded-full border border-primary-500/10 w-fit">
                    {hoveredCell.cell.count} ACTIVE_EVENTS
                  </div>
                </div>

                {hoveredCell.cell.categoryDistribution && (
                  <div className="space-y-6">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 font-black">Payload Breakdown</div>
                    <div className="space-y-4">
                      {Object.entries(hoveredCell.cell.categoryDistribution)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 6)
                        .map(([category, count]) => (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-600 dark:text-zinc-400 font-mono uppercase tracking-wider">
                              <span className="truncate pr-2">{category}</span>
                              <span>{count}</span>
                            </div>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-800/50">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / (d3.max(Object.values(hoveredCell.cell.categoryDistribution!)) || 1)) * 100}%` }}
                                transition={{ duration: 0.4 }}
                                className={`${getCategoryColor(category)} h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]`}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="default-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col"
              >
                <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 mb-8 uppercase tracking-[0.3em]">Telemetry Summary</div>
                <div className="space-y-6 flex-1">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-mono uppercase tracking-widest">
                    Visualizing historical systems telemetry across a 120-month horizon.
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-500">
                      <div className="w-4 h-4 rounded border border-zinc-200 dark:border-white/5 bg-transparent shadow-inner" />
                      <span className="font-mono uppercase tracking-widest font-bold">Zero_Activity</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-500">
                      <div className="flex gap-0.5">
                        <div className="w-3 h-4 bg-blue-900/40 rounded-sm" />
                        <div className="w-3 h-4 bg-blue-700/60 rounded-sm" />
                        <div className="w-3 h-4 bg-blue-500/80 rounded-sm" />
                        <div className="w-3 h-4 bg-blue-400 rounded-sm shadow-[0_0_10px_rgba(96,165,250,0.3)]" />
                      </div>
                      <span className="font-mono uppercase tracking-widest font-bold">Event_Density</span>
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mono leading-relaxed italic border-l-2 border-primary-500/30 pl-4">
                      Protocol: Hover over active telemetry nodes to extract high-fidelity event distribution metadata.
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 font-black mb-2">Observation_Horizon</div>
                  <div className="text-xs font-black text-zinc-900 dark:text-zinc-400 font-mono tracking-tighter">
                    {years[0]} — {years[years.length - 1]}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}