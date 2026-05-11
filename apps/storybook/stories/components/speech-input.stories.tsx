import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SpeechInput } from '@aazucena/ui';
import { toast, Toaster } from '@aazucena/ui';

const meta: Meta<typeof SpeechInput> = {
  title: 'Components/Forms/SpeechInput',
  component: SpeechInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onResult: {
      action: 'speechRecognized',
      description: 'Callback function when speech is recognized.',
      table: { category: 'Behavior', type: { summary: '() => void' } },
    },
    lang: {
      control: 'text',
      description: 'Language for speech recognition (e.g., "en-US", "es-ES").',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'en-US' },
      },
    },
    continuous: {
      control: 'boolean',
      description: 'If true, keeps listening even if the user pauses speaking.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    interimResults: {
      control: 'boolean',
      description: 'If true, emits interim results as speech is being recognized.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when not listening or no transcript.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Start speaking...' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpeechInput>;

const SpeechInputDemo = (args: Story['args']) => {
  const [lastResult, setLastResult] = React.useState('');
  const handleResult = (text: string) => {
    setLastResult(text);
    toast.success(`Recognized: "${text}"`);
    args?.onResult?.(text);
  };
  return (
    <div className="flex flex-col gap-4 w-96">
      <Toaster />
      <SpeechInput {...args} onResult={handleResult} />
      {lastResult && (
        <p className="text-sm">
          Last Recognized: <strong>{lastResult}</strong>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Note: Speech Recognition requires browser support and microphone access. You might be
        prompted for microphone permission.
      </p>
    </div>
  );
};

export const Default: Story = {
  args: {},
  render: (args) => <SpeechInputDemo {...args} />,
};

export const ContinuousListening: Story = {
  args: {
    continuous: true,
    interimResults: true,
    placeholder: 'Speak continuously...',
  },
  render: (args) => <SpeechInputDemo {...args} />,
};

export const CyberVariant: Story = {
  args: {
    variant: 'cyber',
    lang: 'en-GB',
  },
  render: (args) => <SpeechInputDemo {...args} />,
};

export const GlassVariant: Story = {
  args: {
    variant: 'glass',
    lang: 'es-ES',
    placeholder: 'Empieza a hablar...',
  },
  render: (args) => <SpeechInputDemo {...args} />,
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Click mic to begin dictation...',
  },
  render: (args) => <SpeechInputDemo {...args} />,
};
