import type { StrapiAnimation } from '../validators/animation';
import type { AnimationConfigData } from '@aazucena/types';

/**
 * Transform Strapi animation config to frontend format
 */
export function transformAnimation(strapiAnimation: StrapiAnimation): AnimationConfigData {
  return {
    enabled: strapiAnimation.enabled,
    heavyAnimations: strapiAnimation.heavyAnimations,
    defaultPerformanceTier: strapiAnimation.defaultPerformanceTier,
    particleCounts: {
      low: strapiAnimation.particleCountLow ?? 50,
      medium: strapiAnimation.particleCountMedium ?? 100,
      high: strapiAnimation.particleCountHigh ?? 200,
    },
    timing: {
      flipText: strapiAnimation.timingFlipText ?? 3000,
      sectionTransition: strapiAnimation.timingSectionTransition ?? 1000,
    },
  };
}

/**
 * Default fallback animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfigData = {
  enabled: true,
  heavyAnimations: true,
  defaultPerformanceTier: 'auto',
  particleCounts: {
    low: 50,
    medium: 100,
    high: 200,
  },
  timing: {
    flipText: 3000,
    sectionTransition: 1000,
  },
};
