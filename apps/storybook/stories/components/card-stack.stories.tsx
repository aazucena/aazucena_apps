import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardStack } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Stacked card carousel primitive with click-to-cycle interaction and CSS-driven layering.
 * - **UX:** Cards are visually stacked with configurable offset and rotation; clicking the top card advances the stack.
 * - **Design:** Three variants (default, glass, cyber) with per-card styling applied via internal style map.
 * - **Performance:** Pure CSS transforms with no animation library dependency; only re-renders on active index change.
 */
const meta = {
  title: 'Components/Display/CardStack',
  component: CardStack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A stack of cards that cycle on click with configurable offset and rotation. Displays up to three cards simultaneously with perspective layering. Supports default, glass, and cyber variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant applied to card surfaces',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    offset: {
      control: { type: 'number', min: 4, max: 20 },
      description: 'Vertical offset between stacked cards in pixels',
      table: {
        category: 'Layout',
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
      },
    },
    rotation: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Rotation angle applied to background cards in degrees',
      table: {
        category: 'Layout',
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    cards: {
      description: 'Array of ReactNode elements to render as stack items',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode[]' },
      },
    },
    onSwipe: {
      action: 'swiped',
      description: 'Callback fired when the stack advances, receiving the new index',
      table: {
        category: 'Behavior',
        type: { summary: '(index: number) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCards = [
  <div key="1" className="p-6">
    <h3 className="font-bold">Card 1</h3>
    <p className="text-sm text-muted-foreground">Click the top card to cycle through the stack.</p>
  </div>,
  <div key="2" className="p-6">
    <h3 className="font-bold">Card 2</h3>
    <p className="text-sm text-muted-foreground">Each card transitions with CSS transforms.</p>
  </div>,
  <div key="3" className="p-6">
    <h3 className="font-bold">Card 3</h3>
    <p className="text-sm text-muted-foreground">The stack wraps around after the last card.</p>
  </div>,
];

// --- BASIC USAGE ---

/**
 * Default card stack with three cards and standard offset/rotation settings.
 */
export const Basic: Story = {
  args: {
    cards: sampleCards,
    variant: 'default',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic variant with frosted card surfaces, shown on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <CardStack {...args} />
    </div>
  ),
};

/**
 * Cyber variant with neon borders and dark card backgrounds for terminal aesthetics.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
};

// --- LAYOUT VARIATIONS ---

/**
 * Tighter offset with no rotation for a clean, minimal stacking effect.
 */
export const TightStack: Story = {
  args: {
    ...Basic.args,
    offset: 4,
    rotation: 0,
  },
};

/**
 * Dramatic offset and rotation for a playful, fanned-out card effect.
 */
export const DramaticFan: Story = {
  args: {
    ...Basic.args,
    offset: 16,
    rotation: 8,
  },
};

// --- ADVANCED ---

/**
 * Richer card content with images and metadata, simulating a project showcase stack.
 */
export const RichContent: Story = {
  args: {
    variant: 'default',
    cards: [
      <div key="a" className="p-5">
        <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
        <h3 className="font-bold">Project Alpha</h3>
        <p className="mt-1 text-xs text-muted-foreground">React + TypeScript</p>
      </div>,
      <div key="b" className="p-5">
        <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500" />
        <h3 className="font-bold">Project Beta</h3>
        <p className="mt-1 text-xs text-muted-foreground">Next.js + D3</p>
      </div>,
      <div key="c" className="p-5">
        <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500" />
        <h3 className="font-bold">Project Gamma</h3>
        <p className="mt-1 text-xs text-muted-foreground">Astro + Three.js</p>
      </div>,
    ],
  },
};
