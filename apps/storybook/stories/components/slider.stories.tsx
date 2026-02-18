import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@aazucena/ui';
import { Badge, Label } from '@aazucena/ui';
import { Zap, Activity, VolumeLow as Volume, Database } from '@aazucena/icons';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based accessible range primitive for numeric selection.
 * - **Accessibility:** Built-in keyboard support (Arrow keys, Home/End, PageUp/Down) and standard ARIA roles.
 * - **UX:** Features `touch-none` and `select-none` optimizations for fluid mobile and desktop interactions.
 * - **Design:** Supports high-fidelity `cyber` variant with neon glowing tracks and precise thumb shadows.
 */
const meta = {
  title: 'Components/Primitives/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An input where the user selects a value from within a given range.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual theme of the track and thumb',
      table: { category: 'Appearance' }
    },
    defaultValue: {
      control: 'object',
      description: 'The initial value(s) of the slider',
      table: { category: 'State' }
    },
    max: {
      control: 'number',
      description: 'Maximum value',
      table: { category: 'Behavior' }
    },
    step: {
      control: 'number',
      description: 'The stepping interval',
      table: { category: 'Behavior' }
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction',
      table: { category: 'State' }
    }
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a single value selection.
 */
export const Basic: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    variant: 'default',
  },
  render: (args) => (
    <div className="w-80 space-y-6">
      <div className="flex justify-between items-center">
        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">System_Volume</Label>
        <Volume size={14} className="opacity-40" />
      </div>
      <Slider {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    defaultValue: [85],
    max: 100,
    step: 1,
  },
  render: (args) => {
    const [val, setVal] = useState(args.defaultValue?.[0] || 0);
    return (
      <div className="w-80 p-10 bg-black border border-cyan-500/10 rounded-2xl space-y-8">
        <div className="flex justify-between items-end font-mono">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-cyan-500 animate-pulse" />
            <span className="text-[10px] text-cyan-500 uppercase tracking-widest">Signal_Gain</span>
          </div>
          <span className="text-xl font-black text-cyan-400 leading-none">{val}%</span>
        </div>
        <Slider {...args} onValueChange={([v]) => setVal(v)} />
        <p className="text-[9px] font-mono text-cyan-500/20 uppercase text-center italic">Awaiting_Manual_Override</p>
      </div>
    );
  },
};

/**
 * Demonstrates the range selection mode using multiple thumbs.
 */
export const RangeSelection: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
  render: (args) => (
    <div className="w-80 space-y-6">
      <div className="flex justify-between items-center">
        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Buffer_Range</Label>
        <Badge variant="outline" size="xs">SECURE</Badge>
      </div>
      <Slider {...args} />
      <div className="flex justify-between text-[10px] font-mono opacity-20 uppercase">
        <span>0x00</span>
        <span>0xFF</span>
      </div>
    </div>
  ),
};

/**
 * Shows the visual feedback when interaction is restricted.
 */
export const Disabled: Story = {
  args: {
    defaultValue: [42],
    disabled: true,
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-80 opacity-50">
      <Slider {...args} />
    </div>
  ),
};
import { within, userEvent, expect } from '@storybook/test';

/**
 * Automated interaction test: focus slider, press ArrowRight to increment value.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="w-64 px-4">
      <Slider defaultValue={[25]} min={0} max={100} step={1} aria-label="Volume" />
    </div>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    slider.focus();
    await expect(slider).toHaveAttribute('aria-valuenow', '25');
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '26');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(slider).toHaveAttribute('aria-valuenow', '25');
  },
};
