import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { SceneObject, Airplane, Astronaut, Satellite, UFO, Rocket, ISS, Comet, Meteor, SpaceDebris, Blimp, SpyPlane, WeatherBalloon, Drone, Bird, House, Tree, Bush, Rock, Flower } from '@aazucena/animations/three';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

/**
 * ## Engineering Standards
 * - **Modular:** Individual components that can be used independently or within a scene.
 * - **Interactive:** Supports mouse-over effects and clicks (where implemented).
 * - **Performance:** Lightweight geometry using primitive shapes for high-performance background rendering.
 */
const meta = {
  title: 'Animations/ThreeJS/Objects',
  component: SceneObject,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual Three.js objects used throughout the portfolio backgrounds.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[800px] h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
          <OrbitControls enableDamping />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, 5]} intensity={1} />
          <Environment preset="night" />
          <Story />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof SceneObject>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Commercial airplane with cruising flight path, usually found in the Troposphere.
 */
export const CommercialAirplane: Story = {
  render: () => (
    <SceneObject config={{ id: 'airplane', type: 'airplane', position: [0, 0, 0], scale: 1 }}>
      <Airplane opacity={1} />
    </SceneObject>
  ),
};

/**
 * Floating astronaut in zero-gravity, found in the Thermosphere.
 */
export const FloatingAstronaut: Story = {
  render: () => (
    <SceneObject config={{ id: 'astronaut', type: 'astronaut', position: [0, 0, 0], scale: 1.5 }}>
      <Astronaut opacity={1} />
    </SceneObject>
  ),
};

/**
 * Communication satellite in orbit, found in the Exosphere.
 */
export const OrbitalSatellite: Story = {
  render: () => (
    <SceneObject config={{ id: 'satellite', type: 'satellite', position: [0, 0, 0], scale: 1.2 }}>
      <Satellite opacity={1} />
    </SceneObject>
  ),
};

/**
 * The International Space Station (ISS), found in the Thermosphere.
 */
export const InternationalSpaceStation: Story = {
  render: () => (
    <SceneObject config={{ id: 'iss', type: 'iss', position: [0, 0, 0], scale: 2 }}>
      <ISS opacity={1} />
    </SceneObject>
  ),
};

/**
 * A glowing UFO with rotating elements, found in the Exosphere.
 */
export const UnidentifiedFlyingObject: Story = {
  render: () => (
    <SceneObject config={{ id: 'ufo', type: 'ufo', position: [0, 0, 0], scale: 1 }}>
      <UFO opacity={1} />
    </SceneObject>
  ),
};

/**
 * A fast-moving rocket with exhaust trail, found in the Exosphere.
 */
export const SpaceRocket: Story = {
  render: () => (
    <SceneObject config={{ id: 'rocket', type: 'rocket', position: [0, 0, 0], scale: 1 }}>
      <Rocket opacity={1} />
    </SceneObject>
  ),
};

/**
 * A meteor with a bright trail, found in the Mesosphere.
 */
export const FlamingMeteor: Story = {
  render: () => (
    <SceneObject config={{ id: 'meteor', type: 'meteor', position: [0, 0, 0], scale: 1 }}>
      <Meteor opacity={1} />
    </SceneObject>
  ),
};

/**
 * A high-altitude weather balloon, found in the Stratosphere.
 */
export const HighAltitudeWeatherBalloon: Story = {
  render: () => (
    <SceneObject config={{ id: 'weather-balloon', type: 'weather-balloon', position: [0, 0, 0], scale: 1 }}>
      <WeatherBalloon opacity={1} />
    </SceneObject>
  ),
};

/**
 * A small drone, usually found in the lower Troposphere.
 */
export const MonitoringDrone: Story = {
  render: () => (
    <SceneObject config={{ id: 'drone', type: 'drone', position: [0, 0, 0], scale: 0.5 }}>
      <Drone opacity={1} />
    </SceneObject>
  ),
};

/**
 * A simple house model, found on the ground in the Troposphere.
 */
export const GroundHouse: Story = {
  render: () => (
    <SceneObject config={{ id: 'house', type: 'house', position: [0, -1, 0], scale: 1 }}>
      <House opacity={1} />
    </SceneObject>
  ),
};

/**
 * A procedural tree model, found on the ground in the Troposphere.
 */
export const GroundTree: Story = {
  render: () => (
    <SceneObject config={{ id: 'tree', type: 'tree', position: [0, -1, 0], scale: 1 }}>
      <Tree opacity={1} />
    </SceneObject>
  ),
};
