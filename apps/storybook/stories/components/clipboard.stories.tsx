import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clipboard } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Copy-to-clipboard utility with animated visual feedback.
 * - **UX:** Icon transition (copy -> check) confirms successful copy. Supports fallback for non-secure contexts.
 * - **Design:** Inline display with truncated value, optional label, and configurable timeout for feedback state.
 */
const meta = {
  title: 'Components/Utilities/Clipboard',
  component: Clipboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Copy-to-clipboard component with visual confirmation feedback. Displays the value with an optional label and a copy trigger button that animates between copy and check states.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'minimal'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'minimal'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    value: {
      control: 'text',
      description: 'The text value to copy to clipboard',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label displayed before the value',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    timeout: {
      control: 'number',
      description: 'Duration in ms to show the "copied" state',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '2000' },
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
} satisfies Meta<typeof Clipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard clipboard component with a label and install command.
 */
export const Basic: Story = {
  args: {
    value: 'pnpm install @aazucena/ui',
    label: 'Install',
    size: 'md',
    variant: 'default',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for immersive UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Clipboard {...args} />
    </div>
  ),
};

/**
 * High-fidelity cyber variant with monospace font and cyan accents.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    value: 'ssh root@192.168.1.1 -p 2222',
    label: undefined,
  },
};

/**
 * Minimal variant with no background, ideal for inline copy triggers.
 */
export const Minimal: Story = {
  args: {
    ...Basic.args,
    variant: 'minimal',
    value: 'https://aazucena.com',
    label: undefined,
  },
};

// --- SIZE VARIANTS ---

/**
 * Side-by-side comparison of all available size presets.
 */
export const Sizes: Story = {
  args: {
    value: 'pnpm dev',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Clipboard size="sm" value="pnpm dev" label="Small" />
      <Clipboard size="md" value="pnpm build" label="Medium" />
      <Clipboard size="lg" value="pnpm test" label="Large" />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * API key display with a descriptive label, demonstrating real-world usage.
 */
export const ApiKey: Story = {
  args: {
    value: 'sk-proj-abc123def456ghi789',
    label: 'API Key',
    variant: 'default',
    size: 'md',
  },
};

/**
 * Multiple clipboard items stacked, simulating an environment variables panel.
 */
export const EnvVariables: Story = {
  args: {
    value: 'postgres://localhost:5432/mydb',
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Clipboard variant="default" value="postgres://localhost:5432/mydb" label="DATABASE_URL" />
      <Clipboard variant="default" value="sk-proj-abc123" label="API_KEY" />
      <Clipboard variant="default" value="https://cdn.example.com" label="CDN_URL" />
    </div>
  ),
};
