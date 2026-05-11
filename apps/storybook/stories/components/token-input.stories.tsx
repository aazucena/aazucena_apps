import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TokenInput } from '@aazucena/ui';
import { toast, Toaster } from '@aazucena/ui';

const meta: Meta<typeof TokenInput> = {
  title: 'Components/Forms/TokenInput',
  component: TokenInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialToken: {
      control: 'text',
      description: 'Initial token value.',
      table: { category: 'Data' },
    },
    length: {
      control: { type: 'number', min: 8, max: 128 },
      description: 'Length of generated token (ignored for UUID).',
      table: { category: 'Data', defaultValue: { summary: '32' } },
    },
    algorithm: {
      control: 'select',
      options: ['random', 'uuid', 'hex', 'base64', 'numeric', 'custom'],
      description: 'Generation algorithm.',
      table: { category: 'Data', defaultValue: { summary: 'random' } },
    },
    secure: {
      control: 'boolean',
      description: 'Mask the token by default.',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    canRegenerate: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    canCopy: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TokenInput>;

export const Default: Story = {
  args: {
    initialToken: 'ak_live_51P2jK9zX2yR7mN4qL0pB8vW3sH6aE1',
  },
  render: (args) => (
    <div className="w-[450px]">
      <Toaster />
      <TokenInput {...args} onTokenChange={(t) => toast.info(`New token generated`)} />
    </div>
  ),
};

export const UUID: Story = {
  args: {
    algorithm: 'uuid',
    secure: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <TokenInput {...args} />
    </div>
  ),
};

export const Hex: Story = {
  args: {
    algorithm: 'hex',
    length: 16,
    secure: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <TokenInput {...args} />
    </div>
  ),
};

export const CyberSecurity: Story = {
  args: {
    variant: 'cyber',
    algorithm: 'base64',
    length: 48,
    initialToken: 'SECURE_LINK_0x7F_ACTIVE',
  },
  render: (args) => (
    <div className="bg-black p-12 rounded-2xl w-[600px]">
      <TokenInput {...args} />
    </div>
  ),
};

export const GlassTheme: Story = {
  args: {
    variant: 'glass',
    algorithm: 'random',
    length: 24,
  },
  render: (args) => (
    <div className="bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-12 rounded-3xl w-[500px]">
      <TokenInput {...args} />
    </div>
  ),
};

export const CustomGenerator: Story = {
  args: {
    algorithm: 'custom',
    customGenerator: () => `AAZUCENA-${Math.floor(Math.random() * 1000000)}`,
    secure: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <TokenInput {...args} />
    </div>
  ),
};

export const VisibleOnly: Story = {
  args: {
    secure: false,
    canRegenerate: true,
    canCopy: true,
  },
  render: (args) => (
    <div className="w-[400px]">
      <TokenInput {...args} />
    </div>
  ),
};
