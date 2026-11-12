import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
} from '@aazucena/ui';
import { Play, Shield, Zap, Trash, Globe, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based secondary interaction system (Right-click).
 * - **UX:** Features smooth `fade-in` and `zoom-in` animations for menu entry.
 * - **Accessibility:** Fully keyboard navigable once triggered; supports `aria-label` and `aria-disabled`.
 * - **Variants:** Supports high-fidelity `cyber` and `glass` themes.
 */
const meta = {
  title: 'Components/Primitives/ContextMenu',
  component: ContextMenu,
  subcomponents: {
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuCheckboxItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    ContextMenuGroup,
    ContextMenuPortal,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust context menu system triggered by a right-click or long-press. Supports nesting, checkbox items, and radio groups.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard context menu with basic navigation items and grouping.
 */
export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[400px] items-center justify-center rounded-card border-2 border-dashed border-muted text-sm select-none hover:bg-muted/10 transition-colors">
        Right-click to Inspect Element
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Page Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Settings</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Global Stats</ContextMenuItem>
            <ContextMenuItem>Privacy Filter</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const Cyber: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="group flex h-[200px] w-[400px] flex-col items-center justify-center rounded-card border border-signal/20 bg-background">
        <Activity className="size-8 text-signal mb-4 animate-pulse" />
        <span className="font-mono text-signal text-xs tracking-widest">
          [ENCRYPTED_NODE_TERMINAL]
        </span>
        <span className="text-[9px] opacity-20 uppercase mt-2">Right-click for root access</span>
      </ContextMenuTrigger>
      <ContextMenuContent variant="cyber" className="w-72 font-mono">
        <ContextMenuLabel className="text-signal uppercase italic tracking-tighter">
          // NODE_PROTOCOLS
        </ContextMenuLabel>
        <ContextMenuSeparator className="bg-signal/20" />
        <ContextMenuItem className="gap-3 focus:bg-signal/20 focus:text-signal">
          <Play className="size-3.5" />
          EXECUTE_SEQUENCE
          <ContextMenuShortcut>F5</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="gap-3 focus:bg-signal/20 focus:text-signal">
          <Shield className="size-3.5" />
          BYPASS_FIREWALL
          <ContextMenuShortcut>F12</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-signal/20" />
        <ContextMenuGroup>
          <ContextMenuLabel className="text-[10px] opacity-40">DANGEROUS_ZONE</ContextMenuLabel>
          <ContextMenuItem className="gap-3 focus:bg-alert/20 text-alert">
            <Trash className="size-3.5" />
            TERMINATE_CORE
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Immersive glass variant with backdrop blur for atmospheric UI layers.
 */
export const Glass: Story = {
  render: () => (
    <div className="p-20 rounded-card">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[200px] w-[400px] items-center justify-center rounded-card border border-rule bg-state text-foreground font-black tracking-widest text-xs uppercase">
          Atmospheric_Interaction_Zone
        </ContextMenuTrigger>
        <ContextMenuContent variant="glass" className="w-64 border-rule">
          <ContextMenuLabel className="text-foreground/60">LAYER_CONFIG</ContextMenuLabel>
          <ContextMenuSeparator className="bg-state" />
          <ContextMenuCheckboxItem checked className="text-foreground focus:bg-state">
            Enable_Blur_Texture
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem className="text-foreground focus:bg-state">
            Live_Update_Stream
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator className="bg-state" />
          <ContextMenuItem className="text-foreground focus:bg-state">
            Reset_Coordinates
            <ContextMenuShortcut className="text-foreground/40">⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};
