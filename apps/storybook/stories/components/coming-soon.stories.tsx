import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ComingSoon, Button } from '@aazucena/ui';

const meta: Meta<typeof ComingSoon> = {
  title: 'Components/Feedback/ComingSoon',
  component: ComingSoon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The name of the upcoming feature.',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Detailed tease of the feature.',
      table: { category: 'Content' },
    },
    expectedDate: {
      control: 'text',
      description: 'When the feature is expected.',
      table: { category: 'Metadata' },
    },
    fullScreen: {
      control: 'boolean',
      description: 'Whether the component covers the whole screen.',
      table: { category: 'Layout' },
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
type Story = StoryObj<typeof ComingSoon>;

export const Default: Story = {
  args: {
    title: 'AI_ANALYTICS_V2',
    description:
      'A complete overhaul of the predictive modeling engine with real-time vector search integration.',
    expectedDate: 'Q3_2026',
  },
  render: (args) => (
    <div className="w-[600px]">
      <ComingSoon {...args} />
    </div>
  ),
};

export const CyberMode: Story = {
  args: {
    variant: 'cyber',
    title: 'PROJECT_NEBULA',
    description:
      'Direct link established. Decrypting core architectural schematics for distributed neural nodes.',
    expectedDate: 'FALL_2026',
    packetId: '0xBB-99',
  },
  render: (args) => (
    <div className="bg-black p-12 rounded-3xl w-[700px]">
      <ComingSoon {...args} />
    </div>
  ),
};

export const GlassVariant: Story = {
  args: {
    variant: 'glass',
    title: 'Visualizer_Studio',
    description:
      'A high-fidelity immersive environment for real-time audio telemetry and synthesis.',
    expectedDate: 'JUNE_2026',
  },
  render: (args) => (
    <div className="bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-20 rounded-[3rem] w-[800px]">
      <ComingSoon {...args} />
    </div>
  ),
};

export const FullScreenOverlay: Story = {
  args: {
    fullScreen: true,
    variant: 'cyber',
    title: 'SECURE_UPLINK_STABILIZING',
    description:
      'The global neural network is undergoing maintenance. All non-essential protocols are suspended until decryption is complete.',
    expectedDate: 'EST_RECOVERY_04:00_UTC',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setIsOpen(true)}>Launch FullScreen Teaser</Button>
        {isOpen && <ComingSoon {...args} onClose={() => setIsOpen(false)} />}
      </div>
    );
  },
};

export const SmallTeaser: Story = {
  args: {
    size: 'sm',
    title: 'UPLINK_BETA',
    description: 'Early access protocols.',
    expectedDate: 'SOON',
  },
};

export const LargeHero: Story = {
  args: {
    size: 'lg',
    variant: 'cyber',
    title: 'ENGINEERING_INTEL_TERMINAL',
    description:
      'The ultimate interface for monitoring workspace integrity, deployment pipelines, and agentic telemetry across the monorepo ecosystem.',
    expectedDate: 'PROJECTED_AUGUST_2026',
  },
  render: (args) => (
    <div className="bg-black p-4 w-[900px]">
      <ComingSoon {...args} />
    </div>
  ),
};
