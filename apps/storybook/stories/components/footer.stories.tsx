import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Footer,
  FooterBottom,
  FooterContent,
  FooterGrid,
  FooterHeader,
  FooterLink,
  FooterNav,
  FooterSection,
  FooterSocials,
  FooterTechStack,
} from '@aazucena/ui';
import { Logo, Button, Badge } from '@aazucena/ui';
import { Github, Linkedin, Twitter, Discord, Activity, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for managing global site footers.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`).
 * - **UX:** Features `FooterLink` with hover-triggered directional displacement.
 * - **Aesthetics:** Panel surface with 1px rules; mono micro-labels for section headers.
 * - **Architecture:** Fully atomic parts for assembling complex, multi-column navigation footers.
 */
const meta = {
  title: 'Components/Layout/Footer',
  component: Footer,
  subcomponents: {
    FooterContent,
    FooterGrid,
    FooterSection,
    FooterHeader,
    FooterNav,
    FooterLink,
    FooterSocials,
    FooterBottom,
    FooterTechStack,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive layout system for site-wide footers. Supports multi-column navigation, social links, tech stack displays, and status indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the footer container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing multi-column navigation and legal info.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Footer {...args}>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo size="lg" />
            <p className="text-sm opacity-60 max-w-xs leading-relaxed mt-4">
              Engineering Intelligence Unit. Built for the future of decentralized computing and
              high-fidelity interfaces.
            </p>
            <FooterSocials className="mt-8">
              <Button variant="outline" size="icon" className="rounded-full">
                <Github size={16} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin size={16} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter size={16} />
              </Button>
            </FooterSocials>
          </FooterSection>

          <FooterSection>
            <FooterHeader>Platform</FooterHeader>
            <FooterNav>
              <FooterLink href="#">Dashboard</FooterLink>
              <FooterLink href="#">Telemetry</FooterLink>
              <FooterLink href="#">Project Archive</FooterLink>
              <FooterLink href="#">Trajectory Labs</FooterLink>
            </FooterNav>
          </FooterSection>

          <FooterSection>
            <FooterHeader>Resources</FooterHeader>
            <FooterNav>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Knowledge Base</FooterLink>
              <FooterLink href="#">Community Discord</FooterLink>
            </FooterNav>
          </FooterSection>

          <FooterSection>
            <FooterHeader>Company</FooterHeader>
            <FooterNav>
              <FooterLink href="#">About Unit</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Protocol</FooterLink>
              <FooterLink href="#">Contact Support</FooterLink>
            </FooterNav>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-widest opacity-40">
              © 2026 AAZUCENA_LABS
            </span>
            <span className="text-[9px] font-mono opacity-20">BUILD_UUID: 0x7F42_ACTIVE</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-success animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-success/60">
                System_Operational
              </span>
            </div>
            <FooterTechStack>
              <Globe size={14} className="opacity-40" />
              <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
                Distributed_Edge_Network
              </span>
            </FooterTechStack>
          </div>
        </FooterBottom>
      </FooterContent>
    </Footer>
  ),
};

/**
 * Cyber variant: signal rule and Fira Code labels.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <Footer {...args}>
      <FooterContent>
        <FooterGrid>
          <FooterSection className="col-span-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-4 italic text-signal">
              // AAZUCENA_LYTICS
            </h2>
            <p className="font-mono text-xs text-signal/40 max-w-md">
              CENTRAL_INTELLIGENCE_UPLINK_ESTABLISHED
              <br />
              NODES_SYNCED: 14,204 // ENCRYPTION: AES_256_GCM
            </p>
          </FooterSection>
          <FooterSection>
            <FooterHeader className="text-signal">QUICK_COMMANDS</FooterHeader>
            <FooterNav>
              <FooterLink href="#" className="font-mono text-signal/60 hover:text-signal italic">
                {'>'} INIT_SYNC
              </FooterLink>
              <FooterLink href="#" className="font-mono text-signal/60 hover:text-signal italic">
                {'>'} FLUSH_BUFFER
              </FooterLink>
              <FooterLink href="#" className="font-mono text-signal/60 hover:text-signal italic">
                {'>'} REBOOT_NODE
              </FooterLink>
            </FooterNav>
          </FooterSection>
          <FooterSection>
            <FooterHeader className="text-signal">SECURITY</FooterHeader>
            <FooterNav>
              <FooterLink href="#" className="font-mono text-signal/60 hover:text-signal italic">
                {'>'} AUTH_TRACE
              </FooterLink>
              <FooterLink href="#" className="font-mono text-signal/60 hover:text-signal italic">
                {'>'} FIREWALL_LOGS
              </FooterLink>
            </FooterNav>
          </FooterSection>
        </FooterGrid>
        <FooterBottom className="border-signal/10">
          <Badge variant="cyber">UPLINK_SECURE</Badge>
          <p className="font-mono text-[9px] text-signal/20">
            FRAGMENTED_KNOWLEDGE_BASE // ALL_SIGNALS_TRACED
          </p>
        </FooterBottom>
      </FooterContent>
    </Footer>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-10 pt-40 rounded-t-card overflow-hidden relative">
      <div className="absolute inset-0 bg-scrim" />
      <Footer {...args} className="border-rule relative z-10 bg-transparent border-none">
        <FooterContent className="pt-0">
          <FooterGrid>
            <FooterSection>
              <h3 className="text-foreground text-xl font-black uppercase tracking-tighter">
                Crystal_Layer
              </h3>
              <p className="text-foreground/60 text-xs">Distributed cloud infrastructure</p>
            </FooterSection>
            <FooterSection>
              <FooterHeader className="text-foreground/40">Regions</FooterHeader>
              <FooterNav>
                <FooterLink href="#" className="text-foreground/80 hover:text-foreground">
                  US_East
                </FooterLink>
                <FooterLink href="#" className="text-foreground/80 hover:text-foreground">
                  EU_Central
                </FooterLink>
                <FooterLink href="#" className="text-foreground/80 hover:text-foreground">
                  Asia_Pacific
                </FooterLink>
              </FooterNav>
            </FooterSection>
          </FooterGrid>
          <FooterBottom className="border-rule">
            <span className="text-foreground/40 text-[9px] font-bold uppercase tracking-widest">
              Atmospheric_Unit // 2026
            </span>
            <div className="flex items-center gap-4 text-foreground/60 font-mono text-[9px]">
              <span>STATUS: NOMINAL</span>
              <div className="size-1.5 rounded-full bg-success" />
            </div>
          </FooterBottom>
        </FooterContent>
      </Footer>
    </div>
  ),
};
