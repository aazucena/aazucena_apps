import type { Meta, StoryObj } from '@storybook/react-vite';
import { QrCode } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** QR code generator wrapping the `qrcode.react` library with design system variants.
 * - **UX:** Auto-adapts foreground/background colors per variant; optional label for context.
 * - **Accessibility:** SVG output is inline and scales cleanly at all sizes.
 * - **Design:** Three size presets (96/128/192px), error correction level M, optional logo overlay.
 */
const meta = {
  title: 'Components/Data Display/QrCode',
  component: QrCode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'QR code generator with configurable size, colors, variant styling, and optional label. Powered by qrcode.react with error correction level M.',
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
      description: 'QR code size preset (96/128/192px)',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    value: {
      control: 'text',
      description: 'The data to encode in the QR code',
      table: {
        category: 'Data',
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label displayed below the QR code',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    fgColor: {
      control: 'color',
      description: 'Foreground (module) color',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '#000000 (cyber: #06b6d4)' },
      },
    },
    bgColor: {
      control: 'color',
      description: 'Background color',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '#ffffff (cyber: transparent)' },
      },
    },
    includeMargin: {
      control: 'boolean',
      description: 'Include quiet zone margin around the QR code',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    imageSettings: {
      description: 'Optional logo overlay configuration',
      table: {
        category: 'Content',
        type: { summary: '{ src; height; width; excavate }' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 flex justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Default QR code encoding a URL with a descriptive label.
 */
export const Basic: Story = {
  args: {
    value: 'https://aazucena.com',
    label: 'aazucena.com',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted container on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="flex w-96 justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with cyan QR modules on a dark transparent background.
 */
export const Cyber: Story = {
  args: {
    value: 'https://aazucena.com/analytics',
    label: 'LYTICS_PORTAL',
    variant: 'cyber',
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets rendered side-by-side.
 */
export const Sizes: Story = {
  args: {
    value: 'https://example.com',
  },
  render: () => (
    <div className="flex items-end gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <QrCode key={size} value="https://example.com" size={size} label={size.toUpperCase()} />
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Custom purple foreground on a light purple background.
 */
export const CustomColors: Story = {
  args: {
    value: 'https://aazucena.com',
    fgColor: '#7c3aed',
    bgColor: '#faf5ff',
    label: 'Custom Colors',
  },
};

/**
 * QR code without the quiet zone margin for tight layouts.
 */
export const NoMargin: Story = {
  args: {
    value: 'https://aazucena.com',
    includeMargin: false,
    label: 'No Margin',
  },
};
