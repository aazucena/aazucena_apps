import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Searchable select combining text input with a filtered dropdown list.
 * - **UX:** Type-ahead filtering narrows options in real-time. Selected option shows a check icon.
 * - **Accessibility:** ARIA combobox role with `aria-expanded` on trigger and `aria-selected` on options.
 */
const meta = {
  title: 'Components/Forms/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Searchable select component combining text input with a filtered dropdown. Ideal for large option lists. Supports 3 visual variants, 3 size presets, and disabled options.',
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
      description: 'Trigger button size',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when no value is selected',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'Select...'" },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Message displayed when search yields no results',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'No results.'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the combobox trigger',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const frameworkOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'astro', label: 'Astro' },
  { value: 'next', label: 'Next.js' },
];

// --- BASIC USAGE ---

/**
 * Standard combobox with framework options. Click to open, then type to filter.
 */
export const Basic: Story = {
  args: {
    placeholder: 'Select framework...',
    variant: 'default',
    size: 'md',
    options: frameworkOptions,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for immersive UI backgrounds.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Combobox {...args} />
    </div>
  ),
};

/**
 * Cyber variant with monospace font and neon accents.
 */
export const Cyber: Story = {
  args: {
    placeholder: 'SELECT_MODULE',
    variant: 'cyber',
    size: 'md',
    options: [
      { value: 'auth', label: 'AUTH_SERVICE' },
      { value: 'data', label: 'DATA_PIPELINE' },
      { value: 'ml', label: 'ML_ENGINE' },
      { value: 'cache', label: 'CACHE_LAYER' },
    ],
  },
};

// --- SIZE VARIANTS ---

/**
 * All 3 size presets for the combobox trigger.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Combobox size="sm" placeholder="Small" options={frameworkOptions} />
      <Combobox size="md" placeholder="Medium" options={frameworkOptions} />
      <Combobox size="lg" placeholder="Large" options={frameworkOptions} />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Combobox with a pre-selected value showing the check icon.
 */
export const Preselected: Story = {
  args: {
    ...Basic.args,
    placeholder: 'Select language...',
    value: 'ts',
    options: [
      { value: 'ts', label: 'TypeScript' },
      { value: 'js', label: 'JavaScript' },
      { value: 'py', label: 'Python' },
      { value: 'rs', label: 'Rust' },
      { value: 'go', label: 'Go' },
    ],
  },
};

/**
 * Combobox with some disabled options that cannot be selected.
 */
export const WithDisabledOptions: Story = {
  args: {
    ...Basic.args,
    placeholder: 'Select database...',
    options: [
      { value: 'pg', label: 'PostgreSQL' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'mongo', label: 'MongoDB', disabled: true },
      { value: 'redis', label: 'Redis' },
      { value: 'sqlite', label: 'SQLite', disabled: true },
    ],
  },
};
