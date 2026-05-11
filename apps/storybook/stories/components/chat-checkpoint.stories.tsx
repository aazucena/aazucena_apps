import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatCheckpoint } from '@aazucena/ui';

const meta: Meta<typeof ChatCheckpoint> = {
  title: 'Components/Chat/ChatCheckpoint',
  component: ChatCheckpoint,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label or description for the checkpoint.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    status: {
      control: 'select',
      options: ['success', 'failure', 'pending', 'current'],
      description: 'The status of the checkpoint.',
      table: {
        category: 'State',
        type: { summary: "'success' | 'failure' | 'pending' | 'current'" },
      },
    },
    timestamp: {
      control: 'text',
      description: 'Optional timestamp for the checkpoint.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatCheckpoint>;

export const Success: Story = {
  args: {
    label: 'Data validation complete',
    status: 'success',
    timestamp: '14:30:00',
  },
};

export const Failure: Story = {
  args: {
    label: 'API connection failed',
    status: 'failure',
    timestamp: '2024-03-01 10:15',
  },
};

export const Pending: Story = {
  args: {
    label: 'Awaiting user input',
    status: 'pending',
  },
};

export const Current: Story = {
  args: {
    label: 'Processing request',
    status: 'current',
  },
};

export const CyberVariant: Story = {
  args: {
    label: 'NODE_SYNC_COMPLETE',
    status: 'success',
    variant: 'cyber',
    timestamp: '11:23:45',
  },
};

export const GlassVariant: Story = {
  args: {
    label: 'User authentication in progress',
    status: 'current',
    variant: 'glass',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Initiating complex multi-agent reasoning sequence for task optimization.',
    status: 'current',
  },
};
