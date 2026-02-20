/**
 * Force-Directed Graph Component
 * D3.js force simulation showing skill relationships and clustering
 */

import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { skillSearchQueryStore } from "~/store/journey";
import * as d3 from "d3";
import type {
  SkillsNetworkData,
  SkillNode,
  SkillLink,
} from "~/lib/transformers/journey";
import { ExportControls } from "~/components/ui/journey";

interface ForceDirectedGraphProps {
  data: SkillsNetworkData;
  onNodeClick?: (_node: SkillNode) => void;
}

// Extended types for D3 simulation
interface SimulationNode extends SkillNode, d3.SimulationNodeDatum {}
interface SimulationLink extends Pick<SkillLink, "value"> {
  source: SimulationNode | string;
  target: SimulationNode | string;
}

export function ForceDirectedGraph({
  data,
  onNodeClick,
}: ForceDirectedGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 650 });
  const searchQuery = useStore(skillSearchQueryStore);

  // Simulation state
  const [chargeStrength, setChargeStrength] = useState(-400);
  const [linkDistance, setLinkDistance] = useState(120);
  const [collisionRadius, setCollisionRadius] = useState(12);
  const [showControls, setShowControls] = useState(false);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(
            Math.min(containerRef.current.clientWidth * 0.8, 700),
            500,
          ),
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update highlighting when searchQuery changes
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll<SVGGElement, SimulationNode>("g.node-group");
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      nodes.style("opacity", 1);
      nodes.select("circle").attr("stroke", "#ffffff").attr("stroke-width", 2);
      return;
    }

    nodes.each(function (d) {
      const isMatch = d.name.toLowerCase().includes(query);
      d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", isMatch ? 1 : 0.1);

      if (isMatch) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(300)
          .attr("stroke", "#3b82f6")
          .attr("stroke-width", 4);
      } else {
        d3.select(this)
          .select("circle")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2);
      }
    });
  }, [searchQuery, data.nodes.length]);

  // D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Create main group
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Dynamic category color palette
    const colorPalette = [
      "#3b82f6", // blue
      "#10b981", // green
      "#f59e0b", // amber
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#14b8a6", // teal
      "#f97316", // orange
      "#8b5cf6", // violet
      "#6366f1", // indigo
      "#06b6d4", // cyan
    ];

    // Get unique categories and assign colors
    const uniqueCategories = Array.from(
      new Set(data.nodes.map((n) => n.category)),
    );
    const categoryColors: Record<string, string> = {};
    uniqueCategories.forEach((category, index) => {
      categoryColors[category] = colorPalette[index % colorPalette.length]!;
    });

    // Ensure 'Other' always has gray
    categoryColors["Other"] = "#6b7280";

    // Create simulation with dynamic link strength based on co-occurrence
    // Skills that appear together more often will be pulled closer
    const simulation = d3
      .forceSimulation<SimulationNode>(data.nodes as SimulationNode[])
      .force(
        "link",
        d3
          .forceLink<SimulationNode, SimulationLink>(
            data.links as SimulationLink[],
          )
          .id((d) => d.id)
          .distance((d) => linkDistance / Math.sqrt(d.value))
          .strength((d) => Math.min(d.value / 12, 0.8)),
      )
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d: any) => collisionRadius + Math.sqrt(d.size) * 4),
      );

    // Helper function to get link color based on connected node categories
    const getLinkColor = (link: any) => {
      const sourceNode = data.nodes.find(
        (n) =>
          n.id ===
          (typeof link.source === "string" ? link.source : link.source.id),
      );
      const targetNode = data.nodes.find(
        (n) =>
          n.id ===
          (typeof link.target === "string" ? link.target : link.target.id),
      );

      if (!sourceNode || !targetNode) return "#94a3b8"; // neutral gray fallback

      // If both nodes are same category, use that category's color
      if (sourceNode.category === targetNode.category) {
        return categoryColors[sourceNode.category] || "#94a3b8";
      }

      // If different categories, use a neutral slate color
      return "#94a3b8";
    };

    // Draw links - thinner edges, color-coded by category
    const link = g
      .append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", getLinkColor) // Color-coded by node categories
      .attr("stroke-opacity", (d) => Math.min(0.25 + d.value * 0.08, 0.5)) // More transparent
      .attr("stroke-width", (d) => 0.8 + Math.sqrt(d.value) * 0.8) // Much thinner for clarity
      .attr("stroke-linecap", "round"); // Rounded ends for cleaner look

    // Draw nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

    // Add circles to nodes - size scaled by frequency (more dramatic scaling)
    node
      .append("circle")
      .attr("r", (d) => 6 + Math.sqrt(d.size) * 4) // Increased from 5 + size * 3
      .attr(
        "fill",
        (d) => categoryColors[d?.category!] || categoryColors.Other!,
      )
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
        if (onNodeClick) onNodeClick(d);
      })
      .on("mouseenter", function (_event, d) {
        d3.select(this)
          .transition()
          .attr("r", (d) => 9 + Math.sqrt((d as { size: number }).size) * 4);

        // Highlight connected nodes and links
        const connectedNodes = new Set<string>();
        connectedNodes.add(d.id);

        link
          .style("stroke-opacity", (l) => {
            if (l.source === d.id || l.target === d.id) {
              connectedNodes.add(l.source);
              connectedNodes.add(l.target);
              return 0.9; // Full opacity for connected
            }
            return 0.08; // Very faded for non-connected
          })
          .style("stroke-width", (l) => {
            if (l.source === d.id || l.target === d.id) {
              return (0.8 + Math.sqrt(l.value) * 0.8) * 2; // Highlighted = 2x thicker
            }
            return 0.8 + Math.sqrt(l.value) * 0.8;
          });

        node.style("opacity", (n) => (connectedNodes.has(n.id) ? 1 : 0.2));

        // Highlight hovered node's label
        if (!this.parentNode) return;
        d3.select(this?.parentNode.textContent!)
          .selectAll(".node-label")
          .attr("fill", categoryColors[d.category] || "#1f2937")
          .attr("font-weight", "700")
          .attr("font-size", "12px");
      })
      .on("mouseleave", function (_event, _d) {
        d3.select(this)
          .transition()
          .attr("r", (d) => 6 + Math.sqrt((d as { size: number }).size) * 4);

        link
          .attr("stroke", getLinkColor) // Restore color-coded colors
          .style("stroke-opacity", (l) => Math.min(0.25 + l.value * 0.08, 0.5))
          .style("stroke-width", (l) => 0.8 + Math.sqrt(l.value) * 0.8);

        // Restore node opacity based on search query if it exists
        const query = skillSearchQueryStore.get().toLowerCase().trim();
        if (query) {
          node.style("opacity", (n) =>
            n.name.toLowerCase().includes(query) ? 1 : 0.1,
          );
        } else {
          node.style("opacity", 1);
        }

        // Restore normal label appearance
        node
          .selectAll(".node-label")
          .attr("fill", "#1f2937")
          .attr("font-weight", "600")
          .attr("font-size", "11px");
      });

    // Add white halo/background to labels for readability
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", (d) => -9 - Math.sqrt(d.size) * 4)
      .attr("text-anchor", "middle")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .style("pointer-events", "none")
      .attr("opacity", 0.9);

    // Add actual label text on top
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", (d) => -9 - Math.sqrt(d.size) * 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937") // Dark gray for maximum readability
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .style("pointer-events", "none")
      .attr("class", "node-label");

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, dimensions, chargeStrength, linkDistance, collisionRadius]);

  const handleReset = () => {
    setChargeStrength(-400);
    setLinkDistance(120);
    setCollisionRadius(12);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Simulation Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="group w-fit rounded-lg border border-gray-200 bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-700"
          title="Force Simulation Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${showControls ? "rotate-90" : ""} transition-transform`}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {showControls && (
          <div className="animate-in fade-in slide-in-from-left-2 w-64 space-y-4 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Repulsion
                </label>
                <span className="font-mono text-xs text-blue-600">
                  {chargeStrength}
                </span>
              </div>
              <input
                type="range"
                min="-1000"
                max="-100"
                step="50"
                value={chargeStrength}
                onChange={(e) => setChargeStrength(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Distance
                </label>
                <span className="font-mono text-xs text-blue-600">
                  {linkDistance}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={linkDistance}
                onChange={(e) => setLinkDistance(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Spacing
                </label>
                <span className="font-mono text-xs text-blue-600">
                  {collisionRadius}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={collisionRadius}
                onChange={(e) => setCollisionRadius(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700"
              />
            </div>

            <button
              onClick={handleReset}
              className="w-full rounded-lg bg-gray-100 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Reset to Defaults
            </button>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ExportControls svgRef={svgRef} fileName="technology-web" />
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full rounded-3xl bg-gray-50 dark:bg-gray-900"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        {Array.from(new Set(data.nodes.map((n) => n.category))).map(
          (category) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    category === "Other"
                      ? "#6b7280"
                      : [
                          "#3b82f6",
                          "#10b981",
                          "#f59e0b",
                          "#8b5cf6",
                          "#ec4899",
                          "#14b8a6",
                          "#f97316",
                          "#6366f1",
                          "#06b6d4",
                        ][
                          Array.from(
                            new Set(data.nodes.map((n) => n.category)),
                          ).indexOf(category) % 9
                        ],
                }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {category}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
