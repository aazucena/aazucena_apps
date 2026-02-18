import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagsInput } from '@aazucena/ui';
import { within, userEvent, expect } from '@storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Multi-value text input that converts free-text entries into discrete tag tokens.
 * - **UX:** Keyboard-driven (Enter to add, Backspace to remove last) with optional max count and duplicate prevention.
 * - **Forms:** Controlled `value`/`onChange` API compatible with react-hook-form and Zod validation.
 */
const meta = {
  title: 'Components/Forms/TagsInput',
  component: TagsInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tag-based multi-value input. Users type and press Enter to create tags. Supports max count, duplicate prevention, size variants, and disabled state.',
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
    placeholder: {
      control: 'text',
      description: 'Placeholder text when the input is empty',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'Add tag...'" },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum number of tags allowed',
      table: { category: 'Behavior', type: { summary: 'number' } },
    },
    allowDuplicates: {
      control: 'boolean',
      description: 'Allow duplicate tag values',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard tags input with pre-populated values. Press Enter to add, Backspace to remove.
 */
export const Basic: Story = {
  args: {
    value: ['React', 'TypeScript'],
    placeholder: 'Add a skill...',
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
    value: ['Astro', 'Tailwind', 'Vite'],
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <div className="w-96">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Cyber variant with monospace neon tag tokens and dark terminal aesthetics.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    value: ['LANGCHAIN', 'PGVECTOR', 'CLAUDE'],
    placeholder: 'ADD_MODULE...',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <div className="w-96">
          <Story />
        </div>
      </div>
    ),
  ],
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all three size presets side by side.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-[10px] font-bold uppercase tracking-widest opacity-40">
            {size}
          </span>
          <TagsInput value={['React', 'TypeScript']} size={size} placeholder="Add tag..." />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Enforces a maximum of 5 tags. Try adding more to see the limit in action.
 */
export const WithMax: Story = {
  args: {
    ...Basic.args,
    value: ['React', 'TypeScript', 'Tailwind'],
    max: 5,
    placeholder: 'Max 5 tags...',
  },
};

/**
 * Disabled state preventing all keyboard and mouse interaction.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};


/**
 * Automated interaction test: type a tag and press Enter, verify chip appears.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => <TagsInput placeholder="Add tag..." />,
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    // Type a tag
    await userEvent.type(input, 'newtag');
    await userEvent.keyboard('{Enter}');
    // Tag chip should appear
    await expect(canvas.getByText('newtag')).toBeVisible();
  },
};
