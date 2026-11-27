/**
 * TechStackDistribution.tsx
 * Visualizes the breakdown of focus areas (e.g., Frontend, Backend, DevOps)
 * and displays skill badges with icons categorized by usage.
 */

import {
  Cloud,
  Database,
  Grid,
  LayersOne,
  Layout,
  Paint,
  Servers,
  Terminal,
  Wrench,
} from "@aazucena/icons";
import { Fragment, type JSX } from "react";
import { Badge, Panel } from "@aazucena/ui";

interface Skill {
  name: string;
  category: string;
}

interface TechStackDistributionProps {
  skills: Skill[];
}

// Icon mapping for skill categories
const CATEGORY_ICONS: Record<string, any> = {
  Frontend: Layout,
  Backend: Servers,
  Database: Database,
  Cloud: Cloud,
  Tools: Wrench,
  Design: Paint,
  Testing: LayersOne,
  Core: Grid,
  Other: Terminal,
};

// Lets "Hardware/Embedded" wrap after the slash rather than mid-word
const breakAfterSlashes = (text: string) =>
  text.split("/").map((part, i, parts) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          /<wbr />
        </>
      )}
    </Fragment>
  ));

// Series fills by rank; every bar also carries its category name and percentage as text
const SERIES_BG = ["bg-series-1", "bg-series-2", "bg-series-3", "bg-series-4"];

export function TechStackDistribution({
  skills,
}: TechStackDistributionProps): JSX.Element {
  // 1. Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // 2. Calculate distribution percentages (simple count-based for now)
  const totalSkills = skills.length;
  const distribution = Object.entries(skillsByCategory)
    .map(([category, items]) => ({
      category,
      count: items.length,
      percentage: Math.round((items.length / totalSkills) * 100),
    }))
    .sort((a, b) => b.count - a.count) // Sort by most used
    .slice(0, 4); // Take top 4 for the chart

  // The markup holds each bar's real width, so the share shows without script. The page's
  // BarGrowObserver marks a bar data-seen once it is on screen, and styles replay the growth then.

  return (
    <div className="space-y-4">
      {/* Distribution chart */}
      <Panel label="Focus // Distribution" className="border-rule border">
        <div className="space-y-4">
          {distribution.map((item, i) => {
            const Icon = CATEGORY_ICONS[item.category] || Terminal;
            return (
              <div key={item.category} className="space-y-1.5">
                {/* Category on its own line at full width, the count beside the bar: the
                    sidebar is too narrow for a name like "Hardware/Embedded" and the count
                    on one line */}
                <div className="text-foreground flex items-start gap-2 text-sm font-medium">
                  <Icon
                    size={14}
                    className="text-muted-foreground mt-[3px] shrink-0"
                  />
                  <span className="min-w-0">
                    {breakAfterSlashes(item.category)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    role="progressbar"
                    aria-label={`${item.category} share of skills`}
                    aria-valuenow={item.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="bg-state h-1.5 min-w-0 flex-1 overflow-hidden"
                  >
                    <div
                      className={`bar-grow h-full ${SERIES_BG[i % SERIES_BG.length]}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="micro-label text-muted-foreground shrink-0 whitespace-nowrap">
                    {item.count} / {totalSkills} · {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Tech stack grid */}
      <Panel label="Area // Expertise" className="border-rule border">
        <div className="space-y-5">
          {Object.entries(skillsByCategory).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category] || Terminal;
            return (
              <div key={category}>
                <div className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon className="text-muted-foreground h-4 w-4" />
                  {category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
