import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from '@aazucena/ui';
import { useState, useEffect } from 'react';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for visualizing task completion or quantity.
 * - **UX:** Features smooth CSS transitions for value changes to provide fluid feedback.
 * - **Accessibility:** Built with standard `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.
 * - **Variants:** Supports high-fidelity `glass`, `cyber`, and semantic `emerald`/`rose` themes.
 */
const meta = {
  title: 'Components/Primitives/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A bar showing the completion status of a task or the magnitude of a value.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The current progress value',
      table: { category: 'State' }
    },
    variant: {
      control: 'select',
      options: ['default', 'cyber', 'glass', 'branded'],
      description: 'Visual style of the track',
      table: { category: 'Appearance' }
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
      description: 'The height of the progress bar',
      table: { category: 'Appearance' }
    },
    indicatorVariant: {
      control: 'select',
      options: ['default', 'cyber', 'glass', 'gradient', 'emerald', 'rose'],
      description: 'Visual style of the fill indicator',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing mid-sequence progress.
 */
export const Basic: Story = {
  args: {
    value: 65,
    size: 'default',
    variant: 'default',
  },
  render: (args) => (
    <div className="w-80">
      <Progress {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and high-contrast track.
 */
export const CyberTerminal: Story = {
  args: {
    value: 85,
    variant: 'cyber',
    indicatorVariant: 'cyber',
  },
  render: (args) => (
    <div className="w-80 p-8 bg-black rounded-xl border border-white/5">
      <div className="flex justify-between mb-2 font-mono text-[10px] text-cyan-500 uppercase tracking-widest">
        <span>Signal_Sync</span>
        <span>{args.value}%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for overlays on complex backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    value: 42,
    variant: 'glass',
    indicatorVariant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 to-blue-800 rounded-[3rem]">
      <div className="w-80 space-y-2">
        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Refraction_Index</p>
        <Progress {...args} className="bg-white/10" />
      </div>
    </div>
  ),
};

/**
 * Showcase of different size presets for varying UI densities.
 */
export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] opacity-40 uppercase font-bold">Extra_Small (1px)</span>
        <Progress value={75} size="xs" />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] opacity-40 uppercase font-bold">Small (1.5px)</span>
        <Progress value={60} size="sm" />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] opacity-40 uppercase font-bold">Default (2px)</span>
        <Progress value={45} size="default" />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] opacity-40 uppercase font-bold">Large (3px)</span>
        <Progress value={30} size="lg" />
      </div>
    </div>
  ),
};

/**
 * Demonstrates semantic color coding for success or failure states.
 */
export const SemanticColors: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <Progress value={100} indicatorVariant="emerald" />
      <Progress value={12} indicatorVariant="rose" />
      <Progress value={85} indicatorVariant="gradient" />
    </div>
  ),
};

/**
 * Animated live progress demonstration.
 */
export const LiveSequence: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 500);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-80 space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black uppercase opacity-40">Ingestion_Active</span>
          <span className="font-mono text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} indicatorVariant="gradient" className="h-1.5" />
      </div>
    );
  }
};
