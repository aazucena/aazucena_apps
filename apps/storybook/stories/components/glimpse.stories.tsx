import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Glimpse, type GlimpseData } from '@aazucena/ui';

const meta: Meta<typeof Glimpse> = {
  title: 'Components/Content/Glimpse',
  component: Glimpse,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'The URL to preview.',
      table: { category: 'Content' },
    },
    data: {
      control: 'object',
      description: 'SEO/OpenGraph metadata for the link preview.',
      table: { category: 'Content' },
    },
    isLoading: {
      control: 'boolean',
      description: 'Show a skeleton loader while fetching metadata.',
      table: { category: 'State' },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Glimpse>;

const mockMetadata: GlimpseData = {
  title: 'Aldrin Azucena — Engineering High-Fidelity Interfaces',
  description:
    'A portfolio of advanced UI components, technical architecture, and interactive engineering experiences built with Astro, React, and GSAP.',
  image:
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
  siteName: 'AAZUCENA',
  favicon: 'https://aazucena.me/favicon.ico',
};

export const Default: Story = {
  args: {
    children: <span>Project_Sentinel</span>,
    url: 'https://aazucena.me/projects/sentinel',
    data: mockMetadata,
  },
};

export const CyberVariant: Story = {
  args: {
    children: <span className="text-cyan-400 font-mono">LINK://CORE_SYNC</span>,
    url: 'https://github.com/aazucena/core',
    variant: 'cyber',
    data: {
      title: 'aazucena/core-engine',
      description:
        'Standardized utility library for distributed telemetry ingestion and high-volume event streams.',
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      siteName: 'GITHUB',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-20 rounded-3xl">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    children: <span className="text-white">Troposphere Protocol</span>,
    url: 'https://aazucena.me/layers/troposphere',
    variant: 'glass',
    data: {
      title: 'Atmospheric Data Layers',
      description:
        'An exploration of the troposphere through interactive 3D visualizations and real-time telemetry.',
      image:
        'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2070&auto=format&fit=crop',
      siteName: 'AAZUCENA_LABS',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-20 rounded-[3rem]">
        <Story />
      </div>
    ),
  ],
};

export const LoadingState: Story = {
  args: {
    children: <span>Fetching dynamic link...</span>,
    url: 'https://example.com',
    isLoading: true,
  },
};

export const NoImage: Story = {
  args: {
    children: <span>Documentation Index</span>,
    url: 'https://docs.aazucena.me',
    data: {
      title: 'Technical Documentation',
      description:
        'Comprehensive guides on integrating the design system and using the API clients.',
      siteName: 'AAZUCENA_DOCS',
    },
  },
};
