import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Identity,
  IdentityContent,
  IdentityFirst,
  IdentityName,
  IdentityOccupation,
  IdentityProfile,
} from '@aazucena/ui';
import { Badge, Button } from '@aazucena/ui';
import { Github, Linkedin, Twitter, Globe, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for managing primary brand or profile identity.
 * - **UX:** Features integrated profile image scaling and an ambient background `Glow` effect.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for gradients and high-impact typography.
 * - **Architecture:** Fully atomic parts (Profile, Content, Name, Occupation) for assembling flexible identity sections.
 */
const meta = {
  title: 'Components/Identity/Identity',
  component: Identity,
  subcomponents: {
    IdentityProfile,
    IdentityContent,
    IdentityName,
    IdentityFirst,
    IdentityOccupation,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive layout system for site identity, user profiles, or entity representations. Features large typography and branded visual depth.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the identity section',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Identity>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing the full profile identity with description and social links.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[1000px] p-12">
      <Identity {...args}>
        <IdentityProfile src="https://avatars.githubusercontent.com/u/1234567?v=4" alt="Aldrin" />
        <IdentityContent>
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <Badge variant="outline" animated>
              AVAILABLE_FOR_PROTOCOL
            </Badge>
          </div>
          <IdentityName>
            <IdentityFirst>Aldrin</IdentityFirst> Azucena
          </IdentityName>
          <IdentityOccupation>Engineering Intelligence Lead</IdentityOccupation>
          <p className="text-xl opacity-60 leading-relaxed max-w-xl">
            Architecting high-fidelity decentralized interfaces and neural-adaptive telemetry
            systems for the next generation of computing.
          </p>
          <div className="flex gap-4 justify-center md:justify-start pt-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Github size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter size={18} />
            </Button>
          </div>
        </IdentityContent>
      </Identity>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders, mono typography, and technical status.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[1000px] p-20 bg-background rounded-card border border-signal/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-signal animate-pulse" />
          <span className="font-mono text-[9px] text-signal/40 uppercase">NODE_STATUS: STABLE</span>
        </div>
      </div>
      <Identity {...args}>
        <IdentityProfile
          src="https://avatars.githubusercontent.com/u/1234567?v=4"
          className="border-signal/40"
        />
        <IdentityContent className="space-y-8">
          <IdentityName variant="cyber" className="font-mono italic">
            <span className="text-signal">ALDRIN</span>_AZUCENA
          </IdentityName>
          <IdentityOccupation className="font-mono text-signal/60 uppercase tracking-[0.3em] text-lg">
            LEAD_SYSTEMS_ARCHITECT // UNIT_0x7F42
          </IdentityOccupation>
          <div className="p-6 bg-signal/5 border border-signal/10 rounded-card max-w-lg">
            <p className="font-mono text-sm text-signal/80 leading-relaxed italic">
              "Establishing high-bandwidth knowledge ingestion layers across distributed node
              clusters."
            </p>
          </div>
          <Button
            variant="cyber"
            className="h-14 px-12 rounded-full font-black uppercase tracking-widest"
          >
            Execute_Link_Sequence
          </Button>
        </IdentityContent>
      </Identity>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over complex animated backgrounds.
 */
export const StatusGlass: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-40 rounded-card relative overflow-hidden">
      <Identity {...args} className="relative z-10 text-foreground">
        <IdentityProfile
          src="https://avatars.githubusercontent.com/u/1234567?v=4"
          className="border-rule bg-state"
        />
        <IdentityContent>
          <IdentityName className="text-foreground">
            <span className="opacity-60">Aldrin</span> Azucena
          </IdentityName>
          <IdentityOccupation className="text-foreground/40 uppercase tracking-widest text-lg">
            Atmospheric_Designer
          </IdentityOccupation>
          <div className="flex items-center gap-4 pt-8">
            <div className="p-4 bg-state border border-rule rounded-card flex items-center gap-3">
              <Globe size={20} className="text-signal" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-foreground/40 uppercase">
                  Current_Zone
                </span>
                <span className="text-xs font-bold">Orbit_US_East</span>
              </div>
            </div>
          </div>
        </IdentityContent>
      </Identity>
    </div>
  ),
};
