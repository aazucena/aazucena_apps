import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree, TreeItem } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Hierarchical tree view for file systems, navigation, and nested data.
 * - **UX:** Expand/collapse with keyboard navigation (Enter/Space); selected item highlighting.
 * - **Accessibility:** ARIA tree/treeitem roles with proper nesting semantics and aria-expanded.
 * - **Design:** Three visual variants (default, glass, cyber) with three size presets.
 */
const meta = {
  title: 'Components/Data Display/Tree',
  component: Tree,
  subcomponents: { TreeItem },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Hierarchical tree view component for file explorers, nested navigation, and organizational data. Supports expand/collapse, selection, and keyboard controls.',
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
      description: 'Tree size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    data: {
      description: 'Array of TreeNode objects defining the hierarchy',
      table: {
        category: 'Content',
        type: { summary: 'TreeNode[]' },
      },
    },
    defaultExpanded: {
      description: 'Array of node IDs to expand by default',
      table: {
        category: 'Behavior',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    selected: {
      control: 'text',
      description: 'ID of the currently selected node',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    onSelect: {
      description: 'Callback fired when a node is clicked',
      table: {
        category: 'Behavior',
        type: { summary: '(id: string) => void' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

const fileSystemData = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
          { id: 'dialog', label: 'Dialog.tsx' },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        children: [
          { id: 'use-modal', label: 'useModal.ts' },
          { id: 'use-theme', label: 'useTheme.ts' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'tsconfig', label: 'tsconfig.json' },
];

// --- BASIC USAGE ---

/**
 * Default tree view with a file system hierarchy, two folders expanded.
 */
export const Basic: Story = {
  args: {
    data: fileSystemData,
    defaultExpanded: ['src', 'components'],
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted translucent styling on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
  // Override the variant at args level so parent decorator still applies
  render: (args) => <Tree {...args} variant="glass" />,
};

/**
 * Cyber variant with mono typography and cyan accents on a dark background.
 */
export const Cyber: Story = {
  args: {
    data: [
      {
        id: 'sys',
        label: '/system',
        children: [
          { id: 'core', label: 'core.bin' },
          { id: 'config', label: 'config.yml' },
          {
            id: 'modules',
            label: '/modules',
            children: [
              { id: 'auth', label: 'auth.mod' },
              { id: 'cache', label: 'cache.mod' },
            ],
          },
        ],
      },
    ],
    variant: 'cyber',
    defaultExpanded: ['sys', 'modules'],
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets rendered side-by-side for comparison.
 */
export const Sizes: Story = {
  args: {
    data: fileSystemData,
  },
  render: () => (
    <div className="flex items-start gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{size}</span>
          <Tree data={fileSystemData} size={size} defaultExpanded={['src']} className="w-56" />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Tree with a pre-selected node to demonstrate selection highlighting.
 */
export const WithSelection: Story = {
  args: {
    data: fileSystemData,
    defaultExpanded: ['src', 'components'],
    selected: 'button',
  },
};

/**
 * Nodes with the disabled flag are visually dimmed and non-interactive.
 */
export const DisabledNodes: Story = {
  args: {
    data: [
      {
        id: 'root',
        label: 'Project',
        children: [
          { id: 'readme', label: 'README.md' },
          { id: 'locked', label: 'secrets.env', disabled: true },
          { id: 'src', label: 'src/', children: [{ id: 'app', label: 'App.tsx' }] },
        ],
      },
    ],
    defaultExpanded: ['root'],
  },
};
