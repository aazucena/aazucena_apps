import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatQueue, type QueueItem } from '@aazucena/ui';

const meta: Meta<typeof ChatQueue> = {
  title: 'Components/Chat/ChatQueue',
  component: ChatQueue,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    queue: {
      control: 'object',
      description: 'An array of queue items to display.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when the queue is empty.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Queue is empty.' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the chat queue container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatQueue>;

const generateQueue = (count: number): QueueItem[] => {
  const statuses: QueueItem['status'][] = ['pending', 'processing', 'completed', 'failed'];
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    content: `Task ${i + 1}: Process user request for data analytics.`,
    status: statuses[i % statuses.length]!,
    timestamp: new Date(),
  }));
};

export const Default: Story = {
  args: {
    queue: generateQueue(5),
  },
};

export const EmptyQueue: Story = {
  args: {
    queue: [],
    emptyMessage: 'No messages awaiting processing.',
  },
};

export const MixedStatuses: Story = {
  args: {
    queue: [
      {
        id: 't1',
        content: 'User query about product features.',
        status: 'pending',
        timestamp: new Date(),
      },
      {
        id: 't2',
        content: 'Generate report for Q3 sales data.',
        status: 'processing',
        timestamp: new Date(),
      },
      {
        id: 't3',
        content: 'Send personalized email campaign.',
        status: 'completed',
        timestamp: new Date(),
      },
      { id: 't4', content: 'Update database schema.', status: 'failed', timestamp: new Date() },
      {
        id: 't5',
        content: 'Fetch latest news articles.',
        status: 'pending',
        timestamp: new Date(),
      },
    ],
  },
};

export const CyberVariant: Story = {
  args: {
    queue: generateQueue(3),
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    queue: generateQueue(4),
    variant: 'glass',
  },
};

export const LongContent: Story = {
  args: {
    queue: [
      {
        id: 't1',
        content:
          'This is a very long task description that should ideally be truncated or handled gracefully within the UI component to prevent overflow issues.',
        status: 'processing',
        timestamp: new Date(),
      },
      {
        id: 't2',
        content: 'Another long item with pending status.',
        status: 'pending',
        timestamp: new Date(),
      },
    ],
  },
};
