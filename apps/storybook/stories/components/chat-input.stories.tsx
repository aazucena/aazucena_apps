import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatInput } from '@aazucena/ui';
import { toast, Toaster } from '@aazucena/ui'; // Assuming Toaster and toast are available

const meta: Meta<typeof ChatInput> = {
  title: 'Components/Chat/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSendMessage: {
      action: 'messageSent',
      description: 'Callback triggered when a message is sent.',
      table: {
        category: 'Behavior',
        type: { summary: '(message: string, attachments?: File[]) => void' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input area.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    minRows: {
      control: 'number',
      description: 'Minimum rows for the textarea.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
      },
    },
    maxRows: {
      control: 'number',
      description: 'Maximum rows for the textarea before scrolling.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
      },
    },
    showToolbar: {
      control: 'boolean',
      description: 'Toggle visibility of the toolbar (attachment, speech).',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    showModelSelector: {
      control: 'boolean',
      description: 'Toggle visibility of the AI model selector.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    showSpeechInput: {
      control: 'boolean',
      description: 'Toggle visibility of the speech input button.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    showAttachmentButton: {
      control: 'boolean',
      description: 'Toggle visibility of the file attachment button.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    acceptedFileTypes: {
      control: 'object',
      description: 'Array of accepted file types for attachments.',
      table: {
        category: 'Behavior',
        type: { summary: 'object' },
      },
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files that can be attached.',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
      },
    },
    maxFileSize: {
      control: 'number',
      description: 'Maximum file size in bytes.',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
      },
    },
    onFileChange: {
      action: 'filesChanged',
      description: 'Callback when files are added or removed.',
      table: {
        category: 'Behavior',
        type: { summary: '(files: File[]) => void' },
      },
    },
    availableModels: {
      control: 'object',
      description: 'Array of available AI models for selection.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    selectedModelId: {
      control: 'text',
      description: 'ID of the currently selected model.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    onSelectModel: {
      action: 'modelSelected',
      description: 'Callback when a model is selected.',
      table: {
        category: 'Behavior',
        type: { summary: '(modelId: string) => void' },
      },
    },
    isSending: {
      control: 'boolean',
      description: 'If true, shows a sending state (loader icon).',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
      },
    },
    commandPaletteTrigger: {
      control: 'text',
      description: 'Key trigger for command palette (e.g., "/").',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    onCommand: {
      action: 'commandTriggered',
      description: 'Callback when command palette trigger is pressed.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    autoReset: {
      control: 'boolean',
      description: 'If true, clears the input and attachments after sending.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    globalDropzone: {
      control: 'boolean',
      description: 'If true, enables drag-and-drop file support across the entire document.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

const sampleModels = [
  { id: 'gpt4', name: 'GPT-4' },
  { id: 'claude3', name: 'Claude 3' },
  { id: 'gemini', name: 'Gemini Pro' },
];

export const Default: Story = {
  args: {
    onSendMessage: (msg, attachments) =>
      toast.success(`Sent: "${msg}" with ${attachments?.length || 0} attachments`),
    availableModels: sampleModels,
    selectedModelId: 'gpt4',
  },
  render: (args) => (
    <div className="w-[600px] border rounded-lg bg-background p-4">
      <Toaster />
      <ChatInput {...args} />
    </div>
  ),
};

export const WithAttachments: Story = {
  args: {
    onSendMessage: (msg, attachments) =>
      toast.success(`Sent: "${msg}" with ${attachments?.map((a) => a.name).join(', ')}`),
    showAttachmentButton: true,
    acceptedFileTypes: ['image/*', 'application/pdf', '.txt'],
    maxFiles: 3,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  render: (args) => (
    <div className="w-[600px] border rounded-lg bg-background p-4">
      <Toaster />
      <ChatInput {...args} />
    </div>
  ),
};

export const SendingState: Story = {
  args: {
    onSendMessage: (msg) => {
      toast.success(`Sent: "${msg}"`);
      return new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async send
    },
    isSending: true,
  },
  render: (args) => (
    <div className="w-[600px] border rounded-lg bg-background p-4">
      <Toaster />
      <ChatInput {...args} />
    </div>
  ),
};

export const FullFeatured: Story = {
  args: {
    onSendMessage: (msg, attachments) =>
      toast.success(`Sent: "${msg}" (Model: claude3) with ${attachments?.length || 0} files`),
    showToolbar: true,
    showModelSelector: true,
    showSpeechInput: true,
    showAttachmentButton: true,
    availableModels: sampleModels,
    selectedModelId: 'claude3',
    acceptedFileTypes: ['image/*', '.pdf', '.docx'],
    maxFiles: 2,
    maxFileSize: 10 * 1024 * 1024,
    globalDropzone: true,
  },
  render: (args) => (
    <div className="w-[600px] h-[400px] border rounded-lg bg-background p-4 flex flex-col justify-end">
      <Toaster />
      <p className="flex-grow text-sm text-muted-foreground p-2">
        Try typing, using speech input, attaching files (drag/drop or button), or changing the
        model.
      </p>
      <ChatInput {...args} />
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    onSendMessage: (msg) => toast.success(`Sent: "${msg}"`),
    showToolbar: false,
    showModelSelector: false,
    showSpeechInput: false,
    showAttachmentButton: false,
  },
  render: (args) => (
    <div className="w-[400px] border rounded-lg bg-background p-4">
      <Toaster />
      <ChatInput {...args} />
    </div>
  ),
};

export const CustomMinMaxHeight: Story = {
  args: {
    onSendMessage: (msg) => toast.success(`Sent: "${msg}"`),
    minRows: 3,
    maxRows: 5,
  },
  render: (args) => (
    <div className="w-[500px] border rounded-lg bg-background p-4">
      <Toaster />
      <ChatInput {...args} />
    </div>
  ),
};
