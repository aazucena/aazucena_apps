import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatSuggestion } from '@aazucena/ui';

const meta: Meta<typeof ChatSuggestion> = {
  title: 'Components/Chat/ChatSuggestion',
  component: ChatSuggestion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    suggestions: {
      control: 'object',
      description: 'An array of suggestion strings to display.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    onSelectSuggestion: {
      action: 'suggestionSelected',
      description: 'Callback function when a suggestion is clicked.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant for the suggestion buttons.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size of the suggestion text and buttons.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'sm' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatSuggestion>;

export const Default: Story = {
  args: {
    suggestions: ['Tell me more', 'What is this?', 'How does it work?'],
  },
};

export const WithMoreSuggestions: Story = {
  args: {
    suggestions: [
      'Explain the concept',
      'Give me an example',
      'Show me related topics',
      'Summarize this document',
      'What are the next steps?',
    ],
  },
};

export const CyberVariant: Story = {
  args: {
    suggestions: ['Yes', 'No', 'Maybe'],
    variant: 'cyber',
    size: 'sm',
  },
};

export const GlassVariant: Story = {
  args: {
    suggestions: ['Accept', 'Decline'],
    variant: 'glass',
    size: 'lg',
  },
};

export const EmptySuggestions: Story = {
  args: {
    suggestions: [],
    children: 'No suggestions available.',
  },
};
