import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SchemaDisplay, type SchemaProperty } from '@aazucena/ui';

const meta: Meta<typeof SchemaDisplay> = {
  title: 'Components/Data/SchemaDisplay',
  component: SchemaDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    schema: {
      control: 'object',
      description: 'The schema object to display.',
      table: { category: 'Content', type: { summary: 'object' } },
    },
    title: {
      control: 'text',
      description: 'Optional title for the schema display.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Data Schema' },
      },
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether object/array properties should be expanded by default.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the text and icons.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SchemaDisplay>;

const userSchema: SchemaProperty = {
  name: 'User',
  type: 'object',
  properties: [
    { name: 'id', type: 'string', required: true, description: 'Unique user identifier' },
    {
      name: 'username',
      type: 'string',
      required: true,
      description: 'User login name',
      pattern: '^[a-z0-9_]+$',
    },
    {
      name: 'email',
      type: 'string',
      required: true,
      description: 'User email address',
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
    { name: 'age', type: 'number', minimum: 18, maximum: 99 },
    {
      name: 'roles',
      type: 'array',
      items: { name: 'role', type: 'string', enum: ['admin', 'editor', 'viewer'] },
    },
    {
      name: 'address',
      type: 'object',
      properties: [
        { name: 'street', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'zipCode', type: 'string', pattern: '^\\d{5}(-\\d{4})?$' },
      ],
    },
  ],
};

export const Default: Story = {
  args: {
    schema: userSchema,
    defaultExpanded: true,
  },
};

export const CyberVariant: Story = {
  args: {
    schema: userSchema,
    variant: 'cyber',
    size: 'sm',
    defaultExpanded: false,
  },
};

export const GlassVariant: Story = {
  args: {
    schema: userSchema,
    variant: 'glass',
    size: 'lg',
    defaultExpanded: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const ComplexSchema: Story = {
  args: {
    schema: {
      name: 'Product',
      type: 'object',
      properties: [
        { name: 'id', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'price', type: 'number', minimum: 0, description: 'Price of the product' },
        {
          name: 'dimensions',
          type: 'object',
          properties: [
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
            { name: 'depth', type: 'number' },
          ],
        },
        { name: 'tags', type: 'array', items: { name: 'tag', type: 'string' } },
        { name: 'status', type: 'string', enum: ['available', 'out_of_stock', 'discontinued'] },
      ],
    },
    title: 'Product Schema',
    defaultExpanded: true,
  },
};

export const EmptySchema: Story = {
  args: {
    schema: { name: 'Empty', type: 'object', properties: [] },
    title: 'Empty Object Schema',
  },
};
