import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ContactUsForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Portfolio/ContactUsForm',
  component: ContactUsForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Main portfolio contact form. Uses contactFormSchema with Strapi formType.',
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
  },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof ContactUsForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-8">
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
