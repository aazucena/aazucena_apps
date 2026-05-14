import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatQuickActions, type ChatQuickAction } from '@aazucena/ui';
import { Message, PlusCircle, CogFour, Trash } from '@aazucena/icons';

const meta: Meta<typeof ChatQuickActions> = {
  title: 'Components/Chat/ChatQuickActions',
  component: ChatQuickActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    actions: {
      control: 'object',
      description:
        'An array of action objects, each with an id, label, optional icon, and disabled state.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    onActionClick: {
      action: 'actionClicked',
      description: 'Callback function when an action button is clicked.',
      table: {
        category: 'Behavior',
        type: { summary: '(actionId: string) => void' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the actions section.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Available Actions' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no actions are available.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No actions available.' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container and action buttons.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatQuickActions>;

const defaultActions: ChatQuickAction[] = [
  { id: 'new_chat', label: 'New Chat', icon: Message },
  { id: 'add_user', label: 'Add User', icon: PlusCircle },
  { id: 'CogFour', label: 'CogFour', icon: CogFour, disabled: true },
  { id: 'clear_history', label: 'Clear History', icon: Trash },
];

export const Default: Story = {
  args: {
    actions: defaultActions,
  },
};

export const EmptyActions: Story = {
  args: {
    actions: [],
    emptyMessage: 'No actions can be performed at this moment.',
  },
};

export const CyberVariant: Story = {
  args: {
    actions: [
      { id: 'self_destruct', label: 'Self Destruct', icon: Trash },
      { id: 'deploy_patch', label: 'Deploy Patch', icon: PlusCircle },
    ],
    variant: 'cyber',
    title: 'System Commands',
  },
};

export const GlassVariant: Story = {
  args: {
    actions: [
      { id: 'view_report', label: 'View Report' },
      { id: 'export_data', label: 'Export Data' },
    ],
    variant: 'glass',
    title: 'Data Operations',
  },
};

export const CustomIcons: Story = {
  args: {
    actions: [
      {
        id: 'play',
        label: 'Play',
        icon: (props: any) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-play"
            {...props}
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ),
      },
      {
        id: 'pause',
        label: 'Pause',
        icon: (props: any) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pause"
            {...props}
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ),
      },
    ],
    title: 'Media Controls',
  },
};

export const MixedDisabled: Story = {
  args: {
    actions: [
      { id: 'action1', label: 'Enabled Action 1', icon: Message },
      { id: 'action2', label: 'Disabled Action 2', icon: PlusCircle, disabled: true },
      { id: 'action3', label: 'Enabled Action 3', icon: CogFour },
    ],
  },
};
