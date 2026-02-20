/**
 * Scene Objects Data Catalog
 * Centralized configuration for all scene objects across all atmospheric layers
 */

import type { LayerObjects } from "~/components/homepage/scene/objects";

/**
 * Troposphere Objects (Ground Level - 0-12km)
 * Contains ground objects and low-altitude easter eggs
 */
export const troposphereObjects: LayerObjects = {
  easterEggs: [
    {
      id: "airplane-1",
      type: "airplane",
      category: "easter-egg",
      position: [
        -5 + Math.random() * 2,
        4 + Math.random() * 2,
        -6 + Math.random() * 2,
      ],
      scale: 0.3,
      rotation: [0, Math.PI / 2, 0],
      animation: "custom", // Uses custom animation in component
      visible: true,
    },
    {
      id: "bird-1",
      type: "bird",
      category: "easter-egg",
      position: [
        4 + Math.random() * 2,
        3 + Math.random() * 1,
        -5 + Math.random() * 2,
      ],
      scale: 0.15,
      animation: "custom", // Wing flapping requires custom logic
      visible: true,
    },
    {
      id: "drone-1",
      type: "drone",
      category: "easter-egg",
      position: [
        -3 + Math.random() * 2,
        2 + Math.random() * 1,
        5 + Math.random() * 2,
      ],
      scale: 0.2,
      animation: "custom", // Propeller spinning requires custom logic
      visible: true,
    },
  ],
  ground: [], // Will be populated with procedurally generated ground objects
};

/**
 * Stratosphere Objects (High Altitude - 12-50km)
 * Contains clouds and high-altitude easter eggs
 */
export const stratosphereObjects: LayerObjects = {
  easterEggs: [
    {
      id: "weather-balloon-1",
      type: "weather-balloon",
      category: "easter-egg",
      position: [
        -3 + Math.random() * 1,
        2 + Math.random() * 1,
        -12 + Math.random() * 2,
      ],
      scale: 0.3,
      animation: "custom",
      visible: true,
    },
    {
      id: "spy-plane-1",
      type: "spy-plane",
      category: "easter-egg",
      position: [
        4 + Math.random() * 3,
        -1 + Math.random() * 2,
        -6 + Math.random() * 3,
      ],
      scale: 0.35,
      animation: "custom", // Complex flight path
      visible: true,
    },
    {
      id: "blimp-1",
      type: "blimp",
      category: "easter-egg",
      position: [
        -4 + Math.random() * 2,
        -2 + Math.random() * 2,
        6 + Math.random() * 3,
      ],
      scale: 0.4,
      animation: "custom",
      visible: true,
    },
  ],
};

/**
 * Mesosphere Objects (Edge of Space - 50-85km)
 * Contains meteors, comets, and space debris
 */
export const mesosphereObjects: LayerObjects = {
  easterEggs: [
    {
      id: "comet-1",
      type: "comet",
      category: "easter-egg",
      position: [
        -3 + Math.random() * 1,
        2 + Math.random() * 1,
        -12 + Math.random() * 2,
      ],
      scale: 0.5,
      rotation: [0, 0, Math.PI / 6],
      animation: "custom", // Falling motion
      visible: true,
    },
    {
      id: "meteor-1",
      type: "meteor",
      category: "easter-egg",
      position: [
        3 + Math.random() * 1,
        -1 + Math.random() * 1,
        -10 + Math.random() * 2,
      ],
      scale: 0.55,
      rotation: [0, 0, Math.PI / 4],
      animation: "custom", // Tumbling and burning
      visible: true,
    },
    // Space debris pieces
    {
      id: "space-debris-1",
      type: "space-debris" as const,
      category: "easter-egg" as const,
      position: [
        -2 + Math.random() * 1,
        1 + Math.random() * 1,
        -9 + Math.random() * 1,
      ] as [number, number, number],
      scale: 0.45,
      animation: "custom" as const,
      custom: { variant: "solar-panel" as const },
      visible: true,
    },
    {
      id: "space-debris-2",
      type: "space-debris" as const,
      category: "easter-egg" as const,
      position: [
        1 + Math.random() * 1,
        -2 + Math.random() * 1,
        -11 + Math.random() * 1,
      ] as [number, number, number],
      scale: 0.45,
      animation: "custom" as const,
      custom: { variant: "damaged-panel" as const },
      visible: true,
    },
    {
      id: "space-debris-3",
      type: "space-debris" as const,
      category: "easter-egg" as const,
      position: [
        -1 + Math.random() * 1,
        0 + Math.random() * 1,
        -10 + Math.random() * 1,
      ] as [number, number, number],
      scale: 0.45,
      animation: "custom" as const,
      custom: { variant: "body-piece" as const },
      visible: true,
    },
    {
      id: "space-debris-4",
      type: "space-debris" as const,
      category: "easter-egg" as const,
      position: [
        2 + Math.random() * 1,
        1.5 + Math.random() * 1,
        -8 + Math.random() * 1,
      ] as [number, number, number],
      scale: 0.45,
      animation: "custom" as const,
      custom: { variant: "antenna" as const },
      visible: true,
    },
  ],
};

/**
 * Thermosphere Objects (Low Orbit - 85-600km)
 * Contains space shuttle, astronaut, and ISS
 */
export const thermosphereObjects: LayerObjects = {
  easterEggs: [
    {
      id: "space-shuttle-1",
      type: "space-shuttle",
      category: "easter-egg",
      position: [
        -7 + Math.random() * 4,
        3 + Math.random() * 3,
        -9 + Math.random() * 4,
      ],
      scale: 0.5,
      rotation: [0, Math.PI / 2, 0],
      animation: "custom",
      visible: true,
    },
    {
      id: "astronaut-1",
      type: "astronaut",
      category: "easter-egg",
      position: [
        -4 + Math.random() * 2,
        -2 + Math.random() * 2,
        6 + Math.random() * 3,
      ],
      scale: 0.25,
      animation: "custom",
      visible: true,
    },
    {
      id: "iss-1",
      type: "iss",
      category: "easter-egg",
      position: [
        6 + Math.random() * 3,
        -1 + Math.random() * 2,
        -7 + Math.random() * 3,
      ],
      scale: 0.3,
      animation: "custom",
      visible: true,
    },
  ],
};

/**
 * Exosphere Objects (Deep Space - 600km+)
 * Contains satellites, UFOs, and rockets
 */
export const exosphereObjects: LayerObjects = {
  easterEggs: [
    {
      id: "satellite-1",
      type: "satellite",
      category: "easter-egg",
      position: [
        -8 + Math.random() * 4,
        2 + Math.random() * 3,
        -10 + Math.random() * 4,
      ],
      scale: 0.3,
      animation: "custom",
      visible: true,
    },
    {
      id: "ufo-1",
      type: "ufo",
      category: "easter-egg",
      position: [
        5 + Math.random() * 4,
        -2 + Math.random() * 3,
        -8 + Math.random() * 4,
      ],
      scale: 0.4,
      animation: "custom",
      visible: true,
    },
    {
      id: "rocket-1",
      type: "rocket",
      category: "easter-egg",
      position: [
        -6 + Math.random() * 4,
        -3 + Math.random() * 3,
        8 + Math.random() * 4,
      ],
      scale: 0.35,
      animation: "custom",
      visible: true,
    },
  ],
};

/**
 * Complete scene objects catalog
 * Organized by atmospheric layer
 */
export const SCENE_OBJECTS = {
  troposphere: troposphereObjects,
  stratosphere: stratosphereObjects,
  mesosphere: mesosphereObjects,
  thermosphere: thermosphereObjects,
  exosphere: exosphereObjects,
} as const;
