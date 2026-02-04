/**
 * Career Stats Component
 * Displays animated statistics about career progression
 */

import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import type { CareerStat as CareerStatsType } from '~/lib/transformers/journey';

interface CareerStatsProps {
  stats: CareerStatsType;
  isDashboardVariant?: boolean;
}

export function CareerStats({ stats, isDashboardVariant = false }: CareerStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Trigger animation when component comes into view
  useEffect(() => {
    const currentRef = statsRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry!.isIntersecting) {
          setIsVisible(true);
          // Only animate once for better UX
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const statsData = [
    {
      value: stats.totalYears,
      decimals: 1,
      suffix: '+',
      label: 'Years of Experience',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      icon: (
        <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: stats.totalCompanies,
      decimals: 0,
      suffix: '',
      label: 'Companies',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      icon: (
        <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      value: stats.totalTechnologies,
      decimals: 0,
      suffix: '+',
      label: 'Technologies',
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20',
      icon: (
        <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  if (isDashboardVariant) {
    return (
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-5 p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">
                {isVisible ? (
                  <CountUp start={0} end={stat.value} decimals={stat.decimals} duration={2} suffix={stat.suffix} />
                ) : (
                  '0'
                )}
              </div>
              <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={statsRef} className="bg-gray-400/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-20 overflow-hidden max-w-6xl mx-auto text-center">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Career at a Glance
        </h2>
        <div className="text-xs inline-flex items-center gap-4"> 
          {stats.currentRole && (
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="font-bold text-blue-700 dark:text-blue-300">
                Currently: <span className="text-blue-900 dark:text-blue-100">{stats.currentRole}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`group ${stat.bgColor} backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-10 hover:-translate-y-2 transition-all duration-300`}
          >
            <div className={`*:w-12 *:h-12 inline-flex p-4 rounded-2xl ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div className="text-6xl font-black text-gray-950 mb-2 tracking-tighter">
              {isVisible ? (
                <CountUp start={0} end={stat.value} decimals={stat.decimals} duration={2.5} suffix={stat.suffix} />
              ) : (
                '0'
              )}
            </div>
            <div className={`text-sm font-bold text-gray-700 uppercase tracking-widest`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
