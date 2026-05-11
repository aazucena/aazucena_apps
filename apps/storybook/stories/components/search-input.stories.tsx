import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from '@aazucena/ui';
import { within, userEvent, expect } from 'storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Specialized input with integrated search icon, loading spinner, and clear button.
 * - **UX:** Visual feedback for loading state; clear button appears only when a value exists with an onClear handler.
 * - **Accessibility:** Proper search input type with descriptive aria-label on the clear button.
 */
const meta = {
  title: 'Components/Forms/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Search-optimized input with integrated search icon, loading spinner, and clear button. Supports 3 visual variants and 3 size presets.',
      },
    },
  },
  tags: ['autodocs', 'new', 'interaction-test'],
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
      description: 'Input size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when empty',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner in place of the search icon',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard search input with a descriptive placeholder.
 */
export const Basic: Story = {
  args: {
    placeholder: 'Search components...',
    variant: 'default',
    size: 'md',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for overlaying gradient or image backgrounds.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    placeholder: 'Search...',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <SearchInput {...args} />
    </div>
  ),
};

/**
 * Cyber variant with neon accents for terminal-style interfaces.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    placeholder: 'QUERY_DATABASE',
  },
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all 3 size presets rendered vertically.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SearchInput size="sm" placeholder="Small search" />
      <SearchInput size="md" placeholder="Medium search" />
      <SearchInput size="lg" placeholder="Large search" />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Loading state showing spinner in place of the search icon.
 */
export const Loading: Story = {
  args: {
    ...Basic.args,
    loading: true,
    placeholder: 'Searching...',
  },
};

/**
 * Search input with a pre-filled value and clear button visible.
 */
export const WithClearButton: Story = {
  args: {
    ...Basic.args,
    value: 'React components',
    onClear: () => {},
  },
};
/**
 * Automated interaction test: type into search field, verify value.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: {
    placeholder: 'Search here...',
    variant: 'default',
    size: 'md',
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'react hooks');
    await expect(input).toHaveValue('react hooks');
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
  },
};
