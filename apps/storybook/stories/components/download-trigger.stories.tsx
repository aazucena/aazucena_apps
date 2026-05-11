import type { Meta, StoryObj } from '@storybook/react-vite';
import { DownloadTrigger } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Semantic download link rendered as a styled button with file metadata display.
 * - **UX:** Shows file name and size at a glance with a clear download affordance icon. Native `<a download>` semantics.
 * - **Accessibility:** Built on native anchor element for correct browser download behavior and screen reader support.
 */
const meta = {
  title: 'Components/Actions/DownloadTrigger',
  component: DownloadTrigger,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A styled download link that displays file name and size metadata. Built on native `<a download>` semantics for correct browser behavior. Supports size variants and disabled state.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    href: {
      control: 'text',
      description: 'URL of the downloadable file',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    fileName: {
      control: 'text',
      description: 'Display name of the downloadable file',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    fileSize: {
      control: 'text',
      description: 'Human-readable file size label',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the download action',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DownloadTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard download trigger with file name and size metadata.
 */
export const Basic: Story = {
  args: {
    href: '#',
    fileName: 'resume.pdf',
    fileSize: '2.4 MB',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a vivid gradient background for frosted-glass UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    fileName: 'portfolio-assets.zip',
    fileSize: '18.7 MB',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon accents and monospace file name styling.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    fileName: 'MANIFEST_0x7F.bin',
    fileSize: '14.2 KB',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all three size presets rendered vertically.
 */
export const Sizes: Story = {
  args: {
    href: '#',
  },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-[10px] font-bold uppercase tracking-widest opacity-40">
            {size}
          </span>
          <DownloadTrigger href="#" fileName="resume.pdf" fileSize="2.4 MB" size={size} />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Disabled state preventing download interaction with reduced opacity.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};

/**
 * Multiple download triggers arranged as a file list for asset management UIs.
 */
export const FileList: Story = {
  args: {
    href: '#',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <DownloadTrigger href="#" fileName="resume-2026.pdf" fileSize="2.4 MB" />
      <DownloadTrigger href="#" fileName="portfolio-deck.pptx" fileSize="8.1 MB" />
      <DownloadTrigger href="#" fileName="source-code.zip" fileSize="45.3 MB" />
    </div>
  ),
};
