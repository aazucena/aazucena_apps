import type { Meta, StoryObj } from '@storybook/react-vite';
import { MentionInput } from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Textarea with inline mention suggestions triggered by a configurable character.
 * - **UX:** Typing `@` opens a filtered dropdown; selecting inserts the mention inline.
 * - **Design:** Dropdown positioned below the input with avatar + label rows.
 * - **Accessibility:** Dropdown items are mouse-interactive; keyboard focus stays in textarea.
 */
const meta = {
  title: 'Components/Forms/MentionInput',
  component: MentionInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Textarea with inline mention suggestions. Type a trigger character (default @) to open a filtered dropdown of suggestions. Selecting a suggestion inserts the mention into the text.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    trigger: {
      control: 'text',
      description: 'Character that triggers the suggestion dropdown',
      table: { category: 'Behavior', defaultValue: { summary: '@' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[24rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MentionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const users = [
  { id: '1', label: 'Alice Chen' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Carol Davis' },
  { id: '4', label: 'Dave Wilson' },
  { id: '5', label: 'Eve Johnson' },
];

const MentionDemo = (props: React.ComponentProps<typeof MentionInput>) => {
  const [value, setValue] = useState('');
  return <MentionInput {...props} value={value} onChange={setValue} />;
};

export const Basic: Story = {
  args: {
    suggestions: users,
    placeholder: 'Type @ to mention someone...',
  },
  render: (args) => <MentionDemo {...args} />,
};

export const CustomTrigger: Story = {
  args: {
    suggestions: users,
    trigger: '#',
    placeholder: 'Type # to tag a user...',
  },
  render: (args) => <MentionDemo {...args} />,
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <MentionDemo {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
  render: (args) => <MentionDemo {...args} />,
};

export const Sizes: Story = {
  args: {
    suggestions: users,
  },
  render: () => (
    <div className="space-y-4">
      <MentionDemo suggestions={users} size="sm" placeholder="Small (@)" />
      <MentionDemo suggestions={users} size="md" placeholder="Medium (@)" />
      <MentionDemo suggestions={users} size="lg" placeholder="Large (@)" />
    </div>
  ),
};
