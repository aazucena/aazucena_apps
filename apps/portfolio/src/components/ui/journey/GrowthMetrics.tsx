/**
 * Skill Growth Metrics Component
 * Displays quantitative insights about technical evolution
 */

import { Panel } from "@aazucena/ui";
import { usePrefersReducedMotion } from "@aazucena/hooks";
import CountUp from "./countUp";
import type { GrowthData } from "@aazucena/types";

interface GrowthMetricsProps {
  metrics: GrowthData;
}

export function GrowthMetrics({ metrics }: GrowthMetricsProps) {
  const reduceMotion = usePrefersReducedMotion();
  const cards = [
    {
      label: "PRIMARY DOMAIN",
      value: metrics.topDomain,
      description: "Main area of technical focus",
    },
    {
      label: "MOST USED TOOL",
      value: metrics.mostUsedTechnology,
      description: "Frequently applied technology",
    },
    {
      label: "LEARNING VELOCITY",
      value: metrics.learningVelocity,
      suffix: " skills/yr",
      description: "Average new skills acquired annually",
    },
    {
      label: "FASTEST EXPANSION",
      value: metrics.fastestGrowingCategory,
      description: "Domain with highest recent growth",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Panel
          key={card.label}
          label={card.label}
          className="border-rule border"
        >
          <div className="text-foreground truncate text-xl font-semibold">
            {typeof card.value === "number" ? (
              <CountUp
                end={card.value}
                decimals={0}
                duration={reduceMotion ? 0 : 2}
                suffix={card.suffix}
              />
            ) : (
              card.value
            )}
          </div>
          <p className="text-muted-foreground text-xs">{card.description}</p>
        </Panel>
      ))}
    </div>
  );
}
