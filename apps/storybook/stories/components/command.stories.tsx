import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  CommandPalette,
  CommandDialog,
} from '@aazucena/ui';
import {
  Math as Calculator,
  Calendar,
  CreditCard,
  Cog as Settings,
  User,
  Globe,
  Database,
  Shield,
  Activity,
  Zap,
  GitHub,
} from '@aazucena/icons';
import { useState } from 'react';
import { Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Searchable command primitive built on `cmdk`.
 * - **UX:** Features a "Command Palette" implementation with global keyboard shortcut (Cmd/Ctrl + K).
 * - **Variants:** Supports high-fidelity `cyber` and `glass` themes.
 * - **Logic:** Integrated with `useCommandSearch` hook for category-aware filtering.
 */
const meta = {
  title: 'Components/Actions/Command',
  component: Command,
  subcomponents: {
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
    CommandPalette,
    CommandDialog,
  } as any,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=19-47',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'A composable command menu for search, navigation, and quick actions. Supports keyboard shortcuts and high-performance filtering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the command menu',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard command menu implementation.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[450px] border rounded-card overflow-hidden">
      <Command {...args}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <User className="mr-2" />
              <span>Search_Team</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and technical typography.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[450px]">
      <Command {...args} className="font-mono">
        <CommandInput placeholder="EXECUTE_COMMAND..." />
        <CommandList className="max-h-[300px]">
          <CommandEmpty>ERROR: No results found.</CommandEmpty>
          <CommandGroup heading="CORE_PROTOCOLS">
            <CommandItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Zap className="size-4 text-signal" />
              <span>INITIALIZE_SCHEDULER</span>
            </CommandItem>
            <CommandItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Database className="size-4 text-signal" />
              <span>SYNC_TELEMETRY_DB</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator className="bg-signal/20" />
          <CommandGroup heading="SECURITY_SETTINGS">
            <CommandItem className="focus:bg-signal/20 focus:text-signal gap-3">
              <Shield className="size-4 text-signal" />
              <span>IDENT_AUTH_TOKEN</span>
              <CommandShortcut>CTRL_P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for modals over complex backgrounds.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 rounded-card">
      <div className="w-[450px]">
        <Command {...args}>
          <CommandInput
            placeholder="Search system..."
            className="text-foreground placeholder:text-foreground/40"
          />
          <CommandList className="max-h-[250px]">
            <CommandGroup heading="NAVIGATION" className="text-foreground/60">
              <CommandItem className="text-foreground hover:bg-state">
                <Globe className="mr-2" /> Global Overview
              </CommandItem>
              <CommandItem className="text-foreground hover:bg-state">
                <Activity className="mr-2" /> Live Stream
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  ),
};

/**
 * High-level CommandPalette implementation with action mapping.
 */
export const PaletteDemo: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const mockActions = [
      {
        id: '1',
        name: 'Go to GitHub',
        icon: GitHub,
        category: 'Navigation',
        keywords: 'source code repo',
        href: 'https://github.com',
      },
      {
        id: '2',
        name: 'Check Status',
        icon: Activity,
        category: 'System',
        keywords: 'telemetry health',
        actionId: 'check-status',
      },
      {
        id: '3',
        name: 'Toggle Theme',
        icon: Zap,
        category: 'Settings',
        keywords: 'dark light mode',
        actionId: 'toggle-theme',
      },
    ];

    return (
      <div className="text-center space-y-4">
        <p className="text-xs opacity-40 uppercase tracking-widest">
          Press <kbd className="bg-muted px-1.5 py-0.5 rounded border">⌘K</kbd> to activate
        </p>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <CommandDialog open={open} onOpenChange={setOpen} variant="cyber">
          <CommandInput placeholder="Search actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="ACTIONS_CORE">
              {mockActions.map((action) => (
                <CommandItem key={action.id} className="flex items-center gap-3">
                  <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-control border">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-xs font-bold tracking-wide uppercase">{action.name}</span>
                    <span className="truncate font-mono text-[10px] opacity-50">
                      {action.keywords}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};
