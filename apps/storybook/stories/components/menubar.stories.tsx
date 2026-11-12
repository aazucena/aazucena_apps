import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarGroup,
  MenubarPortal,
} from '@aazucena/ui';
import {
  User,
  CogFour as Cog,
  Activity,
  Globe,
  Layout,
  PlusCircle as Plus,
  Shield,
  Zap,
  Trash,
  Copy,
  Database,
} from '@aazucena/icons';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based horizontal menu system for primary application actions.
 * - **UX:** Features sequential menu activation; once open, hovering over other triggers activates their respective menus.
 * - **Accessibility:** Fully keyboard navigable with standard shortcut support and ARIA roles for hierarchical menus.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes.
 */
const meta = {
  title: 'Components/Primitives/Menubar',
  component: Menubar,
  subcomponents: {
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarSeparator,
    MenubarShortcut,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
    MenubarGroup,
    MenubarPortal,
  } as any,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=22-28',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'A persistent horizontal menu bar for complex application interfaces. Supports nested submenus, selection items, and keyboard shortcuts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard application-style menubar with File, Edit, and View menus.
 */
export const Basic: Story = {
  render: () => (
    <Menubar className="rounded-card border px-2">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Protocol</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New_Sync <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open_Buffer <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share_Intel</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Internal_Node</MenubarItem>
              <MenubarItem>Global_Relay</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Print_Report</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="font-bold">Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Reset_Session</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="font-bold">Security</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked>Enable_Firewall</MenubarCheckboxItem>
          <MenubarCheckboxItem>Log_Inbound_Traffic</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Encryption_Level</MenubarLabel>
          <MenubarRadioGroup value="aes">
            <MenubarRadioItem value="aes">AES_256</MenubarRadioItem>
            <MenubarRadioItem value="chacha">CHACHA20</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="p-10 bg-background border border-signal/10 rounded-card">
      <Menubar className="font-mono bg-transparent border-none">
        <MenubarMenu>
          <MenubarTrigger className="text-signal hover:bg-signal/10 italic font-black uppercase tracking-tighter">
            // KERNEL
          </MenubarTrigger>
          <MenubarContent variant="cyber" className="w-64">
            <MenubarLabel className="text-signal/60 uppercase text-[10px]">
              # CORE_OPERATIONS
            </MenubarLabel>
            <MenubarSeparator className="bg-signal/20" />
            <MenubarItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Activity className="size-4" /> STATUS_REPORT
            </MenubarItem>
            <MenubarItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Zap className="size-4" /> INITIALIZE_BOOT
            </MenubarItem>
            <MenubarSeparator className="bg-signal/20" />
            <MenubarItem className="focus:bg-alert/20 text-alert">SHUTDOWN_NODE</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-signal hover:bg-signal/10 italic font-black uppercase tracking-tighter">
            // NETWORK
          </MenubarTrigger>
          <MenubarContent variant="cyber" className="w-64">
            <MenubarItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Globe className="size-4" /> SCAN_PORTS
            </MenubarItem>
            <MenubarItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Database className="size-4" /> SYNC_CLUSTER
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for top-level toolbars over complex backgrounds.
 */
export const GlassToolbar: Story = {
  render: () => (
    <div className="p-40 rounded-card relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-fit">
        <Menubar className="bg-state border-rule text-foreground rounded-full px-4 h-12">
          <MenubarMenu>
            <MenubarTrigger className="focus:bg-state data-open:bg-state font-black uppercase tracking-widest text-xs">
              Layers
            </MenubarTrigger>
            <MenubarContent variant="glass" className="border-rule text-foreground">
              <MenubarItem className="focus:bg-state">Troposphere</MenubarItem>
              <MenubarItem className="focus:bg-state">Mesosphere</MenubarItem>
              <MenubarItem className="focus:bg-state">Exosphere</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="focus:bg-state data-open:bg-state font-black uppercase tracking-widest text-xs">
              View
            </MenubarTrigger>
            <MenubarContent variant="glass" className="border-rule text-foreground">
              <MenubarCheckboxItem checked className="focus:bg-state">
                Show_Telemetry
              </MenubarCheckboxItem>
              <MenubarCheckboxItem className="focus:bg-state">Grid_Overlay</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  ),
};
