import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThoughtTrace, ThoughtStep } from '@aazucena/ui';
import { Badge } from '@aazucena/ui';
import { Activity, Shield, Zap, Terminal } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic primitive for visualizing "Chain of Thought" or asynchronous reasoning steps.
 * - **UX:** Features automated entrance animations (`fade-in`, `slide-in`) and pulsing active indicators.
 * - **Aesthetics:** Aligned with site-wide themes (`cyber`, `ai`) featuring high-fidelity mono-typography.
 * - **Design:** Optimized for embedding within `ChatBubble` or `Terminal` components to show background logic.
 */
const meta = {
  title: 'Components/Data/ThoughtTrace',
  component: ThoughtTrace,
  subcomponents: { ThoughtStep } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for displaying a sequence of "thoughts" or internal processing steps, commonly used in AI reasoning views.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber', 'ai'],
      description: 'The visual theme of the trace list',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof ThoughtTrace>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a basic processing sequence.
 */
export const Basic: Story = {
  render: () => (
    <div className="w-80 p-8 border rounded-3xl bg-muted/5">
      <ThoughtTrace>
        <ThoughtStep status="completed">Initializing buffer stream</ThoughtStep>
        <ThoughtStep status="completed">Authenticating uplink</ThoughtStep>
        <ThoughtStep status="active">Ingesting telemetry data</ThoughtStep>
        <ThoughtStep status="pending">Optimizing cache</ThoughtStep>
      </ThoughtTrace>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="w-96 p-10 bg-black border border-cyan-500/10 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Terminal size={14} className="text-cyan-500 opacity-40" />
        <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.2em]"># INTERNAL_PROCESS_TRACE</span>
      </div>
      <ThoughtTrace variant="cyber">
        <ThoughtStep variant="cyber" status="completed">DECRYPTING_SIGNAL_0x7F</ThoughtStep>
        <ThoughtStep variant="cyber" status="completed">RSA_KEY_VERIFIED</ThoughtStep>
        <ThoughtStep variant="cyber" status="active">MAPPING_NODE_TOPOLOGY</ThoughtStep>
        <ThoughtStep variant="cyber" status="pending">SYNC_MASTER_KERNEL</ThoughtStep>
      </ThoughtTrace>
    </div>
  ),
};

/**
 * Specialized AI reasoning variant used within chat interfaces.
 */
export const AIReasoning: Story = {
  render: () => (
    <div className="w-96 p-8 border-2 border-primary/10 rounded-[2rem] bg-primary/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Reasoning_Layer</span>
        </div>
        <Badge variant="secondary" size="xs">CLAUDE_3.5</Badge>
      </div>
      <ThoughtTrace variant="ai">
        <ThoughtStep variant="ai" status="completed">INDEXING_PROJECT_ROADMAP</ThoughtStep>
        <ThoughtStep variant="ai" status="completed">ANALYZING_COMPONENT_ARCHITECTURE</ThoughtStep>
        <ThoughtStep variant="ai" status="active">GENERATING_GOLD_STANDARD_DOCS</ThoughtStep>
        <ThoughtStep variant="ai" status="pending">VALIDATING_STORYBOOK_SUITE</ThoughtStep>
      </ThoughtTrace>
    </div>
  ),
};

/**
 * Demonstrates the various state transitions for a single step.
 */
export const StepStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[9px] opacity-40 uppercase font-black">Completed</p>
        <ThoughtStep status="completed">Protocol verification successful.</ThoughtStep>
      </div>
      <div className="space-y-2">
        <p className="text-[9px] opacity-40 uppercase font-black">Active (Pulsing)</p>
        <ThoughtStep status="active">Establishing encrypted handshake</ThoughtStep>
      </div>
      <div className="space-y-2">
        <p className="text-[9px] opacity-40 uppercase font-black">Pending</p>
        <ThoughtStep status="pending">Awaiting signal response...</ThoughtStep>
      </div>
    </div>
  ),
};
