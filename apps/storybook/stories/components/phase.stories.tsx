import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Phase,
  PhaseBadge,
  PhaseContent,
  PhaseDescription,
  PhaseHeader,
  PhaseTitle,
} from '@aazucena/ui';
import { Badge, Button, Card, CardContent } from '@aazucena/ui';
import { Activity, Globe, Zap, Database, Shield } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Section-level container for chronological or multi-step narratives (Roadmap, Project lifecycle).
 * - **UX:** Features a specialized `PhaseBadge` with an integrated status pulse for real-time relevance.
 * - **Aesthetics:** Aligned with site-wide themes (`alternate`, `cyber`) with technical typography presets.
 * - **Architecture:** Orchestral component that manages vertical spacing, typography hierarchy, and content layout.
 */
const meta = {
  title: 'Components/Layout/Phase',
  component: Phase,
  subcomponents: {
    PhaseHeader,
    PhaseBadge,
    PhaseTitle,
    PhaseDescription,
    PhaseContent,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-width section component for representing a distinct chapter, phase, or milestone in a process.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'alternate', 'cyber'],
      description: 'The background and border theme of the section',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Phase>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for a roadmap milestone or project phase.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Phase {...args}>
      <PhaseHeader>
        <PhaseBadge variant="blue">Phase_01: Initiation</PhaseBadge>
        <PhaseTitle>Establishing_Neural_Core</PhaseTitle>
        <PhaseDescription>
          Setting up the foundational telemetry ingestion engines and establishing initial node
          handshake protocols for global synchronization.
        </PhaseDescription>
      </PhaseHeader>
      <PhaseContent className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="outline" className="border-zinc-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" size="xs">
                    UNIT_0{i}
                  </Badge>
                </div>
                <p className="text-sm font-bold">Inference_Engine_{i}</p>
                <p className="text-xs opacity-60 mt-2">
                  Nominal pulse interval detected across all local buffers.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PhaseContent>
    </Phase>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberSequence: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="bg-black">
      <Phase {...args}>
        <PhaseHeader>
          <PhaseBadge variant="cyber">NODE_EXTRACTION</PhaseBadge>
          <PhaseTitle className="font-mono text-cyan-500 italic tracking-tighter text-4xl md:text-6xl">
            // BUFFER_OVERRIDE_0x7F
          </PhaseTitle>
          <PhaseDescription className="font-mono text-cyan-500/40 uppercase tracking-[0.2em] text-sm md:text-base">
            CRITICAL_SYSTEM_MODIFICATION // TARGET: KERNEL_SYNC
          </PhaseDescription>
        </PhaseHeader>
        <PhaseContent className="max-w-4xl mx-auto text-center px-4">
          <div className="p-8 border-2 border-dashed border-cyan-500/20 bg-cyan-500/5 rounded-3xl">
            <Activity className="size-12 text-cyan-500 mx-auto mb-6 animate-pulse" />
            <p className="font-mono text-xs text-cyan-400">WAITING_FOR_ADMIN_CREDENTIALS...</p>
          </div>
        </PhaseContent>
      </Phase>
    </div>
  ),
};

/**
 * Minimalist version used for alternating sections in content-heavy layouts.
 */
export const AlternatePhase: Story = {
  args: {
    variant: 'alternate',
  },
  render: (args) => (
    <Phase {...args}>
      <PhaseHeader>
        <PhaseBadge variant="green">Phase_04: Deployment</PhaseBadge>
        <PhaseTitle className="text-3xl md:text-4xl">Global_Edge_Rollout</PhaseTitle>
        <PhaseDescription className="text-base md:text-lg">
          Scaling the synchronized node infrastructure across multiple continental sectors to
          improve global ingestion latency.
        </PhaseDescription>
      </PhaseHeader>
      <PhaseContent className="max-w-5xl mx-auto px-4 md:px-8 flex justify-center">
        <Button
          variant="outline"
          className="rounded-full px-12 h-14 font-black tracking-widest uppercase"
        >
          Review_Deployment_Stats <Globe className="ml-2 size-5" />
        </Button>
      </PhaseContent>
    </Phase>
  ),
};
