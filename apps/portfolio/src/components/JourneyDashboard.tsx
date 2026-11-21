/**
 * Journey Dashboard Component
 * Tabbed interface combining all technical visualizations for the journey page
 * Scoped to /journey page - not a general-purpose dashboard
 */

import { useState, useMemo, useEffect } from "react";
import {
  Panel,
  PanelHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@aazucena/ui";
import { useStore } from "@nanostores/react";
import { visibleCategoriesStore, skillSearchQueryStore } from "~/store/journey";
import {
  CareerStats,
  Toolbar,
  GrowthMetrics,
  HeatmapInfoPanel,
} from "~/components/ui/journey";
import {
  SpiderChart,
  ForceDirectedGraph,
  StreamGraph,
  Heatmap,
} from "@aazucena/visualizations";
import { SankeyWithSemantics } from "~/components/ui/journey/SankeyWithSemantics";
import { DetailsModal } from "~/components/ui/journey/DetailsModal";

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

const TOTAL_AXIS = "Total Skills";

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
  const [chartHeight, setChartHeight] = useState(480);
  const visibleCategories = useStore(visibleCategoriesStore);
  const searchQuery = useStore(skillSearchQueryStore);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setChartHeight(w < 640 ? 300 : w < 1024 ? 400 : 480);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const networkHighlightIds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return null;
    return new Set(
      networkData.nodes
        .filter((n) => n.name.toLowerCase().includes(q))
        .map((n) => n.id),
    );
  }, [searchQuery, networkData.nodes]);

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

  const filteredHeatmapData = useMemo(() => {
    if (!visibleCategories || !heatmapData.length) return heatmapData;
    return heatmapData.map((cell) => {
      if (!cell.category || visibleCategories.has(cell.category)) return cell;
      return { ...cell, value: 0, count: 0, category: undefined };
    });
  }, [heatmapData, visibleCategories]);

  const heatmapYears = useMemo(
    () =>
      Array.from(
        new Set(heatmapData.map((c) => new Date(c.date).getFullYear())),
      ).sort((a, b) => a - b),
    [heatmapData],
  );

  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedSkill(node);
    setIsModalOpen(true);
  };

  const skillDetails = selectedSkill
    ? getSkillDetails(selectedSkill.name, experiences, education, projects)
    : null;

  // The spider keeps the category spokes only; the total is shown as a value beside it
  const spiderData = useMemo(
    () =>
      evolutionData.map((d) => ({
        ...d,
        axes: d.axes.filter((a) => a.axis !== TOTAL_AXIS),
      })),
    [evolutionData],
  );
  const latestYear = evolutionData[evolutionData.length - 1];
  const totalSkills =
    latestYear?.axes.find((a) => a.axis === TOTAL_AXIS)?.value ?? null;

  // Text equivalents for charts whose values are otherwise only visible on hover
  const heatmapByYear = useMemo(() => {
    const byYear = new Map<number, { months: number; peak: number }>();
    for (const c of filteredHeatmapData) {
      const v = (c as { count?: number }).count ?? c.value ?? 0;
      if (v <= 0) continue;
      const y = new Date(c.date).getFullYear();
      const cur = byYear.get(y) ?? { months: 0, peak: 0 };
      byYear.set(y, { months: cur.months + 1, peak: Math.max(cur.peak, v) });
    }
    return Array.from(byYear.entries()).sort(([a], [b]) => a - b);
  }, [filteredHeatmapData]);

  const streamPeaks = useMemo(() => {
    const peaks = new Map<string, number>();
    for (const step of filteredStreamData) {
      for (const [k, v] of Object.entries(step.values)) {
        peaks.set(k, Math.max(peaks.get(k) ?? 0, Number(v) || 0));
      }
    }
    return Array.from(peaks.entries());
  }, [filteredStreamData]);

  const tabs = [
    {
      id: "evolution",
      label: "Growth & Distribution",
      description: "Spider chart showing category dominance",
    },
    {
      id: "network",
      label: "Technology Web",
      description: "Relationships between skills",
    },
    {
      id: "flow",
      label: "Skill Impact Flow",
      description: "Categories → Skills → Experiences",
    },
    {
      id: "momentum",
      label: "Skill Momentum",
      description: "Continuous evolution of skill frequency",
    },
    {
      id: "intensity",
      label: "Usage Intensity",
      description: "Monthly skill usage heat-map",
    },
  ] as const;
  const activeMeta = tabs.find((t) => t.id === activeTab);

  return (
    <div className="overflow-visible">
      <div className="mx-auto max-w-[1120px] px-6">
        {!hideHeader && (
          <div className="mb-8">
            <h2 className="text-foreground mb-2 text-3xl font-bold tracking-tight">
              Technical Expertise Deep-Dive
            </h2>
            <p className="text-muted-foreground">
              Explore different perspectives of my technical evolution and
              impact
            </p>
          </div>
        )}

        {!hideStats && (
          <div className="mb-8">
            <CareerStats stats={careerStats} isDashboardVariant={true} />
          </div>
        )}

        {!hideMetrics && (
          <div className="mb-8">
            <GrowthMetrics metrics={growthMetrics} />
          </div>
        )}

        <Panel className="border-rule border">
          <PanelHeader
            label={`TECHNICAL DNA // ${(activeMeta?.label ?? "").toUpperCase()}`}
          >
            {totalSkills !== null && (
              <span className="micro-label text-signal">
                ● {totalSkills} SKILLS
              </span>
            )}
          </PanelHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabType)}
          >
            <TabsList
              aria-label="Technical visualizations"
              className="border-rule h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b bg-transparent p-0"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="micro-label text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-signal rounded-none border-b-2 border-transparent px-4 py-3 text-[10px] data-[state=active]:bg-transparent"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-panel grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
              <aside
                aria-label="Search and filters"
                className="flex flex-col gap-6"
              >
                <Toolbar categories={categories} />
                {activeTab === "evolution" && totalSkills !== null && (
                  <div className="border-rule border-t pt-4">
                    <div className="micro-label text-muted-foreground mb-2">
                      Total skills
                    </div>
                    <div className="text-signal font-mono text-4xl font-light">
                      {totalSkills}
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Skills counted in {latestYear?.name}. Shown as a value,
                      not a spoke, so the category axes keep their shape.
                    </p>
                  </div>
                )}
              </aside>

              <div className="min-w-0">
                <TabsContent value="evolution" className="mt-0">
                  <SpiderChart
                    data={spiderData}
                    hideHeader
                    showYearControls
                    height={chartHeight}
                  />
                </TabsContent>

                <TabsContent value="network" className="mt-0">
                  <ForceDirectedGraph
                    data={networkData}
                    onNodeClick={handleNodeClick}
                    groupKey="category"
                    hideHeader
                    showPhysicsControls
                    height={chartHeight + 80}
                    highlightIds={networkHighlightIds}
                  />
                  <div className="sr-only">
                    <table>
                      <caption>
                        Technology web: skills and their categories
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Skill</th>
                          <th scope="col">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {networkData.nodes.map((n) => (
                          <tr key={n.id}>
                            <th scope="row">{n.name}</th>
                            <td>{n.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="flow" className="mt-0">
                  <SankeyWithSemantics
                    data={sankeyData}
                    height={chartHeight + 80}
                  />
                </TabsContent>

                <TabsContent value="momentum" className="mt-0">
                  <StreamGraph
                    data={filteredStreamData}
                    hideHeader
                    height={chartHeight + 80}
                  />
                  <div className="sr-only">
                    <table>
                      <caption>Skill momentum: peak value per category</caption>
                      <thead>
                        <tr>
                          <th scope="col">Category</th>
                          <th scope="col">Peak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {streamPeaks.map(([k, v]) => (
                          <tr key={k}>
                            <th scope="row">{k}</th>
                            <td>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="intensity" className="mt-0">
                  <Heatmap
                    data={filteredHeatmapData}
                    hideHeader
                    infoPanel={(cell) => (
                      <HeatmapInfoPanel cell={cell} years={heatmapYears} />
                    )}
                  />
                  <div className="sr-only">
                    <table>
                      <caption>Usage intensity by year</caption>
                      <thead>
                        <tr>
                          <th scope="col">Year</th>
                          <th scope="col">Active months</th>
                          <th scope="col">Peak active skills in a month</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heatmapByYear.map(([y, v]) => (
                          <tr key={y}>
                            <th scope="row">{y}</th>
                            <td>{v.months}</td>
                            <td>{v.peak}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </Panel>

        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          skillDetails={skillDetails}
        />
      </div>
    </div>
  );
}
