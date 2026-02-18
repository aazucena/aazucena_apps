import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar, ToolbarButton } from '@aazucena/ui';
import { Layout, Globe, Activity, CogFour as Cog, Shield, Zap, Search, User } from '@aazucena/icons';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Fixed-position layout component for high-level site or section controls.
 * - **UX:** Features automated `Tooltip` integration for all buttons and smooth `isScrolled` transition logic.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `backdrop-blur`.
 * - **Responsiveness:** Supports multiple fixed anchors (`top-center`, `bottom-right`, etc.) and vertical/horizontal orientations.
 * - **Composition:** Modular `ToolbarButton` parts with support for `isActive` state tracking.
 */
const meta = {
  title: 'Components/Navigation/Toolbar',
  component: Toolbar,
  subcomponents: { ToolbarButton } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A persistent navigation or utility bar. Usually fixed to the viewport edges to provide global actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'ghost'],
      description: 'The visual theme of the toolbar',
      table: { category: 'Appearance' }
    },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'],
      description: 'The fixed anchoring point',
      table: { category: 'Layout' }
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The layout axis',
      table: { category: 'Layout' }
    }
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a floating navigation bar at the top.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    position: 'top-center',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="h-[300px] w-full bg-muted/10 relative overflow-hidden flex flex-col items-center justify-center italic text-xs opacity-20 uppercase tracking-widest">
      <Toolbar {...args}>
        <ToolbarButton icon={<Layout size={20} />} label="Dashboard" isActive />
        <ToolbarButton icon={<Globe size={20} />} label="Globe_View" />
        <ToolbarButton icon={<Activity size={20} />} label="Telemetry" />
        <ToolbarButton icon={<User size={20} />} label="Identity" />
      </Toolbar>
      Viewport_Stage
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical tooltips.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    position: 'top-right',
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="h-[400px] w-full bg-black relative overflow-hidden border border-cyan-500/10">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.3)_0%,transparent_70%)]" />
      <Toolbar {...args}>
        <ToolbarButton variant="cyber" icon={<Zap size={20} />} label="INIT_PULSE" />
        <ToolbarButton variant="cyber" icon={<Shield size={20} />} label="AUTH_ENCLAVE" isActive />
        <ToolbarButton variant="cyber" icon={<Search size={20} />} label="SCAN_SECTOR" />
        <div className="h-px w-8 bg-cyan-500/20 my-2" />
        <ToolbarButton variant="cyber" icon={<Cog size={20} />} label="SYS_CONFIG" />
      </Toolbar>
      <div className="h-full flex items-center justify-center">
        <h1 className="font-mono text-cyan-500/20 text-4xl font-black italic select-none uppercase tracking-[0.2em]">UPLINK_TERMINAL</h1>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    position: 'bottom-center',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="h-[400px] w-full bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <Toolbar {...args} className="bg-white/5 border-white/10 shadow-2xl">
        <ToolbarButton variant="glass" icon={<Layout size={20} className="text-white" />} label="Layers" />
        <ToolbarButton variant="glass" icon={<Globe size={20} className="text-white" />} label="Regions" isActive />
        <ToolbarButton variant="glass" icon={<Activity size={20} className="text-white" />} label="Telemetry" />
      </Toolbar>
      <span className="text-white font-black text-3xl tracking-tighter uppercase opacity-20">Crystal_Layer_Sync</span>
    </div>
  ),
};

/**
 * Demonstrates the interactive state switching.
 */
export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState('d');
    return (
      <div className="h-[200px] w-full flex items-center justify-center bg-muted/5 border-2 border-dashed rounded-[3rem]">
        <Toolbar position="top-center" variant="glass" className="relative top-0 left-0 translate-x-0">
          <ToolbarButton 
            icon={<Layout size={20} />} 
            label="Layout" 
            isActive={active === 'l'} 
            onClick={() => setActive('l')} 
          />
          <ToolbarButton 
            icon={<Globe size={20} />} 
            label="Globe" 
            isActive={active === 'g'} 
            onClick={() => setActive('g')} 
          />
          <ToolbarButton 
            icon={<Activity size={20} />} 
            label="Activity" 
            isActive={active === 'a'} 
            onClick={() => setActive('a')} 
          />
        </Toolbar>
      </div>
    );
  }
};
