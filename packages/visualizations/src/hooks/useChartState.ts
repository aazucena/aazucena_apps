/**
 * useChartState Hook
 * Manages standard interactive states for visualizations
 */

import { useState } from 'react';

export interface ChartStateOptions {
  /** Initial keys to show (defaults to all) */
  initialVisibleKeys?: string[];
  /** Default scale type */
  initialScaleType?: 'linear' | 'log';
}

export function useChartState(allKeys: string[], options: ChartStateOptions = {}) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(
    new Set(options.initialVisibleKeys || allKeys),
  );
  const [scaleType, setScaleType] = useState<'linear' | 'log'>(
    options.initialScaleType || 'linear',
  );
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  const toggleKey = (key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Prevent hiding everything
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const resetVisibility = () => setVisibleKeys(new Set(allKeys));

  return {
    visibleKeys,
    toggleKey,
    resetVisibility,
    scaleType,
    setScaleType,
    showGrid,
    setShowGrid,
    showPoints,
    setShowPoints,
  };
}
