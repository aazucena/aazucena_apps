/**
 * Unified Skills Dashboard Component
 * Tabbed interface combining all technical visualizations
 */

import { useState } from 'react';
import { StreamGraph, Heatmap,SankeyDiagram, SpiderChart, ForceDirectedGraph } from './';
import { DetailsModal, CareerStats, Toolbar, GrowthMetrics } from './ui';
import { getSkillDetails, type SkillsOverTime, type SkillsNetworkData, type SkillNode, type SankeyData, type HeatmapCell, type StreamGraphStep, type GrowthData, type CareerStat as CareerStatsType } from './transformers';
import type { Experience } from '~/components/animations/sections/data';
import type { StrapiEducation } from '~/lib/validators/education';
import type { Project } from '~/lib/transformers/projects';

interface SkillsDashboardProps {
  evolutionData: SkillsOverTime[];
  networkData: SkillsNetworkData;
  sankeyData: SankeyData;
  heatmapData: HeatmapCell[];
  streamGraphData: StreamGraphStep[];
  growthMetrics: GrowthData;
  careerStats: CareerStatsType;
  categories: string[];
  experiences: Experience[];
  education: StrapiEducation[];
  projects: Project[];
  hideHeader?: boolean;
  hideStats?: boolean;
  hideMetrics?: boolean;
}

type TabType = 'evolution' | 'network' | 'flow' | 'momentum' | 'intensity';

export function SkillsDashboard({
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
}: SkillsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('evolution');
  
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
    { id: 'evolution', label: 'Growth & Distribution', icon: '📊', description: 'Spider chart showing category dominance' },
    { id: 'network', label: 'Technology Web', icon: '🕸️', description: 'Relationships between skills' },
    { id: 'flow', label: 'Skill Impact Flow', icon: '🌊', description: 'Categories → Skills → Experiences' },
    { id: 'momentum', label: 'Skill Momentum', icon: '📈', description: 'Continuous evolution of skill frequency' },
    { id: 'intensity', label: 'Usage Intensity', icon: '🔥', description: 'Monthly skill usage heat-map' },
  ];

  return (
    <div className="py-16 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        {!hideHeader && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Technical Expertise Deep-Dive</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">Explore different perspectives of my technical evolution and impact</p>
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
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
        <div className="bg-gray-200/50 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 min-h-[600px] flex flex-col">
          
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center md:text-left">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          <div className="flex-1">
            {activeTab === 'evolution' && (
              <div className="max-w-4xl mx-auto">
                <SpiderChart data={evolutionData} />
              </div>
            )}

            {activeTab === 'network' && (
              <ForceDirectedGraph 
                data={networkData} 
                onNodeClick={handleNodeClick}
              />
            )}

            {activeTab === 'flow' && (
              <SankeyDiagram data={sankeyData} />
            )}

            {activeTab === 'momentum' && (
              <StreamGraph data={streamGraphData} />
            )}

            {activeTab === 'intensity' && (
              <Heatmap data={heatmapData} />
            )}
          </div>
        </div>

        <DetailsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          skillDetails={skillDetails}
        />

      </div>
    </div>
  );
}
