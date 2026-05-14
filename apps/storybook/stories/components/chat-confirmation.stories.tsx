import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatConfirmation } from '@aazucena/ui';
import { Button } from '@aazucena/ui'; // Assuming Button is available for triggering modal

const meta: Meta<typeof ChatConfirmation> = {
  title: 'Components/Chat/ChatConfirmation',
  component: ChatConfirmation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The confirmation message or question.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Callback function when the confirm button is clicked.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback function when the cancel button is clicked.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    confirmLabel: {
      control: 'text',
      description: 'Label for the confirm button.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Confirm' },
      },
    },
    cancelLabel: {
      control: 'text',
      description: 'Label for the cancel button.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Cancel' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the confirmation prompt.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Confirm Action' },
      },
    },
    asModal: {
      control: 'boolean',
      description: 'If true, renders the confirmation as a Dialog modal.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Controls the open state when `asModal` is true.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
      },
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Callback when the modal open state changes.',
      table: {
        category: 'Behavior',
        type: { summary: '(open: boolean) => void' },
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
  },
};

export default meta;
type Story = StoryObj<typeof ChatConfirmation>;

export const DefaultInline: Story = {
  args: {
    message: 'Are you sure you want to delete this chat thread? This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep Chat',
    title: 'Delete Chat Thread',
  },
};

export const ConfirmReset: Story = {
  args: {
    message: 'All unsaved changes will be lost. Do you wish to proceed?',
    confirmLabel: 'Reset',
    title: 'Reset Configuration',
  },
};

export const CyberModal: Story = {
  args: {
    message: 'Initiate system shutdown sequence? This will terminate all active processes.',
    confirmLabel: 'SHUTDOWN',
    cancelLabel: 'CANCEL',
    title: 'SYSTEM_CRITICAL_ACTION',
    asModal: true,
    open: true,
    variant: 'cyber',
  },
  render: (args) => {
    const [open, setOpen] = React.useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Cyber Modal</Button>
        <ChatConfirmation {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

export const GlassModal: Story = {
  args: {
    message: 'Approve the atmospheric layer changes?',
    confirmLabel: 'Approve',
    cancelLabel: 'Reject',
    title: 'Confirm Atmospheric Adjustment',
    asModal: true,
    open: true,
    variant: 'glass',
  },
  render: (args) => {
    const [open, setOpen] = React.useState(args.open);
    return (
      <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
        <Button onClick={() => setOpen(true)}>Open Glass Modal</Button>
        <ChatConfirmation {...args} open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'This action will permanently delete all selected data points, associated metadata, and revoke all read/write permissions for external APIs. Please ensure you have backed up any critical information before confirming. This operation cannot be reversed.',
    confirmLabel: 'Proceed with Deletion',
    cancelLabel: 'Abort Operation',
    title: 'Irreversible Data Deletion',
  },
};
