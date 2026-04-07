import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatContext, type ContextItem } from '@aazucena/ui';
import { Robot, FileText, User } from '@aazucena/icons';

const meta: Meta<typeof ChatContext> = {
  title: 'Components/Chat/ChatContext',
  component: ChatContext,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    contextItems: {
      control: 'object',
      description: 'An array of context items, each with id, label, value, and optional icon.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the context section.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Current Context' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no context items are present.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No active context.' },
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
type Story = StoryObj<typeof ChatContext>;

const sampleContextItems: ContextItem[] = [
  { id: 'persona', label: 'Active Persona', value: 'Technical Assistant', icon: User },
  { id: 'document', label: 'Referenced Document', value: 'Project Roadmap V2', icon: FileText },
  { id: 'model', label: 'AI Model', value: 'GPT-4o', icon: Robot },
  { id: 'temperature', label: 'Temperature', value: 0.7 },
  { id: 'maxTokens', label: 'Max Tokens', value: 1024 },
];

export const Default: Story = {
  args: {
    contextItems: sampleContextItems,
  },
};

export const EmptyState: Story = {
  args: {
    contextItems: [],
    emptyMessage: 'No active context variables are set.',
  },
};

export const CyberVariant: Story = {
  args: {
    contextItems: sampleContextItems.slice(0, 3),
    variant: 'cyber',
    title: 'SYSTEM_CONTEXT',
  },
};

export const GlassVariant: Story = {
  args: {
    contextItems: sampleContextItems.slice(2, 5),
    variant: 'glass',
    title: 'Operational Parameters',
  },
};

export const CustomIconsAndValues: Story = {
  args: {
    contextItems: [
      {
        id: 'status',
        label: 'System Status',
        value: <span className="text-green-500">Online</span>,
        icon: Robot,
      },
      { id: 'uptime', label: 'Uptime', value: '3d 12h 45m', icon: FileText },
    ],
  },
};
