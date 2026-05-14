import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatShimmer } from '@aazucena/ui';

const meta: Meta<typeof ChatShimmer> = {
  title: 'Components/Chat/ChatShimmer',
  component: ChatShimmer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the shimmer effect.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    shape: {
      control: 'select',
      options: ['textLine', 'avatar', 'bubble', 'card'],
      description: 'Predefined shapes to mimic different content types.',
      table: {
        category: 'Appearance',
        type: { summary: "'textLine' | 'avatar' | 'bubble' | 'card'" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatShimmer>;

export const DefaultTextLine: Story = {
  args: {
    shape: 'textLine',
    className: 'w-64', // Custom width for demonstration
  },
};

export const AvatarShimmer: Story = {
  args: {
    shape: 'avatar',
  },
};

export const BubbleShimmer: Story = {
  args: {
    shape: 'bubble',
  },
};

export const CardShimmer: Story = {
  args: {
    shape: 'card',
    className: 'w-80', // Custom width for demonstration
  },
};

export const CyberVariant: Story = {
  args: {
    shape: 'textLine',
    variant: 'cyber',
    className: 'w-56',
  },
};

export const GlassVariant: Story = {
  args: {
    shape: 'bubble',
    variant: 'glass',
    className: 'w-64',
  },
};

export const CombinedShimmers: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ChatShimmer shape="avatar" />
        <div className="flex flex-col gap-2 flex-grow">
          <ChatShimmer shape="textLine" className="w-48" />
          <ChatShimmer shape="textLine" className="w-32" />
        </div>
      </div>
      <ChatShimmer shape="bubble" className="w-full h-20" />
      <ChatShimmer shape="card" className="w-full h-24" />
    </div>
  ),
};
