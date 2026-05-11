/**
 * Device Utilities
 * Device capability detection and performance tier logic
 */

import type { DeviceCapabilities } from '@aazucena/types';

/**
 * Detect device capabilities
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      performanceTier: 'medium',
      canUseHeavyAnimations: true,
    };
  }

  // Detect mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Get hardware info
  // deviceMemory is Chrome-only; Firefox returns undefined — use cores as tiebreaker
  const memory = (navigator as any).deviceMemory; // undefined on Firefox/Safari
  const cores = navigator.hardwareConcurrency || 4;

  // Determine performance tier
  // When deviceMemory is unavailable, fall back to cores-only heuristic
  let performanceTier: 'low' | 'medium' | 'high';
  if ((memory === undefined ? cores >= 8 : memory >= 8) && cores >= 8) {
    performanceTier = 'high';
  } else if ((memory === undefined ? cores >= 4 : memory >= 4) && cores >= 4) {
    performanceTier = 'medium';
  } else {
    performanceTier = 'low';
  }

  // Respect prefers-reduced-motion (accessibility + battery/performance)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Heavy animations: desktop only, sufficient memory (or unknown memory with enough cores),
  // and user has not requested reduced motion
  const hasEnoughMemory = memory !== undefined ? memory >= 4 : cores >= 4;
  const canUseHeavyAnimations = !isMobile && hasEnoughMemory && !reducedMotion && supportsWebGL();

  return {
    isMobile,
    performanceTier,
    canUseHeavyAnimations,
  };
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Get particle count based on performance tier
 */
export function getParticleCountForDevice(capabilities: DeviceCapabilities): number {
  switch (capabilities.performanceTier) {
    case 'high':
      return 200;
    case 'medium':
      return 100;
    case 'low':
      return 50;
    default:
      return 100;
  }
}

/**
 * Check if browser supports WebGL
 */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
