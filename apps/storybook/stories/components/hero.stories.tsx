import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero, HeroActions, HeroContent, HeroHeader, HeroSubtitle, HeroTitle } from '@aazucena/ui';
import { Button, Badge } from '@aazucena/ui';
import { Activity, Play, Globe, Zap, ArrowRight } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for primary landing and section entry headers.
 * - **UX:** Features high-impact typography with built-in decorative elements (dots/underscores) aligned with brand variants.
 * - **Aesthetics:** Supports `glass` and `cyber` presets with integrated background effects (Radial glows, Neon borders).
 * - **Scalability:** Uses standard size presets from `default` to `full` (screen-height).
 * - **Composition:** Fully modular parts (Header, Content, Actions) for flexible landing page assembly.
 */
const meta = {
  title: 'Components/Layout/Hero',
  component: Hero,
  subcomponents: {
    HeroHeader,
    HeroContent,
    HeroTitle,
    HeroSubtitle,
    HeroActions,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A high-impact header section for landing pages and major site modules. Supports multiple visual themes and responsive sizing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the hero section',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['default', 'lg', 'xl', 'full'],
      description: 'The physical height of the hero section',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing the full page shell with high-impact typography.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'lg',
  },
  render: (args) => (
    <Hero {...args}>
      <HeroContent>
        <HeroHeader>
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="px-6 py-1.5 rounded-full border-zinc-200">
              v2.4.0_STABLE
            </Badge>
          </div>
          <HeroTitle>Engineering_Intelligence</HeroTitle>
          <HeroSubtitle>
            Building the next generation of high-fidelity adaptive interfaces and neural-ready
            design systems.
          </HeroSubtitle>
          <HeroActions>
            <Button
              size="lg"
              className="rounded-full px-10 h-14 font-black tracking-widest uppercase"
            >
              View_Projects <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-10 h-14 font-black tracking-widest uppercase border-zinc-200"
            >
              Get_in_Touch
            </Button>
          </HeroActions>
        </HeroHeader>
      </HeroContent>
    </Hero>
  ),
};

/**
 * High-performance cyber variant with exosphere aesthetics and neon effects.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    size: 'xl',
  },
  render: (args) => (
    <div className="bg-black">
      <Hero {...args} className="border-cyan-500/10">
        <HeroContent>
          <HeroHeader>
            <div className="flex flex-col items-center gap-4 mb-12">
              <div className="p-4 border border-cyan-500/30 rounded-full animate-pulse">
                <Zap className="size-8 text-cyan-500" />
              </div>
              <span className="font-mono text-[10px] text-cyan-500/60 uppercase tracking-[0.4em]">
                UPLINK_STATUS: SECURE_ENCLAVE
              </span>
            </div>
            <HeroTitle variant="cyber" size="lg" className="text-cyan-500 italic uppercase">
              CORE_PROTOCOL
            </HeroTitle>
            <HeroSubtitle className="font-mono text-cyan-50/40 uppercase tracking-[0.2em] max-w-2xl mx-auto text-sm md:text-base">
              INITIALIZING_SECURE_EXTRACTION_SEQUENCE... // ALL_NODES_ONLINE
            </HeroSubtitle>
            <HeroActions className="mt-16">
              <Button variant="cyber" size="lg" className="h-14 px-12 text-lg">
                <Play className="mr-2 animate-pulse" /> EXECUTE_INIT
              </Button>
            </HeroActions>
          </HeroHeader>
        </HeroContent>
      </Hero>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic imagery.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    size: 'full',
  },
  render: (args) => (
    <div className="bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />
      <Hero {...args} className="h-full border-none bg-transparent backdrop-blur-none">
        <HeroContent>
          <HeroHeader>
            <HeroTitle variant="glass" size="lg" className="text-white drop-shadow-2xl">
              Crystal_Flow
            </HeroTitle>
            <HeroSubtitle className="text-white/80 max-w-3xl leading-relaxed text-2xl md:text-3xl font-light tracking-tight">
              Adaptive layered surfaces with real-time backdrop blur and environmental projection.
            </HeroSubtitle>
            <HeroActions className="mt-16">
              <Button
                variant="glass"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-12 h-16 text-xl"
              >
                <Globe className="mr-2 size-6" /> Explore_Enclave
              </Button>
            </HeroActions>
          </HeroHeader>
        </HeroContent>
      </Hero>
    </div>
  ),
};

/**
 * Specialized technical hero for analytics and telemetry views.
 */
export const IntelDashboard: Story = {
  args: {
    variant: 'cyber',
    size: 'default',
  },
  render: (args) => (
    <div className="w-[1000px] border rounded-[3rem] overflow-hidden bg-zinc-950">
      <Hero {...args} className="border-none py-20 bg-transparent">
        <HeroContent>
          <div className="flex justify-between items-end border-b border-white/10 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                  LIVE_TELEMETRY_STREAM
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
                Neural_Stats
              </h1>
            </div>
            <div className="text-right space-y-2">
              <p className="text-[10px] font-mono text-white/40 uppercase">Assigned_Node</p>
              <p className="text-xl font-mono text-primary font-black">0x7F42_ALPHA</p>
            </div>
          </div>
        </HeroContent>
      </Hero>
    </div>
  ),
};
