/**
 * Lazy-Loaded Atmospheric Layers
 * Code-split imports for better initial bundle size
 *
 * Each layer is loaded on-demand when scroll progress makes it visible.
 * This reduces the initial JavaScript bundle by ~75-150KB (uncompressed).
 */

import { lazy, type ComponentType } from 'react';

// Re-export prop types to satisfy TypeScript's module resolution
export type { ExosphereProps } from './Exosphere.js';
export type { ThermosphereProps } from './Thermosphere.js';
export type { MesosphereProps } from './Mesosphere.js';
export type { StratosphereProps } from './Stratosphere.js';
export type { TroposphereProps } from './Troposphere.js';

/**
 * Exosphere - Outermost space layer with Milky Way and particles
 * Loaded immediately (visible on page load)
 */
export const ExosphereLazy = lazy(() =>
  import('./Exosphere.js').then((module) => ({
    default: module.Exosphere as ComponentType<unknown>,
  })),
);

/**
 * Thermosphere - Aurora effects and high-altitude phenomena
 * Loaded when user scrolls to section 1-2
 */
export const ThermosphereLazy = lazy(() =>
  import('./Thermosphere.js').then((module) => ({
    default: module.Thermosphere as ComponentType<unknown>,
  })),
);

/**
 * Mesosphere - Meteor showers and middle atmosphere
 * Loaded when user scrolls to section 2-3
 */
export const MesosphereLazy = lazy(() =>
  import('./Mesosphere.js').then((module) => ({
    default: module.Mesosphere as ComponentType<unknown>,
  })),
);

/**
 * Stratosphere - Cloud formations
 * Loaded when user scrolls to section 3-4
 */
export const StratosphereLazy = lazy(() =>
  import('./Stratosphere.js').then((module) => ({
    default: module.Stratosphere as ComponentType<unknown>,
  })),
);

/**
 * Troposphere - Ground scene with buildings, trees, nature
 * Loaded when user scrolls to section 5+
 */
export const TroposphereLazy = lazy(() =>
  import('./Troposphere.js').then((module) => ({
    default: module.Troposphere as ComponentType<unknown>,
  })),
);
