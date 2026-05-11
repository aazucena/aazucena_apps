import type { Meta, StoryObj } from '@storybook/react-vite';
import { Diff } from '@aazucena/ui';

const originalCode = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`;

const modifiedCode = `function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
  return name.toUpperCase();
}`;

const originalConfig = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`;

const modifiedConfig = `{
  "name": "my-app",
  "version": "2.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0"
  }
}`;

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Unified text comparison primitive for code review and content auditing workflows.
 * - **UX:** Automatic line-level diffing with color-coded additions (green) and removals (red). Dual line number gutters.
 * - **Typography:** Monospace font rendering ensures pixel-accurate code alignment across all variants.
 */
const meta = {
  title: 'Components/Display/Diff',
  component: Diff,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A unified diff viewer that highlights additions and removals between two text inputs. Features dual line number gutters, color-coded change indicators, and three visual variants.',
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
    original: {
      control: 'text',
      description: 'The original (before) text content',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    modified: {
      control: 'text',
      description: 'The modified (after) text content',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Toggle dual line number gutter visibility',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[520px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Diff>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard diff view with line numbers showing a function signature change.
 */
export const Basic: Story = {
  args: {
    original: originalCode,
    modified: modifiedCode,
    showLineNumbers: true,
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
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <div className="w-[520px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon-accented diff lines for dark terminal aesthetics.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <div className="w-[520px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// --- ADVANCED ---

/**
 * Diff view without line numbers for a cleaner, minimal presentation.
 */
export const NoLineNumbers: Story = {
  args: {
    ...Basic.args,
    showLineNumbers: false,
  },
};

/**
 * Package.json version bump showing dependency additions and version changes.
 */
export const ConfigDiff: Story = {
  args: {
    original: originalConfig,
    modified: modifiedConfig,
    showLineNumbers: true,
  },
};

/**
 * Side-by-side comparison of default and cyber variants for the same diff.
 */
export const VariantComparison: Story = {
  args: {
    original: originalCode,
    modified: modifiedCode,
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest opacity-40">
          Default
        </span>
        <Diff original={originalCode} modified={modifiedCode} />
      </div>
      <div className="rounded-xl bg-black p-4">
        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-500/40">
          Cyber
        </span>
        <Diff original={originalCode} modified={modifiedCode} variant="cyber" />
      </div>
    </div>
  ),
};
