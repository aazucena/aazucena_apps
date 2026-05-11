/**
 * Skill Growth Metrics Component
 * Displays quantitative insights about technical evolution
 */

import CountUp from "react-countup";
import type { GrowthData } from "@aazucena/types";

interface GrowthMetricsProps {
  metrics: GrowthData;
}

export function GrowthMetrics({ metrics }: GrowthMetricsProps) {
  const cards = [
    {
      label: "Primary Domain",
      value: metrics.topDomain,
      icon: "🎯",
      description: "Main area of technical focus",
      color: "blue",
    },
    {
      label: "Most Used Tool",
      value: metrics.mostUsedTechnology,
      icon: "🛠️",
      description: "Frequently applied technology",
      color: "purple",
    },
    {
      label: "Learning Velocity",
      value: metrics.learningVelocity,
      suffix: " skills/yr",
      icon: "🚀",
      description: "Average new skills acquired annually",
      color: "green",
      isNumeric: true,
    },
    {
      label: "Fastest Expansion",
      value: metrics.fastestGrowingCategory,
      icon: "📈",
      description: "Domain with highest recent growth",
      color: "amber",
    },
  ];
  return (
    <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-2xl">{card.icon}</span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600 dark:text-${card.color}-400`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>

          <span className="mb-1 block text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
            {card.label}
          </span>

          <div className="mb-1 truncate text-xl font-bold text-gray-900 dark:text-white">
            {typeof card.value === "number" ? (
              <CountUp
                end={card.value}
                decimals={0}
                duration={2.5}
                suffix={card.suffix}
              />
            ) : (
              card.value
            )}
          </div>

          <p className="line-clamp-1 text-xs text-gray-500 transition-all group-hover:line-clamp-none dark:text-gray-400">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
