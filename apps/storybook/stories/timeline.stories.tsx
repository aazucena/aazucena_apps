import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Timeline,
  TimelineBadge,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineLine,
  TimelineTitle,
} from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, CheckCircle, Database } from '@aazucena/icons';
import { Badge, Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout system for chronological events and sequential technical logs.
 * - **Responsiveness:** Supports `default` (Left-aligned) and `alternating` (Centered) layouts for mobile vs desktop views.
 * - **Aesthetics:** Aligned with site-wide themes (`default`, `cyber`) featuring high-fidelity glowing dots and gradient connectors.
 * - **Composition:** Fully modular parts (Item, Dot, Line, Content, Header, Badge) for flexible temporal narratives.
 */
const meta = {
  title: 'Components/Data/Timeline',
  component: Timeline,
  subcomponents: {
    TimelineItem,
    TimelineDot,
    TimelineLine,
    TimelineContent,
    TimelineHeader,
    TimelineTitle,
    TimelineDescription,
    TimelineBadge,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A robust chronological display system. Supports multiple visual variants for milestones, status changes, and project history.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber', 'alternating'],
      description: 'The overall theme and layout of the timeline',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a career or project progression.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px] p-8">
      <Timeline {...args}>
        <TimelineItem>
          <TimelineDot variant="primary" />
          <TimelineLine />
          <TimelineContent>
            <TimelineBadge>FEB 2026</TimelineBadge>
            <TimelineHeader>
              <TimelineTitle>System_v4_Release</TimelineTitle>
              <TimelineDescription>Primary node infrastructure deployment.</TimelineDescription>
            </TimelineHeader>
            <p className="text-sm opacity-60 leading-relaxed">
              Successfully established the neural-adaptive ingestion layer across all US_EAST continental clusters.
            </p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot variant="success" />
          <TimelineLine />
          <TimelineContent>
            <TimelineBadge>JAN 2026</TimelineBadge>
            <TimelineHeader>
              <TimelineTitle>Validation_Beta</TimelineTitle>
              <TimelineDescription>Community-driven stress testing.</TimelineDescription>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot variant="default" />
          <TimelineContent>
            <TimelineBadge>DEC 2025</TimelineBadge>
            <TimelineHeader>
              <TimelineTitle>Architecture_Lock</TimelineTitle>
              <TimelineDescription>Blueprint finalization.</TimelineDescription>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-12 bg-black rounded-[3rem] border border-cyan-500/10">
      <Timeline {...args}>
        <TimelineItem>
          <TimelineDot variant="cyber" />
          <TimelineLine variant="cyber" />
          <TimelineContent>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="cyber" size="xs">EPOCH_1742</Badge>
              <Activity className="size-3 text-cyan-500 animate-pulse" />
            </div>
            <TimelineHeader>
              <TimelineTitle className="font-mono italic text-cyan-400 uppercase tracking-tighter text-xl">
                // KERNEL_SYNC_INIT
              </TimelineTitle>
              <TimelineDescription className="font-mono text-[10px] text-cyan-500/40 uppercase">Handshake sequence successful.</TimelineDescription>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineDot variant="cyber" />
          <TimelineContent>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="cyber" size="xs">EPOCH_1741</Badge>
            </div>
            <TimelineHeader>
              <TimelineTitle className="font-mono italic text-cyan-400 uppercase tracking-tighter text-xl">
                // BUFFER_FLUSH
              </TimelineTitle>
              <TimelineDescription className="font-mono text-[10px] text-cyan-500/40 uppercase">Purging legacy packets.</TimelineDescription>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

/**
 * Centered alternating layout, ideal for high-impact brand histories.
 */
export const Alternating: Story = {
  args: {
    variant: 'alternating',
  },
  render: (args) => (
    <div className="w-[900px] py-20">
      <Timeline {...args}>
        <TimelineItem side="left">
          <TimelineDot variant="primary" position="center" />
          <TimelineLine position="center" />
          <TimelineContent side="left">
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">The_Beginning</h3>
            <p className="text-muted-foreground">Architecting the first high-fidelity telemetry bridges for decentralized edge computing.</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem side="right">
          <TimelineDot variant="success" position="center" />
          <TimelineLine position="center" />
          <TimelineContent side="right">
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Global_Expansion</h3>
            <p className="text-muted-foreground">Scaling node synchronization across 4 continental sectors with zero latency deviation.</p>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem side="left">
          <TimelineDot variant="warning" position="center" />
          <TimelineContent side="left">
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Neural_Integration</h3>
            <p className="text-muted-foreground">Implementing AI-driven trajectory inference for real-time biometric optimization.</p>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};
