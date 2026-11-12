import type { Meta, StoryObj } from '@storybook/react-vite';
import { CTA, CTATitle, CTADescription, CTAActions } from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { ArrowRight, Play, Globe, Zap } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Section-level layout component for primary conversion actions.
 * - **UX:** Features centered, high-impact typography with built-in maximum width constraints.
 * - **Design:** Includes aesthetic background layers (radial gradients for `cyber`, backdrop-blur for `glass`).
 * - **Variants:** Aligned with site-wide themes (`glass`, `cyber`) for consistent technical depth.
 * - **Composition:** Atomic header, description, and action-group components.
 */
const meta = {
  title: 'Components/Layout/CTA',
  component: CTA,
  subcomponents: { CTATitle, CTADescription, CTAActions } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A high-impact call-to-action section used to drive user engagement. Supports multiple visual themes and responsive action groups.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber', 'glass'],
      description: 'The visual theme of the section',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof CTA>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard high-contrast CTA section.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <CTA {...args}>
      <CTATitle>Ready to start your next project?</CTATitle>
      <CTADescription>
        Experience the power of high-fidelity engineering combined with modern aesthetic standards.
      </CTADescription>
      <CTAActions>
        <Button
          size="lg"
          className="px-8 h-14 rounded-control font-black uppercase tracking-widest"
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="px-8 h-14 rounded-control font-black uppercase tracking-widest bg-state border-rule text-foreground hover:bg-panel-raised"
        >
          Learn More
        </Button>
      </CTAActions>
    </CTA>
  ),
};

/**
 * High-performance cyber variant with radial glow and technical typography.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <CTA {...args}>
      <div className="flex justify-center mb-8">
        <div className="p-3 bg-signal/10 rounded-card border border-signal/30">
          <Zap className="size-8 text-signal" />
        </div>
      </div>
      <CTATitle className="font-mono italic tracking-tighter text-signal">
        // CORE_INITIALIZATION
      </CTATitle>
      <CTADescription className="font-mono text-base dark:text-signal/60 max-w-xl">
        ESTABLISH_ENCRYPTED_UPLINK // NODES_ONLINE: 14,204 // SIGNAL_STRENGTH: 98%
      </CTADescription>
      <CTAActions>
        <Button variant="cyber" size="lg" className="h-12 px-10">
          <Play className="mr-2" /> EXECUTE_INIT
        </Button>
      </CTAActions>
    </CTA>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic imagery.
 */
export const GlassHero: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="relative h-[600px] w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-scrim" />
      <CTA {...args} className="w-full h-full flex items-center bg-transparent border-none">
        <CTATitle className="text-foreground">Crystal_Clear_Aesthetics</CTATitle>
        <CTADescription className="text-foreground/80">
          Adaptive glass surfacing with multi-layer depth effects and real-time reflection
          simulation.
        </CTADescription>
        <CTAActions>
          <Button
            variant="glass"
            size="lg"
            className="h-14 px-12 bg-state text-foreground border-rule hover:bg-panel-raised rounded-control"
          >
            <Globe className="mr-2 size-5" /> Experience Depth
          </Button>
        </CTAActions>
      </CTA>
    </div>
  ),
};

/**
 * Minimalist version used for mid-page transitions.
 */
export const MidPageTransition: Story = {
  args: {
    variant: 'cyber',
    className: 'py-20 border-none bg-transparent',
  },
  render: (args) => (
    <CTA {...args}>
      <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 mb-6">
        SECTION_REACHED
      </h3>
      <CTATitle className="text-3xl md:text-4xl normal-case font-black tracking-tighter">
        Want to see the source code?
      </CTATitle>
      <CTAActions className="mt-8">
        <Button variant="outline" className="rounded-control px-8">
          Visit Repository
        </Button>
      </CTAActions>
    </CTA>
  ),
};
