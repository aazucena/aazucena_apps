import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  History,
  HistoryBadge,
  HistoryDescription,
  HistoryItem,
  HistoryMeta,
  HistorySubtitle,
  HistoryTitle,
} from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral timeline component for sequential events (Career history, System logs, Activity traces).
 * - **UX:** Supports collapsible descriptions with Framer Motion height animations for smooth disclosure.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with technical indicators (Chevron states, Neon badges).
 * - **Composition:** Fully modular parts (Item, Title, Subtitle, Meta, Badge, Description) for flexible chronological narratives.
 */
const meta = {
  title: 'Components/Data/History',
  component: History,
  subcomponents: {
    HistoryItem,
    HistoryTitle,
    HistorySubtitle,
    HistoryMeta,
    HistoryBadge,
    HistoryDescription,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A chronological timeline component designed for career progression and system activity logs. Features animated expanding descriptions and technical metadata tagging.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual style of the timeline',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof History>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for career or project history.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px] p-10 bg-card border rounded-[2rem] shadow-2xl">
      <History {...args}>
        <HistoryItem>
          <HistoryTitle>Senior Engineering Lead</HistoryTitle>
          <HistorySubtitle>AAZUCENA_LYTICS</HistorySubtitle>
          <HistoryMeta>
            <HistoryBadge>2024 - PRESENT</HistoryBadge>
            <HistoryBadge>REMOTE</HistoryBadge>
          </HistoryMeta>
          <HistoryDescription>
            Leading the development of high-fidelity engineering intelligence terminals and decentralized telemetry systems. Optimized ingestion pipelines for 14k+ active nodes.
          </HistoryDescription>
        </HistoryItem>

        <HistoryItem>
          <HistoryTitle>Frontend Architect</HistoryTitle>
          <HistorySubtitle>TechInnovate_Global</HistorySubtitle>
          <HistoryMeta>
            <HistoryBadge>2022 - 2024</HistoryBadge>
            <HistoryBadge>HYBRID</HistoryBadge>
          </HistoryMeta>
          <HistoryDescription>
            Established design system patterns and optimized performance for large-scale enterprise applications. Reduced bundle size by 45% via advanced code-splitting strategies.
          </HistoryDescription>
        </HistoryItem>
      </History>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical labels.
 */
export const CyberLog: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-10 bg-black rounded-xl border border-cyan-500/20">
      <History {...args}>
        <HistoryItem variant="cyber">
          <HistoryTitle variant="cyber">// NODE_ESTABLISHMENT_0x7F</HistoryTitle>
          <HistorySubtitle variant="cyber">ORBITAL_STATION_SIGMA</HistorySubtitle>
          <HistoryMeta>
            <HistoryBadge variant="cyber">EPOCH: 1742.4</HistoryBadge>
            <HistoryBadge variant="cyber">SIGNAL: STABLE</HistoryBadge>
          </HistoryMeta>
          <HistoryDescription className="text-cyan-500/60 font-mono text-xs italic">
            BUFFER_INITIALIZATION_SUCCESSFUL. SECURE_ENCLAVE_LOCKED. READY_FOR_TRAJECTORY_INFERENCE.
          </HistoryDescription>
        </HistoryItem>
        
        <HistoryItem variant="cyber">
          <HistoryTitle variant="cyber">// KERNEL_SYNC_PROTOCOL</HistoryTitle>
          <HistorySubtitle variant="cyber">MAIN_CLUSTER_UPLINK</HistorySubtitle>
          <HistoryMeta>
            <HistoryBadge variant="cyber">EPOCH: 1741.9</HistoryBadge>
            <HistoryBadge variant="cyber">SIGNAL: DEGRADED</HistoryBadge>
          </HistoryMeta>
          <HistoryDescription className="text-cyan-500/60 font-mono text-xs italic">
            RETRY_SEQUENCE_INITIATED... PACKET_LOSS_DETECTION_ACTIVE.
          </HistoryDescription>
        </HistoryItem>
      </History>
    </div>
  ),
};

/**
 * Demonstrates the interactive disclosure behavior for detailed history items.
 */
export const InteractiveHistory: Story = {
  render: () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const items = [
      { title: 'Project_Alpha_Release', subtitle: 'v1.0.0_PRODUCTION', date: 'FEB 2026' },
      { title: 'Beta_Testing_Phase', subtitle: 'SIGNAL_GROUP_01', date: 'JAN 2026' },
      { title: 'Infrastructure_Design', subtitle: 'BLUEPRINT_LOCKED', date: 'DEC 2025' },
    ];

    return (
      <div className="w-[500px]">
        <History>
          {items.map((item, index) => (
            <HistoryItem 
              key={index} 
              clickable 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <HistoryTitle 
                showIndicator 
                isExpanded={openIndex === index}
              >
                {item.title}
              </HistoryTitle>
              <HistorySubtitle>{item.subtitle}</HistorySubtitle>
              <HistoryMeta>
                <HistoryBadge>{item.date}</HistoryBadge>
              </HistoryMeta>
              <HistoryDescription isOpen={openIndex === index}>
                Full telemetry report for this milestone is available in the secondary buffer. This phase involved the stabilization of the core ingestion engine.
              </HistoryDescription>
            </HistoryItem>
          ))}
        </History>
      </div>
    );
  }
};
