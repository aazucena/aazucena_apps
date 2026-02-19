import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Chat,
  ChatFeed,
  ChatMessage,
  ChatAvatar,
  ChatContent,
  ChatBubble,
  ChatReasoning,
  ChatInputContainer,
  ChatInputWrapper,
  ChatInputArea,
  ChatInputSubmit,
  ChatInputFooter,
  ChatThread,
  ChatThreadTitle,
  ChatThreadMeta,
  ChatThreadAction,
  ChatThreadIcon,
  ChatThreadContent,
  ChatHeader,
  ChatActions,
} from '@aazucena/ui';
import { Badge, Button } from '@aazucena/ui';
import { Trash, Message, Copy, Refresh, Sparkles } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Deeply atomic system for building high-fidelity AI interfaces.
 * - **Variants:** Supports `glass`, `cyber`, `ai`, and `muted` themes.
 * - **UX:** Integrated `ChatReasoning` for "Chain of Thought" visibility and `ChatActions` for message-level utilities.
 * - **Responsiveness:** Fluid input system with `ChatInputArea` (Textarea auto-expand ready) and sticky footer.
 */
const meta = {
  title: 'Components/AI/Chat',
  component: Chat,
  subcomponents: {
    ChatFeed,
    ChatMessage,
    ChatAvatar,
    ChatContent,
    ChatBubble,
    ChatReasoning,
    ChatInputContainer,
    ChatInputWrapper,
    ChatInputArea,
    ChatInputSubmit,
    ChatInputFooter,
    ChatThread,
    ChatHeader,
    ChatActions,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive suite of components for building AI-driven conversational interfaces. Includes message feeds, inputs, and thread management.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard conversational interface with mixed message roles and internal reasoning.
 */
export const FullInterface: Story = {
  render: () => (
    <div className="h-[600px] flex flex-col bg-background border m-10 rounded-[2rem] overflow-hidden shadow-2xl">
      <Chat>
        <div className="p-4 border-b bg-muted/30 flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              AZUCENA_AI // AGENT_01
            </span>
          </div>
          <Badge variant="outline" size="xs">
            v3.5_SONNET
          </Badge>
        </div>

        <ChatFeed>
          <ChatMessage role="assistant">
            <ChatAvatar variant="ai" />
            <ChatContent role="assistant">
              <ChatBubble>
                Hello! I am Azucena_AI. I've finished indexing your latest telemetry stream. How can
                I help you analyze the results?
              </ChatBubble>
              <ChatActions>
                <Button variant="ghost" size="icon" className="size-6">
                  <Copy size={12} />
                </Button>
                <Button variant="ghost" size="icon" className="size-6">
                  <Refresh size={12} />
                </Button>
              </ChatActions>
            </ChatContent>
          </ChatMessage>

          <ChatMessage role="user">
            <ChatAvatar variant="default" />
            <ChatContent role="user">
              <ChatBubble variant="muted" role="user">
                What is the current stability index for the Mesosphere layer?
              </ChatBubble>
            </ChatContent>
          </ChatMessage>

          <ChatMessage role="assistant">
            <ChatAvatar variant="cyber" />
            <ChatContent role="assistant">
              <ChatReasoning>
                Querying database: stability_metrics.mesosphere... Normalizing data over 60m
                window... Result: 0.99984
              </ChatReasoning>
              <ChatBubble variant="cyber">
                Stability is at **99.98%**. Signal gain is consistent at 85dBm with zero dropped
                packets in the last 15 minutes.
              </ChatBubble>
            </ChatContent>
          </ChatMessage>
        </ChatFeed>

        <ChatInputContainer>
          <ChatInputWrapper>
            <ChatInputArea placeholder="Command input..." />
            <ChatInputSubmit />
          </ChatInputWrapper>
          <ChatInputFooter>
            <div className="flex gap-4">
              <span>Latency: 42ms</span>
              <span>Tokens: 1.2K</span>
            </div>
            <span className="text-primary tracking-tighter">ENCRYPTION_ACTIVE</span>
          </ChatInputFooter>
        </ChatInputContainer>
      </Chat>
    </div>
  ),
};

/**
 * Showcase of message bubble themes for assistant responses.
 */
export const MessageVariants: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-10 space-y-12">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center">
          DEFAULT_THEME
        </p>
        <ChatMessage role="assistant">
          <ChatAvatar variant="default" />
          <ChatContent role="assistant">
            <ChatBubble variant="default">
              Standard typography and contrast for high readability.
            </ChatBubble>
          </ChatContent>
        </ChatMessage>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center">
          CYBER_THEME
        </p>
        <ChatMessage role="assistant">
          <ChatAvatar variant="cyber" />
          <ChatContent role="assistant">
            <ChatBubble variant="cyber">
              High-contrast borders and mono font for technical outputs.
            </ChatBubble>
          </ChatContent>
        </ChatMessage>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center">
          GLASS_THEME
        </p>
        <div className="p-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl">
          <ChatMessage role="assistant">
            <ChatAvatar variant="glass" />
            <ChatContent role="assistant">
              <ChatBubble variant="glass">
                Subtle transparency for atmospheric UI layers.
              </ChatBubble>
            </ChatContent>
          </ChatMessage>
        </div>
      </div>
    </div>
  ),
};

/**
 * Thread management components for sidebar or history navigation.
 */
export const ThreadList: Story = {
  render: () => (
    <div className="max-w-md mx-auto p-10 space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-6">
        Archive_Threads
      </h3>

      <ChatThread isActive>
        <ChatThreadIcon>
          <Sparkles size={18} className="text-primary" />
        </ChatThreadIcon>
        <ChatThreadContent>
          <ChatThreadTitle>Mesosphere Stability Analysis</ChatThreadTitle>
          <ChatThreadMeta>ACTIVE_SESSION</ChatThreadMeta>
        </ChatThreadContent>
        <ChatThreadAction>
          <Trash size={14} />
        </ChatThreadAction>
      </ChatThread>

      <ChatThread>
        <ChatThreadIcon>
          <Message size={18} />
        </ChatThreadIcon>
        <ChatThreadContent>
          <ChatThreadTitle>Database Migration Protocol</ChatThreadTitle>
          <ChatThreadMeta>2h ago</ChatThreadMeta>
        </ChatThreadContent>
        <ChatThreadAction>
          <Trash size={14} />
        </ChatThreadAction>
      </ChatThread>

      <ChatThread variant="cyber">
        <ChatThreadIcon>
          <Message size={18} className="text-cyan-400" />
        </ChatThreadIcon>
        <ChatThreadContent>
          <ChatThreadTitle variant="cyber">// SIGNAL_LOCK_0x7F</ChatThreadTitle>
          <ChatThreadMeta variant="cyber">TERMINATED</ChatThreadMeta>
        </ChatThreadContent>
        <ChatThreadAction variant="cyber">
          <Copy size={14} />
        </ChatThreadAction>
      </ChatThread>
    </div>
  ),
};
