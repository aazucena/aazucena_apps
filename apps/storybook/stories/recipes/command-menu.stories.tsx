import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  Badge,
} from '@aazucena/ui';
import {
  Search,
  FileText,
  Cog,
  Users,
  Terminal,
  Zap,
  Globe,
} from '@aazucena/icons';

/**
 * ## Command Menu Recipe
 * Demonstrates composing Command primitives with Badge into a keyboard-driven command palette.
 */
const meta = {
  title: 'Recipes/Navigation/CommandMenu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A command palette composed from Command primitives and Badge, mimicking ⌘K style navigation.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full-featured command palette with grouped actions and keyboard shortcut hints.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[560px] shadow-2xl rounded-2xl border overflow-hidden bg-background">
      <Command className="rounded-none">
        <div className="flex items-center border-b px-4 py-3 gap-3">
          <Search className="size-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Search commands, files, actions..."
            className="border-0 outline-none ring-0 focus:ring-0 h-auto p-0 text-sm bg-transparent flex-1"
          />
          <kbd className="text-[10px] font-mono bg-muted px-2 py-1 rounded border text-muted-foreground">
            ESC
          </kbd>
        </div>
        <CommandList className="max-h-[320px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem className="gap-3 py-2.5">
              <Terminal className="size-4 text-primary" />
              <span>Open Terminal</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                ⌘T
              </Badge>
            </CommandItem>
            <CommandItem className="gap-3 py-2.5">
              <Zap className="size-4 text-amber-500" />
              <span>Run Build</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                ⌘B
              </Badge>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem className="gap-3 py-2.5">
              <Globe className="size-4 text-blue-500" />
              <span>Portfolio</span>
            </CommandItem>
            <CommandItem className="gap-3 py-2.5">
              <FileText className="size-4 text-green-500" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem className="gap-3 py-2.5">
              <Users className="size-4 text-purple-500" />
              <span>Team Members</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem className="gap-3 py-2.5">
              <Cog className="size-4 opacity-60" />
              <span>Preferences</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                ⌘,
              </Badge>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="border-t px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border">↵</kbd> select
          </span>
        </div>
      </Command>
    </div>
  ),
};
