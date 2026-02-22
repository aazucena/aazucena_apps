import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingLabel } from '@aazucena/ui';
import { within, userEvent, expect } from '@storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Input with animated label that floats above on focus or when filled.
 * - **UX:** Uses CSS peer selectors for pure-CSS animation without JavaScript state management.
 * - **Design:** Inspired by Material Design's text field pattern. Supports single-line and multiline modes.
 */
const meta = {
  title: 'Components/Forms/FloatingLabel',
  component: FloatingLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text input with an animated floating label that transitions from placeholder position to above the field on focus. Supports multiline textarea mode, 3 variants, and 3 size presets.',
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
      description: 'Field size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    label: {
      control: 'text',
      description: 'The floating label text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    multiline: {
      control: 'boolean',
      description: 'Renders as a textarea when true',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rows: {
      control: 'number',
      description: 'Number of rows for multiline mode',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
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
} satisfies Meta<typeof FloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard floating label input. Click or tab into the field to see the label animate upward.
 */
export const Basic: Story = {
  args: {
    label: 'Email Address',
    variant: 'default',
    size: 'md',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for use on gradient or image backgrounds.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    label: 'Username',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <FloatingLabel {...args} />
    </div>
  ),
};

/**
 * Cyber variant with monospace font and cyan glow for terminal-style UIs.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    label: 'ACCESS_KEY',
  },
};

// --- SIZE VARIANTS ---

/**
 * All 3 size presets rendered vertically for comparison.
 */
export const Sizes: Story = {
  args: {
    label: 'Size Field',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <FloatingLabel size="sm" label="Small Field" />
      <FloatingLabel size="md" label="Medium Field" />
      <FloatingLabel size="lg" label="Large Field" />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Multiline mode renders a textarea for longer content.
 */
export const Multiline: Story = {
  args: {
    ...Basic.args,
    label: 'Description',
    multiline: true,
    rows: 4,
  },
};

/**
 * Realistic form layout with multiple floating label fields stacked.
 */
export const FormLayout: Story = {
  args: {
    label: 'Form Field',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <FloatingLabel label="Full Name" />
      <FloatingLabel label="Email" type="email" />
      <FloatingLabel label="Phone" type="tel" />
      <FloatingLabel label="Message" multiline rows={3} />
    </div>
  ),
};
/**
 * Automated interaction test: focus causes label to float; value persists after blur.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: {
    label: 'Email Address',
    variant: 'default',
    size: 'md',
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Find the input inside FloatingLabel
    const input = canvas.getByRole('textbox');
    // Focus the input
    await userEvent.click(input);
    // Type a value
    await userEvent.type(input, 'user@example.com');
    await expect(input).toHaveValue('user@example.com');
    // Blur — label should stay floated (value exists)
    await userEvent.tab();
    await expect(input).toHaveValue('user@example.com');
  },
};
