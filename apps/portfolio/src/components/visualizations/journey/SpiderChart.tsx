/**
 * Spider Chart (Radar Chart) Component
 * D3.js-powered radar chart showing skill distribution across categories over time
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { SkillsOverTime } from '~/lib/transformers/journey';
import { ExportControls } from '~/components/ui/journey';

interface SpiderChartProps {
  data: SkillsOverTime[];
  selectedYears?: number[]; // Compare multiple years (default: first and last)
}

export function SpiderChart({ data, selectedYears }: SpiderChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  
  // Memoize years and categories for stability
  const allYears = useMemo(() => 
    Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b),
    [data]
  );

  const categories = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]!.categories).filter(cat => cat !== 'Total Skills');
  }, [data]);

  const [currentYear, setCurrentYear] = useState<number>(allYears[allYears.length - 1] || new Date().getFullYear());
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Sync currentYear if data changes
  useEffect(() => {
    if (allYears.length > 0 && !allYears.includes(currentYear)) {
      setCurrentYear(allYears[allYears.length - 1]!);
    }
  }, [allYears, currentYear]);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setDimensions({
          width,
          height: Math.min(width * 0.8, 500),
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation logic
  const animateYears = () => {
    if (isAnimating || allYears.length === 0) return;
    setIsAnimating(true);
    setShowComparison(false);
    
    let i = 0;
    const interval = setInterval(() => {
      setCurrentYear(allYears[i]!);
      i++;
      if (i >= allYears.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 800);
  };

  // D3 Spider Chart Rendering
  useEffect(() => {
    if (!svgRef.current || !data.length || categories.length === 0 || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Determine which years to display
    let yearsToCompare: number[];
    if (selectedYears && selectedYears.length > 0) {
      yearsToCompare = selectedYears;
    } else if (showComparison && !isAnimating) {
      yearsToCompare = allYears.filter((_, index, arr) => 
        index % 3 === 0 || index === 0 || index === arr.length - 1
      );
    } else {
      yearsToCompare = [currentYear];
    }
    
    const compareData = data.filter((d) => yearsToCompare.includes(d.year));
    if (compareData.length === 0) return;

    const margin = 60;
    const width = Math.max(dimensions.width - margin * 2, 100);
    const height = Math.max(dimensions.height - margin * 2, 100);
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(width, height) / 2;

    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Create scale for radial distance
    const maxValue = d3.max(data, (d) =>
      d3.max(categories, (cat) => d.categories[cat] || 0)
    ) || 1; // Fallback to 1 to avoid scale issues

    const radialScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    // Draw concentric circles (grid)
    const ticks = 5;
    for (let i = 1; i <= ticks; i++) {
      const r = (radius / ticks) * i;
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');

      g.append('text')
        .attr('x', 5)
        .attr('y', -r)
        .attr('fill', '#9ca3af')
        .attr('font-size', '10px')
        .text(Math.round((maxValue / ticks) * i));
    }

    // Draw axis lines for each category
    const angleSlice = (Math.PI * 2) / categories.length;

    categories.forEach((category, i) => {
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

      const labelDistance = radius + 25;
      const labelX = Math.cos(angle) * labelDistance;
      const labelY = Math.sin(angle) * labelDistance;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#4b5563')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(category);
    });

    const colorScale = d3.scaleOrdinal<number, string>()
      .domain(allYears)
      .range(d3.schemeTableau10);

    // Draw data for each year
    compareData.forEach((yearData) => {
      const points = categories.map((category, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const value = yearData.categories[category] || 0;
        const r = radialScale(value);
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
      });

      points.push(points[0]!); // Close loop

      const lineGenerator = d3.line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinearClosed);

      const color = colorScale(yearData.year);

      g.append('path')
        .datum(points)
        .attr('d', lineGenerator)
        .attr('fill', color)
        .attr('fill-opacity', compareData.length === 1 ? 0.4 : 0.15)
        .attr('stroke', color)
        .attr('stroke-width', compareData.length === 1 ? 3 : 2)
        .attr('stroke-linejoin', 'round');

      points.slice(0, -1).forEach((point, i) => {
        g.append('circle')
          .attr('cx', point.x)
          .attr('cy', point.y)
          .attr('r', compareData.length === 1 ? 5 : 3)
          .attr('fill', color)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('mouseenter', function () {
            d3.select(this).transition().attr('r', 7);
            const value = yearData.categories[categories[i]!] || 0;
            g.append('text')
              .attr('class', 'radar-tooltip')
              .attr('x', point.x)
              .attr('y', point.y - 15)
              .attr('text-anchor', 'middle')
              .attr('fill', '#111827')
              .attr('font-size', '12px')
              .attr('font-weight', '700')
              .text(`${value} skills`);
          })
          .on('mouseleave', function () {
            d3.select(this).transition().attr('r', compareData.length === 1 ? 5 : 3);
            g.selectAll('.radar-tooltip').remove();
          });
      });
    });

    // Legend / Indicator
    if (compareData.length > 1) {
      const legend = g.append('g').attr('transform', `translate(${radius + 40}, ${-radius})`);
      compareData.forEach((yearData, i) => {
        const item = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        item.append('rect').attr('width', 16).attr('height', 8).attr('rx', 2).attr('fill', colorScale(yearData.year));
        item.append('text').attr('x', 22).attr('y', 8).attr('fill', '#374151').attr('font-size', '11px').attr('font-weight', '600').text(yearData.year);
      });
    } else if (compareData.length === 1) {
      g.append('text')
        .attr('x', 0)
        .attr('y', -radius - 40)
        .attr('text-anchor', 'middle')
        .attr('fill', colorScale(compareData[0]!.year))
        .attr('font-size', '24px')
        .attr('font-weight', '900')
        .text(compareData[0]!.year);
    }
  }, [data, dimensions, categories, allYears, selectedYears, currentYear, isAnimating, showComparison]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative">
        <div className="absolute top-0 right-0 z-10 p-4">
          <ExportControls svgRef={svgRef} fileName={`skill-growth-${currentYear}`} />
        </div>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full overflow-visible bg-gray-50 dark:bg-gray-900 rounded-3xl p-4"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 my-8 px-4">
        <div className="flex gap-2">
          <button
            onClick={animateYears}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
              isAnimating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            {isAnimating ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
            {isAnimating ? 'Playing...' : 'Animate'}
          </button>

          <button
            onClick={() => setShowComparison(!showComparison)}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border ${
              showComparison
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            {showComparison ? 'Individual' : 'Compare'}
          </button>
        </div>
        
        <div className={`flex-1 flex items-center gap-3 w-full sm:w-auto transition-opacity duration-300 ${showComparison ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <span className="text-[10px] font-bold text-gray-400 w-10 text-right">{allYears[0]}</span>
          <input
            type="range"
            min={allYears[0]}
            max={allYears[allYears.length - 1]}
            value={currentYear}
            onChange={(e) => setCurrentYear(+e.target.value)}
            disabled={isAnimating || showComparison}
            className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-[10px] font-bold text-gray-400 w-10">{allYears[allYears.length - 1]}</span>
        </div>
        
        {!showComparison && (
          <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md border border-blue-100 dark:border-blue-800">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{currentYear}</span>
          </div>
        )}
      </div>
    </div>
  );
}
