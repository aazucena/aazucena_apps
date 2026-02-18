import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ContentCard,
  ContentCardContent,
  ContentCardDescription,
  ContentCardFooter,
  ContentCardGlow,
  ContentCardHeader,
  ContentCardImage,
  ContentCardMeta,
  ContentCardTitle,
  ContentCardOverlay,
} from '@aazucena/ui';
import { Badge, Button } from '@aazucena/ui';
import { Calendar, Play, Globe, Shield, Zap } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Advanced composite layout component for rich-media content (Blog, Projects, Case Studies).
 * - **Interactivity:** Features hover-triggered image scaling and an optional background `Glow` effect.
 * - **Visuals:** Optimized for high-density information with integrated Meta, Image, and Overlay sub-components.
 * - **Architecture:** Extends the base `Card` component, inheriting all standard `glass` and `cyber` variants.
 */
const meta = {
  title: 'Components/Layout/ContentCard',
  component: ContentCard,
  subcomponents: {
    ContentCardHeader,
    ContentCardTitle,
    ContentCardDescription,
    ContentCardContent,
    ContentCardFooter,
    ContentCardImage,
    ContentCardOverlay,
    ContentCardGlow,
    ContentCardMeta,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A feature-rich card component designed for blog posts, project showcases, and rich-media displays.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'outline'],
      description: 'The visual theme of the card',
      table: { category: 'Appearance' }
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Internal content spacing',
      table: { category: 'Layout' }
    },
    radius: {
      control: 'select',
      options: ['default', 'lg', 'xl', '2xl', '3xl'],
      description: 'Corner rounding preset',
      table: { category: 'Layout' }
    },
    hover: {
      control: 'boolean',
      description: 'Enable scale and glow on hover',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard project or blog post card with image and metadata.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    radius: '2xl',
    padding: 'md',
  },
  render: (args) => (
    <ContentCard {...args} className="w-[400px] group">
      <ContentCardImage 
        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
        alt="Engineering Aesthetic" 
      />
      <ContentCardHeader>
        <ContentCardMeta>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>Feb 14, 2026</span>
          </div>
          <span className="text-primary font-bold">CASE_STUDY</span>
        </ContentCardMeta>
        <ContentCardTitle size="xl">Neural_Interface_Optimization</ContentCardTitle>
        <ContentCardDescription>
          Implementing high-performance telemetry processing for next-generation biometric interfaces.
        </ContentCardDescription>
      </ContentCardHeader>
      <ContentCardFooter>
        <div className="flex gap-2">
          <Badge variant="secondary" size="xs">REACT</Badge>
          <Badge variant="secondary" size="xs">D3.JS</Badge>
        </div>
        <Button variant="ghost" size="sm">Review_Intel</Button>
      </ContentCardFooter>
    </ContentCard>
  ),
};

/**
 * High-performance cyber variant with overlays and glowing interaction.
 */
export const CyberShowcase: Story = {
  args: {
    variant: 'cyber',
    hover: true,
  },
  render: (args) => (
    <ContentCard {...args} className="w-[400px] group">
      <div className="relative">
        <ContentCardImage 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          aspect="wide"
        />
        <ContentCardOverlay position="top-right">
          <Badge variant="cyber" animated>LIVE_FEED</Badge>
        </ContentCardOverlay>
        <ContentCardOverlay position="bottom-left">
          <div className="size-10 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
            <Play className="text-cyan-400 size-5" />
          </div>
        </ContentCardOverlay>
      </div>
      <ContentCardHeader className="pt-6">
        <ContentCardTitle size="lg" className="font-mono italic">// SIGNAL_TRACER_v2</ContentCardTitle>
        <ContentCardDescription className="font-mono text-xs">
          Cryptographic protocol analyzer for secure node-to-node communication.
        </ContentCardDescription>
      </ContentCardHeader>
      <ContentCardGlow color="bg-cyan-500/10" />
    </ContentCard>
  ),
};

/**
 * Immersive glass variant with overlays and backdrop effects.
 */
export const GlassHero: Story = {
  args: {
    variant: 'glass',
    padding: 'lg',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <ContentCard {...args} className="w-[450px] group">
        <ContentCardHeader>
          <ContentCardMeta className="text-white/60">DEPLOYMENT_STATION</ContentCardMeta>
          <ContentCardTitle size="2xl" className="text-white">Atmospheric_Unit</ContentCardTitle>
          <ContentCardDescription className="text-white/70 line-clamp-2">
            Real-time environmental monitoring across high-altitude edge nodes.
          </ContentCardDescription>
        </ContentCardHeader>
        <ContentCardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-lg font-black text-white">98%</span>
              <span className="text-[8px] font-bold text-white/40 uppercase">Efficiency</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
              <Globe size={16} className="text-blue-400" />
              <span className="text-lg font-black text-white">42</span>
              <span className="text-[8px] font-bold text-white/40 uppercase">Active_Nodes</span>
            </div>
          </div>
        </ContentCardContent>
        <ContentCardGlow color="bg-white/5" />
      </ContentCard>
    </div>
  ),
};

/**
 * Minimalist outline version for secondary information or sidebars.
 */
export const SidebarCard: Story = {
  args: {
    variant: 'outline',
    padding: 'sm',
    radius: 'lg',
  },
  render: (args) => (
    <ContentCard {...args} className="w-[280px]">
      <ContentCardHeader className="mb-0">
        <div className="flex items-center gap-3">
          <Shield className="size-4 text-primary" />
          <ContentCardTitle size="sm">Security_Notice</ContentCardTitle>
        </div>
      </ContentCardHeader>
      <ContentCardContent className="pt-2">
        <p className="text-[11px] opacity-60">Authentication tokens will expire in **12 minutes**. Please re-validate your session identifiers.</p>
      </ContentCardContent>
    </ContentCard>
  ),
};
