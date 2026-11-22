/**
 * Career Stats Component
 * Displays animated statistics about career progression
 */

import { Panel, PanelHeader } from "@aazucena/ui";
import { usePrefersReducedMotion } from "@aazucena/hooks";
import CountUp from "./countUp";
import type { CareerStat as CareerStatsType } from "@aazucena/types";

interface CareerStatsProps {
  stats: CareerStatsType;
  isDashboardVariant?: boolean;
}

export function CareerStats({ stats }: CareerStatsProps) {
  const reduceMotion = usePrefersReducedMotion();
  const statsData = [
    {
      value: stats.totalYears,
      decimals: 1,
      suffix: "+",
      label: "Years of experience",
    },
    {
      value: stats.totalCompanies,
      decimals: 0,
      suffix: "",
      label: "Companies",
    },
    {
      value: stats.totalTechnologies,
      decimals: 0,
      suffix: "+",
      label: "Technologies",
    },
  ];

  return (
    <Panel
      role="region"
      aria-label="Career at a glance"
      className="border-rule border"
    >
      <PanelHeader label="CAREER // AT A GLANCE">
        {stats.currentRole && (
          <span className="micro-label text-signal truncate">
            ● CURRENTLY: {stats.currentRole}
          </span>
        )}
      </PanelHeader>
      <dl className="divide-rule grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {statsData.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-2 p-6">
            <dt className="micro-label text-muted-foreground">{stat.label}</dt>
            <dd className="text-signal font-mono text-5xl font-light">
              <CountUp
                end={stat.value}
                decimals={stat.decimals}
                duration={reduceMotion ? 0 : 2}
                suffix={stat.suffix}
              />
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
