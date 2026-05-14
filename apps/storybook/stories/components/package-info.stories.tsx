import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { PackageInfo, type PackageMetadata } from '@aazucena/ui';

const meta: Meta<typeof PackageInfo> = {
  title: 'Components/Data/PackageInfo',
  component: PackageInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    metadata: {
      control: 'object',
      description: 'The package metadata object.',
      table: { category: 'Content', type: { summary: 'object' } },
    },
    showDescription: {
      control: 'boolean',
      description: 'Show/hide the package description.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showAuthor: {
      control: 'boolean',
      description: 'Show/hide the package author.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showLicense: {
      control: 'boolean',
      description: 'Show/hide the package license.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showDependencies: {
      control: 'boolean',
      description: 'Show/hide the package dependencies.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showDevDependencies: {
      control: 'boolean',
      description: 'Show/hide the package devDependencies.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showRepository: {
      control: 'boolean',
      description: 'Show/hide the repository link.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showHomepage: {
      control: 'boolean',
      description: 'Show/hide the homepage link.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the text and icons.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PackageInfo>;

const sampleMetadata: PackageMetadata = {
  name: 'gemini-cli-core',
  version: '0.29.5',
  description:
    'A core library for building interactive command-line interfaces with Gemini models.',
  author: 'Google LLC',
  license: 'Apache-2.0',
  dependencies: {
    '@grpc/grpc-js': '^1.14.1',
    '@opentelemetry/api': '^1.8.0',
    '@opentelemetry/core': '^1.22.0',
  },
  devDependencies: {
    '@types/node': '^18.19.10',
    typescript: '^5.3.3',
  },
  repository: {
    type: 'git',
    url: 'https://github.com/google/gemini-cli-core.git',
  },
  homepage: 'https://github.com/google/gemini-cli-core#readme',
};

export const Default: Story = {
  args: {
    metadata: sampleMetadata,
    showDescription: true,
    showAuthor: true,
    showLicense: true,
  },
};

export const WithDependencies: Story = {
  args: {
    metadata: sampleMetadata,
    showDependencies: true,
    showDevDependencies: true,
  },
};

export const CyberVariant: Story = {
  args: {
    metadata: {
      name: 'node-monitor',
      version: '1.0.0',
      description: 'Real-time system monitoring and telemetry collection agent.',
      author: 'CyberSec Corp',
      license: 'MIT',
    },
    variant: 'cyber',
    size: 'sm',
    showRepository: true,
  },
};

export const GlassVariant: Story = {
  args: {
    metadata: {
      name: 'atmospheric-shader',
      version: '0.5.0-beta',
      description: 'GLSL shader for atmospheric rendering in 3D scenes.',
      author: 'Astral Labs',
      license: 'BSD-3-Clause',
    },
    variant: 'glass',
    size: 'lg',
    showHomepage: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const Minimal: Story = {
  args: {
    metadata: {
      name: 'my-package',
      version: '1.0.0',
    },
    showDescription: false,
    showAuthor: false,
    showLicense: false,
  },
};
