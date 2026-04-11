/**
 * Journey Dashboard Component
 * Tabbed interface combining all technical visualizations for the journey page
 *
 * Scoped to /journey page - not a general-purpose dashboard
 * Phase 3 Task #5: DetailsModal lazy-loaded for bundle optimization
 */

import { lazy, Suspense, useState, useMemo } from "react";
import { useStore } from "@nanostores/react";
import { visibleCategoriesStore, skillSearchQueryStore } from "~/store/journey";
import {
  CareerStats,
  Toolbar,
  GrowthMetrics,
  // DEBUG: comment out HeatmapInfoPanel to bisect esbuild error at 92:93
  // HeatmapInfoPanel,
} from "~/components/ui/journey";

// Lazy load all @aazucena/visualizations — bisecting bundler parse error at 11389:107
// Isolates whether d3/luxon/framer-motion in visualizations package is the cause
const SpiderChart = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({ default: m.SpiderChart })),
);
const ForceDirectedGraph = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({
    default: m.ForceDirectedGraph,
  })),
);
const StreamGraph = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({ default: m.StreamGraph })),
);
const Heatmap = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({ default: m.Heatmap })),
);

// Lazy load SankeyWithSemantics — removes d3-sankey (and d3-array@2/internmap)
// from the static chunk to isolate a bundler parse error at 11389:100
const SankeyWithSemantics = lazy(() =>
  import("~/components/ui/journey/SankeyWithSemantics").then((m) => ({
    default: m.SankeyWithSemantics,
  })),
);
import { getSkillDetails } from "~/lib/transformers";
import type {
  SpiderChartData,
  SkillsNetworkData,
  SkillNode,
  SankeyData,
  GenericHeatmapCell as HeatmapCell,
  GenericTimeSeriesStep as StreamGraphStep,
  GrowthData,
  CareerStat as CareerStatsType,
  Experience,
  Education,
  Project,
} from "@aazucena/types";

// Lazy load DetailsModal - only loads when user clicks to view skill details
const DetailsModal = lazy(() =>
  import("~/components/ui/journey/DetailsModal").then((m) => ({
    default: m.DetailsModal,
  })),
);

interface JourneyDashboardProps {
  evolutionData: SpiderChartData[];
  networkData: SkillsNetworkData;
  sankeyData: SankeyData;
  heatmapData: HeatmapCell[];
  streamGraphData: StreamGraphStep[];
  growthMetrics: GrowthData;
  careerStats: CareerStatsType;
  categories: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  hideHeader?: boolean;
  hideStats?: boolean;
  hideMetrics?: boolean;
}

type TabType = "evolution" | "network" | "flow" | "momentum" | "intensity";

export function JourneyDashboard({
  evolutionData,
  networkData,
  sankeyData,
  heatmapData,
  streamGraphData,
  growthMetrics,
  careerStats,
  categories,
  experiences,
  education,
  projects,
  hideHeader = false,
  hideStats = false,
  hideMetrics = false,
}: JourneyDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("evolution");
  const visibleCategories = useStore(visibleCategoriesStore);
  const searchQuery = useStore(skillSearchQueryStore);

  // Derive highlight IDs for the network graph from the search query
  const networkHighlightIds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return null;
    return new Set(
      networkData.nodes
        .filter((n) => n.name.toLowerCase().includes(q))
        .map((n) => n.id),
    );
  }, [searchQuery, networkData.nodes]);

  // Filter stream graph data by visible categories
  const filteredStreamData = useMemo(() => {
    if (!visibleCategories || !streamGraphData.length) return streamGraphData;
    return streamGraphData.map((step) => ({
      ...step,
      values: Object.fromEntries(
        Object.entries(step.values).filter(([key]) =>
          visibleCategories.has(key),
        ),
      ),
    }));
  }, [streamGraphData, visibleCategories]);

  // Filter heatmap data — zero out months whose dominant category is hidden
  const filteredHeatmapData = useMemo(() => {
    if (!visibleCategories || !heatmapData.length) return heatmapData;
    return heatmapData.map((cell) => {
      if (!cell.category || visibleCategories.has(cell.category)) return cell;
      return { ...cell, value: 0, count: 0, category: undefined };
    });
  }, [heatmapData, visibleCategories]);

  // Derive year range for the info panel timeline footer
  const heatmapYears = useMemo(
    () =>
      Array.from(
        new Set(heatmapData.map((c) => new Date(c.date).getFullYear())),
      ).sort((a, b) => a - b),
    [heatmapData],
  );

  // Modal state for network graph
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedSkill(node);
    setIsModalOpen(true);
  };

  const skillDetails = selectedSkill
    ? getSkillDetails(selectedSkill.name, experiences, education, projects)
    : null;

  const tabs = [
    {
      id: "evolution",
      label: "Growth & Distribution",
      icon: "📊",
      description: "Spider chart showing category dominance",
    },
    {
      id: "network",
      label: "Technology Web",
      icon: "🕸️",
      description: "Relationships between skills",
    },
    {
      id: "flow",
      label: "Skill Impact Flow",
      icon: "🌊",
      description: "Categories → Skills → Experiences",
    },
    {
      id: "momentum",
      label: "Skill Momentum",
      icon: "📈",
      description: "Continuous evolution of skill frequency",
    },
    {
      id: "intensity",
      label: "Usage Intensity",
      icon: "🔥",
      description: "Monthly skill usage heat-map",
    },
  ];

  return (
    <div className="overflow-visible py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        {!hideHeader && (
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Technical Expertise Deep-Dive
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Explore different perspectives of my technical evolution and
              impact
            </p>
          </div>
        )}

        {/* Career Stats Summary */}
        {!hideStats && (
          <div className="mb-12">
            <CareerStats stats={careerStats} isDashboardVariant={true} />
          </div>
        )}

        {/* Growth Metrics Summary */}
        {!hideMetrics && (
          <div className="mb-12">
            <GrowthMetrics metrics={growthMetrics} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const tabId = tab.id as TabType;
                setActiveTab(tabId);
              }}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        {/* Global Toolbar (Sticky within dashboard section) */}
        <div className="mb-2">
          <Toolbar categories={categories} />
        </div>

        {/* Active Tab Content */}
        <div className="flex min-h-[600px] flex-col rounded-3xl border border-gray-100 bg-gray-200/50 p-6 md:p-10 dark:border-gray-800">
          <div className="mb-8 text-center md:text-left">
            <h3 className="mb-2 text-center text-2xl font-bold text-gray-900 md:text-left dark:text-white">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-center text-gray-600 md:text-left dark:text-gray-400">
              {tabs.find((t) => t.id === activeTab)?.description}
            </p>
          </div>

          <div className="flex-1">
            {activeTab === "evolution" && (
              <Suspense
                fallback={
                  <div className="mx-auto h-[480px] max-w-4xl animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                }
              >
                <div className="mx-auto max-w-4xl">
                  <SpiderChart
                    data={evolutionData}
                    hideHeader
                    showYearControls
                    height={480}
                  />
                </div>
              </Suspense>
            )}

            {activeTab === "network" && (
              <Suspense
                fallback={
                  <div className="h-[560px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                }
              >
                <ForceDirectedGraph
                  data={networkData}
                  onNodeClick={handleNodeClick}
                  groupKey="category"
                  hideHeader
                  showPhysicsControls
                  height={560}
                  highlightIds={networkHighlightIds}
                />
              </Suspense>
            )}

            {activeTab === "flow" && (
              <Suspense
                fallback={
                  <div className="h-[560px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                }
              >
                <SankeyWithSemantics data={sankeyData} height={560} />
              </Suspense>
            )}

            {activeTab === "momentum" && (
              <Suspense
                fallback={
                  <div className="h-[560px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                }
              >
                <StreamGraph
                  data={filteredStreamData}
                  hideHeader
                  height={560}
                />
              </Suspense>
            )}

            {activeTab === "intensity" && (
              <Suspense
                fallback={
                  <div className="h-[560px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                }
              >
                <Heatmap
                  data={filteredHeatmapData}
                  hideHeader
                  // DEBUG: infoPanel removed to bisect esbuild error at 92:93
                  // infoPanel={(cell) => (
                  //   <HeatmapInfoPanel cell={cell} years={heatmapYears} />
                  // )}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* DetailsModal - Lazy loaded */}
        <Suspense fallback={<div className="sr-only">Loading...</div>}>
          <DetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            skillDetails={skillDetails}
          />
        </Suspense>
      </div>
    </div>
  );
}
