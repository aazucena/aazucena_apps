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
      options: ['browser', 'phone', 'tablet', 'laptop'], // Added 'laptop'
      table: {
        category: 'Appearance',
        type: { summary: "'browser' | 'phone' | 'tablet' | 'laptop'" }, // Updated summary
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

const FullContent = () => (
  <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground">
    <p className="text-sm">Full content area</p>
  </div>
);

// --- SPECIFIC DEVICE MOCKUPS ---

export const Browser: Story = {
  args: {
    device: 'browser',
    size: 'lg',
    url: 'https://aazucena.dev',
    children: <FullContent />,
  },
};

export const iPad: Story = {
  args: {
    device: 'tablet',
    size: 'lg',
    children: <FullContent />,
  },
};

export const iPhone: Story = {
  args: {
    device: 'phone',
    size: 'lg',
    children: <FullContent />,
  },
};

export const Android: Story = {
  args: {
    device: 'phone',
    size: 'lg',
    variant: 'cyber', // Differentiate with cyber variant
    children: (
      <div className="flex h-full w-full flex-col items-center justify-center bg-black/80 font-mono text-cyan-400">
        <p>ANDROID_OS</p>
        <p>INIT_COMPLETE</p>
      </div>
    ),
  },
};

export const MacBookPro: Story = {
  args: {
    device: 'laptop',
    size: 'lg',
    url: 'https://dev.portal',
    children: <FullContent />,
  },
};

export const Safari: Story = {
  args: {
    device: 'browser',
    size: 'lg',
    url: 'https://safari.apple.com',
    children: (
      <div className="flex h-full w-full items-center justify-center bg-blue-500/10 text-muted-foreground">
        <p className="text-sm">Safari Browser Content</p>
      </div>
    ),
  },
};
