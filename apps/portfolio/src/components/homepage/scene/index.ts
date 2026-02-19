/**
 * Scene Module
 * Barrel export for all scene components
 * Note: Scene data is in ~/data/scene, utilities in ~/lib/utils/scene
 */

// Atmospheric Layers (flattened from layers/)
// NOTE: Static exports removed to enable code splitting.
// These layers are now ONLY exported via index.lazy.ts for lazy loading.
// Static exports here would prevent Vite from code-splitting, bundling
// all 5 layers (~375-750KB) into the main chunk unnecessarily.
// Use SceneLayerManager.lazy with ENABLE_LAYER_LAZY_LOADING=true instead.

// Scene Management
// NOTE: SceneLayerManager (non-lazy) export removed - we now ONLY use LazySceneLayerManager
// Exporting both would prevent code-splitting since SceneLayerManager imports all layers directly
export * from "./SceneLayerManager.lazy";
export * from "./SceneLighting";

// Scene Objects (kept at depth 2)
export * from "./objects";
