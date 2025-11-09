/**
 * Phase Color Generation
 * Generates dynamic colors based on atmospheric phase
 */

import type { AtmosphericPhase } from '../../config';

/**
 * Generate a random color based on the atmospheric phase
 */
export function generatePhaseColor(phase: AtmosphericPhase): string {
  switch (phase) {
    case 'exosphere':
      // Deep space colors (purples, blues, pinks)
      const exosphereHue = Math.random() * 100 + 200; // 200-300 (blues to purples)
      return `hsl(${exosphereHue}, ${60 + Math.random() * 20}%, ${70 + Math.random() * 15}%)`;

    case 'thermosphere':
      // Aurora colors (greens, purples, pinks)
      const thermosphereHue = Math.random() > 0.5 ? Math.random() * 60 + 120 : Math.random() * 60 + 280; // Green or purple/pink
      return `hsl(${thermosphereHue}, ${70 + Math.random() * 20}%, ${65 + Math.random() * 15}%)`;

    case 'mesosphere':
      // Deep blue colors
      const mesosphereHue = Math.random() * 40 + 200; // 200-240 (deep blues)
      return `hsl(${mesosphereHue}, ${60 + Math.random() * 20}%, ${60 + Math.random() * 15}%)`;

    case 'stratosphere':
      // Sky blue colors (blues, cyans)
      const stratosphereHue = Math.random() * 60 + 180; // 180-240 (cyans to blues)
      return `hsl(${stratosphereHue}, ${50 + Math.random() * 30}%, ${75 + Math.random() * 15}%)`;

    case 'troposphere':
      // Earth tones and cloud colors (greens, blues, whites)
      const troposphereHue = Math.random() * 120 + 90; // 90-210 (greens to blues)
      return `hsl(${troposphereHue}, ${40 + Math.random() * 30}%, ${60 + Math.random() * 20}%)`;

    default:
      return `hsl(${Math.random() * 360}, 60%, 70%)`;
  }
}
