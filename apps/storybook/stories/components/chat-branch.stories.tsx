import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatBranch, type BranchOption } from '@aazucena/ui';

const meta: Meta<typeof ChatBranch> = {
  title: 'Components/Chat/ChatBranch',
  component: ChatBranch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    question: {
      control: 'text',
      description: 'The question or decision point for the branch.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Which path should the agent take?' },
      },
    },
    options: {
      control: 'object',
      description: 'An array of branch options, each with an id, label, and optional description.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    selectedOptionId: {
      control: 'text',
      description: 'The ID of the option that was selected or taken.',
      table: {
        category: 'State',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no branching options are available.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No branching options available.' },
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
type Story = StoryObj<typeof ChatBranch>;

const defaultOptions: BranchOption[] = [
  {
    id: 'search_db',
    label: 'Search Internal Database',
    description: 'Query the knowledge base for relevant documents.',
  },
  {
    id: 'call_api',
    label: 'Call External API',
    description: 'Fetch real-time data from a third-party service.',
  },
  {
    id: 'ask_user',
    label: 'Ask User for Clarification',
    description: 'Request more information from the user.',
  },
];

export const Default: Story = {
  args: {
    question: 'How should I proceed with this query?',
    options: defaultOptions,
    selectedOptionId: 'search_db',
  },
};

export const NoSelection: Story = {
  args: {
    question: 'Possible next steps:',
    options: defaultOptions,
  },
};

export const CyberVariant: Story = {
  args: {
    question: 'Choose your action:',
    options: [
      {
        id: 'attack',
        label: 'Launch Cyber Attack',
        description: 'Initiate protocol "Red Dragon".',
      },
      { id: 'defend', label: 'Activate Shields', description: 'Deploy defensive subroutines.' },
    ],
    selectedOptionId: 'defend',
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    question: 'Decision point:',
    options: [
      { id: 'path_a', label: 'Follow Path A', description: 'A more conservative approach.' },
      {
        id: 'path_b',
        label: 'Explore Path B',
        description: 'A riskier but potentially higher reward option.',
      },
    ],
    selectedOptionId: 'path_a',
    variant: 'glass',
  },
};

export const EmptyBranch: Story = {
  args: {
    question: 'No decisions to make.',
    options: [],
  },
};

export const ShortOptions: Story = {
  args: {
    question: 'Binary choice:',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ],
    selectedOptionId: 'yes',
  },
};
