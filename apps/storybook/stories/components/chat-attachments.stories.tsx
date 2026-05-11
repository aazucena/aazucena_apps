import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatAttachments, type Attachment } from '@aazucena/ui';

const meta: Meta<typeof ChatAttachments> = {
  title: 'Components/Chat/ChatAttachments',
  component: ChatAttachments,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    attachments: {
      control: 'object',
      description:
        'An array of attachment objects, each with id, name, type, url, preview, status, progress, and error.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    onRemoveAttachment: {
      action: 'removeAttachment',
      description: 'Callback function when an attachment is removed.',
      table: {
        category: 'Behavior',
        type: { summary: '(id: string) => void' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the attachments section.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Attachments' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no attachments are present.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No files attached.' },
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
type Story = StoryObj<typeof ChatAttachments>;

const sampleAttachments: Attachment[] = [
  {
    id: '1',
    name: 'document.pdf',
    type: 'application/pdf',
    url: 'https://example.com/document.pdf',
    status: 'uploaded',
  },
  {
    id: '2',
    name: 'image.png',
    type: 'image/png',
    preview: 'https://via.placeholder.com/50x50/ADD8E6/000000?text=IMG',
    url: 'https://example.com/image.png',
    status: 'uploaded',
  },
  {
    id: '3',
    name: 'report.txt',
    type: 'text/plain',
    status: 'uploading',
    progress: 75,
  },
  {
    id: '4',
    name: 'failed_upload.jpg',
    type: 'image/jpeg',
    status: 'failed',
    error: 'Server error',
  },
  {
    id: '5',
    name: 'new_file.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'pending',
  },
];

export const Default: Story = {
  args: {
    attachments: sampleAttachments,
  },
};

export const EmptyState: Story = {
  args: {
    attachments: [],
    emptyMessage: 'No documents or images currently attached.',
  },
};

export const CyberVariant: Story = {
  args: {
    attachments: sampleAttachments.slice(0, 3),
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    attachments: sampleAttachments.slice(1, 4),
    variant: 'glass',
  },
};

export const OnlyImages: Story = {
  args: {
    attachments: [
      {
        id: '6',
        name: 'chart.png',
        type: 'image/png',
        preview: 'https://via.placeholder.com/50x50/C8A2C8/FFFFFF?text=Chart',
        url: 'https://example.com/chart.png',
        status: 'uploaded',
      },
      {
        id: '7',
        name: 'diagram.svg',
        type: 'image/svg+xml',
        preview: 'https://via.placeholder.com/50x50/FFD700/000000?text=SVG',
        url: 'https://example.com/diagram.svg',
        status: 'uploaded',
      },
    ],
  },
};

export const UploadingProgress: Story = {
  args: {
    attachments: [
      {
        id: '8',
        name: 'large_model.zip',
        type: 'application/zip',
        status: 'uploading',
        progress: 30,
      },
      {
        id: '9',
        name: 'config.json',
        type: 'application/json',
        status: 'pending',
      },
    ],
  },
};
