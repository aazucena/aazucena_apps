import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent } from '@storybook/test';
import { AssistantTrigger } from '@aazucena/ui';
import { 
  Chat, 
  ChatFeed, 
  ChatMessage, 
  ChatAvatar, 
  ChatContent, 
  ChatBubble,
  ChatInputContainer,
  ChatInputWrapper,
  ChatInputArea,
  ChatInputSubmit,
  Card
} from '@aazucena/ui';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * ## Engineering Standards
 * - **UX:** Floating Action Button (FAB) pattern for global AI access.
 * - **Accessibility:** Uses Tooltip for hover labels and ARIA labels for state transition.
 * - **Animation:** Framer Motion orchestrates the Icon toggle and Chat window presence.
 * - **Variants:** Supports `glass`, `cyber`, and `ai` (gradient) styles to match site context.
 */
const meta = {
  title: 'Components/AI/AssistantTrigger',
  component: AssistantTrigger,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A global floating trigger used to activate the AI assistant. Features state-aware icons, notification badges, and built-in tooltip support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'ai'],
      description: 'The visual style of the trigger',
      table: { category: 'Appearance' }
    },
    size: {
      control: 'select',
      options: ['default', 'lg', 'xl'],
      description: 'The physical size of the trigger',
      table: { category: 'Appearance' }
    },
    isOpen: {
      control: 'boolean',
      description: 'Current toggle state',
      table: { category: 'State' }
    },
    hasNotification: {
      control: 'boolean',
      description: 'Displays a pulsing notification dot',
      table: { category: 'State' }
    },
    label: {
      control: 'text',
      description: 'Optional text label shown next to icon',
      table: { category: 'Content' }
    },
    tooltip: {
      control: 'text',
      description: 'Text shown in the hover tooltip',
      table: { category: 'Content' }
    }
  },
} satisfies Meta<typeof AssistantTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard AI-branded trigger with built-in tooltip.
 */
export const Basic: Story = {
  args: {
    variant: 'ai',
    tooltip: 'Ask AI Assistant',
    className: 'static', // Override fixed for demo
  },
};

/**
 * Full implementation example showing the transition to a chat window.
 */
export const FullInterface: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || false);
    return (
      <div className="h-[500px] w-[500px] relative border border-dashed rounded-[3rem] flex items-center justify-center bg-muted/5">
        <div className="text-center space-y-2 opacity-20 select-none">
          <p className="text-sm font-black tracking-widest uppercase">STAGE_ENVIRONMENT</p>
          <p className="text-[10px] font-mono italic">// TRIGGER_IS_BOTTOM_RIGHT</p>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
              className="absolute bottom-24 right-4 w-80 z-50"
            >
              <Card variant="cyber" className="h-[400px] flex flex-col overflow-hidden shadow-2xl border-cyan-500/30">
                <Chat>
                  <div className="p-4 border-b border-cyan-500/10 bg-cyan-500/5">
                    <p className="text-[10px] font-mono text-cyan-500 tracking-tighter">INTELLIGENCE_UPLINK_ESTABLISHED</p>
                  </div>
                  <ChatFeed className="p-4">
                    <ChatMessage role="assistant">
                      <ChatAvatar variant="ai" />
                      <ChatContent role="assistant">
                        <ChatBubble variant="cyber">
                          Protocol 7 initiated. How can I assist with your engineering queries today?
                        </ChatBubble>
                      </ChatContent>
                    </ChatMessage>
                  </ChatFeed>
                  <ChatInputContainer className="p-4 border-t border-cyan-500/10">
                    <ChatInputWrapper>
                      <ChatInputArea placeholder="Command input..." className="min-h-[40px] text-xs" />
                      <ChatInputSubmit className="h-8 w-8" />
                    </ChatInputWrapper>
                  </ChatInputContainer>
                </Chat>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AssistantTrigger 
          {...args}
          className="absolute bottom-4 right-4" 
          isOpen={isOpen} 
          onClick={() => setIsOpen(!isOpen)} 
        />
      </div>
    );
  },
};

/**
 * High-urgency state with notification badge and cyber aesthetic.
 */
export const AlertState: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    label: 'UPLINK',
    hasNotification: true,
    tooltip: '1 Pending Transmission',
  },
};

/**
 * Minimalist glass variant, ideal for content-heavy pages.
 */
export const GlassVariant: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    size: 'lg',
  },
};

/**
 * Automated test for opening the assistant interface.
 */
export const AutomatedToggle: Story = {
  ...FullInterface,
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    
    // Initial state check
    await new Promise(r => setTimeout(r, 1000));
    
    // Open
    await userEvent.click(trigger);
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 1500));
    
    // Close
    await userEvent.click(trigger);
  }
};
