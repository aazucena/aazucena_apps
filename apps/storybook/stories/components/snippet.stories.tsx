import type { Meta, StoryObj } from '@storybook/react';
import { Snippet } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg) |
 * | UX | One-click copy with visual feedback (check icon) |
 * | Design | Mono font code display with optional command-line symbol prefix |
 */
const meta = {
  title: 'Components/Display/Snippet',
  component: Snippet,
  parameters: {
    docs: {
      description: {
        component:
          'A code snippet display component with optional symbol prefix and copy-to-clipboard functionality. Shows a check icon after copying with configurable timeout.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    symbol: {
      control: 'text',
      table: { category: 'Content', defaultValue: { summary: '$' } },
    },
    copyable: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    children: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Snippet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { children: 'npm install @aazucena/ui' },
};

export const NoSymbol: Story = {
  args: { children: 'const x = 42;', symbol: '' },
};

export const NoCopy: Story = {
  args: { children: 'pnpm dev', copyable: false },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Snippet {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { children: 'turbo build --force', variant: 'cyber' },
};

export const Sizes: Story = {
  args: {
    children: 'pnpm install',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Snippet key={s} size={s}>
          pnpm install
        </Snippet>
      ))}
    </div>
  ),
};
