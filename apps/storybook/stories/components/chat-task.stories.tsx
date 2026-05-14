import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatTask } from '@aazucena/ui';

const meta: Meta<typeof ChatTask> = {
  title: 'Components/Chat/ChatTask',
  component: ChatTask,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    task: {
      control: 'object',
      description: 'The task object containing id, description, status, and optional details.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the task card.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatTask>;

const baseTask = {
  id: 'task-1',
  description: 'Research and summarize latest trends in generative AI.',
};

export const TodoTask: Story = {
  args: {
    task: { ...baseTask, status: 'todo' },
  },
};

export const InProgressTask: Story = {
  args: {
    task: { ...baseTask, status: 'in-progress', assignedTo: 'Agent Alpha', priority: 'high' },
  },
};

export const DoneTask: Story = {
  args: {
    task: { ...baseTask, status: 'done', dueDate: '2023-12-31' },
  },
};

export const CancelledTask: Story = {
  args: {
    task: { ...baseTask, status: 'cancelled', assignedTo: 'Agent Beta', priority: 'low' },
  },
};

export const CyberVariant: Story = {
  args: {
    task: {
      id: 'task-cyber',
      description: 'Monitor network for anomalies and report suspicious activity.',
      status: 'in-progress',
      assignedTo: 'Security Bot',
      priority: 'high',
    },
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    task: {
      id: 'task-glass',
      description: 'Prepare quarterly financial report for review.',
      status: 'todo',
      dueDate: '2024-03-15',
      priority: 'medium',
    },
    variant: 'glass',
  },
};

export const AllDetailsTask: Story = {
  args: {
    task: {
      id: 'task-full',
      description: 'Develop and deploy new feature X to production environment.',
      status: 'in-progress',
      assignedTo: 'Dev Team Lead',
      dueDate: '2024-02-29',
      priority: 'high',
    },
  },
};
