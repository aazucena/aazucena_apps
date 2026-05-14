import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { StackTrace } from '@aazucena/ui';

const meta: Meta<typeof StackTrace> = {
  title: 'Components/Data/StackTrace',
  component: StackTrace,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    trace: {
      control: 'text',
      description: 'The raw stack trace string to parse and display.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Title displayed in the component header.',
      defaultValue: 'Stack Trace',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    highlightFrame: {
      control: 'number',
      description: 'The 0-indexed frame number to highlight.',
      table: { category: 'State', type: { summary: 'number' } },
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
type Story = StoryObj<typeof StackTrace>;

const sampleJsTrace = `Error: Something went wrong
    at myFunction (file:///path/to/my-app/src/utils.js:10:5)
    at anotherFunction (file:///path/to/my-app/src/main.js:25:12)
    at yetAnother (file:///path/to/my-app/src/index.js:5:1)
    at Promise.then (<anonymous>)
    at asyncCall (file:///path/to/my-app/src/api.js:30:7)`;

export const Default: Story = {
  args: {
    trace: sampleJsTrace,
    className: 'w-[500px]',
  },
};

export const HighlightedFrame: Story = {
  args: {
    trace: sampleJsTrace,
    highlightFrame: 1, // Highlight the second frame
    title: 'Error Log // Trace_0x7F',
    className: 'w-[500px]',
  },
};

export const CyberVariant: Story = {
  args: {
    trace: sampleJsTrace,
    variant: 'cyber',
    highlightFrame: 0,
    title: 'KERNEL_PANIC // STACK_DUMP',
    className: 'w-[600px]',
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
    trace: sampleJsTrace,
    variant: 'glass',
    highlightFrame: 2,
    title: 'Atmospheric Anomaly Trace',
    className: 'w-[500px]',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const LongStackTrace: Story = {
  args: {
    trace: `Error: Critical system failure at core.
    at processModule (file:///app/src/core/module.js:120:10)
    at runSystemCheck (file:///app/src/system/monitor.js:55:8)
    at initializeService (file:///app/src/service/init.js:15:3)
    at startApplication (file:///app/src/main.js:10:1)
    at callNextTick (node:internal/process/task_queues:60:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:3)
    at async doSomethingCritical (file:///app/src/critical/logic.js:5:2)
    at async main (file:///app/src/app.js:10:1)`,
    highlightFrame: 0,
    className: 'w-[500px]',
  },
};
