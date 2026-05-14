import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatArtifact, type Artifact } from '@aazucena/ui';

const meta: Meta<typeof ChatArtifact> = {
  title: 'Components/Chat/ChatArtifact',
  component: ChatArtifact,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    artifacts: {
      control: 'object',
      description:
        'An array of artifact objects, each with name, type, URL, and optional description.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the artifact list.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Related Artifacts' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message to display when no artifacts are present.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No artifacts generated or referenced.' },
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
type Story = StoryObj<typeof ChatArtifact>;

const defaultArtifacts: Artifact[] = [
  {
    id: '1',
    name: 'Analysis Report.pdf',
    type: 'file',
    url: '/docs/report.pdf',
    description: 'Detailed market analysis report.',
  },
  {
    id: '2',
    name: 'Source Code (GitHub)',
    type: 'code',
    url: 'https://github.com/aazucena/aazucena_apps',
    description: "Link to the project's GitHub repository.",
  },
  {
    id: '3',
    name: 'Reference Article',
    type: 'link',
    url: 'https://example.com/article',
    description: 'External article on AI advancements.',
  },
  { id: '4', name: 'Generated Image.png', type: 'file', url: '/assets/image.png' },
];

export const Default: Story = {
  args: {
    artifacts: defaultArtifacts,
  },
};

export const EmptyState: Story = {
  args: {
    artifacts: [],
    emptyMessage: 'No related files or links available for this conversation.',
  },
};

export const CyberVariant: Story = {
  args: {
    artifacts: defaultArtifacts.slice(0, 2),
    variant: 'cyber',
    title: 'Cyber Artifacts',
  },
};

export const GlassVariant: Story = {
  args: {
    artifacts: defaultArtifacts.slice(1, 3),
    variant: 'glass',
    title: 'Glass Artifacts',
  },
};

export const LinksOnly: Story = {
  args: {
    artifacts: [
      { id: 'a', name: 'Google', type: 'link', url: 'https://google.com' },
      { id: 'b', name: 'Bing', type: 'link', url: 'https://bing.com' },
    ],
  },
};

export const FilesOnly: Story = {
  args: {
    artifacts: [
      { id: 'x', name: 'Document.docx', type: 'file', url: '/docs/document.docx' },
      { id: 'y', name: 'Spreadsheet.xlsx', type: 'file', url: '/docs/spreadsheet.xlsx' },
    ],
  },
};
