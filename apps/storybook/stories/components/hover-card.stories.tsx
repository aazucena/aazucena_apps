import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@aazucena/ui';
import { Button, Avatar, AvatarImage, AvatarFallback, Badge } from '@aazucena/ui';
import { Calendar, Shield, Activity, Globe } from '@aazucena/icons';
import { within, userEvent, expect, waitFor } from 'storybook/test';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI primitive for secondary informational overlays.
 * - **UX:** Features smooth `fade-in` and `zoom-in` animations with configurable side offsets.
 * - **Accessibility:** Uses standard ARIA attributes for managing visibility; non-interactive trigger by default.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes.
 */
const meta = {
  title: 'Components/Primitives/HoverCard',
  component: HoverCard,
  subcomponents: { HoverCardTrigger, HoverCardContent } as any,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=23-12',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'For sighted users to preview content available behind a link or button without navigating.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    openDelay: {
      control: 'number',
      description:
        'The duration from when the mouse enters the trigger until the hover card opens.',
      table: { category: 'Behavior', defaultValue: { summary: '700' } },
    },
    closeDelay: {
      control: 'number',
      description:
        'The duration from when the mouse leaves the trigger or content until the hover card closes.',
      table: { category: 'Behavior', defaultValue: { summary: '300' } },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing user or entity previews.
 */
export const Basic: Story = {
  render: () => (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="font-bold">
          @aazucena
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-6 rounded-card">
        <div className="flex justify-between space-x-4">
          <Avatar className="size-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-black tracking-tighter uppercase">Aldrin Azucena</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineering Lead focusing on high-fidelity design systems and decentralized telemetry.
            </p>
            <div className="flex items-center pt-2 gap-2 opacity-40">
              <Calendar className="size-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Joined FEB 2026
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Cyber variant: signal rule and Fira Code labels.
 */
export const CyberSpec: Story = {
  render: () => (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-help border-b border-dashed border-signal/40 pb-0.5">
          <Activity size={14} className="text-signal" />
          <span className="font-mono text-xs text-signal">NODE_0x7F42</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent variant="cyber" side="top" className="w-72 font-mono p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="text-[10px] text-signal font-black uppercase italic tracking-tighter">
              // IDENT_DECRYPTED
            </div>
            <Badge variant="cyber" size="xs">
              ACTIVE
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground uppercase">Primary_Uplink_Core</p>
            <p className="text-[10px] opacity-40 uppercase">ZONE: US_EAST_1</p>
          </div>
          <div className="pt-2 border-t border-signal/10 flex justify-between text-[9px] opacity-60 uppercase">
            <span>Latency</span>
            <span className="text-signal">12ms</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Glass variant: translucent `panel-glass` surface with a 1px rule, for use over imagery. Avra 0.2 has no blur, so check contrast against the backdrop.
 */
export const GlassPreview: Story = {
  render: () => (
    <div className="p-20 rounded-card">
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <Button
            variant="glass"
            className="bg-state text-foreground border-rule hover:bg-panel-raised rounded-full"
          >
            Inspect_Layer
          </Button>
        </HoverCardTrigger>
        <HoverCardContent variant="glass" className="w-80 border-rule text-foreground">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="size-4 opacity-60" />
              <h4 className="font-black uppercase tracking-tighter">Atmospheric_Unit</h4>
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Real-time environmental monitoring with adaptive frosted surfaces and backdrop blur
              enabled.
            </p>
            <div className="p-3 bg-state border border-rule rounded-card">
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                SIGNAL_LOCK
              </span>
              <div className="text-success font-mono text-xs mt-1">99.98% STABLE</div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

/**
 * Automated interaction test: hover trigger to show hover card.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="link">@aazucena</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <p className="text-sm">Hover card content is visible</p>
      </HoverCardContent>
    </HoverCard>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /@aazucena/i });
    await userEvent.hover(trigger);
    // findByText retries until the portal renders; waitFor then retries the
    // visibility assertion while Radix's open animation transitions opacity 0→1.
    const content = await within(document.body).findByText('Hover card content is visible');
    await waitFor(() => expect(content).toBeVisible(), { timeout: 3000 });
    await userEvent.unhover(trigger);
  },
};
