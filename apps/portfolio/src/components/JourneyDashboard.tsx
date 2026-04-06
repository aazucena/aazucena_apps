/**
 * Journey Dashboard Component
 * Tabbed interface combining all technical visualizations for the journey page
 *
 * Scoped to /journey page - not a general-purpose dashboard
 * Phase 3 Task #5: DetailsModal lazy-loaded for bundle optimization
 */

import { lazy, Suspense, useState } from "react";
import {
  SpiderChart,
  ForceDirectedGraph,
  StreamGraph,
  Heatmap,
} from "@aazucena/visualizations";
import {
  CareerStats,
  Toolbar,
  GrowthMetrics,
  SankeyWithSemantics,
  HeatmapInfoPanel,
} from "~/components/ui/journey";
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
} from "@aazucena/types";

// Lazy load DetailsModal - only loads when user clicks to view skill details
const DetailsModal = lazy(() =>
  import("~/components/ui/journey/DetailsModal").then((m) => ({
    default: m.DetailsModal,
  })),
);
import type { Experience } from "@aazucena/types";
import type { Education } from "@aazucena/types";
import type { Project } from "@aazucena/types";

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
              onClick={() => setActiveTab(tab.id as TabType)}
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
              <div className="mx-auto max-w-4xl">
                <SpiderChart
                  data={evolutionData as any}
                  hideHeader
                  showYearControls
                  height={480}
                />
              </div>
            )}

            {activeTab === "network" && (
              <ForceDirectedGraph
                data={networkData}
                onNodeClick={handleNodeClick}
                groupKey="category"
                hideHeader
                showPhysicsControls
                height={560}
              />
            )}

            {activeTab === "flow" && (
              <SankeyWithSemantics data={sankeyData} height={560} />
            )}

            {activeTab === "momentum" && (
              <StreamGraph data={streamGraphData} hideHeader height={560} />
            )}

            {activeTab === "intensity" && (
              <Heatmap
                data={heatmapData}
                hideHeader
                height={500}
                infoPanel={(cell) => <HeatmapInfoPanel cell={cell} />}
              />
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
