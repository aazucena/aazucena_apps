/**
 * Skills Stream Graph Component
 * D3.js-powered organic stacked area chart showing category dominance over time
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { useStore } from "@nanostores/react";
import { visibleCategoriesStore } from "~/store/journey";
import * as d3 from "d3";
import type { StreamGraphStep } from "~/lib/transformers/journey";
import { ExportControls } from "~/components/ui/journey";

interface StreamGraphProps {
  data: StreamGraphStep[];
}
type StreamGraphData = Record<string, number | null | undefined> & {
  date: Date;
};
export function StreamGraph({ data }: StreamGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  const globalVisibleCategories = useStore(visibleCategoriesStore);

  // Filtered data based on global store
  const filteredData = useMemo<StreamGraphData[]>(() => {
    if (!globalVisibleCategories || !data.length) return data;

    return data.map((step) => {
      const filteredStep = { date: step.date } as StreamGraphData;
      Object.keys(step).forEach((key) => {
        if (key === "date") return;
        if (globalVisibleCategories.has(key)) {
          filteredStep[key] = step[key];
        }
      });
      return filteredStep;
    });
  }, [data, globalVisibleCategories]);

  // Stable keys and color scale
  const { keys, colorScale } = useMemo(() => {
    if (!filteredData.length) return { keys: [], colorScale: null };
    const k = Object.keys(filteredData[0]!).filter((k) => k !== "date");
    const cs = d3.scaleOrdinal(d3.schemeTableau10).domain(k);
    return { keys: k, colorScale: cs };
  }, [filteredData]);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      !svgRef.current ||
      !filteredData.length ||
      dimensions.width === 0 ||
      !colorScale
    )
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => {
          let sum = 0;
          keys.forEach((k) => {
            if (k in d && d[k]) {
              sum += d[k];
            }
          });
          return -sum / 2; // Center for stream
        }) || -10,
        d3.max(filteredData, (d) => {
          let sum = 0;
          keys.forEach((k) => {
            if (k in d && d[k]) {
              sum += d[k];
            }
          });
          return sum / 2;
        }) || 10,
      ])
      .range([height, 0]);

    // Stack generator for streamgraph
    const stack = d3
      .stack()
      .keys(keys)
      .offset(d3.stackOffsetSilhouette) // Centers the stream
      .order(d3.stackOrderNone);

    const series = stack(filteredData as any);

    // Area generator
    const area = d3
      .area<any>()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveBasis); // Smooth curves

    // Draw layers
    g.selectAll(".layer")
      .data(series)
      .enter()
      .append("path")
      .attr("class", "layer")
      .attr("d", area)
      .attr("fill", (d) => colorScale(d.key) as string)
      .attr("fill-opacity", 0.8)
      .on("mouseenter", function (_event, d) {
        d3.selectAll(".layer").attr("fill-opacity", 0.3);
        d3.select(this).attr("fill-opacity", 1);

        // Tooltip
        tooltip.style("opacity", 1).text(d.key);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseleave", function () {
        d3.selectAll(".layer").attr("fill-opacity", 0.8);
        tooltip.style("opacity", 0);
      });

    // Add X Axis
    const xAxis = d3.axisBottom(xScale).ticks(width / 100);
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove())
      .selectAll("text")
      .attr("fill", "#9ca3af");

    // Tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "stream-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("padding", "4px 8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 100);

    // Cleanup
    return () => {
      d3.selectAll(".stream-tooltip").remove();
    };
  }, [data, dimensions, keys, colorScale]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl border border-gray-100 p-4 dark:border-gray-800"
    >
      <div className="absolute top-4 right-4 z-10">
        <ExportControls svgRef={svgRef} fileName="skill-momentum" />
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full text-gray-900 dark:text-gray-100"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {colorScale &&
          keys.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: colorScale(key) as string }}
              ></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {key}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
