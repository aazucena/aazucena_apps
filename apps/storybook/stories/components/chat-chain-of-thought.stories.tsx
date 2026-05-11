import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatChainOfThought } from '@aazucena/ui';
import type { ChainOfThoughtStep } from '@aazucena/ui';

const meta: Meta<typeof ChatChainOfThought> = {
  title: 'Components/Chat/ChatChainOfThought',
  component: ChatChainOfThought,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    chain: {
      control: 'object',
      description:
        'An array of thought steps, each with a title, description, and optional expanded state.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when the chain of thought is empty.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No chain of thought available.' },
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
type Story = StoryObj<typeof ChatChainOfThought>;

const defaultChain: ChainOfThoughtStep[] = [
  {
    id: '1',
    title: 'Deconstruct User Query',
    description:
      "Break down the user's input into key entities, intents, and constraints to understand the core request.",
    isExpanded: true,
  },
  {
    id: '2',
    title: 'Formulate Search Strategy',
    description:
      'Determine optimal keywords, relevant data sources (internal knowledge base, external APIs), and query parameters for information retrieval.',
  },
  {
    id: '3',
    title: 'Execute Information Retrieval',
    description: 'Perform parallel queries across identified sources and aggregate raw results.',
  },
  {
    id: '4',
    title: 'Synthesize and Summarize',
    description:
      "Process retrieved information, identify salient points, resolve contradictions, and synthesize into a concise summary relevant to the user's original query.",
  },
  {
    id: '5',
    title: 'Formulate Response',
    description:
      "Construct a natural language response incorporating the synthesized information, addressing all aspects of the user's query, and maintaining a helpful tone.",
  },
];

export const Default: Story = {
  args: {
    chain: defaultChain,
  },
};

export const WithAllStepsExpanded: Story = {
  args: {
    chain: defaultChain.map((step) => ({ ...step, isExpanded: true })),
  },
};

export const CyberVariant: Story = {
  args: {
    chain: defaultChain.slice(0, 3), // Show a shorter chain
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    chain: defaultChain.slice(2), // Show later steps
    variant: 'glass',
  },
};

export const EmptyChain: Story = {
  args: {
    chain: [],
    emptyMessage: 'AI agent is awaiting instructions.',
  },
};

export const SingleStep: Story = {
  args: {
    chain: [
      {
        id: '1',
        title: 'Initial Assessment',
        description:
          'The agent is performing a preliminary assessment of the incoming data stream to identify potential anomalies or critical alerts.',
      },
    ],
  },
};
