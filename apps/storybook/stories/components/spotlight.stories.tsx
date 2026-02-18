import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Spotlight,
  SpotlightVisual,
  SpotlightContent,
  SpotlightTitle,
  SpotlightDescription,
  SpotlightMeta,
} from '@aazucena/ui';
import { Activity, Database, Globe, Shield, Zap, ArrowRight } from '@aazucena/icons';
import { Badge, Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout component for featured content and key system highlights.
 * - **UX:** Features hover-triggered scale feedback on visual elements and high-impact typography.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) including specialized color-gradient variants (`cyan-blue`, `emerald-teal`).
 * - **Composition:** Fully modular parts (Visual, Content, Title, Description, Meta) for tailorable highlight blocks.
 */
const meta = {
  title: 'Components/Layout/Spotlight',
  component: Spotlight,
  subcomponents: {
    SpotlightVisual,
    SpotlightContent,
    SpotlightTitle,
    SpotlightDescription,
    SpotlightMeta,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A high-impact feature card used to spotlight specific projects, services, or technical capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default', 
        'glass', 
        'cyber', 
        'cyan-blue', 
        'emerald-teal', 
        'purple-pink', 
        'orange-red', 
        'indigo-purple'
      ],
      description: 'The visual theme and color palette',
      table: { category: 'Appearance' }
    },
    size: {
      control: 'radio',
      options: ['default', 'lg'],
      description: 'Internal padding and gap scale',
      table: { category: 'Layout' }
    }
  },
} satisfies Meta<typeof Spotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for featuring a system capability.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[700px]">
      <Spotlight {...args}>
        <SpotlightVisual><Activity size={24} /></SpotlightVisual>
        <SpotlightContent>
          <SpotlightTitle>Real-Time_Telemetry</SpotlightTitle>
          <SpotlightDescription>
            High-bandwidth ingestion pipelines processing millions of technical data points every second with zero packet loss.
          </SpotlightDescription>
          <div className="pt-4">
            <Button variant="ghost" size="sm" className="gap-2">Learn_More <ArrowRight size={14}/></Button>
          </div>
        </SpotlightContent>
      </Spotlight>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[700px] p-12 bg-black rounded-[3rem]">
      <Spotlight {...args}>
        <SpotlightVisual variant="cyber"><Database size={24} /></SpotlightVisual>
        <SpotlightContent>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="cyber" size="xs">SECURE_ENCLAVE</Badge>
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest">Protocol: RSA-4096</span>
          </div>
          <SpotlightTitle variant="cyber" className="font-mono italic">// KERNEL_STORAGE_V4</SpotlightTitle>
          <SpotlightDescription className="font-mono text-xs text-cyan-500/60 leading-relaxed">
            Encrypted buffer synchronization established across all continental edge nodes. Persistence level: CRITICAL.
          </SpotlightDescription>
        </SpotlightContent>
      </Spotlight>
    </div>
  ),
};

/**
 * Vibrant gradient variant for primary featured highlights.
 */
export const GradientHighlight: Story = {
  args: {
    variant: 'cyan-blue',
    size: 'lg',
  },
  render: (args) => (
    <div className="w-[800px]">
      <Spotlight {...args}>
        <SpotlightVisual variant="cyan-blue"><Zap size={28} /></SpotlightVisual>
        <SpotlightContent>
          <SpotlightTitle variant="cyan-blue" className="text-3xl">Neural_Inference_Sync</SpotlightTitle>
          <SpotlightDescription className="text-lg">
            Leveraging advanced pathfinding algorithms to optimize global node handshakes.
          </SpotlightDescription>
          <SpotlightMeta>
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-40">Success_Rate</span>
                <span className="text-xl font-black">99.9%</span>
              </div>
              <div className="flex flex-col border-l pl-4">
                <span className="text-[10px] font-black uppercase opacity-40">Active_Units</span>
                <span className="text-xl font-black">14.2K</span>
              </div>
            </div>
          </SpotlightMeta>
        </SpotlightContent>
      </Spotlight>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="w-[600px] relative z-10">
        <Spotlight {...args} className="border-white/10 shadow-2xl">
          <SpotlightVisual variant="glass"><Globe size={24} className="text-white" /></SpotlightVisual>
          <SpotlightContent className="text-white">
            <SpotlightTitle className="text-white">Global_Reach</SpotlightTitle>
            <SpotlightDescription className="text-white/60">
              Distributed cloud architecture performing within nominal latency thresholds.
            </SpotlightDescription>
          </SpotlightContent>
        </Spotlight>
      </div>
    </div>
  ),
};
