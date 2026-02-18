import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReadingProgress } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Global scroll-synced indicator for long-form content readability.
 * - **Animation:** Orchestrated with Framer Motion `useScroll` and `useSpring` for physics-based fluid movement.
 * - **UX:** Fixed to the viewport top with `origin-left` to ensure accurate percentage representation.
 * - **Variants:** Supports `glass` and high-fidelity `cyber` themes with integrated neon glow.
 * - **Accessibility:** Automatically hidden during print using `print:hidden`.
 */
const meta = {
  title: 'Components/Primitives/ReadingProgress',
  component: ReadingProgress,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A progress bar fixed to the top of the viewport that fills as the user scrolls down the page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the bar',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof ReadingProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation with a vibrant brand gradient. **Scroll the preview below.**
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="h-[200vh] w-full relative bg-muted/5">
      <ReadingProgress {...args} />
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="font-mono text-xs opacity-40 uppercase tracking-[0.4em]">↓ SCROLL_TO_FILL_BAR ↓</p>
        <div className="h-96 w-px bg-current/10" />
      </div>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="h-[200vh] w-full relative bg-black">
      <ReadingProgress {...args} />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-cyan-500 font-mono text-xl animate-pulse uppercase tracking-[0.3em]">
          // DATA_STREAM_INBOUND
        </h1>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over complex backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="h-[200vh] w-full relative bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800">
      <ReadingProgress {...args} className="h-2 border-b border-white/10" />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="p-12 glass border-white/10 rounded-[3rem] text-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Atmospheric_Reading</h2>
        </div>
      </div>
    </div>
  ),
};
