import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Timer } from '@aazucena/ui';
import { toast, Toaster } from '@aazucena/ui';

const meta: Meta<typeof Timer> = {
  title: 'Components/Utilities/Timer',
  component: Timer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialTime: {
      control: { type: 'number', min: 0, step: 1000 },
      description: 'Starting time in milliseconds.',
      table: { category: 'Data', type: { summary: 'number' }, defaultValue: { summary: '60000' } },
    },
    onComplete: {
      action: 'completed',
      description: 'Triggered when the countdown reaches zero.',
      table: { category: 'Events', type: { summary: '() => void' } },
    },
    autoStart: {
      control: 'boolean',
      description: 'Start counting down immediately on mount.',
      table: { category: 'Behavior' },
    },
    showControls: {
      control: 'boolean',
      description: 'Toggle play/pause/reset buttons.',
      table: { category: 'Appearance' },
    },
    showAdjusters: {
      control: 'boolean',
      description: 'Toggle time increment/decrement buttons.',
      table: { category: 'Appearance' },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant.',
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timer>;

export const Default: Story = {
  args: {
    initialTime: 60000,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Timer {...args} />
    </div>
  ),
};

export const CyberMode: Story = {
  args: {
    variant: 'cyber',
    initialTime: 10000,
    onComplete: () => alert('SYSTEM_LOCKDOWN_INITIATED'),
  },
  render: (args) => (
    <div className="bg-black p-12 rounded-2xl w-[500px]">
      <Timer {...args} />
    </div>
  ),
};

export const GlassVariant: Story = {
  args: {
    variant: 'glass',
    initialTime: 300000, // 5 minutes
  },
  render: (args) => (
    <div className="bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-12 rounded-3xl w-[500px]">
      <Timer {...args} />
    </div>
  ),
};

export const interactiveTest: Story = {
  args: {
    initialTime: 5000,
    showAdjusters: true,
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-4 items-center w-[400px]">
        <Toaster />
        <Timer {...args} onComplete={() => toast.success('Countdown Finished!')} />
        <p className="text-xs text-muted-foreground text-center">
          Try adjusting the time using the buttons above, then press play.
        </p>
      </div>
    );
  },
};

export const MinimalNoAdjusters: Story = {
  args: {
    initialTime: 15000,
    showAdjusters: false,
  },
  render: (args) => (
    <div className="w-[300px]">
      <Timer {...args} />
    </div>
  ),
};
