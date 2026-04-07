import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HoldToConfirm } from '@aazucena/ui';
import { toast, Toaster } from '@aazucena/ui'; // Assuming toast and Toaster are available

const meta: Meta<typeof HoldToConfirm> = {
  title: 'Components/Feedback/HoldToConfirm',
  component: HoldToConfirm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onConfirm: {
      action: 'confirmed',
      description: 'Callback function triggered after holding for the specified duration.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds the button must be held to trigger confirmation.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '2000' },
      },
    },
    text: {
      control: 'text',
      description: 'Text displayed on the button when not holding.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Hold to Confirm' },
      },
    },
    confirmText: {
      control: 'text',
      description: 'Text displayed on the button while holding.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Releasing...' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the button is disabled and cannot be held.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'glass', 'cyber'],
      description: 'Visual variant of the button.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'destructive' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoldToConfirm>;

export const Default: Story = {
  args: {
    onConfirm: () => toast.success('Action Confirmed!'),
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export const DestructiveAction: Story = {
  args: {
    text: 'Hold to Delete',
    confirmText: 'Deleting...',
    duration: 3000,
    variant: 'destructive',
    onConfirm: () => toast.error('Item Deleted!'),
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export const CyberVariant: Story = {
  args: {
    text: 'ACTIVATE_PROTOCOL',
    confirmText: 'INITIATING_SEQUENCE...',
    duration: 1500,
    variant: 'cyber',
    onConfirm: () =>
      toast.info('Protocol Activated!', { style: { background: 'black', color: '#06b6d4' } }),
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    text: 'Hold for Transparency',
    confirmText: 'Revealing Data...',
    duration: 2500,
    variant: 'glass',
    onConfirm: () =>
      toast.info('Data Revealed!', {
        style: { background: 'rgba(255,255,255,0.1)', color: 'white' },
      }),
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export const QuickConfirm: Story = {
  args: {
    text: 'Quick Confirm',
    confirmText: 'Done!',
    duration: 500,
    onConfirm: () => toast.success('Quick Action Complete!'),
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    text: 'Cannot Confirm',
    disabled: true,
  },
};
