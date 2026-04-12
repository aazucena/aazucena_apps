/**
 * Career Stats Component
 * Displays animated statistics about career progression
 */

import CountUp from "react-countup";
import type { CareerStat as CareerStatsType } from "@aazucena/types";

interface CareerStatsProps {
  stats: CareerStatsType;
  isDashboardVariant?: boolean;
}

export function CareerStats({
  stats,
  isDashboardVariant = false,
}: CareerStatsProps) {

  const statsData = [
    {
      value: stats.totalYears,
      decimals: 1,
      suffix: "+",
      label: "Years of Experience",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      icon: (
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      value: stats.totalCompanies,
      decimals: 0,
      suffix: "",
      label: "Companies",
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      icon: (
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      value: stats.totalTechnologies,
      decimals: 0,
      suffix: "+",
      label: "Technologies",
      color: "text-pink-400",
      bgColor: "bg-pink-900/20",
      icon: (
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
  ];

  if (isDashboardVariant) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/50"
          >
            <div
              className={`rounded-xl p-3 ${stat.bgColor} ${stat.color} shrink-0`}
            >
              {stat.icon}
            </div>
            <div>
              <div className="mb-1 text-3xl leading-none font-black text-gray-900 dark:text-white">
                <CountUp
                  start={0}
                  end={stat.value}
                  decimals={stat.decimals}
                  duration={2}
                  suffix={stat.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </div>
              <div className="text-[11px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/20 bg-gray-400/10 p-20 text-center shadow-2xl backdrop-blur-md"
    >
      <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Career at a Glance
        </h2>
        <div className="inline-flex items-center gap-4 text-xs">
          {stats.currentRole && (
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50 px-5 py-2 dark:border-blue-800 dark:bg-blue-900/20">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
              <span className="font-bold text-blue-700 dark:text-blue-300">
                Currently:{" "}
                <span className="text-blue-900 dark:text-blue-100">
                  {stats.currentRole}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`group ${stat.bgColor} rounded-3xl border border-white/20 p-10 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2`}
          >
            <div
              className={`inline-flex rounded-2xl p-4 *:h-12 *:w-12 ${stat.color} mb-2 transition-transform group-hover:scale-110`}
            >
              {stat.icon}
            </div>
            <div className="mb-2 text-6xl font-black tracking-tighter text-gray-950">
              <CountUp
                start={0}
                end={stat.value}
                decimals={stat.decimals}
                duration={2.5}
                suffix={stat.suffix}
                enableScrollSpy
                scrollSpyOnce
              />
            </div>
            <div
              className={`text-sm font-bold tracking-widest text-gray-700 uppercase`}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
