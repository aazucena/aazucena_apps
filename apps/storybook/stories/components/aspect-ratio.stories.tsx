import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI primitive for maintaining consistent container dimensions.
 * - **Responsiveness:** Ensure children fill the container (e.g., `object-cover` for images).
 * - **Accessibility:** Transparent wrapper; semantic weight relies on children.
 */
const meta = {
  title: 'Components/Primitives/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays content within a desired ratio. Commonly used for images, videos, and map embeds to prevent layout shifts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number', step: 0.1 },
      description: 'The desired aspect ratio (width / height)',
      table: {
        category: 'Layout',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard 16:9 ratio, ideal for cinematic video content.
 */
export const SixteenByNine: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[450px] overflow-hidden rounded-xl border border-border shadow-2xl">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2000&auto=format&fit=crop"
          alt="Engineering aesthetic"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <p className="text-white font-black uppercase tracking-widest text-xs">
            VIDEO_STREAM // 16:9
          </p>
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Classic 4:3 ratio, common for legacy media or specific UI modules.
 */
export const FourByThree: Story = {
  args: {
    ratio: 4 / 3,
  },
  render: (args) => (
    <div className="w-[300px] overflow-hidden rounded-lg border bg-muted/50">
      <AspectRatio {...args}>
        <div className="flex h-full items-center justify-center flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
            SIGNAL_LOST // 4:3
          </span>
        </div>
      </AspectRatio>
    </div>
  ),
};

/**
 * Square 1:1 ratio, perfect for profile pictures or icon grids.
 */
export const Square: Story = {
  args: {
    ratio: 1 / 1,
  },
  render: (args) => (
    <div className="w-[200px] overflow-hidden rounded-full border-4 border-primary/20">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop"
          alt="User Profile"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

/**
 * Demonstrates how the ratio can be adjusted dynamically.
 */
export const CinemaScope: Story = {
  args: {
    ratio: 21 / 9,
  },
  render: (args) => (
    <div className="w-[600px] border bg-black overflow-hidden group">
      <AspectRatio {...args}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[1px] w-0 bg-cyan-500 group-hover:w-full transition-all duration-700 opacity-50" />
        </div>
        <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-500/50">
          ULTRAWIDE_OUTPUT
        </div>
      </AspectRatio>
    </div>
  ),
};
