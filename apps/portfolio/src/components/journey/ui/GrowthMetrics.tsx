/**
 * Skill Growth Metrics Component
 * Displays quantitative insights about technical evolution
 */

import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import type { GrowthData } from '../transformers';

interface GrowthMetricsProps {
  metrics: GrowthData;
}

export function GrowthMetrics({ metrics }: GrowthMetricsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry!.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => {
      if (metricsRef.current) {
        observer.unobserve(metricsRef.current);
      }
    };
  }, []);
  const cards = [
    {
      label: 'Primary Domain',
      value: metrics.topDomain,
      icon: '🎯',
      description: 'Main area of technical focus',
      color: 'blue'
    },
    {
      label: 'Most Used Tool',
      value: metrics.mostUsedTechnology,
      icon: '🛠️',
      description: 'Frequently applied technology',
      color: 'purple'
    },
    {
      label: 'Learning Velocity',
      value: metrics.learningVelocity,
      suffix: ' skills/yr',
      icon: '🚀',
      description: 'Average new skills acquired annually',
      color: 'green',
      isNumeric: true
    },
    {
      label: 'Fastest Expansion',
      value: metrics.fastestGrowingCategory,
      icon: '📈',
      description: 'Domain with highest recent growth',
      color: 'amber'
    }
  ];
  return (
    <div ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{card.icon}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600 dark:text-${card.color}-400`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
            {card.label}
          </span>
          
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
            {isVisible && typeof card.value === 'number' ? (
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
          
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 group-hover:line-clamp-none transition-all">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
