import type { Meta, StoryObj } from '@storybook/react-vite';
import { Watermark } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout primitive for high-impact background branding.
 * - **UX:** Features `pointer-events-none` and `select-none` to ensure zero interference with foreground content.
 * - **Accessibility:** Built with `aria-hidden="true"` to prevent screen reader noise.
 * - **Aesthetics:** Uses ultra-low opacity (`0.02` to `0.05`) and high-weight `font-black` for subtle architectural depth.
 * - **Responsiveness:** Scales dynamically across breakpoints to maintain "massive" feel.
 */
const meta = {
  title: 'Components/Layout/Watermark',
  component: Watermark,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A background typography component used for large-scale branding. Automatically centers itself and handles responsive scaling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'huge'],
      description: 'The massive font size preset',
      table: { category: 'Appearance' }
    },
    text: {
      control: 'text',
      description: 'The background string to display',
      table: { category: 'Content' }
    }
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for section backgrounds.
 */
export const Basic: Story = {
  args: {
    text: 'AAZUCENA',
    size: 'lg',
  },
  render: (args) => (
    <div className="relative h-[500px] w-full bg-background overflow-hidden border rounded-[3rem] m-10">
      <Watermark {...args} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-20 text-center gap-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase">Foreground_Content</h1>
        <p className="max-w-md opacity-60">The watermark sits at z-index 0, providing a subtle architectural layer behind your primary components.</p>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the massive "huge" size preset for landing page heroes.
 */
export const HugeBranding: Story = {
  args: {
    text: 'ENGINEERING',
    size: 'huge',
  },
  render: (args) => (
    <div className="relative h-screen w-full bg-zinc-950 overflow-hidden text-white">
      <Watermark {...args} className="dark:opacity-[0.03]" />
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center p-12 glass border-white/10 rounded-[3rem]">
          <h2 className="text-3xl font-black tracking-widest uppercase">Center_Node</h2>
        </div>
      </div>
    </div>
  ),
};

/**
 * Showcase of different size presets in smaller containers.
 */
export const SizePresets: Story = {
  render: () => (
    <div className="space-y-12 p-20">
      <div className="relative h-40 w-full border border-dashed rounded-2xl overflow-hidden bg-muted/5">
        <Watermark text="SMALL" size="sm" />
        <div className="relative z-10 p-4 text-[10px] font-bold opacity-40 uppercase">Size: sm</div>
      </div>
      <div className="relative h-40 w-full border border-dashed rounded-2xl overflow-hidden bg-muted/5">
        <Watermark text="MEDIUM" size="md" />
        <div className="relative z-10 p-4 text-[10px] font-bold opacity-40 uppercase">Size: md</div>
      </div>
      <div className="relative h-40 w-full border border-dashed rounded-2xl overflow-hidden bg-muted/5">
        <Watermark text="LARGE" size="lg" />
        <div className="relative z-10 p-4 text-[10px] font-bold opacity-40 uppercase">Size: lg</div>
      </div>
    </div>
  ),
};
