import type { StrapiAnimation } from "~/lib/validators/animation";

export interface AnimationConfigData {
  enabled: boolean;
  heavyAnimations: boolean;
  defaultPerformanceTier: "low" | "medium" | "high" | "auto";
  particleCounts: {
    low: number;
    medium: number;
    high: number;
  };
  timing: {
    flipText: number;
    sectionTransition: number;
  };
}

/**
 * Transform Strapi animation config to frontend format
 */
export function transformAnimation(
  strapiAnimation: StrapiAnimation,
): AnimationConfigData {
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
  defaultPerformanceTier: "auto",
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
