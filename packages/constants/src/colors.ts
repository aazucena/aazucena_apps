/**
 * [Constants] : Atmospheric_Colors
 * HSL and Hex mappings for environmental phases.
 */

export const ATMOSPHERIC_COLORS = {
  exosphere: {
    from: '#000000',
    via: '#0a0a1a',
    to: '#1a1a2e',
    light: '#ffffff',
  },
  thermosphere: {
    from: '#1a1a2e',
    via: '#2d1b4e',
    to: '#1e3a8a',
    light: '#9D4EDD',
  },
  mesosphere: {
    from: '#1e3a8a',
    via: '#1e40af',
    to: '#1d4ed8',
    light: '#3A86FF',
  },
  stratosphere: {
    from: '#1d4ed8',
    via: '#2563eb',
    to: '#3b82f6',
    light: '#87CEEB',
  },
  troposphere: {
    from: '#38bdf8',
    via: '#7dd3fc',
    to: '#bae6fd',
    light: '#FFA07A',
  },
} as const;
