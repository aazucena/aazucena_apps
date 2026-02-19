import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Loading primitive for building high-fidelity shimmer/pulse placeholders.
 * - **UX:** Features smooth `animate-pulse` behavior to signify active loading without layout shifts.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for high-fidelity background effects.
 * - **Responsiveness:** Highly flexible through Tailwind width/height utility classes.
 */
const meta = {
  title: 'Components/Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A placeholder component used to represent content that is currently loading.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the placeholder',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for profile or entity headers.
 */
export const ProfileHeader: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Skeleton {...args} className="size-16 rounded-full" />
      <div className="space-y-3">
        <Skeleton {...args} className="h-5 w-[200px] rounded-lg" />
        <Skeleton {...args} className="h-3 w-[150px] rounded-md opacity-60" />
      </div>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical context.
 */
export const CyberModule: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[450px] p-8 border border-cyan-500/10 bg-black rounded-[2rem] space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton {...args} className="h-4 w-32" />
        <Skeleton {...args} className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton {...args} className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton {...args} className="h-12 w-full rounded-xl" />
        <Skeleton {...args} className="h-12 w-full rounded-xl" />
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <div className="w-[350px] space-y-6">
        <Skeleton {...args} className="h-10 w-2/3 rounded-full border-white/10" />
        <div className="space-y-3">
          <Skeleton {...args} className="h-3 w-full rounded-md border-white/10" />
          <Skeleton {...args} className="h-3 w-full rounded-md border-white/10" />
          <Skeleton {...args} className="h-3 w-1/2 rounded-md border-white/10" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates a complex grid of card placeholders.
 */
export const DataGrid: Story = {
  render: () => (
    <div className="w-[800px] grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-6 border rounded-[2rem] bg-card space-y-4 shadow-sm">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2 opacity-60" />
          </div>
        </div>
      ))}
    </div>
  ),
};
