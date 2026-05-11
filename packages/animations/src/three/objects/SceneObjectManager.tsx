/**
 * SceneObjectManager Component
 * Manages rendering of multiple scene objects with filtering and optimization
 */

import type { JSX } from 'react';
import { useMemo } from 'react';
import { SceneObject } from './SceneObject';
import type { SceneObjectManagerProps, SceneObjectConfig } from '@aazucena/types';
import { objectRegistry } from './registry';

/**
 * SceneObjectManager - Renders and manages multiple scene objects
 *
 * Features:
 * - Automatic object component lookup from registry
 * - Category and type filtering
 * - Opacity control
 * - Performance optimization (memoization, conditional rendering)
 *
 * @example
 * ```tsx
 * <SceneObjectManager
 *   objects={SCENE_OBJECTS.troposphere.easterEggs}
 *   opacity={0.8}
 *   categoryFilter={['easter-egg']}
 * />
 * ```
 */
export function SceneObjectManager({
  objects,
  opacity,
  categoryFilter,
  typeFilter,
}: SceneObjectManagerProps): JSX.Element {
  // Filter objects based on category and type
  const filteredObjects = useMemo(() => {
    let filtered = objects;

    if (categoryFilter && categoryFilter.length > 0) {
      filtered = filtered.filter((obj) => categoryFilter.includes(obj.category));
    }

    if (typeFilter && typeFilter.length > 0) {
      filtered = filtered.filter((obj) => typeFilter.includes(obj.type));
    }

    return filtered;
  }, [objects, categoryFilter, typeFilter]);

  return (
    <>
      {filteredObjects.map((config: SceneObjectConfig, index: number) => {
        const registryEntry = objectRegistry[config.type];

        if (!registryEntry) {
          console.warn(`SceneObjectManager: No component registered for type "${config.type}"`);
          return null;
        }

        const ObjectComponent = registryEntry.component;
        const objectId = config.id || `${config.type}-${index}`;
        const finalOpacity = (config.opacity ?? 1) * opacity;

        return (
          <SceneObject key={objectId} config={{ ...config, id: objectId }} opacity={finalOpacity}>
            <ObjectComponent opacity={finalOpacity} config={config} />
          </SceneObject>
        );
      })}
    </>
  );
}
