import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Import, type ImportFileData } from '@aazucena/ui';
import { toast, Toaster } from '@aazucena/ui';

const meta: Meta<typeof Import> = {
  title: 'Components/Utilities/Import',
  component: Import,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the import component.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    allowedFileTypes: {
      control: 'object',
      description: 'Array of allowed file extensions or MIME types.',
      table: {
        category: 'Behavior',
        type: { summary: 'object' },
      },
    },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size in bytes.',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
      },
    },
    enableDragAndDrop: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    enableUrlImport: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    onFileImport: {
      action: 'fileImported',
      description:
        'Callback triggered when a file is successfully imported (provides ImportFileData).',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    onUrlImport: {
      action: 'urlImported',
      description: 'Callback triggered when a URL is imported.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Import>;

export const Default: Story = {
  args: {
    onFileImport: (data: ImportFileData) => console.log('File imported:', data.name, data.content),
    onUrlImport: (url: string) => console.log('URL imported:', url),
  },
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Import {...args} />
    </div>
  ),
};

export const CustomConstraints: Story = {
  args: {
    allowedFileTypes: ['.json', 'text/csv'],
    maxFileSize: 1024 * 1024, // 1MB
    onFileImport: (data: ImportFileData) => alert(`File ${data.name} imported!`),
  },
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Import {...args} />
    </div>
  ),
};

export const CyberVariant: Story = {
  args: {
    variant: 'cyber',
    onFileImport: (data: ImportFileData) => console.log('Cyber File:', data.name),
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Import {...args} />
    </div>
  ),
};

export const GlassVariant: Story = {
  args: {
    variant: 'glass',
    onFileImport: (data: ImportFileData) => console.log('Glass File:', data.name),
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Import {...args} />
    </div>
  ),
};

export const OnlyFileImport: Story = {
  args: {
    enableUrlImport: false,
  },
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Import {...args} />
    </div>
  ),
};

export const OnlyUrlImport: Story = {
  args: {
    enableDragAndDrop: false,
  },
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Import {...args} />
    </div>
  ),
};
