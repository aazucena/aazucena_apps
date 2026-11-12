import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InteractiveCard,
  InteractiveCardContent,
  InteractiveCardHeader,
  InteractiveCardIcon,
  InteractiveCardIndicator,
  InteractiveCardSubtitle,
  InteractiveCardTitle,
} from '@aazucena/ui';
import { Activity, Database, Globe, Shield, Zap } from '@aazucena/icons';
import { useState } from 'react';
import { Badge, Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite accordion-style card for progressive disclosure of technical details.
 * - **UX:** Features smooth Framer Motion height animations and tactile scale feedback on expansion.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for semantic color-coded icons.
 * - **Composition:** Fully modular parts (Header, Icon, Title, Indicator, Content) for flexible disclosure modules.
 */
const meta = {
  title: 'Components/Layout/InteractiveCard',
  component: InteractiveCard,
  subcomponents: {
    InteractiveCardHeader,
    InteractiveCardIcon,
    InteractiveCardTitle,
    InteractiveCardSubtitle,
    InteractiveCardContent,
    InteractiveCardIndicator,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An expandable card component designed for detailed metrics, system logs, or FAQ-style disclosure. Features integrated animation and semantic visual states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the card',
      table: { category: 'Appearance' },
    },
    isOpen: {
      control: 'boolean',
      description: 'The controlled expansion state',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof InteractiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a system diagnostic panel.
 */
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="w-[500px]">
        <InteractiveCard isOpen={isOpen}>
          <InteractiveCardHeader onClick={() => setIsOpen(!isOpen)}>
            <InteractiveCardIcon color="blue">
              <Activity size={20} />
            </InteractiveCardIcon>
            <div className="flex flex-col">
              <InteractiveCardTitle>System_Diagnostics</InteractiveCardTitle>
              <InteractiveCardSubtitle>Protocol_v4.2 // Active</InteractiveCardSubtitle>
            </div>
            <InteractiveCardIndicator />
          </InteractiveCardHeader>
          <InteractiveCardContent>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive diagnostic sequence initialized. All kernel parameters within optimal
              range. No anomalies detected in the current processing cycle.
            </p>
            <div className="mt-6 flex gap-3">
              <Badge variant="outline">STABLE</Badge>
              <Badge variant="outline">US_EAST_1</Badge>
            </div>
          </InteractiveCardContent>
        </InteractiveCard>
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
      <div className="w-[500px]">
        <InteractiveCard variant="cyber" isOpen={isOpen}>
          <InteractiveCardHeader onClick={() => setIsOpen(!isOpen)}>
            <InteractiveCardIcon variant="cyber">
              <Database size={20} />
            </InteractiveCardIcon>
            <div className="flex flex-col font-mono">
              <InteractiveCardTitle className="text-signal font-black tracking-tighter uppercase italic">
                // DATA_ENCLAVE_ROOT
              </InteractiveCardTitle>
              <InteractiveCardSubtitle className="text-signal/60">
                SECTOR_ACCESS_GRANTED
              </InteractiveCardSubtitle>
            </div>
            <InteractiveCardIndicator className="text-signal" />
          </InteractiveCardHeader>
          <InteractiveCardContent className="font-mono text-signal/60 bg-signal/5">
            <div className="space-y-2 text-xs">
              <p className="text-signal/80">{'>'} DECRYPTING_BUFFER_STREAM...</p>
              <p className="text-success">{'>'} 0x7F42_ACTIVE: [OK]</p>
              <p className="text-signal/80">{'>'} SYNCHRONIZING_WITH_MASTER_NODE...</p>
              <p className="text-signal/80">{'>'} HANDSHAKE_COMPLETE.</p>
            </div>
            <Button variant="cyber" size="sm" className="mt-6 w-full">
              INIT_EXTRACTION
            </Button>
          </InteractiveCardContent>
        </InteractiveCard>
      </div>
    );
  },
};

/**
 * Immersive glass variant, ideal for placement over cinematic backgrounds.
 */
export const GlassAtmospheric: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="p-20 rounded-card">
        <div className="w-[450px]">
          <InteractiveCard variant="glass" isOpen={isOpen}>
            <InteractiveCardHeader onClick={() => setIsOpen(!isOpen)} className="text-foreground">
              <InteractiveCardIcon variant="glass">
                <Globe size={20} />
              </InteractiveCardIcon>
              <div className="flex flex-col">
                <InteractiveCardTitle>Global_Traffic</InteractiveCardTitle>
                <InteractiveCardSubtitle className="text-foreground/40">
                  Real-time Node Distribution
                </InteractiveCardSubtitle>
              </div>
              <InteractiveCardIndicator className="text-foreground/60" />
            </InteractiveCardHeader>
            <InteractiveCardContent className="text-foreground/80 border-rule">
              <p className="text-xs font-medium">
                98 active trajectories detected across 4 continental sectors. Atmospheric layers are
                performing within nominal latency thresholds.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-state border border-rule rounded-card">
                  <span className="text-[9px] font-black uppercase text-foreground/40">
                    US_East
                  </span>
                  <p className="text-lg font-black">42.8%</p>
                </div>
                <div className="p-3 bg-state border border-rule rounded-card">
                  <span className="text-[9px] font-black uppercase text-foreground/40">
                    EU_West
                  </span>
                  <p className="text-lg font-black text-signal">18.2%</p>
                </div>
              </div>
            </InteractiveCardContent>
          </InteractiveCard>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates semantic color variants for specific alert levels.
 */
export const AlertState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="w-[500px]">
        <InteractiveCard isOpen={isOpen} className="border-alert/20 bg-alert/5">
          <InteractiveCardHeader onClick={() => setIsOpen(!isOpen)}>
            <InteractiveCardIcon color="rose" className="animate-pulse">
              <Shield size={20} />
            </InteractiveCardIcon>
            <div className="flex flex-col">
              <InteractiveCardTitle className="text-alert">
                Security_Breach_Attempt
              </InteractiveCardTitle>
              <InteractiveCardSubtitle className="text-alert/40">
                Node: US_EAST_01 // CRITICAL
              </InteractiveCardSubtitle>
            </div>
            <InteractiveCardIndicator className="text-alert" />
          </InteractiveCardHeader>
          <InteractiveCardContent className="text-alert/80 border-alert/10">
            <p className="font-mono text-xs italic">
              Multiple unauthorized handshake attempts detected from IP range 192.168.x.x. Port 8080
              has been automatically isolated.
            </p>
            <Button variant="destructive" size="sm" className="mt-6 w-full rounded-card">
              EXECUTE_LOCKDOWN
            </Button>
          </InteractiveCardContent>
        </InteractiveCard>
      </div>
    );
  },
};
