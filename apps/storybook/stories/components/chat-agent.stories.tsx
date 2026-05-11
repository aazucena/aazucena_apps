import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatAgent } from '@aazucena/ui';

const meta: Meta<typeof ChatAgent> = {
  title: 'Components/Chat/ChatAgent',
  component: ChatAgent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the AI agent.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    avatarSrc: {
      control: 'text',
      description: "URL for the agent's avatar image.",
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    status: {
      control: 'select',
      options: ['idle', 'active', 'thinking', 'online', 'offline'],
      description: 'Current status of the agent.',
      table: {
        category: 'State',
        type: { summary: "'idle' | 'active' | 'thinking' | 'online' | 'offline'" },
      },
    },
    role: {
      control: 'text',
      description: 'The role or function of the agent.',
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
type Story = StoryObj<typeof ChatAgent>;

export const Default: Story = {
  args: {
    name: 'Assistant Bot',
    status: 'online',
    role: 'General Purpose AI',
  },
};

export const ThinkingAgent: Story = {
  args: {
    name: 'Reasoning Engine',
    status: 'thinking',
    role: 'Cognitive Processor',
    avatarSrc: 'https://cdn-icons-png.flaticon.com/512/10008/10008064.png',
  },
};

export const OfflineAgent: Story = {
  args: {
    name: 'Data Fetcher',
    status: 'offline',
    role: 'Information Retriever',
  },
};

export const CyberVariant: Story = {
  args: {
    name: 'Cybernetic Sentinel',
    status: 'active',
    role: 'Threat Analysis Unit',
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    name: 'Atmospheric Mapper',
    status: 'idle',
    role: 'Environmental Monitor',
    variant: 'glass',
  },
};

export const CustomAvatar: Story = {
  args: {
    name: 'Custom AI',
    status: 'active',
    avatarSrc: 'https://avatar.iran.liara.run/public/boy', // Example custom avatar
    role: 'Personalized Helper',
  },
};
