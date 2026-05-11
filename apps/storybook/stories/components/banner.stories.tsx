import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Full-width notification banner for site-wide announcements.
 * - **UX:** Supports dismissible state with smooth hide transition.
 * - **Design:** Seven semantic variants (default, glass, cyber, info, warning, destructive, success).
 * - **Accessibility:** Uses `role="banner"` and labeled dismiss button.
 */
const meta = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Full-width notification banner for announcements, warnings, and promotions. Supports sticky-top and inline positioning with an optional dismiss button.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'info', 'warning', 'destructive', 'success'],
      description: 'Visual style and color scheme',
      table: {
        category: 'Appearance',
        type: {
          summary: "'default' | 'glass' | 'cyber' | 'info' | 'warning' | 'destructive' | 'success'",
        },
        defaultValue: { summary: 'default' },
      },
    },
    position: {
      control: 'select',
      options: ['top', 'inline'],
      description: 'Sticky top positioning or inline block',
      table: {
        category: 'Appearance',
        type: { summary: "'top' | 'inline'" },
        defaultValue: { summary: 'top' },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Show a close button to dismiss the banner',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Callback when the banner is dismissed',
      table: { category: 'Behavior' },
    },
    children: {
      control: 'text',
      description: 'Banner content',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[36rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard banner with primary color scheme and inline positioning.
 */
export const Basic: Story = {
  args: {
    children: 'New version 4.2.0 is now available!',
    variant: 'default',
    position: 'inline',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic banner on a gradient background for immersive contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    children: 'Welcome to the immersive experience',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Banner {...args} />
    </div>
  ),
};

/**
 * Terminal-style cyber banner for technical announcements.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    children: 'SYSTEM_UPDATE :: FIRMWARE_v3.1.7 DEPLOYED',
  },
};

// --- SEMANTIC VARIANTS ---

/**
 * Showcase of all semantic color variants in inline positioning.
 */
export const SemanticVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <Banner variant="info" position="inline">
        Scheduled maintenance at 2:00 AM UTC.
      </Banner>
      <Banner variant="warning" position="inline">
        API rate limit approaching threshold.
      </Banner>
      <Banner variant="destructive" position="inline">
        Service outage detected in region us-east-1.
      </Banner>
      <Banner variant="success" position="inline">
        All systems operational. Deploy successful.
      </Banner>
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Dismissible banner with close button and callback action.
 */
export const Dismissible: Story = {
  args: {
    ...Basic.args,
    variant: 'info',
    dismissible: true,
    children: 'This banner can be closed by the user.',
  },
};

/**
 * Inline-positioned banner used inside a content area instead of sticky top.
 */
export const InlinePosition: Story = {
  args: {
    ...Basic.args,
    variant: 'warning',
    position: 'inline',
    dismissible: true,
    children: 'Your session will expire in 5 minutes.',
  },
};
