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

// The atmospheric phase thresholds in scene.ts were calibrated for 8 sections.
// Normalise progress to that reference so all 5 phases are always reachable
// regardless of how many sections the CMS returns.
const REFERENCE_SECTIONS = 8;

export function useAtmosphericLayer(
  currentSection: number,
  scrollProgress: number,
  totalSections: number = REFERENCE_SECTIONS,
): AtmosphericLayerResult {
  const rawProgress = currentSection + scrollProgress;
  // Scale so that the last section always maps to the same endpoint the
  // hardcoded thresholds expect, giving each phase an equal slice of the journey.
  const scale = totalSections > 0 ? REFERENCE_SECTIONS / totalSections : 1;
  const progress = rawProgress * scale;

  const phase = useMemo(() => {
    return getAtmosphericPhase(progress);
  }, [progress]);

  const backgroundStyle = useMemo(() => {
    // Pass scaled values so the gradient interpolation also covers the full range.
    const scaledSection = currentSection * scale;
    const scaledScroll = scrollProgress * scale;
    return {
      backgroundImage: getBackgroundGradient(scaledSection, scaledScroll),
    };
  }, [currentSection, scrollProgress, scale]);

  return { phase, backgroundStyle };
}
