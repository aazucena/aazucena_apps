import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatSources, type ChatSource } from '@aazucena/ui';

const meta: Meta<typeof ChatSources> = {
  title: 'Components/Chat/ChatSources',
  component: ChatSources,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    sources: {
      control: 'object',
      description:
        'An array of source objects, each with id, title, optional url, snippet, and relevanceScore.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the sources section.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Information Sources' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no sources are present.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No sources provided.' },
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
type Story = StoryObj<typeof ChatSources>;

const sampleSources: ChatSource[] = [
  {
    id: 'doc1',
    title: 'Research Paper on Quantum AI',
    url: 'https://example.com/quantum-ai.pdf',
    snippet:
      'This paper explores the theoretical underpinnings and practical applications of quantum artificial intelligence...',
    relevanceScore: 92,
  },
  {
    id: 'web1',
    title: 'Blog Post: Future of LLMs',
    url: 'https://blog.example.com/future-llms',
    snippet:
      'A discussion on the evolving landscape of Large Language Models and their impact on various industries...',
    relevanceScore: 85,
  },
  {
    id: 'kb1',
    title: 'Internal Knowledge Base Article: Agentic Workflows',
    snippet:
      'Guide to designing and implementing multi-agent systems for complex problem-solving...',
    relevanceScore: 78,
  },
  {
    id: 'news1',
    title: 'Tech News: Breakthrough in Neural Networks',
    url: 'https://news.example.com/nn-breakthrough',
    relevanceScore: 60,
  },
];

export const Default: Story = {
  args: {
    sources: sampleSources,
  },
};

export const EmptyState: Story = {
  args: {
    sources: [],
    emptyMessage: 'No external information sources were referenced for this response.',
  },
};

export const CyberVariant: Story = {
  args: {
    sources: sampleSources.slice(0, 2),
    variant: 'cyber',
    title: 'DATA_REFERENCES',
  },
};

export const GlassVariant: Story = {
  args: {
    sources: sampleSources.slice(1, 3),
    variant: 'glass',
    title: 'Contextual Links',
  },
};

export const NoSnippets: Story = {
  args: {
    sources: [
      {
        id: 'docA',
        title: 'Project Alpha Overview',
        url: 'https://internal.example.com/alpha',
        relevanceScore: 95,
      },
      {
        id: 'docB',
        title: 'Meeting Minutes Feb 2024',
        relevanceScore: 70,
      },
    ],
  },
};
