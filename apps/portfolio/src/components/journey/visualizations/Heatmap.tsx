/**
 * Skills Heatmap Component
 * D3.js-powered heatmap showing intensity of skill usage month-by-month
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { visibleCategoriesStore } from '../store';
import * as d3 from 'd3';
import type { HeatmapCell } from '../transformers';
import { Info } from 'luxon';
import { ExportControls } from '../ui/ExportControls';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatmapProps {
  data: HeatmapCell[];
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Frontend': 'bg-sky-500',
    'Backend': 'bg-emerald-500',
    'AI/ML': 'bg-purple-500',
    'DevOps': 'bg-orange-500',
    'Tools': 'bg-slate-500',
    'Design': 'bg-pink-500',
    'Mobile': 'bg-indigo-500',
    'Cloud': 'bg-cyan-500',
    'Data': 'bg-amber-500',
    'Security': 'bg-rose-500',
    'Testing': 'bg-lime-500',
    'Other': 'bg-gray-500'
  };
  return colors[category] || 'bg-blue-500';
};

export function Heatmap({ data }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const [hoveredCell, setHoveredCell] = useState<{ cell: HeatmapCell; x: number; y: number } | null>(null);
  const globalVisibleCategories = useStore(visibleCategoriesStore);

  // Filtered data based on global store
  const filteredData = useMemo(() => {
    if (!globalVisibleCategories || !data.length) return data;
    
    return data.map(cell => {
      if (!cell.category || globalVisibleCategories.has(cell.category)) {
        return cell;
      }
      return { ...cell, count: 0, category: undefined };
    });
  }, [data, globalVisibleCategories]);

  // Group data by year
  const years = useMemo(() => {
    return Array.from(new Set(filteredData.map(d => d.date.getFullYear()))).sort((a, b) => a - b);
  }, [filteredData]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const totalWidth = containerRef.current.clientWidth;
        const MARGIN_X = 120; // Total horizontal margin (60 left + 60 right)
        const MAX_CELL_SIZE = 35;
        
        const availableWidth = totalWidth - MARGIN_X;
        const cellSize = Math.min(MAX_CELL_SIZE, availableWidth / (years.length || 1));
        
        // Calculate dynamic height based on 12 months + margins (60 top + 60 bottom)
        const dynamicHeight = 12 * cellSize + 120;
        
        setDimensions({
          width: totalWidth,
          height: Math.max(300, dynamicHeight),
        });
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
    const MAX_CELL_SIZE = 35;

    const cellSize = Math.min(MAX_CELL_SIZE, width / (years.length || 1));
    const gridWidth = years.length * cellSize;
    const xOffset = (width - gridWidth) / 2;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left + xOffset},${margin.top})`);
    
    // Color scale for intensity
    const maxCount = d3.max(filteredData, d => d.count) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxCount]);

    // Draw year labels (X-axis) - with skip logic to prevent overlap
    g.selectAll('.year-label')
      .data(years)
      .enter()
      .append('text')
      .attr('x', (d, i) => years.indexOf(d) * cellSize + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'currentColor')
      .text(d => d);

    // Draw month labels (Y-axis)
    g.selectAll('.month-label')
      .data(months)
      .enter()
      .append('text')
      .attr('x', -10)
      .attr('y', (d, i) => i * cellSize + cellSize / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .attr('fill', 'currentColor')
      .text(d => d);

    // Draw cells
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
      .attr('fill', d => d.count === 0 ? '#f3f4f6' : colorScale(d.count))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 0.5)
      .on('mouseenter', function(event, d) {
        if (d.count === 0) return;
        d3.select(this).attr('stroke', '#3b82f6').attr('stroke-width', 2);
        
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
      .on('mouseleave', function() {
        d3.select(this).attr('stroke', '#e5e7eb').attr('stroke-width', 0.5);
        setHoveredCell(null);
      });

  }, [filteredData, dimensions, years]);

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 bg-gray-50 dark:bg-gray-900 rounded-3xl">
        {/* Left Column: Heatmap */}
        <div ref={containerRef} className="lg:col-span-3 relative p-4">
          <div className="absolute top-4 right-4 z-10">
            <ExportControls svgRef={svgRef} fileName="skill-usage-intensity" />
          </div>

          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Right Column: Info Panel */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <div className="bg-white/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 h-full flex flex-col shadow-sm">
            <AnimatePresence mode="wait">
              {hoveredCell ? (
                <motion.div
                  key="hover-details"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {d3.timeFormat('%B %Y')(hoveredCell.cell.date)}
                    </div>
                    <div className="text-sm text-blue-500 font-semibold mt-1">
                      {hoveredCell.cell.count} Active Skills
                    </div>
                  </div>

                  {hoveredCell.cell.categoryDistribution && (
                    <div className="space-y-4">
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Category Distribution</div>
                      <div className="space-y-3">
                        {Object.entries(hoveredCell.cell.categoryDistribution)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 6)
                          .map(([category, count]) => (
                            <div key={category} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                                <span className="truncate pr-2">{category}</span>
                                <span>{count}</span>
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / (d3.max(Object.values(hoveredCell.cell.categoryDistribution!)) || 1)) * 100}%` }}
                                  transition={{ duration: 0.4 }}
                                  className={`${getCategoryColor(category)} h-full rounded-full`}
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
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">Quick Insights</div>
                  <div className="space-y-4 flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      This heatmap visualizes technical activity over time. Each cell represents a month.
                    </p>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-4 h-4 bg-[#f3f4f6] rounded border border-gray-200" />
                        <span>No skill activity</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex gap-0.5">
                          <div className="w-3 h-4 bg-blue-100 rounded-sm" />
                          <div className="w-3 h-4 bg-blue-300 rounded-sm" />
                          <div className="w-3 h-4 bg-blue-500 rounded-sm" />
                          <div className="w-3 h-4 bg-blue-700 rounded-sm" />
                        </div>
                        <span>Frequency scale</span>
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <p className="text-[10px] text-gray-400 italic">
                        Tip: Hover over any blue square to see which technology categories dominated that specific month.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Timeline Range</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {years[0]} — {years[years.length - 1]}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
