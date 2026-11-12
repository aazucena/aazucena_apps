import type { Meta, StoryObj } from '@storybook/react-vite';
import { Terminal, TerminalAction, TerminalBody, TerminalHeader, TerminalLine } from '@aazucena/ui';
import { Badge, Button } from '@aazucena/ui';
import { Activity, Globe, Zap, Database, Shield } from '@aazucena/icons';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for technical readouts, code snippets, and log streams.
 * - **UX:** Features specialized `TerminalLine` with support for line numbering and high-fidelity code highlighting.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `` and terminal decoration buttons.
 * - **Composition:** Fully modular parts (Header, Body, Line, Action) for tailorable technical displays.
 */
const meta = {
  title: 'Components/Data/Terminal',
  component: Terminal,
  subcomponents: {
    TerminalHeader,
    TerminalBody,
    TerminalLine,
    TerminalAction,
  } as any,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=24-95',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'A high-fidelity terminal emulator component for displaying technical logs, code, and system status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the terminal',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a boot sequence log.
 */
export const CyberBoot: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[700px] p-12 bg-background rounded-card border border-signal/10">
      <Terminal {...args}>
        <TerminalHeader>KERNEL_BOOT_SEQUENCE</TerminalHeader>
        <TerminalBody className="max-h-[300px]">
          <TerminalLine number={1}>[ 0.000000] Linux version 6.5.0-intel-aazucena</TerminalLine>
          <TerminalLine number={2}>
            [ 0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009efff] usable
          </TerminalLine>
          <TerminalLine number={3}>
            [ 0.000000] NX (Execute Disable) protection: active
          </TerminalLine>
          <TerminalLine number={4}>[ 0.000000] DMI: AAZUCENA_LABS_UNIT_0x7F42</TerminalLine>
          <TerminalLine number={5} className="text-signal font-bold">
            -- INITIALIZING_UPLINK_ENCLAVE --
          </TerminalLine>
          <TerminalLine number={6}>
            [ 0.420042] pci 0000:00:00.0: [8086:9b41] type 00 class 0x060000
          </TerminalLine>
          <TerminalLine number={7}>
            [ 0.420884] usbcore: registered new interface driver usbfs
          </TerminalLine>
          <TerminalLine number={8} className="text-success font-bold">
            {' '}
            SUCCESS: Uplink synchronized across all continental nodes.
          </TerminalLine>
        </TerminalBody>
      </Terminal>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for code snippets or technical overviews.
 */
export const GlassCode: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="p-20 rounded-card relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-scrim" />
        <div className="w-[600px] relative z-10">
          <Terminal {...args} className="border-rule">
            <TerminalHeader className="text-foreground border-rule">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-foreground border-rule">
                  JSON
                </Badge>
                <span>node_config.json</span>
              </div>
              <TerminalAction active={copied} onClick={handleCopy} className="text-foreground" />
            </TerminalHeader>
            <TerminalBody className="text-foreground/80">
              <TerminalLine number={1}>
                <span className="text-series-4">&#123;</span>
              </TerminalLine>
              <TerminalLine number={2}>
                {' '}
                <span className="text-signal">"id"</span>:{' '}
                <span className="text-warning">"0x7F42"</span>,
              </TerminalLine>
              <TerminalLine number={3}>
                {' '}
                <span className="text-signal">"alias"</span>:{' '}
                <span className="text-warning">"Azucena_Primary"</span>,
              </TerminalLine>
              <TerminalLine number={4}>
                {' '}
                <span className="text-signal">"status"</span>:{' '}
                <span className="text-success">"OPERATIONAL"</span>,
              </TerminalLine>
              <TerminalLine number={5}>
                {' '}
                <span className="text-signal">"enclave"</span>:{' '}
                <span className="text-series-4">&#123;</span>
              </TerminalLine>
              <TerminalLine number={6}>
                {' '}
                <span className="text-signal">"type"</span>:{' '}
                <span className="text-warning">"RSA-4096"</span>,
              </TerminalLine>
              <TerminalLine number={7}>
                {' '}
                <span className="text-signal">"active"</span>:{' '}
                <span className="text-warning">true</span>
              </TerminalLine>
              <TerminalLine number={8}>
                {' '}
                <span className="text-series-4">&#125;</span>
              </TerminalLine>
              <TerminalLine number={9}>
                <span className="text-series-4">&#125;</span>
              </TerminalLine>
            </TerminalBody>
          </Terminal>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates a high-density status monitor layout.
 */
export const StatusMonitor: Story = {
  render: () => (
    <div className="w-[500px]">
      <Terminal variant="default">
        <TerminalHeader showButtons={false}>
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">
              Global_Heartbeat_Monitor
            </span>
          </div>
        </TerminalHeader>
        <TerminalBody className="bg-muted/30">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase">US_EAST_NODE</span>
                <span className="font-bold">Syncing...</span>
              </div>
              <div className="size-2 rounded-full bg-signal animate-pulse" />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase">EU_WEST_NODE</span>
                <span className="font-bold text-success">Nominal</span>
              </div>
              <div className="size-2 rounded-full bg-success" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase">AP_SOUTH_NODE</span>
                <span className="font-bold text-alert">Critical_Fail</span>
              </div>
              <div className="size-2 rounded-full bg-alert animate-ping" />
            </div>
          </div>
        </TerminalBody>
      </Terminal>
    </div>
  ),
};
