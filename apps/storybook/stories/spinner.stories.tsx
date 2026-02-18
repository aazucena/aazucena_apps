import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic primitive for visualizing indeterminate loading states.
 * - **Accessibility:** Built with standard `role="status"` and `aria-label="Loading"` for proper assistive tech announcements.
 * - **Animation:** Features a continuous `animate-spin` CSS rotation.
 * - **Design:** Optimized for high-density UI contexts (Buttons, Inputs, Status Bars) using standard size utilities.
 */
const meta = {
  title: 'Components/Primitives/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A standard indeterminate loading indicator. Uses a rotating circle-notch icon.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation at the default size.
 */
export const Basic: Story = {
  args: {
    className: "size-6",
  },
};

/**
 * Large format variant for centered page-level loading states.
 */
export const Large: Story = {
  args: {
    className: "size-16 text-primary",
  },
};

/**
 * High-performance cyber variant with neon glow.
 */
export const Cyber: Story = {
  args: {
    className: "size-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
  },
  render: (args) => (
    <div className="p-12 bg-black rounded-3xl border border-cyan-500/10 flex justify-center">
      <Spinner {...args} />
    </div>
  )
};

/**
 * Comparison of the available size presets via utility classes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-12">
      <div className="text-center space-y-4">
        <Spinner className="size-4" />
        <p className="text-[10px] font-mono opacity-40">SM (16px)</p>
      </div>
      <div className="text-center space-y-4">
        <Spinner className="size-8" />
        <p className="text-[10px] font-mono opacity-40">DEFAULT (32px)</p>
      </div>
      <div className="text-center space-y-4">
        <Spinner className="size-12" />
        <p className="text-[10px] font-mono opacity-40">LG (48px)</p>
      </div>
      <div className="text-center space-y-4">
        <Spinner className="size-20" />
        <p className="text-[10px] font-mono opacity-40">XL (80px)</p>
      </div>
    </div>
  ),
};
