/**
 * Scene Objects System
 * Main barrel export for all scene objects functionality
 */

// Core components
export * from './SceneObject.js';
export * from './SceneObjectManager.js';

// Registry and utilities
export * from './registry.js';

// Ground Objects
export { House } from './House.js';
export { Tree } from './Tree.js';
export { Bush } from './Bush.js';
export { Rock } from './Rock.js';
export { Flower } from './Flower.js';
export { Ground } from './Ground.js';

// Easter Eggs
// Troposphere
export { Airplane } from './Airplane.js';
export { Bird } from './Bird.js';
export { Drone } from './Drone.js';

// Stratosphere
export { WeatherBalloon } from './WeatherBalloon.js';
export { SpyPlane } from './SpyPlane.js';
export { Blimp } from './Blimp.js';

// Mesosphere
export { Comet } from './Comet.js';
export { Meteor } from './Meteor.js';
export { SpaceDebris } from './SpaceDebris.js';

// Thermosphere
export { SpaceShuttle } from './SpaceShuttle.js';
export { ISS } from './ISS.js';
export { Astronaut } from './Astronaut.js';

// Exosphere
export { Satellite } from './Satellite.js';
export { UFO } from './UFO.js';
export { Rocket } from './Rocket.js';
