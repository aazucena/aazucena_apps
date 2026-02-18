import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Reveal,
  RevealContent,
  RevealIndicator,
  RevealTrigger,
} from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, InfoCircle as Info } from '@aazucena/icons';
import { useState } from 'react';
import { Badge, Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic primitive for progressive disclosure of text or small interactive blocks.
 * - **UX:** Features smooth Framer Motion height animations and state-aware chevron rotation.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for technical typography.
 * - **Composition:** Fully modular parts (Trigger, Content, Indicator) for flexible disclosure modules.
 */
const meta = {
  title: 'Components/Primitives/Reveal',
  component: Reveal,
  subcomponents: {
    RevealTrigger,
    RevealContent,
    RevealIndicator,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A minimal disclosure component for showing and hiding content. Lighter than an Accordion, ideal for inline details or secondary information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the bottom border and text',
      table: { category: 'Appearance' }
    },
    isOpen: {
      control: 'boolean',
      description: 'The controlled expansion state',
      table: { category: 'State' }
    }
  },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a basic info disclosure.
 */
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="w-[500px]">
        <Reveal isOpen={isOpen}>
          <RevealTrigger onClick={() => setIsOpen(!isOpen)} className="hover:no-underline group">
            <span className="text-sm font-black tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">Technical_Specifications</span>
            <RevealIndicator />
          </RevealTrigger>
          <RevealContent>
            <p className="text-muted-foreground leading-relaxed py-2">
              All infrastructure components are built using React 19 and Tailwind CSS 4. Telemetry is processed via ClickHouse with real-time ingestion paths.
            </p>
          </RevealContent>
        </Reveal>
      </div>
    );
  },
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="w-[500px] p-8 bg-black rounded-xl border border-cyan-500/10">
        <Reveal variant="cyber" isOpen={isOpen}>
          <RevealTrigger onClick={() => setIsOpen(!isOpen)} className="font-mono text-cyan-500 hover:text-cyan-400 no-underline gap-4">
            <div className="flex items-center gap-3">
              <Activity className="size-4 animate-pulse" />
              <span>// ACCESS_LOG_STREAM</span>
            </div>
            <RevealIndicator />
          </RevealTrigger>
          <RevealContent className="font-mono text-cyan-50/40 text-[10px] space-y-1 py-4">
            <p>[0x7F42] HANDSHAKE_INITIATED...</p>
            <p>[0x7F42] ENCLAVE_AUTH_SUCCESS [KEY: RSA-4096]</p>
            <p>[0x7F42] STREAM_ESTABLISHED // BUFFER: 1024MB</p>
          </RevealContent>
        </Reveal>
      </div>
    );
  },
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassAtmospheric: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
        <div className="w-[450px]">
          <Reveal variant="glass" isOpen={isOpen}>
            <RevealTrigger onClick={() => setIsOpen(!isOpen)} className="text-white hover:no-underline">
              <div className="flex items-center gap-3">
                <Globe className="size-4 opacity-60" />
                <span className="font-black uppercase tracking-tighter">Atmospheric_Unit</span>
              </div>
              <RevealIndicator className="text-white" />
            </RevealTrigger>
            <RevealContent className="text-white/60 pt-2">
              <p className="text-xs">Real-time environmental monitoring with adaptive frosted surfaces and backdrop blur enabled across all continental nodes.</p>
            </RevealContent>
          </Reveal>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates a list of multiple reveal components (Accordion lite).
 */
export const DisclosureList: Story = {
  render: () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const items = [
      { title: 'Project_Alpha', content: 'Core infrastructure module for real-time telemetry ingestion.' },
      { title: 'Project_Beta', content: 'Distributed node synchronization using neural-adaptive pathfinding.' },
      { title: 'Project_Gamma', content: 'High-fidelity glass surfacing for immersive analytical terminals.' },
    ];

    return (
      <div className="w-[500px] space-y-2">
        {items.map((item, index) => (
          <Reveal key={index} isOpen={openIndex === index}>
            <RevealTrigger onClick={() => setOpenIndex(openIndex === index ? null : index)} className="hover:no-underline py-6">
              <span className="font-bold tracking-tight">{item.title}</span>
              <RevealIndicator />
            </RevealTrigger>
            <RevealContent>
              <p className="text-sm opacity-60">{item.content}</p>
            </RevealContent>
          </Reveal>
        ))}
      </div>
    );
  }
};
