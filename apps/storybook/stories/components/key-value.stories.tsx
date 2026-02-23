import type { Meta, StoryObj } from '@storybook/react';
import { KeyValue, type KeyValueEntry } from '@aazucena/ui';
import React from 'react';

const meta: Meta<typeof KeyValue> = {
  title: 'Components/Data/KeyValue',
  component: KeyValue,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    entries: {
      control: 'object',
      description: 'Array of key-value entries.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when entries change.',
    },
    keyPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the key input.',
    },
    valuePlaceholder: {
      control: 'text',
      description: 'Placeholder text for the value input.',
    },
    addLabel: {
      control: 'text',
      description: 'Label for the add button.',
    },
    allowAdd: {
      control: 'boolean',
      description: 'Whether adding new entries is allowed.',
    },
    allowRemove: {
      control: 'boolean',
      description: 'Whether removing entries is allowed.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all inputs and actions.',
    },
    copyable: {
      control: 'boolean',
      description: 'Show copy button for values.',
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the editor.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KeyValue>;

const defaultEntries: KeyValueEntry[] = [
  { id: '1', key: 'Content-Type', value: 'application/json' },
  { id: '2', key: 'Authorization', value: 'Bearer sk-...' },
];

const InteractiveKeyValue = (args: any) => {
  const [entries, setEntries] = React.useState<KeyValueEntry[]>(args.entries || []);
  
  // Update local state if args change
  React.useEffect(() => {
    setEntries(args.entries || []);
  }, [args.entries]);

  return (
    <div className="w-[400px]">
      <KeyValue
        {...args}
        entries={entries}
        onChange={(newEntries) => {
          setEntries(newEntries);
          args.onChange?.(newEntries);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    entries: defaultEntries,
  },
  render: (args) => <InteractiveKeyValue {...args} />,
};

export const EnvironmentVariables: Story = {
  args: {
    keyPlaceholder: 'VARIABLE_NAME',
    valuePlaceholder: 'value',
    entries: [
      { id: '1', key: 'NODE_ENV', value: 'production' },
      { id: '2', key: 'DB_HOST', value: 'postgres.internal' },
    ],
    copyable: true,
  },
  render: (args) => <InteractiveKeyValue {...args} />,
};

export const CyberVariant: Story = {
  args: {
    variant: 'cyber',
    entries: [
      { id: '1', key: 'PROTOCOL', value: 'HTTPS' },
      { id: '2', key: 'PORT', value: '443' },
    ],
    addLabel: 'APPEND_PARAMETER',
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8 rounded-xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => <InteractiveKeyValue {...args} />,
};

export const GlassVariant: Story = {
  args: {
    variant: 'glass',
    entries: [
      { id: '1', key: 'Opacity', value: '0.5' },
      { id: '2', key: 'Blur', value: '10px' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8 rounded-xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => <InteractiveKeyValue {...args} />,
};

export const ReadOnly: Story = {
  args: {
    entries: defaultEntries,
    disabled: true,
    copyable: true,
  },
  render: (args) => <InteractiveKeyValue {...args} />,
};
