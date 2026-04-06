import * as THREE from 'three';
import type { Group } from 'three';
import type { RefObject } from 'react';
import type { ShaderMaterial } from 'three';
import type {
  AtmosphericPhase,
  LayerOpacities,
  AuroraShaderConfig,
  RotationConfig,
  RotationOscillationConfig,
  PositionWaveConfig,
  SceneAnimationConfig as AnimationConfig,
} from '@aazucena/types';

/**
 * Scene-related utility functions
 */

/**
 * Applies constant rotation animation
 */
export function applyRotation(
  ref: RefObject<Group | null>,
  time: number,
  config: RotationConfig,
): void {
  if (!ref.current) return;

  if (config.x !== undefined) {
    ref.current.rotation.x = time * config.x;
  }
  if (config.y !== undefined) {
    ref.current.rotation.y = time * config.y;
  }
  if (config.z !== undefined) {
    ref.current.rotation.z = time * config.z;
  }
}

/**
 * Applies oscillating rotation animation
 */
export function applyRotationOscillation(
  ref: RefObject<Group | null>,
  time: number,
  config: RotationOscillationConfig,
): void {
  if (!ref.current) return;

  if (config.x) {
    const { frequency, amplitude, phase = 0 } = config.x;
    ref.current.rotation.x = Math.sin(time * frequency + phase) * amplitude;
  }
  if (config.y) {
    const { frequency, amplitude, phase = 0 } = config.y;
    ref.current.rotation.y = Math.sin(time * frequency + phase) * amplitude;
  }
  if (config.z) {
    const { frequency, amplitude, phase = 0 } = config.z;
    ref.current.rotation.z = Math.sin(time * frequency + phase) * amplitude;
  }
}

/**
 * Applies position wave animation
 */
export function applyPositionWave(
  ref: RefObject<Group | null>,
  time: number,
  config: PositionWaveConfig,
): void {
  if (!ref.current) return;

  const { base, x, y, z } = config;

  ref.current.position.x = base.x;
  ref.current.position.y = base.y;
  ref.current.position.z = base.z;

  if (x) {
    const { frequency, amplitude, phase = 0 } = x;
    ref.current.position.x += Math.sin(time * frequency + phase) * amplitude;
  }
  if (y) {
    const { frequency, amplitude, phase = 0 } = y;
    ref.current.position.y += Math.sin(time * frequency + phase) * amplitude;
  }
  if (z) {
    const { frequency, amplitude, phase = 0 } = z;
    ref.current.position.z += Math.sin(time * frequency + phase) * amplitude;
  }
}

/**
 * Applies circular motion animation
 */
export function applyCircularMotion(
  ref: RefObject<Group | null>,
  time: number,
  config: PositionWaveConfig,
): void {
  if (!ref.current) return;

  const { base, x, y, z } = config;

  ref.current.position.set(base.x, base.y, base.z);

  if (x && y) {
    const { frequency: xFreq, amplitude: xAmp, phase: xPhase = 0 } = x;
    const { frequency: yFreq, amplitude: yAmp, phase: yPhase = 0 } = y;
    ref.current.position.x += Math.cos(time * xFreq + xPhase) * xAmp;
    ref.current.position.y += Math.sin(time * yFreq + yPhase) * yAmp;
  } else if (x && z) {
    const { frequency: xFreq, amplitude: xAmp, phase: xPhase = 0 } = x;
    const { frequency: zFreq, amplitude: zAmp, phase: zPhase = 0 } = z;
    ref.current.position.x += Math.cos(time * xFreq + xPhase) * xAmp;
    ref.current.position.z += Math.sin(time * zFreq + zPhase) * zAmp;
  } else if (y && z) {
    const { frequency: yFreq, amplitude: yAmp, phase: yPhase = 0 } = y;
    const { frequency: zFreq, amplitude: zAmp, phase: zPhase = 0 } = z;
    ref.current.position.y += Math.cos(time * yFreq + yPhase) * yAmp;
    ref.current.position.z += Math.sin(time * zFreq + zPhase) * zAmp;
  }
}

/**
 * Applies complete animation configuration
 */
export function applyAnimation(
  ref: RefObject<Group | null>,
  time: number,
  config: AnimationConfig,
): void {
  if (!ref.current) return;

  if (config.rotation) {
    applyRotation(ref, time, config.rotation);
  }

  if (config.rotationOscillation) {
    applyRotationOscillation(ref, time, config.rotationOscillation);
  }

  if (config.positionWave) {
    applyPositionWave(ref, time, config.positionWave);
  }
}

/**
 * Common animation presets for easter eggs
 */
export const SCENE_ANIMATION_PRESETS = {
  ORBITAL: {
    rotation: { y: 0.1 },
    rotationOscillation: { z: { frequency: 0.2, amplitude: 0.05 } },
  },
  FLOATING: {
    positionWave: {
      base: { x: 0, y: 0, z: 0 },
      y: { frequency: 0.5, amplitude: 0.4 },
      x: { frequency: 0.3, amplitude: 0.2 },
    },
  },
  FLYING: {
    rotation: { y: 0.15 },
    rotationOscillation: { x: { frequency: 0.3, amplitude: 0.1 } },
    positionWave: {
      base: { x: 0, y: 0, z: 0 },
      y: { frequency: 0.25, amplitude: 0.3 },
    },
  },
  WOBBLING: {
    rotation: { y: 0.5 },
    rotationOscillation: { x: { frequency: 0.8, amplitude: 0.15 } },
    positionWave: {
      base: { x: 0, y: 0, z: 0 },
      y: { frequency: 0.6, amplitude: 0.3 },
      x: { frequency: 0.4, amplitude: 0.2 },
    },
  },
  TUMBLING: {
    rotation: { y: 0.6, x: 0.4, z: 0.3 },
  },
} as const;

/**
 * Atmospheric Colors Configuration
 */
interface AtmosphericColors {
  from: string;
  via: string;
  to: string;
}

export const atmosphericColors: Record<AtmosphericPhase, AtmosphericColors> = {
  exosphere: {
    from: '#000000',
    via: '#0a0a1a',
    to: '#1a1a2e',
  },
  thermosphere: {
    from: '#1a1a2e',
    via: '#2d1b4e',
    to: '#1e3a8a',
  },
  mesosphere: {
    from: '#1e3a8a',
    via: '#1e40af',
    to: '#1d4ed8',
  },
  stratosphere: {
    from: '#1d4ed8',
    via: '#2563eb',
    to: '#3b82f6',
  },
  troposphere: {
    from: '#38bdf8',
    via: '#7dd3fc',
    to: '#bae6fd',
  },
};

/**
 * Light Configuration
 */
export const POINT_LIGHT_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: '#ffffff',
  thermosphere: '#9D4EDD',
  mesosphere: '#3A86FF',
  stratosphere: '#87CEEB',
  troposphere: '#FFA07A',
};

export const SECONDARY_LIGHT_COLORS: Record<AtmosphericPhase, string> = {
  exosphere: '#aaaaff',
  thermosphere: '#06FFA5',
  mesosphere: '#1E40AF',
  stratosphere: '#B0E0E6',
  troposphere: '#D2691E',
};

/**
 * Maps section progress to atmospheric phase
 */
export function getAtmosphericPhase(progress: number): AtmosphericPhase {
  if (progress < 0.5) return 'exosphere';
  if (progress < 1.5) return 'thermosphere';
  if (progress < 3.5) return 'mesosphere';
  if (progress < 5.5) return 'stratosphere';
  return 'troposphere';
}

/**
 * Interpolates between two hex colors
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Gets dynamic background gradient style based on section progress
 */
export function getBackgroundGradient(currentSection: number, scrollProgress: number): string {
  const progress = currentSection + scrollProgress;

  let fromColor: string, viaColor: string, toColor: string;

  if (progress < 0.5) {
    fromColor = atmosphericColors.exosphere.from;
    viaColor = atmosphericColors.exosphere.via;
    toColor = atmosphericColors.exosphere.to;
  } else if (progress < 1) {
    const factor = (progress - 0.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.exosphere.from,
      atmosphericColors.thermosphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.exosphere.via,
      atmosphericColors.thermosphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.exosphere.to,
      atmosphericColors.thermosphere.to,
      factor,
    );
  } else if (progress < 1.5) {
    fromColor = atmosphericColors.thermosphere.from;
    viaColor = atmosphericColors.thermosphere.via;
    toColor = atmosphericColors.thermosphere.to;
  } else if (progress < 2) {
    const factor = (progress - 1.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.thermosphere.from,
      atmosphericColors.mesosphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.thermosphere.via,
      atmosphericColors.mesosphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.thermosphere.to,
      atmosphericColors.mesosphere.to,
      factor,
    );
  } else if (progress < 3.5) {
    fromColor = atmosphericColors.mesosphere.from;
    viaColor = atmosphericColors.mesosphere.via;
    toColor = atmosphericColors.mesosphere.to;
  } else if (progress < 4) {
    const factor = (progress - 3.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.mesosphere.from,
      atmosphericColors.stratosphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.mesosphere.via,
      atmosphericColors.stratosphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.mesosphere.to,
      atmosphericColors.stratosphere.to,
      factor,
    );
  } else if (progress < 5.5) {
    fromColor = atmosphericColors.stratosphere.from;
    viaColor = atmosphericColors.stratosphere.via;
    toColor = atmosphericColors.stratosphere.to;
  } else if (progress < 6) {
    const factor = (progress - 5.5) * 2;
    fromColor = interpolateColor(
      atmosphericColors.stratosphere.from,
      atmosphericColors.troposphere.from,
      factor,
    );
    viaColor = interpolateColor(
      atmosphericColors.stratosphere.via,
      atmosphericColors.troposphere.via,
      factor,
    );
    toColor = interpolateColor(
      atmosphericColors.stratosphere.to,
      atmosphericColors.troposphere.to,
      factor,
    );
  } else {
    fromColor = atmosphericColors.troposphere.from;
    viaColor = atmosphericColors.troposphere.via;
    toColor = atmosphericColors.troposphere.to;
  }

  return `linear-gradient(to bottom right, ${fromColor}, ${viaColor}, ${toColor})`;
}

/**
 * Calculate opacity for all atmospheric layers based on current progress
 */
export function calculateLayerOpacities(progress: number): LayerOpacities {
  const exosphereOpacity = progress <= 0.5 ? 1 : progress >= 1.0 ? 0 : 1 - (progress - 0.5) * 2;

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

  const troposphereOpacity = progress < 5.5 ? 0 : progress >= 6.0 ? 1 : (progress - 5.5) * 2;

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
export function isLayerVisible(layer: keyof LayerOpacities, opacities: LayerOpacities): boolean {
  return opacities[layer] > 0;
}

/**
 * Light Configuration Helpers
 */
export function getAmbientIntensity(phase: AtmosphericPhase, baseIntensity: number = 1): number {
  return phase === 'troposphere' ? 0.5 * baseIntensity : 0.3 * baseIntensity;
}

export function getPointLightColor(phase: AtmosphericPhase): string {
  return POINT_LIGHT_COLORS[phase] || POINT_LIGHT_COLORS.exosphere;
}

export function getSecondaryLightColor(phase: AtmosphericPhase): string {
  return SECONDARY_LIGHT_COLORS[phase] || SECONDARY_LIGHT_COLORS.exosphere;
}

/**
 * Generate a random color based on the atmospheric phase
 */
export function generatePhaseColor(phase: AtmosphericPhase): string {
  switch (phase) {
    case 'exosphere': {
      const exosphereHue = Math.random() * 100 + 200;
      return `hsl(${exosphereHue}, ${60 + Math.random() * 20}%, ${70 + Math.random() * 15}%)`;
    }

    case 'thermosphere': {
      const thermosphereHue =
        Math.random() > 0.5 ? Math.random() * 60 + 120 : Math.random() * 60 + 280;
      return `hsl(${thermosphereHue}, ${70 + Math.random() * 20}%, ${65 + Math.random() * 15}%)`;
    }

    case 'mesosphere': {
      const mesosphereHue = Math.random() * 40 + 200;
      return `hsl(${mesosphereHue}, ${60 + Math.random() * 20}%, ${60 + Math.random() * 15}%)`;
    }

    case 'stratosphere': {
      const stratosphereHue = Math.random() * 60 + 180;
      return `hsl(${stratosphereHue}, ${50 + Math.random() * 30}%, ${75 + Math.random() * 15}%)`;
    }

    case 'troposphere': {
      const troposphereHue = Math.random() * 120 + 90;
      return `hsl(${troposphereHue}, ${40 + Math.random() * 30}%, ${60 + Math.random() * 20}%)`;
    }

    default:
      return `hsl(${Math.random() * 360}, 60%, 70%)`;
  }
}

/**
 * Creates an aurora shader material with gradient fading and flickering effects
 */
export function createAuroraMaterial(config: AuroraShaderConfig): THREE.ShaderMaterial {
  const {
    color,
    baseOpacity,
    verticalFadeRange = 0.3,
    edgeSoftness = 0.15,
    flickerIntensity = 0.1,
  } = config;

  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: {
        value: typeof color === 'string' ? new THREE.Color(color) : color,
      },
      uOpacity: { value: baseOpacity },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        float verticalGradient = smoothstep(0.0, ${verticalFadeRange.toFixed(2)}, vUv.y);
        float edgeSoftnessX = smoothstep(0.0, ${edgeSoftness.toFixed(2)}, vUv.x) * smoothstep(1.0, ${(1.0 - edgeSoftness).toFixed(2)}, vUv.x);
        float topEdgeSoftness = smoothstep(1.0, 0.75, vUv.y);
        float horizontalVariation = sin(vUv.x * 3.14159 * 4.0) * 0.15 + 0.85;
        float finalAlpha = verticalGradient * edgeSoftnessX * topEdgeSoftness * horizontalVariation * uOpacity;
        float flicker = sin(uTime * 2.0 + vUv.y * 10.0) * ${flickerIntensity.toFixed(2)} + ${(1.0 - flickerIntensity).toFixed(2)};
        finalAlpha *= flicker;

        gl_FragColor = vec4(uColor, finalAlpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/**
 * Updates shader time uniform
 */
export function updateShaderTime(material: ShaderMaterial, time: number): void {
  if (material.uniforms?.uTime) {
    material.uniforms.uTime.value = time;
  }
}

/**
 * Updates shader opacity uniform
 */
export function updateShaderOpacity(material: ShaderMaterial, opacity: number): void {
  if (material.uniforms?.uOpacity) {
    material.uniforms.uOpacity.value = opacity;
  }
}
