import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Persona } from '@aazucena/ui';
import { Robot, User as UserIcon } from '@aazucena/icons'; // Assuming these icons are available

const meta: Meta<typeof Persona> = {
  title: 'Components/Chat/Persona',
  component: Persona,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the persona.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    description: {
      control: 'text',
      description: 'A brief description or role of the persona.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    avatarSrc: {
      control: 'text',
      description: "URL for the persona's avatar image.",
      table: { category: 'Content', type: { summary: 'string' } },
    },
    icon: {
      control: false, // Custom icon component is passed directly
      description: 'Custom icon component to display when no avatarSrc is provided.',
      table: { category: 'Content', type: { summary: 'React.ReactNode' } },
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
type Story = StoryObj<typeof Persona>;

export const Default: Story = {
  args: {
    name: 'Standard Assistant',
    description: 'A helpful general-purpose AI.',
  },
};

export const WithAvatar: Story = {
  args: {
    name: 'Creative Writer',
    description: 'Generates engaging and imaginative content.',
    avatarSrc: 'https://avatar.iran.liara.run/public/girl',
  },
};

export const TechnicalExpert: Story = {
  args: {
    name: 'Code Debugger',
    description: 'Specializes in identifying and fixing programming errors.',
    icon: Robot,
    variant: 'cyber',
  },
};

export const CyberVariant: Story = {
  args: {
    name: 'Sentinel_AI',
    description: 'Monitors system integrity and security protocols.',
    icon: Robot,
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    name: 'Atmospheric Modeler',
    description: 'Simulates complex weather patterns and climate changes.',
    icon: Robot,
    variant: 'glass',
  },
};

export const UserPersona: Story = {
  args: {
    name: 'Aldrin Azucena',
    description: 'Full-Stack Developer',
    avatarSrc: 'https://i.pravatar.cc/150?img=68',
    icon: UserIcon,
  },
};

export const Minimal: Story = {
  args: {
    name: 'Basic Persona',
    description: 'Just a name, nothing fancy.',
  },
};
