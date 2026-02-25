import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimationParticles } from '@aazucena/animations';
import { useEffect, useState } from 'react';

/**
 * ## Engineering Standards
 * - **Performance:** Uses PixiJS for high-performance 2D particle rendering.
 * - **Visuals:** Supports different presets (space, snow, rain, floating) and effects (glow, blur).
 * - **Interactivity:** Can emit particles at specific positions or in bursts.
 */
const meta = {
  title: 'Animations/PixiJS/Particles',
  component: AnimationParticles,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'High-performance 2D particle system using PixiJS. Ideal for atmospheric backgrounds like space, snow, or rain.',
      },
    },
    chromatic: { disableSnapshot: true }, // PixiJS requires WebGL — not available in Chromatic's headless Chrome
  },
  tags: ['autodocs', 'no-vitest'],
  argTypes: {
    preset: {
      control: 'select',
      options: ['space', 'snow', 'rain', 'floating'],
      description: 'The visual preset for the particle system',
      table: { category: 'Appearance' },
    },
    effect: {
      control: 'select',
      options: ['glow', 'blur', 'none'],
      description: 'Visual post-processing effects',
      table: { category: 'Appearance' },
    },
    count: {
      control: { type: 'number', min: 10, max: 2000 },
      description: 'Number of particles',
      table: { category: 'Performance' },
    },
    speed: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'Movement speed multiplier',
      table: { category: 'Animation' },
    },
    size: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Base particle size',
      table: { category: 'Appearance' },
    },
    opacity: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Particle opacity',
      table: { category: 'Appearance' },
    },
    isPlaying: {
      control: 'boolean',
      description: 'Toggle playback',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof AnimationParticles>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The default space preset with glowing particles.
 */
export const Space: Story = {
  args: {
    preset: 'space',
    effect: 'glow',
    count: 200,
    speed: 1,
    size: 2,
    opacity: 0.8,
    isPlaying: true,
  },
  render: (args) => {
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div className="bg-slate-950 w-full h-screen">
        <AnimationParticles {...args} width={dimensions.width} height={dimensions.height} />
      </div>
    );
  },
};

/**
 * Snow preset with blur effect for a soft winter look.
 */
export const Snow: Story = {
  args: {
    ...Space.args,
    preset: 'snow',
    effect: 'blur',
    count: 500,
    speed: 0.5,
    size: 3,
  },
  render: Space.render,
};

/**
 * Rain preset for fast, linear movement.
 */
export const Rain: Story = {
  args: {
    ...Space.args,
    preset: 'rain',
    effect: 'none',
    count: 800,
    speed: 2,
    size: 1,
  },
  render: Space.render,
};

/**
 * Slow floating particles for a calm atmospheric effect.
 */
export const Floating: Story = {
  args: {
    ...Space.args,
    preset: 'floating',
    effect: 'glow',
    count: 100,
    speed: 0.2,
    size: 4,
  },
  render: Space.render,
};
