/**
 * Light Configuration Utilities
 * Light colors and configurations for each atmospheric phase
 */

import type { AtmosphericPhase } from '../../config';

export const POINT_LIGHT_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: '#ffffff',
  thermosphere: '#9D4EDD',
  mesosphere: '#3A86FF',
  stratosphere: '#87CEEB',
  troposphere: '#FFA07A'
};

export const SECONDARY_LIGHT_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: '#aaaaff',
  thermosphere: '#06FFA5',
  mesosphere: '#1E40AF',
  stratosphere: '#B0E0E6',
  troposphere: '#D2691E'
};

export function getAmbientIntensity(phase: AtmosphericPhase, baseIntensity: number = 1): number {
  return phase === 'troposphere' ? 0.5 * baseIntensity : 0.3 * baseIntensity;
}

export function getPointLightColor(phase: AtmosphericPhase): string {
  return POINT_LIGHT_COLORS[phase];
}

export function getSecondaryLightColor(phase: AtmosphericPhase): string {
  return SECONDARY_LIGHT_COLORS[phase];
}
