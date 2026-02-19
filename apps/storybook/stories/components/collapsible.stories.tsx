import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { ChevronDown, CogFour as Cog, InfoCircle as Info } from '@aazucena/icons';
import { useState } from 'react';
import { within, userEvent, expect } from '@storybook/test';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI primitive for progressive disclosure.
 * - **UX:** Smooth height transitions (requires `data-[state=open]:animate-collapsible-down`).
 * - **Accessibility:** Uses standard ARIA attributes for expanding/collapsing content.
 * - **Design:** Optimized for technical settings, logs, and metadata inspection panels.
 */
const meta = {
  title: 'Components/Primitives/Collapsible',
  component: Collapsible,
  subcomponents: { CollapsibleTrigger, CollapsibleContent } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An interactive component which can be expanded or collapsed. Useful for secondary information or high-density technical interfaces.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'The controlled open state',
      table: { category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a system initialization log.
 */
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4 py-2 border rounded-xl bg-muted/30">
          <div className="flex items-center gap-3">
            <Cog className="size-4 animate-spin-slow opacity-40" />
            <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] opacity-60">
              SYSTEM_BOOT_LOG
            </h4>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronDown
                className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className="rounded-xl border border-border px-4 py-3 font-mono text-[10px] bg-muted/10 opacity-80">
          {'>'} INITIALIZING_KERNEL... [OK]
        </div>

        <CollapsibleContent className="space-y-2 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-300">
          <div className="rounded-xl border border-border px-4 py-3 font-mono text-[10px] bg-muted/10 opacity-80">
            {'>'} MOUNTING_VIRTUAL_VOLUMES... [OK]
          </div>
          <div className="rounded-xl border border-border px-4 py-3 font-mono text-[10px] bg-muted/10 opacity-80">
            {'>'} ESTABLISHING_ENCRYPTED_TUNNEL... [OK]
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

/**
 * Used for expanding technical details within a specification card.
 */
export const DetailInspection: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-[450px] p-8 border rounded-3xl bg-card shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-black tracking-tighter">NODE_TRANSCEIVER</h3>
            <p className="text-xs text-muted-foreground">Standard Signal Processor v4</p>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4 px-1">
            <span>Core_Metrics</span>
            <CollapsibleTrigger asChild>
              <button className="hover:text-primary transition-colors flex items-center gap-1">
                {isOpen ? 'Hide' : 'Inspect'} <Info size={12} />
              </button>
            </CollapsibleTrigger>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-xl border">
              <p className="text-[9px] opacity-40 uppercase">Bandwidth</p>
              <p className="text-lg font-black">1.2 Gbps</p>
            </div>
            <div className="p-3 bg-muted rounded-xl border">
              <p className="text-[9px] opacity-40 uppercase">Latency</p>
              <p className="text-lg font-black text-cyan-500">12ms</p>
            </div>
          </div>

          <CollapsibleContent className="pt-4 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300">
            <div className="p-4 rounded-xl border-2 border-dashed bg-muted/20 space-y-3">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="opacity-40 uppercase">Packet_Loss</span>
                <span className="text-emerald-500">0.0001%</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="opacity-40 uppercase">Signal_Jitter</span>
                <span className="text-cyan-500">0.42ms</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="opacity-40 uppercase">Auth_Status</span>
                <span className="text-primary font-bold">VERIFIED</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

/**
 * Automated interaction test: click to expand, verify content visible, click to collapse.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4 py-2 border rounded-xl bg-muted/30">
          <h4 className="text-sm font-semibold">System Log</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" aria-label="Toggle system log">
              <ChevronDown
                className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="rounded-xl border px-4 py-3 font-mono text-sm">
            Hidden content revealed
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /toggle system log/i });
    // Content should not be visible initially
    await expect(canvas.queryByText('Hidden content revealed')).not.toBeInTheDocument();
    // Click to expand
    await userEvent.click(trigger);
    await expect(canvas.getByText('Hidden content revealed')).toBeVisible();
    // Click to collapse
    await userEvent.click(trigger);
  },
};
