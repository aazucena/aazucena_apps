/**
 * Career Stats Component
 * Displays animated statistics about career progression
 */

import { Building, ClockCircle, Code } from "@aazucena/icons";
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
      icon: ClockCircle,
    },
    {
      value: stats.totalCompanies,
      decimals: 0,
      suffix: "",
      label: "Companies",
      icon: Building,
    },
    {
      value: stats.totalTechnologies,
      decimals: 0,
      suffix: "+",
      label: "Technologies",
      icon: Code,
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
            <span aria-hidden="true" className="motion-safe:animate-pulse">
              ●
            </span>{" "}
            CURRENTLY: {stats.currentRole}
          </span>
        )}
      </PanelHeader>
      <dl className="divide-rule grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col-reverse gap-2 p-6"
          >
            <dt className="micro-label text-muted-foreground flex items-center gap-2">
              <stat.icon
                aria-hidden
                size={18}
                className="hover-grow text-signal"
              />
              {stat.label}
            </dt>
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
