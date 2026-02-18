import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from '@aazucena/ui';
import * as React from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composes `Dropzone` with a file list preview including thumbnails, sizes, and remove buttons.
 * - **UX:** Supports controlled and uncontrolled modes, drag-and-drop + click-to-select, with validation for max files and max size.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) — file list rows inherit the variant styling.
 * - **Responsiveness:** Full-width by default, file names truncate gracefully on narrow viewports.
 */
const meta = {
  title: 'Components/Forms/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A file upload component with drag-and-drop, file list preview with thumbnails, and validation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme',
      table: { category: 'Appearance' },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
      table: { category: 'Behavior' },
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed',
      table: { category: 'Validation' },
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
      table: { category: 'Validation' },
    },
    showPreview: {
      control: 'boolean',
      description: 'Show file list preview below the dropzone',
      table: { category: 'Behavior' },
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., "image/*")',
      table: { category: 'Behavior' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Default file upload with all features enabled.
 */
export const Default: Story = {
  args: {
    multiple: true,
    showPreview: true,
  },
};

/**
 * Restricted to image files only.
 */
export const ImagesOnly: Story = {
  args: {
    accept: 'image/*',
    multiple: true,
  },
};

/**
 * Limited to 3 files maximum — exceeding shows validation error.
 */
export const MaxFiles: Story = {
  args: {
    maxFiles: 3,
    multiple: true,
  },
};

/**
 * Glass variant for atmospheric overlay contexts.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 p-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon styling.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] rounded-[2rem] border border-cyan-500/10 bg-black p-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Controlled mode with external state management.
 */
export const Controlled: Story = {
  render: (args) => {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <div className="space-y-4">
        <FileUpload {...args} files={files} onFilesChange={setFiles} />
        <p className="text-muted-foreground text-sm">
          {files.length} file{files.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    );
  },
};
