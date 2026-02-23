import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DescriptionList, type DescriptionListItem } from '@aazucena/ui';
import { Badge } from '@aazucena/ui';

const meta: Meta<typeof DescriptionList> = {
  title: 'Components/Data/DescriptionList',
  component: DescriptionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title for the description list.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    items: {
      control: 'object',
      description: 'An array of items, each with a label and a value.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the description list container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the text and padding.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

const sampleItems: DescriptionListItem[] = [
  { label: 'Full Name', value: 'Aldrin Azucena' },
  { label: 'Email Address', value: 'aldrin.azucena@example.com' },
  { label: 'Role', value: 'Engineering Lead' },
  { label: 'Department', value: 'Core Systems' },
  { label: 'Status', value: 'Active' },
];

export const Default: Story = {
  args: {
    title: 'User Profile',
    items: sampleItems,
  },
};

export const CyberVariant: Story = {
  args: {
    title: 'NODE_SPECIFICATIONS',
    items: [
      { label: 'NODE_ID', value: '0x7F42' },
      { label: 'STATUS', value: 'OPERATIONAL' },
      { label: 'LOCATION', value: 'US_EAST_01' },
      { label: 'LAST_SYNC', value: '2026-02-21 14:30:00 UTC' },
    ],
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
    title: 'Atmospheric Layers',
    items: [
      { label: 'Troposphere', value: '0-12 km' },
      { label: 'Stratosphere', value: '12-50 km' },
      { label: 'Mesosphere', value: '50-85 km' },
    ],
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

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <DescriptionList title="Small Info" items={sampleItems.slice(0, 2)} size="sm" />
      <DescriptionList title="Default Info" items={sampleItems.slice(0, 2)} size="default" />
      <DescriptionList title="Large Info" items={sampleItems.slice(0, 2)} size="lg" />
    </div>
  ),
};

export const NoTitle: Story = {
  args: {
    items: sampleItems.slice(0, 3),
  },
};
