import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { SecurityQuestionsForm } from '@aazucena/forms/templates';

/**
 * ## SecurityQuestionsForm
 * KBA (Knowledge-Based Authentication) setup form — the user selects 3 distinct
 * security questions from a preset list and provides answers that are stored hashed.
 */
const meta = {
  title: 'Forms/Auth/SecurityQuestionsForm',
  component: SecurityQuestionsForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed security questions form using `securityQuestionsSchema`. Prevents duplicate question selection across the 3 slots.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
    onSuccess: { table: { category: 'Events' } },
    onError: { table: { category: 'Events' } },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof SecurityQuestionsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-8 backdrop-blur">
        <Story />
      </div>
    ),
  ],
};

export const Cyber: Story = {
  args: { variant: 'cyber' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl border border-cyan-500/20 bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
