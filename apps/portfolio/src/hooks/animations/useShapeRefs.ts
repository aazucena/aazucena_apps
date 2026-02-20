/**
 * useShapeRefs Hook
 * Type-safe ref management for Three.js meshes using Map pattern
 * Provides automatic cleanup and prevents memory leaks
 */

import { useRef, useCallback } from "react";
import type * as THREE from "three";

/**
 * useShapeRefs
 *
 * Manages refs for multiple Three.js mesh instances safely:
 * - Uses Map instead of array for O(1) access and cleanup
 * - Provides type-safe get/set operations
 * - Automatically cleans up on unmount
 * - Prevents memory leaks from orphaned refs
 *
 * @returns {Object} - Ref management utilities
 * @returns {Function} setRef - Callback ref function for JSX
 * @returns {Function} getRef - Type-safe ref getter
 * @returns {Function} getAllRefs - Get all refs as array
 * @returns {Function} clearRefs - Manual cleanup function
 */
export function useShapeRefs() {
  // Use Map for type-safe, performant ref storage
  const refsMap = useRef<Map<number, THREE.Mesh>>(new Map());

  /**
   * Callback ref function to attach to mesh elements
   * Automatically adds/removes refs from the Map
   *
   * @param {number} index - Unique identifier for this mesh
   * @returns {Function} - React ref callback
   *
   * @example
   * <mesh ref={setRef(i)} />
   */
  const setRef = useCallback((index: number) => {
    return (element: THREE.Mesh | null) => {
      if (element) {
        // Add or update ref in Map
        refsMap.current.set(index, element);
      } else {
        // Remove ref when element unmounts
        refsMap.current.delete(index);
      }
    };
  }, []);

  /**
   * Get a specific mesh ref by index
   * Returns undefined if not found (type-safe)
   *
   * @param {number} index - Mesh identifier
   * @returns {THREE.Mesh | undefined}
   */
  const getRef = useCallback((index: number): THREE.Mesh | undefined => {
    return refsMap.current.get(index);
  }, []);

  /**
   * Get all mesh refs as an array
   * Useful for batch operations (e.g., animations)
   *
   * @returns {THREE.Mesh[]}
   */
  const getAllRefs = useCallback((): THREE.Mesh[] => {
    return Array.from(refsMap.current.values());
  }, []);

  /**
   * Manually clear all refs
   * Usually not needed (automatic cleanup on unmount)
   * but useful for resetting scene
   *
   * @returns {void}
   */
  const clearRefs = useCallback((): void => {
    refsMap.current.clear();
  }, []);

  /**
   * Get the current number of refs
   *
   * @returns {number}
   */
  const getRefCount = useCallback((): number => {
    return refsMap.current.size;
  }, []);

  return {
    setRef,
    getRef,
    getAllRefs,
    clearRefs,
    getRefCount,
  };
}
