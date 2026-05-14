import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FileTree, type FileTreeNode } from '@aazucena/ui';

const meta: Meta<typeof FileTree> = {
  title: 'Components/Data/FileTree',
  component: FileTree,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'An array of FileTreeNode objects representing the file system hierarchy.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    onNodeClick: {
      action: 'nodeClicked',
      description: 'Callback function when a node is clicked.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    defaultExpandedIds: {
      control: 'object',
      description: 'An array of node IDs to be expanded by default.',
      table: {
        category: 'State',
        type: { summary: 'object' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container and nodes.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the text and icons within the tree.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileTree>;

const sampleFileSystem: FileTreeNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        children: [
          { id: 'button.tsx', name: 'button.tsx', type: 'file' },
          { id: 'input.tsx', name: 'input.tsx', type: 'file' },
        ],
      },
      {
        id: 'pages',
        name: 'pages',
        type: 'folder',
        children: [{ id: 'index.tsx', name: 'index.tsx', type: 'file' }],
      },
      { id: 'app.tsx', name: 'app.tsx', type: 'file' },
    ],
  },
  {
    id: 'public',
    name: 'public',
    type: 'folder',
    children: [{ id: 'favicon.ico', name: 'favicon.ico', type: 'file' }],
  },
  { id: 'package.json', name: 'package.json', type: 'file' },
  { id: 'readme.md', name: 'README.md', type: 'file' },
];

export const Default: Story = {
  args: {
    data: sampleFileSystem,
    defaultExpandedIds: ['src', 'components'],
  },
};

export const CyberVariant: Story = {
  args: {
    data: sampleFileSystem,
    variant: 'cyber',
    defaultExpandedIds: ['src'],
    size: 'sm',
  },
};

export const GlassVariant: Story = {
  args: {
    data: sampleFileSystem,
    variant: 'glass',
    defaultExpandedIds: ['public'],
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const SingleFolderExpanded: Story = {
  args: {
    data: sampleFileSystem,
    defaultExpandedIds: ['src'],
  },
};

export const NoFoldersExpanded: Story = {
  args: {
    data: sampleFileSystem,
    defaultExpandedIds: [],
  },
};

export const LargeSize: Story = {
  args: {
    data: sampleFileSystem,
    defaultExpandedIds: ['src'],
    size: 'lg',
  },
};
