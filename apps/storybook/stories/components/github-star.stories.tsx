import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { GithubStar } from '@aazucena/ui';

const meta: Meta<typeof GithubStar> = {
  title: 'Components/Utilities/GithubStar',
  component: GithubStar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    owner: {
      control: 'text',
      description: 'The GitHub repository owner (e.g., "vercel").',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    repo: {
      control: 'text',
      description: 'The GitHub repository name (e.g., "next.js").',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    showCount: {
      control: 'boolean',
      description: 'Whether to display the star count bubble.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showBranding: {
      control: 'boolean',
      description: 'Whether to display the GitHub logo.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the component.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Overall size of the button.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GithubStar>;

export const Default: Story = {
  args: {
    owner: 'aazucena',
    repo: 'crunch_time',
  },
};

export const LargeCyber: Story = {
  args: {
    owner: 'vercel',
    repo: 'next.js',
    size: 'lg',
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    owner: 'shadcn',
    repo: 'ui',
    variant: 'glass',
    size: 'default',
  },
};

export const NoCount: Story = {
  args: {
    owner: 'vitejs',
    repo: 'vite',
    showCount: false,
  },
};

export const NoBranding: Story = {
  args: {
    owner: 'facebook',
    repo: 'react',
    showBranding: false,
  },
};

export const ErrorState: Story = {
  args: {
    owner: 'non-existent-owner',
    repo: 'unknown-repo',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simulates an error state (e.g., repository not found or API rate limited). Displays a friendly "Unavailable" message.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    owner: 'google',
    repo: 'gemini-cli',
    size: 'sm',
  },
};
