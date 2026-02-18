import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { AnimationScene } from '@aazucena/animations';
import { AnimationProvider, PortfolioProvider } from '@aazucena/context';

/**
 * ## Engineering Standards
 * - **Performance:** Uses demand-based rendering for 20-30% FPS improvement.
 * - **Layers:** Orchestrates atmospheric layers from Exosphere down to Troposphere.
 * - **Responsive:** Adaptive intensity and detail based on performance tier.
 */
const meta = {
  title: 'Animations/ThreeJS/Scene',
  component: AnimationScene,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main Three.js scene orchestrator for the portfolio background. Supports atmospheric layer transitions and demand-based rendering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    phase: {
      control: 'select',
      options: ['exosphere', 'thermosphere', 'mesosphere', 'stratosphere', 'troposphere'],
      description: 'The current atmospheric phase/layer',
      table: { category: 'State' }
    },
    intensity: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Animation intensity multiplier',
      table: { category: 'Visuals' }
    },
    currentSection: {
      control: { type: 'number', min: 0, max: 7 },
      description: 'Current section index (0-7)',
      table: { category: 'Navigation' }
    },
    scrollProgress: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Scroll progress within current section (0-1)',
      table: { category: 'Navigation' }
    }
  },
  decorators: [
    (Story) => (
      <AnimationProvider>
        <PortfolioProvider totalSections={8}>
          <div className="w-full h-screen bg-slate-950">
            <Canvas
              frameloop="demand"
              camera={{ position: [0, 0, 0], fov: 15 }}
              gl={{ alpha: true, antialias: true }}
              shadows
            >
              <Story />
            </Canvas>
          </div>
        </PortfolioProvider>
      </AnimationProvider>
    ),
  ],
} satisfies Meta<typeof AnimationScene>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The default exosphere phase with floating shapes and high-altitude elements.
 */
export const Exosphere: Story = {
  args: {
    phase: 'exosphere',
    intensity: 1,
    currentSection: 0,
    scrollProgress: 0,
  },
};

/**
 * The thermosphere phase with glowing technical elements.
 */
export const Thermosphere: Story = {
  args: {
    ...Exosphere.args,
    phase: 'thermosphere',
    currentSection: 1,
  },
};

/**
 * The mesosphere phase with meteors and comets.
 */
export const Mesosphere: Story = {
  args: {
    ...Exosphere.args,
    phase: 'mesosphere',
    currentSection: 3,
  },
};

/**
 * The stratosphere phase with weather balloons and high-altitude aircraft.
 */
export const Stratosphere: Story = {
  args: {
    ...Exosphere.args,
    phase: 'stratosphere',
    currentSection: 5,
  },
};

/**
 * The troposphere phase with ground objects, houses, and trees.
 */
export const Troposphere: Story = {
  args: {
    ...Exosphere.args,
    phase: 'troposphere',
    currentSection: 7,
  },
};
