/**
 * @aazucena/animations
 * Animation utilities for GSAP, Three.js, and PixiJS
 */

// GSAP
export * from './gsap/presets';
export * from './gsap/scrollTrigger';
export * from './gsap/timeline';

// Three.js
export * from './three/geometries';
export * from './three/materials';
export * from './three/objects/index';
export { AnimationCanvas } from './three/AnimationCanvas';
export { AnimationScene } from './three/AnimationScene';
export * from './three/viewer/index';

// PixiJS
export * from './pixi/particles';
export { AnimationParticles } from './pixi/AnimationParticles';
