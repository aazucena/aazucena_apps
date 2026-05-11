import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConsentForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Legal/ConsentForm',
  component: ConsentForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'GDPR-compliant consent form with analytics, marketing, and functional cookie categories.',
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
} satisfies Meta<typeof ConsentForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
