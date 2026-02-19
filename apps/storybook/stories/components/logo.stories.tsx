import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic brand primitive for universal site identification.
 * - **Accessibility:** Built with standard `role="img"` and supports `aria-label` for semantic screen reader recognition.
 * - **UX:** Features hover-triggered scale and rotation feedback for interactive depth.
 * - **Design:** Optimized for high-fidelity technical branding with specific `cyber` glow effects.
 * - **Architecture:** Leverages centralized SVG constants from the `@aazucena/design-system`.
 */
const meta = {
  title: 'Components/Identity/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The primary brand mark for the project. Features multiple visual variants, size presets, and interactive hover states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['main', 'alt', 'white', 'cyber'],
      description: 'The visual theme and color palette',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl'],
      description: 'Standard size presets',
      table: { category: 'Appearance' },
    },
    logoType: {
      control: 'radio',
      options: ['main', 'alt'],
      description: 'The SVG path variation',
      table: { category: 'Content' },
    },
    hover: {
      control: 'boolean',
      description: 'Enable scale and rotation on hover',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation using the primary brand color.
 */
export const Basic: Story = {
  args: {
    variant: 'main',
    size: 'default',
    hover: true,
  },
};

/**
 * High-performance cyber variant with neon glow and specific technical tint.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    size: 'xl',
  },
  render: (args) => (
    <div className="p-12 bg-black rounded-3xl border border-cyan-500/10 flex justify-center">
      <Logo {...args} />
    </div>
  ),
};

/**
 * Demonstrates the range of available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="text-center space-y-2">
        <Logo size="xs" />
        <p className="text-[10px] font-mono opacity-40">XS</p>
      </div>
      <div className="text-center space-y-2">
        <Logo size="sm" />
        <p className="text-[10px] font-mono opacity-40">SM</p>
      </div>
      <div className="text-center space-y-2">
        <Logo size="default" />
        <p className="text-[10px] font-mono opacity-40">DEFAULT</p>
      </div>
      <div className="text-center space-y-2">
        <Logo size="lg" />
        <p className="text-[10px] font-mono opacity-40">LG</p>
      </div>
      <div className="text-center space-y-2">
        <Logo size="xl" />
        <p className="text-[10px] font-mono opacity-40">XL</p>
      </div>
      <div className="text-center space-y-2">
        <Logo size="2xl" />
        <p className="text-[10px] font-mono opacity-40">2XL</p>
      </div>
    </div>
  ),
};

/**
 * Alternative logo mark variation.
 */
export const AltMark: Story = {
  args: {
    logoType: 'alt',
    size: 'xl',
    variant: 'main',
  },
};

/**
 * White variant for placement over dark or high-contrast backgrounds.
 */
export const OnDark: Story = {
  args: {
    variant: 'white',
    size: 'xl',
  },
  render: (args) => (
    <div className="p-12 bg-zinc-950 rounded-3xl border border-white/5 flex justify-center">
      <Logo {...args} />
    </div>
  ),
};
