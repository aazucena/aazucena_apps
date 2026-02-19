import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from '@aazucena/ui';
import { Button } from '@aazucena/ui';
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
} from '@aazucena/icons';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based dropdown primitive for navigation and actions.
 * - **UX:** Features smooth `fade-in`, `zoom-in`, and directional slide animations.
 * - **Accessibility:** Built-in focus management, keyboard navigation, and ARIA roles for submenus and selection items.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes.
 */
const meta = {
  title: 'Components/Primitives/DropdownMenu',
  component: DropdownMenu,
  subcomponents: {
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile dropdown menu for presenting a list of actions or navigation links. Supports submenus, checkboxes, and radio selections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for account management or general actions.
 */
export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Manage Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent size="md">
        <DropdownMenuLabel>IDENTITY_TOKENS</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2" />
            <span>Profile_Settings</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shield className="mr-2" />
            <span>Security_Logs</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-500 focus:text-rose-500">
          <Trash className="mr-2" />
          <span>Purge_Session</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const Cyber: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="cyber">NODE_OPERATIONS</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="cyber" size="lg" className="font-mono">
        <DropdownMenuLabel className="text-cyan-500 italic tracking-tighter uppercase">
          // SELECT_PROTOCOL
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-cyan-500/20" />
        <DropdownMenuItem className="focus:bg-cyan-500/20 focus:text-cyan-400 gap-3">
          <Globe className="size-4" />
          ESTABLISH_GLOBAL_LINK
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-cyan-500/20 focus:text-cyan-400 gap-3">
          <Zap className="size-4" />
          INITIATE_PULSE_SYNC
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-cyan-500/20" />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="focus:bg-cyan-500/20 focus:text-cyan-400 gap-3">
            <Shield className="size-4" />
            ENCRYPTION_MODES
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent variant="cyber" className="font-mono">
              <DropdownMenuItem className="focus:bg-cyan-500/20 focus:text-cyan-400">
                AES_256_GCM
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-cyan-500/20 focus:text-cyan-400">
                CHACHA20_POLY1305
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Immersive glass variant with backdrop blur for atmospheric UI contexts.
 */
export const GlassSelection: Story = {
  render: () => {
    const [theme, setTheme] = useState('dark');
    const [blur, setBlur] = useState(true);

    return (
      <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="glass"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-8"
            >
              Environment_Config
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent variant="glass" className="w-64 border-white/10 text-white">
            <DropdownMenuLabel className="text-white/60">LAYER_VISUALS</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuCheckboxItem
              checked={blur}
              onCheckedChange={setBlur}
              className="focus:bg-white/10"
            >
              Backdrop_Blur_Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuLabel className="text-[10px] opacity-40">DISPLAY_MODE</DropdownMenuLabel>
              <DropdownMenuRadioItem value="light" className="focus:bg-white/10">
                Light_Layer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="focus:bg-white/10">
                Dark_Layer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="auto" className="focus:bg-white/10">
                System_Sync
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
};

/**
 * Demonstrates complex groupings and keyboard shortcuts.
 */
export const AdvancedComposition: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy_Identifier</span>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Activity className="mr-2 h-4 w-4" />
            <span>Trace_Signal</span>
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Global_Relay</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            <span>Select_Region...</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
