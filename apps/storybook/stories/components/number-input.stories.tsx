import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from '@aazucena/ui';
import { within, userEvent, expect } from 'storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Numeric input with decrement/increment stepper buttons.
 * - **UX:** Supports min/max bounds, configurable step size, and keyboard input. Buttons disable at boundaries.
 * - **Accessibility:** ARIA labels on stepper buttons; native number input hidden spin buttons.
 */
const meta = {
  title: 'Components/Forms/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Numeric input with stepper buttons for precise value adjustment. Supports min, max, and step constraints with automatic clamping. 3 visual variants and 3 size presets.',
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
      description: 'Input size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
      table: {
        category: 'Constraints',
        type: { summary: 'number' },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
      table: {
        category: 'Constraints',
        type: { summary: 'number' },
      },
    },
    step: {
      control: 'number',
      description: 'Increment/decrement step amount',
      table: {
        category: 'Constraints',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and stepper buttons',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard number input with min/max bounds.
 */
export const Basic: Story = {
  args: {
    defaultValue: 5,
    min: 0,
    max: 100,
    variant: 'default',
    size: 'md',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for overlaying gradient backgrounds.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <NumberInput {...args} />
    </div>
  ),
};

/**
 * Cyber variant with cyan accents for terminal-style dashboards.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    defaultValue: 42,
    max: 255,
  },
};

// --- SIZE VARIANTS ---

/**
 * All 3 size presets rendered for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <NumberInput size="sm" defaultValue={1} min={0} max={10} />
      <NumberInput size="md" defaultValue={5} min={0} max={10} />
      <NumberInput size="lg" defaultValue={9} min={0} max={10} />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Custom step size of 10, useful for percentage or bulk quantity inputs.
 */
export const WithStep: Story = {
  args: {
    ...Basic.args,
    defaultValue: 50,
    step: 10,
  },
};

/**
 * Disabled state with reduced opacity and non-interactive buttons.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    defaultValue: 10,
    disabled: true,
  },
};

/**
 * Automated interaction test: click increment → value +1, click decrement → value -1.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: {
    defaultValue: 5,
    min: 0,
    max: 100,
    variant: 'default',
    size: 'md',
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    // Initial value
    await expect(input).toHaveValue(5);
    // Find increment button (aria-label contains 'increment' or '+')
    const buttons = canvas.getAllByRole('button');
    // NumberInput has decrement (index 0) and increment (index 1)
    const incrementBtn =
      buttons.find(
        (b: HTMLElement) =>
          b.getAttribute('aria-label')?.toLowerCase().includes('increment') ||
          b.textContent?.includes('+'),
      ) ?? buttons[1];
    const decrementBtn =
      buttons.find(
        (b: HTMLElement) =>
          b.getAttribute('aria-label')?.toLowerCase().includes('decrement') ||
          b.textContent?.includes('-'),
      ) ?? buttons[0];
    await userEvent.click(incrementBtn as HTMLElement);
    await expect(input).toHaveValue(6);
    await userEvent.click(decrementBtn as HTMLElement);
    await expect(input).toHaveValue(5);
  },
};
