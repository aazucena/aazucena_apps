import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPicker } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Color selection with swatch palette, native picker, and text input.
 * - **UX:** Three interaction modes: preset swatches, native OS color picker, hex text input.
 * - **Accessibility:** Swatch buttons have aria-label with hex value; click-outside dismisses popover.
 * - **Design:** Popover swatch grid (5-column) with active state ring and optional hex text field.
 */
const meta = {
  title: 'Components/Forms/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Color picker with swatch palette, native OS color input, and hex text field. Supports three visual variants and three size presets.',
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
      description: 'Picker size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    value: {
      control: 'color',
      description: 'Current selected color hex value',
      table: {
        category: 'Data',
        type: { summary: 'string' },
        defaultValue: { summary: '#3b82f6' },
      },
    },
    showInput: {
      control: 'boolean',
      description: 'Show the hex text input alongside the swatch button',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    swatches: {
      description: 'Array of hex color strings for the swatch palette',
      table: {
        category: 'Content',
        type: { summary: 'string[]' },
      },
    },
    onChange: {
      description: 'Callback fired when the selected color changes',
      table: {
        category: 'Behavior',
        type: { summary: '(color: string) => void' },
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
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Default color picker with blue pre-selected and hex text input visible.
 */
export const Basic: Story = {
  args: {
    value: '#3b82f6',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted styling on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-96 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with cyan-themed swatch panel and mono input.
 */
export const Cyber: Story = {
  args: {
    value: '#06b6d4',
    variant: 'cyber',
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-[10px] font-bold uppercase tracking-widest opacity-40">
            {size}
          </span>
          <ColorPicker size={size} value="#3b82f6" />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Swatch-only mode hides the text input for a compact layout.
 */
export const SwatchOnly: Story = {
  args: {
    value: '#ef4444',
    showInput: false,
  },
};

/**
 * Custom slate-scale swatches for design system token selection.
 */
export const CustomSwatches: Story = {
  args: {
    value: '#1e293b',
    swatches: [
      '#0f172a',
      '#1e293b',
      '#334155',
      '#475569',
      '#64748b',
      '#94a3b8',
      '#cbd5e1',
      '#e2e8f0',
      '#f1f5f9',
      '#f8fafc',
    ],
  },
};

/**
 * Disabled state prevents all interaction.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};
