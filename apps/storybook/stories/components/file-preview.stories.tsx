import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FilePreview, type FilePreviewData } from '@aazucena/ui';

const meta: Meta<typeof FilePreview> = {
  title: 'Components/Content/FilePreview',
  component: FilePreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      control: 'object',
      description: 'The file data object (id, name, size, type, status, etc.).',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    onRemove: {
      action: 'fileRemoved',
      description: 'Callback function when the remove button is clicked.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the file preview.',
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
type Story = StoryObj<typeof FilePreview>;

const sampleFiles: FilePreviewData[] = [
  {
    id: 'file-1',
    name: 'document.pdf',
    size: 1234567,
    type: 'application/pdf',
    status: 'uploaded',
  },
  {
    id: 'file-2',
    name: 'image.png',
    size: 567890,
    type: 'image/png',
    preview: 'https://via.placeholder.com/50x50/ADD8E6/000000?text=IMG',
    status: 'uploaded',
  },
  {
    id: 'file-3',
    name: 'report.txt',
    size: 789012,
    type: 'text/plain',
    status: 'uploading',
    progress: 75,
  },
  {
    id: 'file-4',
    name: 'failed_upload.jpg',
    size: 901234,
    type: 'image/jpeg',
    status: 'failed',
    error: 'Server error',
  },
  {
    id: 'file-5',
    name: 'archive.zip',
    size: 23456789,
    type: 'application/zip',
    status: 'pending',
  },
];

export const Default: Story = {
  args: {
    file: sampleFiles[0],
    onRemove: (id: string) => console.log('Remove file with id:', id),
  },
};

export const ImageFile: Story = {
  args: {
    file: sampleFiles[1],
    onRemove: (id: string) => console.log('Remove file with id:', id),
  },
};

export const Uploading: Story = {
  args: {
    file: sampleFiles[2],
    onRemove: (id: string) => console.log('Remove file with id:', id),
  },
};

export const Failed: Story = {
  args: {
    file: sampleFiles[3],
    onRemove: (id: string) => console.log('Remove file with id:', id),
  },
};

export const CyberVariant: Story = {
  args: {
    file: sampleFiles[4],
    onRemove: (id: string) => console.log('Remove file with id:', id),
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
    file: sampleFiles[0],
    onRemove: (id: string) => console.log('Remove file with id:', id),
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

export const WithoutRemoveButton: Story = {
  args: {
    file: sampleFiles[1],
    onRemove: undefined,
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <FilePreview file={sampleFiles[0]} size="sm" />
      <FilePreview file={sampleFiles[1]} size="default" />
      <FilePreview file={sampleFiles[2]} size="lg" />
    </div>
  ),
};
