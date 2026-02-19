import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
  InputGroupButton,
  InputGroupTextarea,
} from '@aazucena/ui';
import { Globe, Database, Search, Copy, Refresh, Shield, Send } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite input container for grouping addons, buttons, and text prefixes/suffixes.
 * - **UX:** Automatically manages focus delegation; clicking an addon focuses the nested input.
 * - **Architecture:** Unifies internal borders and corner-radii to present a single cohesive module.
 * - **Accessibility:** Built with standard ARIA group roles and supports keyboard navigation for nested actions.
 */
const meta = {
  title: 'Components/Forms/InputGroup',
  component: InputGroup,
  subcomponents: {
    InputGroupAddon,
    InputGroupText,
    InputGroupInput,
    InputGroupButton,
    InputGroupTextarea,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper for clustering input elements with related actions, icons, or labels.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing prefix icons and suffix text.
 */
export const Basic: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <InputGroup>
        <InputGroupAddon>
          <Globe size={14} />
        </InputGroupAddon>
        <InputGroupInput placeholder="https://aazucena.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="user_handle" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@node_alpha</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon buttons and technical icons.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="w-96 p-10 bg-black rounded-3xl border border-cyan-500/10">
      <InputGroup className="border-cyan-500/30 bg-cyan-500/5 h-12 rounded-xl">
        <InputGroupAddon className="text-cyan-500 pl-4">
          <Database size={16} />
        </InputGroupAddon>
        <InputGroupInput
          className="text-cyan-400 font-mono uppercase tracking-widest placeholder:text-cyan-500/20"
          placeholder="QUERY_ID"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-sm"
            className="text-cyan-500 hover:bg-cyan-500/10 mr-1"
          >
            <Refresh size={14} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/**
 * Demonstrates the block-start alignment for multiline technical comments.
 */
export const MultilineConfig: Story = {
  render: () => (
    <div className="w-[500px]">
      <InputGroup className="h-auto">
        <InputGroupAddon align="block-start" className="border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Security_Protocol_Override
            </span>
          </div>
        </InputGroupAddon>
        <InputGroupTextarea
          placeholder="Paste RSA public key or PGP signature here..."
          className="min-h-[150px] p-4 text-xs font-mono"
        />
        <InputGroupAddon align="inline-end" className="absolute bottom-2 right-2 border-none">
          <InputGroupButton variant="default" size="sm" className="rounded-lg h-10 px-6">
            Apply_Key
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/**
 * Integrated search pattern with primary action button.
 */
export const IntegratedSearch: Story = {
  render: () => (
    <div className="w-[500px]">
      <InputGroup className="h-14 rounded-full pl-6 border-zinc-200 overflow-hidden shadow-lg">
        <Search className="size-5 opacity-40 mr-2" />
        <InputGroupInput placeholder="Search node registry..." className="text-base" />
        <InputGroupAddon align="inline-end" className="p-0">
          <Button className="h-14 px-8 rounded-none bg-primary hover:bg-primary/90 font-black uppercase tracking-widest">
            Search
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
