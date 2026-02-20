/**
 * Color Configuration
 * HSL color ranges for atmospheric phases and UI
 */

import type { AtmosphericPhase } from "./types";

interface HSLRange {
  hueMin: number;
  hueMax: number;
  saturationMin: number;
  saturationMax: number;
  lightnessMin: number;
  lightnessMax: number;
}

export const HSL_RANGES: Record<AtmosphericPhase, HSLRange> = {
  exosphere: {
    hueMin: 200,
    hueMax: 300,
    saturationMin: 60,
    saturationMax: 80,
    lightnessMin: 70,
    lightnessMax: 85,
  },
  thermosphere: {
    hueMin: 120,
    hueMax: 340,
    saturationMin: 70,
    saturationMax: 90,
    lightnessMin: 65,
    lightnessMax: 80,
  },
  mesosphere: {
    hueMin: 200,
    hueMax: 240,
    saturationMin: 60,
    saturationMax: 80,
    lightnessMin: 60,
    lightnessMax: 75,
  },
  stratosphere: {
    hueMin: 180,
    hueMax: 240,
    saturationMin: 50,
    saturationMax: 80,
    lightnessMin: 75,
    lightnessMax: 90,
  },
  troposphere: {
    hueMin: 90,
    hueMax: 210,
    saturationMin: 40,
    saturationMax: 70,
    lightnessMin: 60,
    lightnessMax: 80,
  },
};

export const BACKGROUND_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: "#0a0e27",
  thermosphere: "#1a1a2e",
  mesosphere: "#16213e",
  stratosphere: "#0f3460",
  troposphere: "#533483",
};

export const POINT_LIGHT_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: "#ffffff",
  thermosphere: "#9D4EDD",
  mesosphere: "#3A86FF",
  stratosphere: "#87CEEB",
  troposphere: "#FFA07A",
};

export const SECONDARY_LIGHT_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: "#aaaaff",
  thermosphere: "#06FFA5",
  mesosphere: "#1E40AF",
  stratosphere: "#B0E0E6",
  troposphere: "#D2691E",
};
