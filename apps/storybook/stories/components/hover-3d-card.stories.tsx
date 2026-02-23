import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hover3DCard } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Interactive container primitive that applies perspective transforms based on pointer position.
 * - **UX:** Provides tactile depth feedback on hover with configurable intensity and optional glare overlay.
 * - **Performance:** GPU-accelerated transforms with `will-change: transform`; smooth ease-out reset on mouse leave.
 */
const meta = {
  title: 'Components/Display/Hover3DCard',
  component: Hover3DCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A card wrapper that applies a 3D tilt effect on mouse hover with optional radial glare. Supports configurable intensity, perspective distance, and three visual variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: "'default'" },
      },
    },
    intensity: {
      control: { type: 'number', min: 1, max: 30 },
      description: 'Tilt intensity in degrees',
      table: {
        category: 'Animation',
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
      },
    },
    glare: {
      control: 'boolean',
      description: 'Enable a radial glare overlay that follows the cursor',
      table: {
        category: 'Effects',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    perspective: {
      control: { type: 'number', min: 500, max: 2000 },
      description: 'CSS perspective distance in pixels',
      table: {
        category: 'Animation',
        type: { summary: 'number' },
        defaultValue: { summary: '1000' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Hover3DCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardContent = (
  <div className="p-6">
    <h3 className="text-lg font-bold">Hover Me</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Move your mouse over this card to see the 3D tilt effect in action.
    </p>
  </div>
);

const richContent = (
  <div className="p-6">
    <div className="mb-3 h-32 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20" />
    <h3 className="text-lg font-bold">Project Alpha</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      A fullstack application built with React and Node.js.
    </p>
    <div className="mt-3 flex gap-2">
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">React</span>
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">Node.js</span>
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">TypeScript</span>
    </div>
  </div>
);

// --- BASIC USAGE ---

/**
 * Default 3D card with standard intensity and no glare. Hover to interact.
 */
export const Basic: Story = {
  args: {
    children: cardContent,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a vivid gradient background for frosted-glass UI contexts.
 */
export const Glass: Story = {
  args: {
    children: cardContent,
    variant: 'glass',
    glare: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <div className="w-[320px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon border glow and dark background.
 */
export const Cyber: Story = {
  args: {
    children: cardContent,
    variant: 'cyber',
    glare: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <div className="w-[320px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// --- ADVANCED ---

/**
 * Enables the radial glare overlay that tracks cursor position across the card surface.
 */
export const WithGlare: Story = {
  args: {
    children: cardContent,
    glare: true,
  },
};

/**
 * High intensity tilt (25 degrees) for a more dramatic 3D effect.
 */
export const HighIntensity: Story = {
  args: {
    children: cardContent,
    intensity: 25,
    glare: true,
  },
};

/**
 * Rich project card content demonstrating a real-world portfolio use case.
 */
export const ProjectCard: Story = {
  args: {
    children: richContent,
    glare: true,
    intensity: 12,
  },
};
