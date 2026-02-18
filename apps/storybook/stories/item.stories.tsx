import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  Item, 
  ItemMedia, 
  ItemContent, 
  ItemTitle, 
  ItemDescription, 
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemFooter
} from '@aazucena/ui';
import { User, Activity, ChevronRight, Shield, Globe, Zap, Database, Copy } from '@aazucena/icons';
import { Button, Badge, Avatar, AvatarImage, AvatarFallback } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic list-item primitive for high-density navigation, settings, and feed modules.
 * - **UX:** Features flexible media slots (Icon, Image, Avatar) and trailing action groups.
 * - **Accessibility:** Built with standard `role="listitem"` and supports polymorphic `asChild` for semantic link wrapping.
 * - **Design:** Optimized for vertical stacking within `ItemGroup` with integrated separators.
 * - **Composition:** Fully modular parts (Media, Content, Header, Footer, Actions) for flexible item assembly.
 */
const meta = {
  title: 'Components/Primitives/Item',
  component: Item,
  subcomponents: {
    ItemMedia,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    ItemGroup,
    ItemSeparator,
    ItemHeader,
    ItemFooter,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile list item primitive. Handles media alignment, content hierarchy, and trailing actions. Typically used within an ItemGroup.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
      description: 'The visual style of the item container',
      table: { category: 'Appearance' }
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
      description: 'Internal padding and gap preset',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a user profile item with an avatar.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[400px]">
      <Item {...args}>
        <ItemMedia variant="image">
          <Avatar className="size-full rounded-none">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Aldrin Azucena</ItemTitle>
          <ItemDescription>Lead Systems Architect // UNIT_0x7F42</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline" size="xs">ACTIVE</Badge>
          <Button variant="ghost" size="icon" className="size-8"><ChevronRight size={14}/></Button>
        </ItemActions>
      </Item>
    </div>
  ),
};

/**
 * High-density technical item used for system logs or resource lists.
 */
export const TechnicalItem: Story = {
  args: {
    variant: 'muted',
    size: 'sm',
  },
  render: (args) => (
    <div className="w-[450px]">
      <Item {...args} className="rounded-xl">
        <ItemMedia variant="icon" className="bg-primary/10 border-primary/20 text-primary">
          <Activity size={14} />
        </ItemMedia>
        <ItemContent>
          <div className="flex items-center gap-2">
            <ItemTitle className="text-xs font-black uppercase">Ingestion_Pulse</ItemTitle>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <ItemDescription className="font-mono text-[10px]">FREQ: 2.4GHz // SYNC: TRUE</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span className="font-mono text-[10px] opacity-40">12ms</span>
        </ItemActions>
      </Item>
    </div>
  ),
};

/**
 * Demonstrates a complex vertical list implementation with grouping and separators.
 */
export const NavigationList: Story = {
  render: () => (
    <div className="w-[350px] border rounded-2xl overflow-hidden shadow-2xl bg-card">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">SYSTEM_REGISTRY</h3>
      </div>
      <ItemGroup>
        <Item asChild>
          <a href="#">
            <ItemMedia variant="icon"><Database size={14}/></ItemMedia>
            <ItemContent>
              <ItemTitle>Global_Nodes</ItemTitle>
              <ItemDescription>Manage distributed clusters</ItemDescription>
            </ItemContent>
            <ItemActions><Badge variant="secondary">14.2K</Badge></ItemActions>
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild>
          <a href="#">
            <ItemMedia variant="icon"><Shield size={14}/></ItemMedia>
            <ItemContent>
              <ItemTitle>Security_Enclave</ItemTitle>
              <ItemDescription>Identity & access logs</ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild>
          <a href="#">
            <ItemMedia variant="icon"><Zap size={14}/></ItemMedia>
            <ItemContent>
              <ItemTitle>Telemetry_Stream</ItemTitle>
              <ItemDescription>Real-time pulse monitoring</ItemDescription>
            </ItemContent>
            <ItemActions><div className="size-2 rounded-full bg-emerald-500 animate-pulse" /></ItemActions>
          </a>
        </Item>
      </ItemGroup>
    </div>
  ),
};

/**
 * Advanced implementation utilizing ItemHeader and ItemFooter for extra layout control.
 */
export const RichContent: Story = {
  render: () => (
    <div className="w-[500px]">
      <Item className="flex-col items-stretch gap-4 p-6 border-2 border-dashed rounded-[2rem]">
        <ItemHeader>
          <div className="flex items-center gap-3">
            <Globe className="text-primary size-5" />
            <ItemTitle className="text-lg">Orbital_Sync_Protocol</ItemTitle>
          </div>
          <Badge variant="outline">STABLE</Badge>
        </ItemHeader>
        
        <ItemContent>
          <ItemDescription className="text-base line-clamp-none">
            Detailed telemetry analysis for the US_EAST sector. Ingestion rates have stabilized after the buffer flush sequence.
          </ItemDescription>
        </ItemContent>

        <ItemFooter className="pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <Avatar key={i} className="size-6 border-2 border-background">
                  <AvatarFallback className="text-[8px]">U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-[10px] font-bold opacity-40 uppercase">3 Agents Active</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-2"><Copy size={12}/> Copy_Log_ID</Button>
        </ItemFooter>
      </Item>
    </div>
  ),
};
