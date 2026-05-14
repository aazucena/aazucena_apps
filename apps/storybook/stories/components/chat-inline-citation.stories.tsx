import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatInlineCitation, type CitationSource } from '@aazucena/ui';

const meta: Meta<typeof ChatInlineCitation> = {
  title: 'Components/Chat/ChatInlineCitation',
  component: ChatInlineCitation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    citationKey: {
      control: 'text',
      description: 'The key or number for the citation (e.g., "1", "A").',
      table: {
        category: 'Content',
        type: { summary: 'string | number' },
        defaultValue: { summary: '1' },
      },
    },
    source: {
      control: 'object',
      description: 'The source object containing id, title, optional URL, and snippet.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the citation button.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size of the citation button.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'sm' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatInlineCitation>;

const defaultSource: CitationSource = {
  id: 'doc1',
  title: 'How LLMs Work: A Comprehensive Guide',
  url: 'https://example.com/llm-guide',
  snippet: 'Large Language Models (LLMs) are a type of artificial intelligence program...',
};

export const Default: Story = {
  args: {
    citationKey: 1,
    source: defaultSource,
  },
};

export const WithLongSnippet: Story = {
  args: {
    citationKey: 'B',
    source: {
      id: 'doc2',
      title: 'The History and Future of AI',
      url: 'https://wikipedia.org/wiki/History_of_artificial_intelligence_and_future_plans',
      snippet:
        'Artificial intelligence (AI) has a long history, dating back to ancient philosophical attempts to mechanize human thought. The field has experienced several booms and busts, with current research focusing on deep learning, neural networks, and generative models that are capable of performing complex tasks previously thought to be exclusive to human intellect. The future of AI is expected to revolutionize various industries, from healthcare to finance, by automating processes and enabling new discoveries. However, ethical considerations and potential societal impacts remain a significant area of discussion and research. This document explores these themes in detail.',
    },
    variant: 'glass',
  },
};

export const NoURL: Story = {
  args: {
    citationKey: 3,
    source: {
      id: 'doc3',
      title: 'Internal Research Paper: Project X',
      snippet: 'Key findings indicate a significant correlation between factor A and factor B...',
    },
    variant: 'cyber',
  },
};

export const MinimalSource: Story = {
  args: {
    citationKey: 4,
    source: {
      id: 'doc4',
      title: 'Brief Note',
    },
    size: 'sm',
  },
};

export const LargeCitation: Story = {
  args: {
    citationKey: 5,
    source: defaultSource,
    size: 'lg',
  },
};
