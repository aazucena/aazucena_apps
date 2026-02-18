import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneInput } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Phone number input with country code selector and auto-formatting.
 * - **UX:** Flag emoji + dial code selector; US phone formatting `(555) 123-4567` by default.
 * - **Accessibility:** Country select has aria-label "Country code"; tel input type for mobile keyboards.
 * - **Data:** Ships with 10 common countries; accepts custom country list via `countries` prop.
 */
const meta = {
  title: 'Components/Forms/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Phone number input with integrated country code selector and automatic number formatting. Supports 10 built-in countries with flag emojis and customizable country lists.',
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
      description: 'Input size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    country: {
      control: 'select',
      options: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'IN', 'PH', 'BR'],
      description: 'Selected country code',
      table: {
        category: 'Data',
        type: { summary: 'string' },
        defaultValue: { summary: 'US' },
      },
    },
    value: {
      control: 'text',
      description: 'Raw digit string of the phone number',
      table: {
        category: 'Data',
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: '(555) 123-4567' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input and country selector',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      description: 'Callback fired with raw digit string on input change',
      table: {
        category: 'Behavior',
        type: { summary: '(value: string) => void' },
      },
    },
    onCountryChange: {
      description: 'Callback fired when country selection changes',
      table: {
        category: 'Behavior',
        type: { summary: '(code: string) => void' },
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
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Default phone input with US country code and placeholder formatting.
 */
export const Basic: Story = {
  args: {
    country: 'US',
    placeholder: '(555) 123-4567',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted input styling on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with mono typography and cyan accent borders.
 */
export const Cyber: Story = {
  args: {
    country: 'JP',
    variant: 'cyber',
    placeholder: 'ENTER_NUMBER',
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
          <PhoneInput size={size} country="US" placeholder="(555) 123-4567" />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Pre-filled phone number demonstrating auto-formatting of raw digits.
 */
export const WithValue: Story = {
  args: {
    country: 'US',
    value: '5551234567',
  },
};

/**
 * Philippines country code selected with a local placeholder.
 */
export const Philippines: Story = {
  args: {
    country: 'PH',
    placeholder: 'Enter number',
  },
};

/**
 * Disabled state dims the entire input and prevents interaction.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    value: '5551234567',
    disabled: true,
  },
};
