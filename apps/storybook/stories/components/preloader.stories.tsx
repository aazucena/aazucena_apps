import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Preloader } from '@aazucena/ui';
import {
  PreloaderOverlay,
  PreloaderContent,
  PreloaderHeader,
  PreloaderTitle,
  PreloaderSubtitle,
  PreloaderIndicator,
  PreloaderStep,
  PreloaderSteps,
  PreloaderFooter,
  PreloaderActions,
} from '@aazucena/ui';
import {
  Code,
  Database,
  Globe,
  CogFour as Cog,
  Shield,
  Zap,
  Image as ImageIcon,
  Layout,
  Check,
  Activity,
  ArrowRight,
} from '@aazucena/icons';
import { Button, Badge } from '@aazucena/ui';
import { useState, useEffect } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral initialization suite for managing app-wide loading sequences.
 * - **UX:** Features progressive step tracking with integrated progress weights and automated state transitions.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`, `hoyoverse`) with support for high-fidelity overlays.
 * - **Composition:** Fully modular parts (Overlay, Indicator, Steps, Actions) for tailorable loading experiences.
 */
const meta = {
  title: 'Components/Layout/Preloader',
  component: Preloader,
  subcomponents: {
    PreloaderOverlay,
    PreloaderContent,
    PreloaderHeader,
    PreloaderTitle,
    PreloaderSubtitle,
    PreloaderIndicator,
    PreloaderStep,
    PreloaderSteps,
    PreloaderFooter,
    PreloaderActions,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A sophisticated application initialization system. Manages complex loading sequences across multiple asynchronous steps with high-fidelity visual feedback.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Preloader>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSteps = [
  { id: 1, name: 'Initializing_Core', description: 'Setting up framework', icon: Code, weight: 20 },
  {
    id: 2,
    name: 'Loading_Assets',
    description: 'Images and resources',
    icon: ImageIcon,
    weight: 30,
  },
  { id: 3, name: 'Inference_Sync', description: 'Performance tweaks', icon: Zap, weight: 20 },
  {
    id: 4,
    name: 'Node_Handshake',
    description: 'Establishing connections',
    icon: Globe,
    weight: 30,
  },
];

// --- STORIES ---

/**
 * Standard implementation used during primary application boot.
 */
export const Basic: Story = {
  args: {
    variant: 'interactive',
    theme: 'default',
    title: 'Preparing Your Experience',
    customSteps: defaultSteps,
    showOnce: false,
    onComplete: fn(),
  },
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'interactive',
    theme: 'cyberpunk',
    title: '// PROTOCOL_INITIALIZATION',
    customSteps: defaultSteps.map((s) => ({ ...s, name: s.name.toUpperCase() })),
    showOnce: false,
  },
};

/**
 * Immersive glass variant with backdrop blur, ideal for mid-app transitions.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'interactive',
    theme: 'glass',
    title: 'Atmospheric_Sync',
    customSteps: defaultSteps,
    showOnce: false,
  },
  render: (args) => (
    <div className="h-screen bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800">
      <Preloader {...args} />
    </div>
  ),
};

/**
 * Demonstrates the atomic sub-components for custom preloader layouts.
 */
export const ComponentGallery: Story = {
  render: () => {
    return (
      <div className="p-20 space-y-12">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
            Preloader_Indicator
          </p>
          <div className="flex gap-8 items-center">
            <PreloaderIndicator progress={42} theme="default" />
            <PreloaderIndicator progress={85} theme="cyber" />
            <PreloaderIndicator progress={60} theme="glass" className="bg-primary/5" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
            Step_States
          </p>
          <div className="w-80 space-y-2">
            <PreloaderStep status="completed" icon={<Database size={14} />}>
              Database_Connected
            </PreloaderStep>
            <PreloaderStep status="active" icon={<Activity size={14} />}>
              Syncing_Packets...
            </PreloaderStep>
            <PreloaderStep status="pending" icon={<Globe size={14} />}>
              Awaiting_Node_Uplink
            </PreloaderStep>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
            Preloader_Content_Variants
          </p>
          <div className="grid grid-cols-2 gap-8">
            <PreloaderContent variant="cyber" className="p-10 border border-cyan-500/20 bg-black">
              <PreloaderHeader>
                <PreloaderTitle className="text-cyan-500 font-mono italic tracking-tighter text-xl">
                  // SECURITY_ENCLAVE
                </PreloaderTitle>
                <PreloaderSubtitle className="font-mono text-[9px] text-cyan-500/40">
                  IDENT_AUTH_REQUIRED
                </PreloaderSubtitle>
              </PreloaderHeader>
              <PreloaderActions>
                <Button variant="cyber" size="sm" className="w-full">
                  BYPASS_AUTH
                </Button>
              </PreloaderActions>
            </PreloaderContent>

            <PreloaderContent
              variant="glass"
              className="p-10 border-white/10 bg-white/5 backdrop-blur-2xl"
            >
              <PreloaderHeader>
                <PreloaderTitle className="text-white text-xl">Cloud_Layer</PreloaderTitle>
                <PreloaderSubtitle className="text-white/40 text-xs uppercase tracking-widest">
                  Optimizing_Refraction
                </PreloaderSubtitle>
              </PreloaderHeader>
              <PreloaderActions>
                <Badge variant="outline" className="text-white border-white/20">
                  98% STABLE
                </Badge>
              </PreloaderActions>
            </PreloaderContent>
          </div>
        </div>
      </div>
    );
  },
};
