import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
} from '@aazucena/ui';
import { Badge, Button, Card, CardContent } from '@aazucena/ui';
import { Activity, Globe, Zap, Shield, ArrowRight } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for managing primary page segments.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for high-impact card elevation.
 * - **UX:** Features flexible content widths (`narrow`, `medium`, `wide`) and automatic horizontal centering.
 * - **Responsiveness:** Automatically handles typography scaling and spacing across breakpoints.
 * - **Composition:** Fully modular parts (Header, Title, Subtitle, Content) for tailorable page architecture.
 */
const meta = {
  title: 'Components/Layout/Section',
  component: Section,
  subcomponents: {
    SectionHeader,
    SectionTitle,
    SectionSubtitle,
    SectionContent,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive layout system for building page sections. Manages vertical spacing, content max-widths, and header hierarchies.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    contentWidth: {
      control: 'select',
      options: ['narrow', 'medium', 'wide', 'full'],
      description: 'The maximum width of the content container',
      table: { category: 'Layout' }
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the section',
      table: { category: 'Appearance' }
    },
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of the header content',
      table: { category: 'Layout' }
    }
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a centered section with a grid of cards.
 */
export const Basic: Story = {
  args: {
    contentWidth: 'wide',
    alignment: 'center',
  },
  render: (args) => (
    <div className="py-20">
      <Section {...args}>
        <SectionHeader>
          <SectionTitle>Project_Intelligence</SectionTitle>
          <SectionSubtitle>Building High-Fidelity Infrastructure</SectionSubtitle>
        </SectionHeader>
        <SectionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} variant="outline" className="h-48 flex items-center justify-center">
                <span className="text-xs font-black opacity-20 uppercase tracking-widest">MODULE_0{i}</span>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    contentWidth: 'medium',
    alignment: 'left',
  },
  render: (args) => (
    <div className="bg-black py-20 px-10">
      <Section {...args}>
        <SectionHeader alignment="left">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="size-4 text-cyan-500 animate-pulse" />
            <Badge variant="cyber" size="xs">ACTIVE_SIGNAL</Badge>
          </div>
          <SectionTitle className="text-white font-mono italic uppercase tracking-tighter text-4xl md:text-5xl">
            // PROTOCOL_0x7F
          </SectionTitle>
          <SectionSubtitle className="text-cyan-500/40 font-mono text-sm uppercase tracking-[0.2em] italic">
            Kernel_Ingestion_Layer
          </SectionSubtitle>
        </SectionHeader>
        <SectionContent>
          <div className="p-12 border-2 border-dashed border-cyan-500/10 bg-cyan-500/5 rounded-[3rem] text-center">
            <p className="font-mono text-xs text-cyan-400">WAITING_FOR_TRAJECTORY_DATA...</p>
          </div>
        </SectionContent>
      </Section>
    </div>
  ),
};

/**
 * Narrow layout ideal for articles or text-heavy documentation.
 */
export const ContentFocused: Story = {
  args: {
    contentWidth: 'narrow',
    alignment: 'left',
  },
  render: (args) => (
    <div className="py-20">
      <Section {...args}>
        <SectionHeader alignment="left" className="mb-16">
          <SectionTitle className="text-4xl">System_Philosophy</SectionTitle>
          <p className="text-muted-foreground mt-4 text-lg">The architectural standards driving our engineering unit.</p>
        </SectionHeader>
        <SectionContent className="space-y-8 text-base leading-relaxed opacity-80">
          <p>
            The future of decentralized computing requires a paradigm shift in how we handle telemetry. 
            By establishing high-bandwidth ingestion layers directly at the edge, we reduce latency 
            while preserving data integrity across all continental node clusters.
          </p>
          <p>
            Our neural-adaptive pathfinding algorithms ensure that every packet is traced and 
            verified against local security enclaves before being committed to the global master node.
          </p>
          <div className="pt-8">
            <Button className="rounded-full px-10">Explore_Blueprint</Button>
          </div>
        </SectionContent>
      </Section>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric backgrounds.
 */
export const GlassHero: Story = {
  args: {
    variant: 'glass',
    contentWidth: 'wide',
  },
  render: (args) => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <Section {...args} className="relative z-10 m-0 border-white/10">
        <SectionHeader>
          <SectionTitle className="text-white text-5xl md:text-7xl">Crystal_Flow</SectionTitle>
          <SectionSubtitle className="text-white/60">Atmospheric_Unit_Inference</SectionSubtitle>
        </SectionHeader>
        <SectionContent className="flex justify-center mt-12">
          <Button variant="glass" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-12 h-16 text-xl">
            <Globe className="mr-2" /> Start_Observation
          </Button>
        </SectionContent>
      </Section>
    </div>
  ),
};
