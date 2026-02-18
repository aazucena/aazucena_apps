import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Composes Button + Spinner — inherits all Button variants |
 * | UX | Replaces children with spinner + loadingText during async submission |
 * | Design | Disables pointer events when loading, shows cursor-wait |
 */
const meta = {
  title: 'Components/Forms/SubmitButton',
  component: SubmitButton,
  parameters: {
    docs: {
      description: {
        component:
          'A form submission button that composes Button and Spinner. Shows a loading state with spinner and optional loading text during async operations.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'glass', 'cyber', 'gradient'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    loading: {
      control: 'boolean',
      table: { category: 'Behavior', type: { summary: 'boolean' } },
    },
    loadingText: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { children: 'Submit' },
};

export const Loading: Story = {
  args: { children: 'Submit', loading: true, loadingText: 'Submitting...' },
};

export const WithIcons: Story = {
  args: {
    children: 'Send',
    leftIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4z" />
      </svg>
    ),
  },
};

export const Glass: Story = {
  args: { children: 'Submit', variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <SubmitButton {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { children: 'SUBMIT', variant: 'cyber' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SubmitButton size="sm">Small</SubmitButton>
      <SubmitButton size="default">Default</SubmitButton>
      <SubmitButton size="lg">Large</SubmitButton>
    </div>
  ),
};
