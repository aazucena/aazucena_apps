/**
 * Scene Objects Registry
 * Central registry mapping object types to their components
 */

import type { SceneObjectType, ObjectRegistryEntry } from "./types";
import {
  Airplane,
  Bird,
  Drone,
  WeatherBalloon,
  SpyPlane,
  Blimp,
  Comet,
  Meteor,
  SpaceDebris,
  SpaceShuttle,
  ISS,
  Astronaut,
  Satellite,
  UFO,
  Rocket,
} from "./easter-eggs";
import { House, Tree, Bush, Rock, Flower, Ground } from "./ground";

/**
 * Object Registry
 * Maps object types to their component implementations
 *
 * Components are lazy-loaded on first use for better performance
 */
export const objectRegistry: Record<SceneObjectType, ObjectRegistryEntry> = {
  // Troposphere Easter Eggs
  airplane: {
    type: "airplane",
    component: Airplane,
    cost: 3,
  },
  bird: {
    type: "bird",
    component: Bird,
    cost: 3,
  },
  drone: {
    type: "drone",
    component: Drone,
    cost: 4,
  },

  // Stratosphere Easter Eggs
  "weather-balloon": {
    type: "weather-balloon",
    component: WeatherBalloon,
    cost: 2,
  },
  "spy-plane": {
    type: "spy-plane",
    component: SpyPlane,
    cost: 4,
  },
  blimp: {
    type: "blimp",
    component: Blimp,
    cost: 3,
  },

  // Mesosphere Easter Eggs
  comet: {
    type: "comet",
    component: Comet,
    cost: 4,
  },
  meteor: {
    type: "meteor",
    component: Meteor,
    cost: 4,
  },
  "space-debris": {
    type: "space-debris",
    component: SpaceDebris,
    cost: 2,
  },

  // Thermosphere Easter Eggs
  "space-shuttle": {
    type: "space-shuttle",
    component: SpaceShuttle,
    cost: 5,
  },
  astronaut: {
    type: "astronaut",
    component: Astronaut,
    cost: 4,
  },
  iss: {
    type: "iss",
    component: ISS,
    cost: 5,
  },

  // Exosphere Easter Eggs
  satellite: {
    type: "satellite",
    component: Satellite,
    cost: 3,
  },
  ufo: {
    type: "ufo",
    component: UFO,
    cost: 4,
  },
  rocket: {
    type: "rocket",
    component: Rocket,
    cost: 3,
  },

  // Ground Objects
  house: {
    type: "house",
    component: House,
    cost: 3,
  },
  tree: {
    type: "tree",
    component: Tree,
    cost: 2,
  },
  bush: {
    type: "bush",
    component: Bush,
    cost: 1,
  },
  rock: {
    type: "rock",
    component: Rock,
    cost: 1,
  },
  flower: {
    type: "flower",
    component: Flower,
    cost: 1,
  },
  ground: {
    type: "ground",
    component: Ground,
    cost: 2,
  },
};

/**
 * Register an object component
 */
export function registerObject(entry: ObjectRegistryEntry): void {
  objectRegistry[entry.type] = entry;
}

/**
 * Get all registered object types
 */
export function getRegisteredTypes(): SceneObjectType[] {
  return Object.keys(objectRegistry) as SceneObjectType[];
}

/**
 * Check if an object type is registered
 */
export function isRegistered(type: SceneObjectType): boolean {
  return type in objectRegistry && objectRegistry[type]?.component !== null;
}
