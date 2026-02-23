import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Frame } from '@aazucena/ui';
import { Button } from '@aazucena/ui';

const meta: Meta<typeof Frame> = {
  title: 'Components/UI/Frame',
  component: Frame,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Text displayed in the title bar.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Untitled' },
      },
    },
    children: {
      control: 'text',
      description: 'Content to be rendered inside the frame.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    showControls: {
      control: 'boolean',
      description: 'Toggle visibility of the minimize/maximize/close buttons.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the frame.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Predefined size of the frame.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  args: {
    title: 'My Application Window',
    children: (
      <div className="flex flex-col gap-4">
        <p>Welcome to your new window!</p>
        <Button size="sm">Click Me</Button>
      </div>
    ),
  },
};

export const CyberVariant: Story = {
  args: {
    title: 'SECURE_SHELL_0x7F',
    children: (
      <div className="flex flex-col gap-4 font-mono text-cyan-400">
        <p>// KERNEL_ACTIVE</p>
        <p>// INGESTION_LIVE</p>
        <Button variant="cyber" size="sm">
          EXECUTE
        </Button>
      </div>
    ),
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    title: 'Atmospheric Layer',
    children: (
      <div className="flex flex-col gap-4 text-white">
        <p>Crystal clear view of the mesosphere.</p>
        <Button variant="glass" size="sm">
          Explore
        </Button>
      </div>
    ),
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const LargeFrame: Story = {
  args: {
    title: 'Code Editor',
    children: (
      <pre>
        <code>
          {`function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
}`}
        </code>
      </pre>
    ),
    size: 'lg',
  },
};

export const WithoutControls: Story = {
  args: {
    title: 'Info Panel',
    children: <p>This panel has no window controls.</p>,
    showControls: false,
  },
};
