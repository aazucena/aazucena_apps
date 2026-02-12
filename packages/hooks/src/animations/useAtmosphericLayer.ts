/**
 * useAtmosphericLayer Hook
 * Calculates atmospheric layer based on section progress
 */

import { useMemo } from 'react';
import type { AtmosphericPhase } from '@aazucena/types';
import { getAtmosphericPhase, getBackgroundGradient } from '@aazucena/utils';

export interface AtmosphericLayerResult {
  phase: AtmosphericPhase;
  backgroundStyle: { backgroundImage: string };
}

export function useAtmosphericLayer(
  currentSection: number,
  scrollProgress: number,
): AtmosphericLayerResult {
  const progress = currentSection + scrollProgress;

  const phase = useMemo(() => {
    return getAtmosphericPhase(progress);
  }, [progress]);

  const backgroundStyle = useMemo(() => {
    return {
      backgroundImage: getBackgroundGradient(currentSection, scrollProgress),
    };
  }, [currentSection, scrollProgress]);

  return { phase, backgroundStyle };
}
