/**
 * Device Utilities
 * Device capability detection and performance tier logic
 */

import type { DeviceCapabilities } from '~/config/animations';

/**
 * Detect device capabilities
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      performanceTier: 'medium',
      canUseHeavyAnimations: true
    };
  }

  // Detect mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Get hardware info
  const memory = (navigator as any).deviceMemory || 4; // in GB
  const cores = navigator.hardwareConcurrency || 4;

  // Determine performance tier
  let performanceTier: 'low' | 'medium' | 'high';
  if (memory >= 8 && cores >= 8) {
    performanceTier = 'high';
  } else if (memory >= 4 && cores >= 4) {
    performanceTier = 'medium';
  } else {
    performanceTier = 'low';
  }

  // Heavy animations for desktop with good specs
  const canUseHeavyAnimations = !isMobile && memory >= 4;

  return {
    isMobile,
    performanceTier,
    canUseHeavyAnimations
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
export function getParticleCountForDevice(
  capabilities: DeviceCapabilities
): number {
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
  } catch (e) {
    return false;
  }
}
