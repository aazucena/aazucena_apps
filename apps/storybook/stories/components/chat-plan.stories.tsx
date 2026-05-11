import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatPlan, type PlanStep } from '@aazucena/ui';

const meta: Meta<typeof ChatPlan> = {
  title: 'Components/Chat/ChatPlan',
  component: ChatPlan,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    plan: {
      control: 'object',
      description: 'An array of plan steps, each with a description, status, and optional details.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when the plan is empty.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No plan defined.' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the chat plan container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatPlan>;

const defaultPlan: PlanStep[] = [
  { id: '1', description: "Understand the user's query", status: 'completed' },
  {
    id: '2',
    description: 'Search relevant documentation',
    status: 'active',
    details: 'Searching across 5 data sources.',
  },
  { id: '3', description: 'Synthesize findings', status: 'pending' },
  { id: '4', description: 'Formulate a comprehensive response', status: 'pending' },
];

export const Default: Story = {
  args: {
    plan: defaultPlan,
  },
};

export const EmptyPlan: Story = {
  args: {
    plan: [],
    emptyMessage: 'AI agent is awaiting instructions.',
  },
};

export const PlanWithAllStatuses: Story = {
  args: {
    plan: [
      { id: 'a', description: 'Initialize environment', status: 'completed' },
      {
        id: 'b',
        description: 'Fetch latest data',
        status: 'active',
        details: 'Connecting to external API...',
      },
      { id: 'c', description: 'Process data for analysis', status: 'pending' },
      {
        id: 'd',
        description: 'Generate visual report',
        status: 'failed',
        details: 'Data validation error: missing fields.',
      },
      { id: 'e', description: 'Notify stakeholders', status: 'pending' },
    ],
  },
};

export const CyberVariant: Story = {
  args: {
    plan: defaultPlan,
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    plan: [
      { id: 'x', description: 'Identify core problem', status: 'completed' },
      { id: 'y', description: 'Brainstorm solutions', status: 'active' },
      { id: 'z', description: 'Evaluate options', status: 'pending' },
    ],
    variant: 'glass',
  },
};

export const LongDetails: Story = {
  args: {
    plan: [
      {
        id: '1',
        description: 'Perform deep dive analysis on market trends',
        status: 'active',
        details:
          'This step involves collecting data from various financial news sources, social media sentiments, and historical market data to identify emerging patterns and potential future shifts. It is a crucial phase requiring extensive data processing and machine learning models.',
      },
      { id: '2', description: 'Prepare executive summary', status: 'pending' },
    ],
  },
};
