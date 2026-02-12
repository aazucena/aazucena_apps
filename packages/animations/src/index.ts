/**
 * @aazucena/animations
 * Animation utilities for GSAP, Three.js, and PixiJS
 */

// GSAP
export * from './gsap/presets.js';
export * from './gsap/scrollTrigger.js';
export * from './gsap/timeline.js';

// Three.js
export * from './three/geometries.js';
export * from './three/materials.js';
export * from './three/objects/index.js';
export { AnimationCanvas } from './three/AnimationCanvas.js';
export { HomepageScene } from './three/HomepageScene.js';

// PixiJS
export * from './pixi/particles.js';
export { PixiJSParticles } from './pixi/PixiJSParticles.js';
