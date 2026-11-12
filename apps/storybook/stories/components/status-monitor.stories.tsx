import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  StatusMonitor,
  StatusMonitorContent,
  StatusMonitorFooter,
  StatusMonitorHeader,
  StatusMonitorIcon,
  StatusMonitorTitle,
  StatusMonitorValue,
  StatusMonitorAlert,
  StatusMonitorLog,
  StatusMonitorLogHeader,
  StatusMonitorLogContent,
} from '@aazucena/ui';
import {
  Activity,
  CheckCircle as ShieldCheck,
  DangerCircle,
  InfoCircle,
  Terminal,
  Database,
  Globe,
} from '@aazucena/icons';
import { useState } from 'react';
import { Badge, Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for real-time system monitoring and alert management.
 * - **UX:** Features state-aware headers and icons that transition between `NOMINAL`, `WARNING`, and `CRITICAL`.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `` and pulsing alert icons.
 * - **Composition:** Fully modular parts (Header, Icon, Value, Log, Alert) for tailorable terminal interfaces.
 */
const meta = {
  title: 'Components/Data/StatusMonitor',
  component: StatusMonitor,
  subcomponents: {
    StatusMonitorHeader,
    StatusMonitorIcon,
    StatusMonitorTitle,
    StatusMonitorValue,
    StatusMonitorContent,
    StatusMonitorFooter,
    StatusMonitorAlert,
    StatusMonitorLog,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A sophisticated monitoring module for displaying system health, active alerts, and diagnostic logs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the monitor container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof StatusMonitor>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a nominal security state.
 */
export const NominalState: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[500px]">
      <StatusMonitor {...args}>
        <StatusMonitorHeader status="NOMINAL">
          <div className="flex items-center gap-4">
            <StatusMonitorIcon status="NOMINAL">
              <ShieldCheck className="size-6" />
            </StatusMonitorIcon>
            <div>
              <StatusMonitorTitle>Security_Enclave</StatusMonitorTitle>
              <StatusMonitorValue status="NOMINAL">ENCRYPTED_LOCKED</StatusMonitorValue>
            </div>
          </div>
          <Badge variant="outline" size="xs">
            STABLE
          </Badge>
        </StatusMonitorHeader>
        <StatusMonitorContent>
          <p className="text-sm opacity-60 leading-relaxed">
            All cryptographic barriers are active. Node US_EAST_01 is reporting zero unauthorized
            handshake attempts in the current epoch.
          </p>
          <div className="mt-6 space-y-3">
            <StatusMonitorAlert level="NOMINAL">
              <div className="flex items-center gap-3">
                <Database size={14} className="text-success" />
                <span className="text-xs font-bold uppercase">Buffer_Sync</span>
              </div>
              <span className="text-[10px] font-mono opacity-40 uppercase">0ms_Lag</span>
            </StatusMonitorAlert>
          </div>
        </StatusMonitorContent>
        <StatusMonitorFooter>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Auto_Audit: PASS
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-widest"
          >
            Details
          </Button>
        </StatusMonitorFooter>
      </StatusMonitor>
    </div>
  ),
};

/**
 * High-urgency critical state with terminal-style logs.
 */
export const CriticalTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[550px]">
      <StatusMonitor {...args}>
        <StatusMonitorHeader status="CRITICAL">
          <div className="flex items-center gap-4">
            <StatusMonitorIcon status="CRITICAL">
              <DangerCircle className="size-6" />
            </StatusMonitorIcon>
            <div>
              <StatusMonitorTitle className="text-alert/60">Kernel_Inference</StatusMonitorTitle>
              <StatusMonitorValue status="CRITICAL">BUFFER_OVERFLOW_0x7F</StatusMonitorValue>
            </div>
          </div>
          <div className="size-2 rounded-full bg-alert animate-ping" />
        </StatusMonitorHeader>
        <StatusMonitorContent className="bg-background p-0">
          <div className="p-6 font-mono text-[11px] text-alert space-y-1">
            <p className="font-bold">{'>'} CRITICAL_ERROR: MEMORY_ALLOCATION_FAILED</p>
            <p className="opacity-40 italic">-- generating stack trace --</p>
            <p className="opacity-40 italic">-- isolating affected sectors --</p>
            <p className="mt-4">{'>'} INITIATING_EMERGENCY_OVERRIDE...</p>
          </div>
          <div className="px-6 pb-6">
            <StatusMonitorAlert level="CRITICAL" className="bg-alert/10 border-alert/20">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-alert" />
                <span className="text-xs font-black uppercase text-alert">
                  Manual_Init_Required
                </span>
              </div>
            </StatusMonitorAlert>
          </div>
        </StatusMonitorContent>
        <StatusMonitorFooter variant="cyber" className="border-alert/20">
          <span className="text-[10px] font-mono text-alert/40 uppercase">
            Awaiting_Admin_Pulse_
          </span>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 rounded-control uppercase font-black tracking-widest text-[9px]"
          >
            Reboot_Kernel
          </Button>
        </StatusMonitorFooter>
      </StatusMonitor>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric backgrounds.
 */
export const GlassMonitor: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 rounded-card relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-scrim" />
      <div className="relative z-10 w-[500px]">
        <StatusMonitor {...args} className="border-rule">
          <StatusMonitorHeader status="NOMINAL" className="border-rule bg-state">
            <div className="flex items-center gap-4 text-foreground">
              <StatusMonitorIcon
                status="NOMINAL"
                className="bg-state border-rule text-foreground shadow-none"
              >
                <Globe size={24} />
              </StatusMonitorIcon>
              <div>
                <StatusMonitorTitle className="text-foreground/40">
                  Network_Reach
                </StatusMonitorTitle>
                <StatusMonitorValue className="text-foreground">
                  Global_Uplink_Active
                </StatusMonitorValue>
              </div>
            </div>
          </StatusMonitorHeader>
          <StatusMonitorContent className="text-foreground/80">
            <div className="space-y-6">
              <p className="text-xs leading-relaxed">
                Continental edge nodes are reporting consistent heartbeat signals. Signal gain
                optimization is running at **98.4%** efficiency.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-state border border-rule rounded-card">
                  <span className="text-[9px] font-black uppercase text-foreground/40">
                    US_East
                  </span>
                  <p className="text-lg font-black">12ms</p>
                </div>
                <div className="p-3 bg-state border border-rule rounded-card">
                  <span className="text-[9px] font-black uppercase text-foreground/40">
                    EU_West
                  </span>
                  <p className="text-lg font-black text-signal">18ms</p>
                </div>
              </div>
            </div>
          </StatusMonitorContent>
        </StatusMonitor>
      </div>
    </div>
  ),
};
