import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichEditor } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Rich text editor wrapping Tiptap (ProseMirror) with formatting toolbar.
 * - **UX:** Familiar toolbar with Bold, Italic, Strikethrough, Heading, Lists, Blockquote, Code Block.
 * - **Accessibility:** Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.) for all formatting actions.
 * - **Design:** Three variants with prose styling; outputs clean HTML for storage and rendering.
 */
const meta = {
  title: 'Components/Forms/Editor',
  component: RichEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Rich text editor powered by Tiptap with formatting toolbar, keyboard shortcuts, and HTML output. Supports three visual variants and three height presets.',
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
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Editor height preset (120/200/320px min-height)',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when editor is empty',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Start writing...' },
      },
    },
    toolbar: {
      control: 'boolean',
      description: 'Show the formatting toolbar',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable editing and toolbar interaction',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: 'text',
      description: 'Initial HTML content for the editor',
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    onChange: {
      description: 'Callback fired with HTML string on content change',
      table: {
        category: 'Behavior',
        type: { summary: '(html: string) => void' },
      },
    },
    onEditorReady: {
      description: 'Callback fired when the Tiptap editor instance is ready',
      table: {
        category: 'Behavior',
        type: { summary: '(editor: Editor) => void' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Empty editor with placeholder text and full toolbar.
 */
export const Basic: Story = {
  args: {
    placeholder: 'Start writing your content...',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted editor chrome on a gradient background.
 */
export const Glass: Story = {
  args: {
    placeholder: 'Write something beautiful...',
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with mono typography and cyan accent toolbar.
 */
export const Cyber: Story = {
  args: {
    placeholder: 'ENTER_TRANSMISSION...',
    variant: 'cyber',
  },
};

// --- SIZE VARIANTS ---

/**
 * All three height presets rendered vertically.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-[600px] flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{size}</span>
          <RichEditor size={size} placeholder={`${size} editor...`} />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Editor pre-filled with rich HTML content including headings, bold, lists.
 */
export const WithContent: Story = {
  args: {
    value:
      '<h2>Hello World</h2><p>This is a <strong>rich text</strong> editor with <em>formatting</em> support.</p><ul><li>Bullet point one</li><li>Bullet point two</li></ul><blockquote>A meaningful quote.</blockquote>',
  },
};

/**
 * Minimal editor without the formatting toolbar for simple text input.
 */
export const NoToolbar: Story = {
  args: {
    placeholder: 'Minimal editor without toolbar...',
    toolbar: false,
  },
};

/**
 * Disabled editor dims the entire component and blocks editing.
 */
export const Disabled: Story = {
  args: {
    value: '<p>This content is <strong>read-only</strong> and cannot be edited.</p>',
    disabled: true,
  },
};
