/**
 * Scene Objects Gallery
 * High-fidelity 3D inspection for ALL 60+ registry objects.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ObjectViewer } from '@aazucena/animations';
import type { ComponentProps } from 'react';

const meta: Meta<ComponentProps<typeof ObjectViewer>> = {
  title: 'Animations/ThreeJS/Scene Objects',
  component: ObjectViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete catalog of all Three.js objects used in the portfolio. Categorized by atmospheric layer.',
      },
    },
  },
  tags: ['no-vitest'],
  argTypes: {
    objectKey: { table: { disable: true } },
    showGrid: { name: 'Show Grid', control: 'boolean' },
    autoRotate: { name: 'Auto Rotate', control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<ComponentProps<typeof ObjectViewer>>;

const Template: Story = {
  render: (args) => (
    <div className="w-full h-screen">
      <ObjectViewer {...args} />
    </div>
  ),
};

// --- LAYER 1: TROPOSPHERE ---
export const Tropo_Airplane: Story = {
  ...Template,
  args: { objectKey: 'airplane', showGrid: true, autoRotate: true },
};
export const Tropo_Bird: Story = {
  ...Template,
  args: { objectKey: 'bird', showGrid: true, autoRotate: true },
};
export const Tropo_BirdFlock: Story = {
  ...Template,
  args: { objectKey: 'bird-flock', showGrid: true, autoRotate: true },
};
export const Tropo_Drone: Story = {
  ...Template,
  args: { objectKey: 'drone', showGrid: true, autoRotate: true },
};
export const Tropo_Helicopter: Story = {
  ...Template,
  args: { objectKey: 'helicopter', showGrid: true, autoRotate: true },
};
export const Tropo_HotAirBalloon: Story = {
  ...Template,
  args: { objectKey: 'hot-air-balloon', showGrid: true, autoRotate: true },
};
export const Tropo_LawnChairBalloon: Story = {
  ...Template,
  args: { objectKey: 'lawn-chair-balloon', showGrid: true, autoRotate: true },
};
export const Tropo_GiantDuck: Story = {
  ...Template,
  args: { objectKey: 'giant-duck', showGrid: true, autoRotate: true },
};
export const Tropo_SantaSleigh: Story = {
  ...Template,
  args: { objectKey: 'santa-sleigh', showGrid: true, autoRotate: true },
};
export const Tropo_GiantPaperPlane: Story = {
  ...Template,
  args: { objectKey: 'giant-paper-plane', showGrid: true, autoRotate: true },
};
export const Tropo_Superman: Story = {
  ...Template,
  args: { objectKey: 'superman', showGrid: true, autoRotate: true },
};

// --- LAYER 2: STRATOSPHERE ---
export const Strato_WeatherBalloon: Story = {
  ...Template,
  args: { objectKey: 'weather-balloon', showGrid: true, autoRotate: true },
};
export const Strato_SpyPlane: Story = {
  ...Template,
  args: { objectKey: 'spy-plane', showGrid: true, autoRotate: true },
};
export const Strato_Blimp: Story = {
  ...Template,
  args: { objectKey: 'blimp', showGrid: true, autoRotate: true },
};
export const Strato_RedSprite: Story = {
  ...Template,
  args: { objectKey: 'red-sprite', showGrid: true, autoRotate: true },
};
export const Strato_SolarPlane: Story = {
  ...Template,
  args: { objectKey: 'solar-plane', showGrid: true, autoRotate: true },
};
export const Strato_SupersonicTransport: Story = {
  ...Template,
  args: { objectKey: 'supersonic-transport', showGrid: true, autoRotate: true },
};
export const Strato_ScientificGondola: Story = {
  ...Template,
  args: { objectKey: 'scientific-gondola', showGrid: true, autoRotate: true },
};
export const Strato_BlueJet: Story = {
  ...Template,
  args: { objectKey: 'blue-jet', showGrid: true, autoRotate: true },
};
export const Strato_UpHouse: Story = {
  ...Template,
  args: { objectKey: 'up-house', showGrid: true, autoRotate: true },
};
export const Strato_FallingWhale: Story = {
  ...Template,
  args: { objectKey: 'falling-whale', showGrid: true, autoRotate: true },
};
export const Strato_MaryPoppins: Story = {
  ...Template,
  args: { objectKey: 'mary-poppins', showGrid: true, autoRotate: true },
};
export const Strato_FlyingCow: Story = {
  ...Template,
  args: { objectKey: 'flying-cow', showGrid: true, autoRotate: true },
};
export const Strato_ETBike: Story = {
  ...Template,
  args: { objectKey: 'et-bike', showGrid: true, autoRotate: true },
};

// --- LAYER 3: MESOSPHERE ---
export const Meso_Comet: Story = {
  ...Template,
  args: { objectKey: 'comet', showGrid: true, autoRotate: true },
};
export const Meso_Meteor: Story = {
  ...Template,
  args: { objectKey: 'meteor', showGrid: true, autoRotate: true },
};
export const Meso_SpaceDebris: Story = {
  ...Template,
  args: { objectKey: 'space-debris', showGrid: true, autoRotate: true },
};
export const Meso_SoundingRocket: Story = {
  ...Template,
  args: { objectKey: 'sounding-rocket', showGrid: true, autoRotate: true },
};
export const Meso_NoctilucentCloud: Story = {
  ...Template,
  args: { objectKey: 'noctilucent-cloud', showGrid: true, autoRotate: true },
};
export const Meso_ELVES: Story = {
  ...Template,
  args: { objectKey: 'elves', showGrid: true, autoRotate: true },
};
export const Meso_MeteorSmokeTrail: Story = {
  ...Template,
  args: { objectKey: 'meteor-smoke-trail', showGrid: true, autoRotate: true },
};
export const Meso_SpriteGhost: Story = {
  ...Template,
  args: { objectKey: 'sprite-ghost', showGrid: true, autoRotate: true },
};
export const Meso_NyanCat: Story = {
  ...Template,
  args: { objectKey: 'nyan-cat', showGrid: true, autoRotate: true },
};
export const Meso_SpaceInvader: Story = {
  ...Template,
  args: { objectKey: 'space-invader', showGrid: true, autoRotate: true },
};
export const Meso_ThorsHammer: Story = {
  ...Template,
  args: { objectKey: 'thors-hammer', showGrid: true, autoRotate: true },
};
export const Meso_FloatingTeapot: Story = {
  ...Template,
  args: { objectKey: 'floating-teapot', showGrid: true, autoRotate: true },
};

// --- LAYER 4: THERMOSPHERE ---
export const Thermo_SpaceShuttle: Story = {
  ...Template,
  args: { objectKey: 'space-shuttle', showGrid: true, autoRotate: true },
};
export const Thermo_ISS: Story = {
  ...Template,
  args: { objectKey: 'iss', showGrid: true, autoRotate: true },
};
export const Thermo_Astronaut: Story = {
  ...Template,
  args: { objectKey: 'astronaut', showGrid: true, autoRotate: true },
};
export const Thermo_Hubble: Story = {
  ...Template,
  args: { objectKey: 'hubble', showGrid: true, autoRotate: true },
};
export const Thermo_AuroraRibbon: Story = {
  ...Template,
  args: { objectKey: 'aurora-ribbon', showGrid: true, autoRotate: true },
};
export const Thermo_CubeSat: Story = {
  ...Template,
  args: { objectKey: 'cubesat', showGrid: true, autoRotate: true },
};
export const Thermo_SoyuzCapsule: Story = {
  ...Template,
  args: { objectKey: 'soyuz-capsule', showGrid: true, autoRotate: true },
};
export const Thermo_StarlinkSatellite: Story = {
  ...Template,
  args: { objectKey: 'starlink-satellite', showGrid: true, autoRotate: true },
};
export const Thermo_Tardis: Story = {
  ...Template,
  args: { objectKey: 'tardis', showGrid: true, autoRotate: true },
};
export const Thermo_DeathStar: Story = {
  ...Template,
  args: { objectKey: 'death-star', showGrid: true, autoRotate: true },
};
export const Thermo_TeslaRoadster: Story = {
  ...Template,
  args: { objectKey: 'tesla-roadster', showGrid: true, autoRotate: true },
};

// --- LAYER 5: EXOSPHERE ---
export const Exo_Satellite: Story = {
  ...Template,
  args: { objectKey: 'satellite', showGrid: true, autoRotate: true },
};
export const Exo_UFO: Story = {
  ...Template,
  args: { objectKey: 'ufo', showGrid: true, autoRotate: true },
};
export const Exo_Rocket: Story = {
  ...Template,
  args: { objectKey: 'rocket', showGrid: true, autoRotate: true },
};
export const Exo_StarlinkTrain: Story = {
  ...Template,
  args: { objectKey: 'starlink-train', showGrid: true, autoRotate: true },
};
export const Exo_JamesWebb: Story = {
  ...Template,
  args: { objectKey: 'james-webb', showGrid: true, autoRotate: true },
};
export const Exo_Voyager: Story = {
  ...Template,
  args: { objectKey: 'voyager', showGrid: true, autoRotate: true },
};
export const Exo_GPSSatellite: Story = {
  ...Template,
  args: { objectKey: 'gps-satellite', showGrid: true, autoRotate: true },
};
export const Exo_Sputnik: Story = {
  ...Template,
  args: { objectKey: 'sputnik', showGrid: true, autoRotate: true },
};
export const Exo_Monolith: Story = {
  ...Template,
  args: { objectKey: 'monolith', showGrid: true, autoRotate: true },
};
export const Exo_PlanetExpress: Story = {
  ...Template,
  args: { objectKey: 'planet-express', showGrid: true, autoRotate: true },
};
export const Exo_BlackHole: Story = {
  ...Template,
  args: { objectKey: 'black-hole', showGrid: true, autoRotate: true },
};
export const Exo_FlatEarth: Story = {
  ...Template,
  args: { objectKey: 'flat-earth', showGrid: true, autoRotate: true },
};

// --- GROUND OBJECTS ---
export const Ground_House: Story = {
  ...Template,
  args: { objectKey: 'house', showGrid: true, autoRotate: true },
};
export const Ground_Tree: Story = {
  ...Template,
  args: { objectKey: 'tree', showGrid: true, autoRotate: true },
};
export const Ground_Bush: Story = {
  ...Template,
  args: { objectKey: 'bush', showGrid: true, autoRotate: true },
};
export const Ground_Rock: Story = {
  ...Template,
  args: { objectKey: 'rock', showGrid: true, autoRotate: true },
};
export const Ground_Flower: Story = {
  ...Template,
  args: { objectKey: 'flower', showGrid: true, autoRotate: true },
};
export const Ground_WindTurbine: Story = {
  ...Template,
  args: { objectKey: 'wind-turbine', showGrid: true, autoRotate: true },
};
export const Ground_UtilityPylon: Story = {
  ...Template,
  args: { objectKey: 'utility-pylon', showGrid: true, autoRotate: true },
};
export const Ground_Skyscraper: Story = {
  ...Template,
  args: { objectKey: 'skyscraper', showGrid: true, autoRotate: true },
};
export const Ground_Lighthouse: Story = {
  ...Template,
  args: { objectKey: 'lighthouse', showGrid: true, autoRotate: true },
};
