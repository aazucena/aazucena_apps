/**
 * Scene Objects Registry
 * Central registry mapping object types to their components
 */

import type { SceneObjectType, ObjectRegistryEntry } from '@aazucena/types';
import {
  Airplane,
  Bird,
  BirdFlock,
  Drone,
  Helicopter,
  HotAirBalloon,
  LawnChairBalloon,
  GiantDuck,
  SantaSleigh,
  GiantPaperPlane,
  Superman,
  WeatherBalloon,
  SpyPlane,
  Blimp,
  RedSprite,
  SolarPlane,
  SupersonicTransport,
  ScientificGondola,
  BlueJet,
  UpHouse,
  FallingWhale,
  MaryPoppins,
  FlyingCow,
  ETBike,
  Comet,
  Meteor,
  SpaceDebris,
  SoundingRocket,
  NoctilucentCloud,
  ELVES,
  MeteorSmokeTrail,
  SpriteGhost,
  NyanCat,
  SpaceInvader,
  ThorsHammer,
  FloatingTeapot,
  SpaceShuttle,
  ISS,
  Astronaut,
  Hubble,
  AuroraRibbon,
  CubeSat,
  SoyuzCapsule,
  StarlinkSatellite,
  Tardis,
  DeathStar,
  TeslaRoadster,
  Satellite,
  UFO,
  Rocket,
  StarlinkTrain,
  JamesWebb,
  Voyager,
  GPSSatellite,
  Sputnik,
  Monolith,
  PlanetExpress,
  BlackHole,
  FlatEarth,
  House,
  Tree,
  Bush,
  Rock,
  Flower,
  Ground,
  WindTurbine,
  UtilityPylon,
  Skyscraper,
  Lighthouse,
} from './index.js';

/**
 * Object Registry
 * Maps object types to their component implementations
 */
export const ANIMATION_OBJECT_REGISTRY: Record<SceneObjectType, ObjectRegistryEntry> = {
  // Troposphere Easter Eggs
  airplane: {
    type: 'airplane',
    component: Airplane,
    cost: 3,
    layer: 'troposphere',
  },
  bird: {
    type: 'bird',
    component: Bird,
    cost: 3,
    layer: 'troposphere',
  },
  'bird-flock': {
    type: 'bird-flock',
    component: BirdFlock,
    cost: 5,
    layer: 'troposphere',
  },
  drone: {
    type: 'drone',
    component: Drone,
    cost: 4,
    layer: 'troposphere',
  },
  helicopter: {
    type: 'helicopter',
    component: Helicopter,
    cost: 4,
    layer: 'troposphere',
  },
  'hot-air-balloon': {
    type: 'hot-air-balloon',
    component: HotAirBalloon,
    cost: 3,
    layer: 'troposphere',
  },
  'lawn-chair-balloon': {
    type: 'lawn-chair-balloon',
    component: LawnChairBalloon,
    cost: 5,
    layer: 'troposphere',
  },
  'giant-duck': {
    type: 'giant-duck',
    component: GiantDuck,
    cost: 5,
    layer: 'troposphere',
  },
  'santa-sleigh': {
    type: 'santa-sleigh',
    component: SantaSleigh,
    cost: 5,
    layer: 'troposphere',
  },
  'giant-paper-plane': {
    type: 'giant-paper-plane',
    component: GiantPaperPlane,
    cost: 4,
    layer: 'troposphere',
  },
  superman: {
    type: 'superman',
    component: Superman,
    cost: 6,
    layer: 'troposphere',
  },

  // Stratosphere Easter Eggs
  'weather-balloon': {
    type: 'weather-balloon',
    component: WeatherBalloon,
    cost: 2,
    layer: 'stratosphere',
  },
  'spy-plane': {
    type: 'spy-plane',
    component: SpyPlane,
    cost: 4,
    layer: 'stratosphere',
  },
  blimp: {
    type: 'blimp',
    component: Blimp,
    cost: 3,
    layer: 'stratosphere',
  },
  'red-sprite': {
    type: 'red-sprite',
    component: RedSprite,
    cost: 5,
    layer: 'stratosphere',
  },
  'solar-plane': {
    type: 'solar-plane',
    component: SolarPlane,
    cost: 4,
    layer: 'stratosphere',
  },
  'supersonic-transport': {
    type: 'supersonic-transport',
    component: SupersonicTransport,
    cost: 4,
    layer: 'stratosphere',
  },
  'scientific-gondola': {
    type: 'scientific-gondola',
    component: ScientificGondola,
    cost: 3,
    layer: 'stratosphere',
  },
  'blue-jet': {
    type: 'blue-jet',
    component: BlueJet,
    cost: 5,
    layer: 'stratosphere',
  },
  'up-house': {
    type: 'up-house',
    component: UpHouse,
    cost: 6,
    layer: 'stratosphere',
  },
  'falling-whale': {
    type: 'falling-whale',
    component: FallingWhale,
    cost: 5,
    layer: 'stratosphere',
  },
  'mary-poppins': {
    type: 'mary-poppins',
    component: MaryPoppins,
    cost: 4,
    layer: 'stratosphere',
  },
  'flying-cow': {
    type: 'flying-cow',
    component: FlyingCow,
    cost: 4,
    layer: 'stratosphere',
  },
  'et-bike': {
    type: 'et-bike',
    component: ETBike,
    cost: 6,
    layer: 'stratosphere',
  },

  // Mesosphere Easter Eggs
  comet: {
    type: 'comet',
    component: Comet,
    cost: 4,
    layer: 'mesosphere',
  },
  meteor: {
    type: 'meteor',
    component: Meteor,
    cost: 4,
    layer: 'mesosphere',
  },
  'space-debris': {
    type: 'space-debris',
    component: SpaceDebris,
    cost: 2,
    layer: 'mesosphere',
  },
  'sounding-rocket': {
    type: 'sounding-rocket',
    component: SoundingRocket,
    cost: 4,
    layer: 'mesosphere',
  },
  'noctilucent-cloud': {
    type: 'noctilucent-cloud',
    component: NoctilucentCloud,
    cost: 2,
    layer: 'mesosphere',
  },
  elves: {
    type: 'elves',
    component: ELVES,
    cost: 5,
    layer: 'mesosphere',
  },
  'meteor-smoke-trail': {
    type: 'meteor-smoke-trail',
    component: MeteorSmokeTrail,
    cost: 2,
    layer: 'mesosphere',
  },
  'sprite-ghost': {
    type: 'sprite-ghost',
    component: SpriteGhost,
    cost: 2,
    layer: 'mesosphere',
  },
  'nyan-cat': {
    type: 'nyan-cat',
    component: NyanCat,
    cost: 6,
    layer: 'mesosphere',
  },
  'space-invader': {
    type: 'space-invader',
    component: SpaceInvader,
    cost: 5,
    layer: 'mesosphere',
  },
  'thors-hammer': {
    type: 'thors-hammer',
    component: ThorsHammer,
    cost: 5,
    layer: 'mesosphere',
  },
  'floating-teapot': {
    type: 'floating-teapot',
    component: FloatingTeapot,
    cost: 4,
    layer: 'mesosphere',
  },

  // Thermosphere Easter Eggs
  'space-shuttle': {
    type: 'space-shuttle',
    component: SpaceShuttle,
    cost: 5,
    layer: 'thermosphere',
  },
  iss: {
    type: 'iss',
    component: ISS,
    cost: 5,
    layer: 'thermosphere',
  },
  astronaut: {
    type: 'astronaut',
    component: Astronaut,
    cost: 4,
    layer: 'thermosphere',
  },
  hubble: {
    type: 'hubble',
    component: Hubble,
    cost: 5,
    layer: 'thermosphere',
  },
  'aurora-ribbon': {
    type: 'aurora-ribbon',
    component: AuroraRibbon,
    cost: 2,
    layer: 'thermosphere',
  },
  'cubesat': {
    type: 'cubesat',
    component: CubeSat,
    cost: 3,
    layer: 'thermosphere',
  },
  'soyuz-capsule': {
    type: 'soyuz-capsule',
    component: SoyuzCapsule,
    cost: 4,
    layer: 'thermosphere',
  },
  'starlink-satellite': {
    type: 'starlink-satellite',
    component: StarlinkSatellite,
    cost: 3,
    layer: 'thermosphere',
  },
  tardis: {
    type: 'tardis',
    component: Tardis,
    cost: 6,
    layer: 'thermosphere',
  },
  'death-star': {
    type: 'death-star',
    component: DeathStar,
    cost: 7,
    layer: 'thermosphere',
  },
  'tesla-roadster': {
    type: 'tesla-roadster',
    component: TeslaRoadster,
    cost: 6,
    layer: 'thermosphere',
  },

  // Exosphere Easter Eggs
  satellite: {
    type: 'satellite',
    component: Satellite,
    cost: 3,
    layer: 'exosphere',
  },
  ufo: {
    type: 'ufo',
    component: UFO,
    cost: 4,
    layer: 'exosphere',
  },
  rocket: {
    type: 'rocket',
    component: Rocket,
    cost: 3,
    layer: 'exosphere',
  },
  'starlink-train': {
    type: 'starlink-train',
    component: StarlinkTrain,
    cost: 2,
    layer: 'exosphere',
  },
  'james-webb': {
    type: 'james-webb',
    component: JamesWebb,
    cost: 5,
    layer: 'exosphere',
  },
  voyager: {
    type: 'voyager',
    component: Voyager,
    cost: 4,
    layer: 'exosphere',
  },
  'gps-satellite': {
    type: 'gps-satellite',
    component: GPSSatellite,
    cost: 3,
    layer: 'exosphere',
  },
  sputnik: {
    type: 'sputnik',
    component: Sputnik,
    cost: 3,
    layer: 'exosphere',
  },
  monolith: {
    type: 'monolith',
    component: Monolith,
    cost: 5,
    layer: 'exosphere',
  },
  'planet-express': {
    type: 'planet-express',
    component: PlanetExpress,
    cost: 6,
    layer: 'exosphere',
  },
  'black-hole': {
    type: 'black-hole',
    component: BlackHole,
    cost: 8,
    layer: 'exosphere',
  },
  'flat-earth': {
    type: 'flat-earth',
    component: FlatEarth,
    cost: 7,
    layer: 'exosphere',
  },

  // Ground Objects
  house: {
    type: 'house',
    component: House,
    cost: 3,
    layer: 'ground',
  },
  tree: {
    type: 'tree',
    component: Tree,
    cost: 2,
    layer: 'ground',
  },
  bush: {
    type: 'bush',
    component: Bush,
    cost: 1,
    layer: 'ground',
  },
  rock: {
    type: 'rock',
    component: Rock,
    cost: 1,
    layer: 'ground',
  },
  flower: {
    type: 'flower',
    component: Flower,
    cost: 1,
    layer: 'ground',
  },
  ground: {
    type: 'ground',
    component: Ground,
    cost: 2,
    layer: 'ground',
  },
  'wind-turbine': {
    type: 'wind-turbine',
    component: WindTurbine,
    cost: 3,
    layer: 'ground',
  },
  'utility-pylon': {
    type: 'utility-pylon',
    component: UtilityPylon,
    cost: 3,
    layer: 'ground',
  },
  skyscraper: {
    type: 'skyscraper',
    component: Skyscraper,
    cost: 4,
    layer: 'ground',
  },
  lighthouse: {
    type: 'lighthouse',
    component: Lighthouse,
    cost: 4,
    layer: 'ground',
  },
};

/**
 * Backward compatibility alias
 */
export const objectRegistry = ANIMATION_OBJECT_REGISTRY;

/**
 * Register an object component
 */
export function registerObject(entry: ObjectRegistryEntry): void {
  ANIMATION_OBJECT_REGISTRY[entry.type] = entry;
}

/**
 * Get all registered object types
 */
export function getRegisteredTypes(): SceneObjectType[] {
  return Object.keys(ANIMATION_OBJECT_REGISTRY) as SceneObjectType[];
}

/**
 * Check if an object type is registered
 */
export function isRegistered(type: SceneObjectType): boolean {
  return type in ANIMATION_OBJECT_REGISTRY && ANIMATION_OBJECT_REGISTRY[type]?.component !== null;
}
