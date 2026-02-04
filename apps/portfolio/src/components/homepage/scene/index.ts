/**
 * Scene Module
 * Barrel export for all scene components
 * Note: Scene data is in ~/data/scene, utilities in ~/lib/utils/scene
 */

// Atmospheric Layers (flattened from layers/)
export * from './Exosphere';
export * from './Thermosphere';
export * from './Mesosphere';
export * from './Stratosphere';
export * from './Troposphere';

// Scene Management
export * from './SceneLayerManager';
export * from './SceneLayerManager.lazy';
export * from './SceneLighting';

// Scene Objects (kept at depth 2)
export * from './objects';
