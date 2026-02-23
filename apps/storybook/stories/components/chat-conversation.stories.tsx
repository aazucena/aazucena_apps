import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatConversation, ChatMessage, ChatBubble, ChatInputArea, ChatInputSubmit, ChatAgent, ChatQuickActions, ChatCheckpoint, type ConversationMessage } from '@aazucena/ui';

const meta: Meta<typeof ChatConversation> = {
  title: 'Components/Chat/ChatConversation',
  component: ChatConversation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    messages: {
      control: 'object',
      description: 'An array of message objects to display in the conversation feed.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    onSendMessage: {
      action: 'sendMessage',
      description: 'Callback function when a new message is sent.',
      table: {
        category: 'Behavior',
        type: { summary: '(message: string) => void' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the chat conversation header.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Chat Conversation' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the chat input.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Type your message...' },
      },
    },
    footer: {
      control: 'text',
      description: 'Optional footer content for the chat conversation.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
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
type Story = StoryObj<typeof ChatConversation>;

const sampleMessages: ConversationMessage[] = [
  {
    id: '1',
    role: 'system',
    content: (
      <ChatCheckpoint status="success" label="Session initialized" timestamp="10:00:00" />
    ),
  },
  {
    id: '2',
    role: 'user',
    content: <ChatBubble role="user">Hello there!</ChatBubble>,
  },
  {
    id: '3',
    role: 'assistant',
    content: <ChatBubble role="assistant">How can I assist you today?</ChatBubble>,
  },
  {
    id: '4',
    role: 'assistant',
    content: (
      <ChatBubble role="assistant">
        I can help with code, data analysis, and general information.
      </ChatBubble>
    ),
  },
  {
    id: '5',
    role: 'user',
    content: <ChatBubble role="user">What's the capital of France?</ChatBubble>,
  },
  {
    id: '6',
    role: 'assistant',
    content: (
      <ChatBubble role="assistant">
        The capital of France is Paris.
        <ChatQuickActions
          actions={[{ id: 'more_info', label: 'More about Paris' }]}
        />
      </ChatBubble>
    ),
  },
  {
    id: '7',
    role: 'system',
    content: <ChatAgent name="Data_Agent" status="active" role="Information Retriever" />,
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
    title: 'Support Chat',
  },
  render: (args) => (
    <div className="h-[600px] w-[500px]">
      <ChatConversation {...args} />
    </div>
  ),
};

export const CyberVariant: Story = {
  args: {
    messages: sampleMessages,
    title: 'SYSTEM LOGS // ENCLAVE_01',
    variant: 'cyber',
  },
  render: (args) => (
    <div className="h-[600px] w-[500px]">
      <ChatConversation {...args} />
    </div>
  ),
};

export const GlassVariant: Story = {
  args: {
    messages: sampleMessages,
    title: 'Atmospheric Controls',
    variant: 'glass',
  },
  render: (args) => (
    <div className="h-[600px] w-[500px] bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8 rounded-[3rem]">
      <ChatConversation {...args} />
    </div>
  ),
};

export const EmptyConversation: Story = {
  args: {
    messages: [],
    title: 'New Conversation',
    placeholder: 'Start typing to begin...',
  },
  render: (args) => (
    <div className="h-[600px] w-[500px]">
      <ChatConversation {...args} />
    </div>
  ),
};
