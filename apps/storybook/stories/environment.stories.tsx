import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Environment,
  EnvironmentAtmosphere,
  EnvironmentGlow,
  EnvironmentGrid,
  EnvironmentNoise,
  EnvironmentShell,
  EnvironmentHeader,
  EnvironmentMain,
  EnvironmentFooter,
} from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for managing global site "Atmosphere" and page shells.
 * - **UX:** Features pointer-event transparent layers for background depth effects (Grids, Glows, Noise).
 * - **Atmosphere:** Uses `EnvironmentAtmosphere` to sync visual gradients with the site's scrolling phases (Troposphere to Exosphere).
 * - **Design:** Optimized for high-fidelity technical depth with grain overlays and neon-tinted grids.
 * - **Architecture:** Fully atomic parts for assembling complex, layered backgrounds.
 */
const meta = {
  title: 'Components/Layout/Environment',
  component: Environment,
  subcomponents: {
    EnvironmentShell,
    EnvironmentHeader,
    EnvironmentMain,
    EnvironmentFooter,
    EnvironmentGrid,
    EnvironmentGlow,
    EnvironmentAtmosphere,
    EnvironmentNoise,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A global layout system used to create immersive, multi-layered background environments and standard page structures.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Environment>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing the full page shell with a troposphere (entry-level) atmosphere.
 */
export const BasicShell: Story = {
  render: () => (
    <EnvironmentShell className="min-h-[600px] bg-background">
      <Environment>
        <EnvironmentAtmosphere phase="troposphere" />
        <EnvironmentGrid variant="dots" className="opacity-40" />
        <EnvironmentGlow color="blue" size="lg" position="top-left" />
        <EnvironmentGlow color="emerald" size="sm" position="bottom-right" delay="2s" />
        <EnvironmentNoise />
      </Environment>
      
      <EnvironmentHeader className="p-8 border-b border-current/10 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <span className="font-black uppercase tracking-widest text-xs">Environment_Protocol</span>
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </EnvironmentHeader>

      <EnvironmentMain className="p-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter uppercase">Surface_Layer</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.3em] text-[10px]">Altitude: 0km - 12km [TROPOSPHERE]</p>
        </div>
      </EnvironmentMain>

      <EnvironmentFooter className="p-8 border-t border-current/10 bg-white/5 backdrop-blur-sm text-center">
        <p className="text-[10px] font-mono opacity-40 italic">// SYSTEM_ACTIVE_ID: 0x7F42</p>
      </EnvironmentFooter>
    </EnvironmentShell>
  ),
};

/**
 * High-performance cyber variant with exosphere (deep space) atmosphere and neon grid.
 */
export const CyberSpace: Story = {
  render: () => (
    <EnvironmentShell className="h-screen bg-black overflow-hidden">
      <Environment>
        <EnvironmentAtmosphere phase="exosphere" />
        <EnvironmentGrid variant="cyber" className="opacity-60" />
        <EnvironmentGlow color="cyan" size="xl" position="center" />
        <EnvironmentNoise className="opacity-[0.05]" />
      </Environment>
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-cyan-400">
        <div className="p-4 border border-cyan-500/30 rounded-full mb-8 animate-pulse">
          <div className="size-4 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,1)]" />
        </div>
        <h1 className="text-5xl font-mono font-black tracking-[0.4em] uppercase italic">SIGNAL_ENCLAVE</h1>
        <p className="mt-4 font-mono text-[10px] opacity-40 tracking-widest">ENCRYPTED_UPLINK_STABLE // ALTITUDE: 10,000KM+</p>
      </div>
    </EnvironmentShell>
  ),
};

/**
 * Demonstrates the multi-layer glow composition for atmospheric depth.
 */
export const GlowComposition: Story = {
  render: () => (
    <EnvironmentShell className="h-screen bg-zinc-950 overflow-hidden">
      <Environment>
        <EnvironmentGlow color="indigo" size="xl" position="top-left" delay="0s" />
        <EnvironmentGlow color="purple" size="lg" position="bottom-right" delay="1s" />
        <EnvironmentGlow color="blue" size="md" position="center" delay="2s" />
        <EnvironmentGrid variant="dots" className="opacity-20" />
        <EnvironmentNoise />
      </Environment>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center p-12 glass rounded-[3rem] border-white/10">
          <h2 className="text-white text-3xl font-black tracking-tighter">Compositional_Depth</h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Stacked Glow Layers</p>
        </div>
      </div>
    </EnvironmentShell>
  ),
};

/**
 * Mid-altitude atmosphere showing the mesosphere phase.
 */
export const MesospherePhase: Story = {
  render: () => (
    <EnvironmentShell className="h-screen bg-background">
      <Environment>
        <EnvironmentAtmosphere phase="mesosphere" />
        <EnvironmentGrid variant="default" className="opacity-30" />
        <EnvironmentGlow color="indigo" size="lg" position="bottom-left" />
        <EnvironmentNoise />
      </Environment>
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Node_Processing_Zone</h1>
        <p className="text-primary font-mono text-[10px] mt-4 uppercase tracking-[0.3em]">Phase: MESOSPHERE // ALT: 50KM - 85KM</p>
      </div>
    </EnvironmentShell>
  ),
};
