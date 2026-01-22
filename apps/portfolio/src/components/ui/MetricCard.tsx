/**
 * Metric Card Component
 * Displays a single impact metric (e.g., "30%", "25+") with a label.
 */

import type { JSX } from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  description?: string;
}

export function MetricCard({ value, label, description }: MetricCardProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
      <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-cyan-400 mb-2 group-hover:scale-105 transition-transform duration-300">
        {value}
      </div>
      <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">
        {label}
      </div>
      {description && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
    </div>
  );
}
