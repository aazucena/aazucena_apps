import type { Meta, StoryObj } from '@storybook/react';
import { DeviceMockup } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + device type (browser / phone / tablet) + size (sm / md / lg) |
 * | UX | Provides realistic device chrome for previewing content in context |
 * | Design | Compound variants map device + size to pixel-accurate widths; browser shows traffic-light dots + URL bar |
 */
const meta = {
  title: 'Components/Data Display/DeviceMockup',
  component: DeviceMockup,
  parameters: {
    docs: {
      description: {
        component:
          'A responsive device frame component that wraps arbitrary content in browser, phone, or tablet chrome. Supports three visual variants (default, glass, cyber), three device types, and three sizes via compound CVA variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    device: {
      control: 'select',
      options: ['browser', 'phone', 'tablet'],
      table: {
        category: 'Appearance',
        type: { summary: "'browser' | 'phone' | 'tablet'" },
        defaultValue: { summary: 'browser' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    url: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DeviceMockup>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div className="flex h-48 items-center justify-center bg-muted/30 text-muted-foreground">
    <p className="text-sm">Page content goes here</p>
  </div>
);

// --- BASIC USAGE ---

/**
 * Default browser mockup with a URL bar and traffic-light dots.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    device: 'browser',
    size: 'md',
    url: 'https://azucena.dev',
    children: <SampleContent />,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with translucent border styling, shown over a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <DeviceMockup {...args}>
        <SampleContent />
      </DeviceMockup>
    </div>
  ),
};

/**
 * Cyber variant featuring cyan accent borders, mono URL font, and a subtle glow shadow.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    url: 'https://sys.azucena.dev',
  },
};

// --- DEVICE TYPES ---

/**
 * All three device types rendered side by side at the small size for comparison.
 */
export const DeviceTypes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <DeviceMockup device="browser" size="sm" url="https://azucena.dev">
        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
          Browser
        </div>
      </DeviceMockup>
      <DeviceMockup device="tablet" size="sm">
        <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
          Tablet
        </div>
      </DeviceMockup>
      <DeviceMockup device="phone" size="sm">
        <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
          Phone
        </div>
      </DeviceMockup>
    </div>
  ),
};

// --- SIZE VARIANTS ---

/**
 * Browser device at all three size breakpoints (sm 480px, md 640px, lg 800px).
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <DeviceMockup key={s} device="browser" size={s} url={`size: ${s}`}>
          <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
            {s.toUpperCase()}
          </div>
        </DeviceMockup>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Phone mockup in cyber variant demonstrating the notch and home-indicator chrome.
 */
export const CyberPhone: Story = {
  args: {
    variant: 'cyber',
    device: 'phone',
    size: 'md',
  },
  render: (args) => (
    <div className="rounded-2xl bg-black p-8">
      <DeviceMockup {...args}>
        <div className="flex h-64 flex-col items-center justify-center gap-2 bg-black/80">
          <span className="font-mono text-xs text-cyan-400">SYS://MOBILE</span>
          <span className="text-[10px] text-cyan-500/50">DEVICE CONNECTED</span>
        </div>
      </DeviceMockup>
    </div>
  ),
};
