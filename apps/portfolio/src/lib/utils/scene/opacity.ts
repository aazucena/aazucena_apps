/**
 * Layer Opacity Utilities
 * Calculates opacity for each atmospheric layer based on scroll progress
 */

export interface LayerOpacities {
  exosphere: number;
  thermosphere: number;
  mesosphere: number;
  stratosphere: number;
  troposphere: number;
}

/**
 * Calculate opacity for all atmospheric layers based on current progress
 * @param progress Current section + scroll progress
 * @returns Object with opacity values for each layer
 */
export function calculateLayerOpacities(progress: number): LayerOpacities {
  // Exosphere (section 0): full opacity until 0.5, fade out 0.5-1.0
  const exosphereOpacity =
    progress <= 0.5 ? 1 : progress >= 1.0 ? 0 : 1 - (progress - 0.5) * 2;

  // Thermosphere (section 1): fade in 0.5-1.0, full until 1.5, fade out 1.5-2.0
  const thermosphereOpacity =
    progress < 0.5
      ? 0
      : progress <= 1.0
        ? (progress - 0.5) * 2
        : progress <= 1.5
          ? 1
          : progress >= 2.0
            ? 0
            : 1 - (progress - 1.5) * 2;

  // Mesosphere (sections 2-3): fade in 1.5-2.0, full until 3.5, fade out 3.5-4.0
  const mesosphereOpacity =
    progress < 1.5
      ? 0
      : progress <= 2.0
        ? (progress - 1.5) * 2
        : progress <= 3.5
          ? 1
          : progress >= 4.0
            ? 0
            : 1 - (progress - 3.5) * 2;

  // Stratosphere (sections 4-5): fade in 3.5-4.0, full until 5.5, fade out 5.5-6.0
  const stratosphereOpacity =
    progress < 3.5
      ? 0
      : progress <= 4.0
        ? (progress - 3.5) * 2
        : progress <= 5.5
          ? 1
          : progress >= 6.0
            ? 0
            : 1 - (progress - 5.5) * 2;

  // Troposphere (sections 6-7): fade in 5.5-6.0, then full opacity
  const troposphereOpacity =
    progress < 5.5 ? 0 : progress >= 6.0 ? 1 : (progress - 5.5) * 2;

  return {
    exosphere: exosphereOpacity,
    thermosphere: thermosphereOpacity,
    mesosphere: mesosphereOpacity,
    stratosphere: stratosphereOpacity,
    troposphere: troposphereOpacity,
  };
}

/**
 * Check if a specific layer is visible (opacity > 0)
 */
export function isLayerVisible(
  layer: keyof LayerOpacities,
  opacities: LayerOpacities,
): boolean {
  return opacities[layer] > 0;
}
