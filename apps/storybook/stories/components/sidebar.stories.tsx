import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarInset,
  SidebarBlock,
  SidebarBlockHeader,
  SidebarBlockTitle,
  SidebarBlockContent,
  SidebarBlockItem,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@aazucena/ui';
import {
  Activity,
  Layout,
  User,
  CogFour as Cog,
  Database,
  Shield,
  Globe,
  PlusCircle as Plus,
  Sparkles,
  Search,
  Zap,
  Terminal,
  MoveHorizontal,
} from '@aazucena/icons';
import { Badge, Button, Avatar, AvatarImage, AvatarFallback } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout system for high-complexity application navigation.
 * - **UX:** Features collapsible states (`offcanvas`, `icon`), mobile-responsive drawers, and persistence.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `backdrop-blur`.
 * - **Composition:** Extremely modular parts (Menu, Group, Block, Action, Badge) for technical dashboard assembly.
 */
const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  subcomponents: {
    SidebarProvider,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarBlock,
    SidebarTrigger,
    SidebarInset,
  } as any,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex h-[600px] w-full overflow-hidden bg-background border rounded-[3rem] m-10 shadow-2xl">
          <Story />
          <SidebarInset className="flex flex-col flex-1">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Stage_Environment // Unit_0x7F42
              </span>
            </header>
            <main className="flex-1 p-8 overflow-auto">
              <div className="space-y-8">
                <div className="h-32 rounded-2xl bg-muted/5 border-2 border-dashed flex items-center justify-center italic text-xs opacity-20 uppercase tracking-[0.4em]">
                  Viewport_Content_Area
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-3xl bg-muted/10 border border-border/50 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a multi-group navigation sidebar.
 */
export const BasicDashboard: Story = {
  render: () => (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 px-2">
          <MoveHorizontal size="sm" />
          <div className="flex flex-col leading-none">
            <span className="font-black tracking-tighter uppercase text-sm">Aazucena</span>
            <span className="text-[9px] opacity-40 uppercase font-bold tracking-widest">
              Intelligence_Unit
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core_Engineering</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Real-time Node Dashboard">
                  <Layout />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Global Ingestion Stats">
                  <Globe />
                  <span>Telemetry</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>14.2K</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Database Clusters">
                  <Database />
                  <span>Clusters</span>
                </SidebarMenuButton>
                <SidebarMenuAction>
                  <Plus />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Security_Enclave</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Shield />
                  <span>Firewall_Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User />
                  <span>Identity_Store</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 mt-auto border-t">
        <div className="flex items-center gap-4 px-2 mb-6">
          <Avatar className="size-8">
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold">Aldrin_A</span>
            <span className="text-[9px] opacity-40">Admin_L1</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Cog />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  ),
};

/**
 * High-performance cyber variant featuring data blocks and technical status.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <Sidebar {...args}>
      <SidebarHeader className="p-6 border-b border-cyan-500/10 bg-cyan-500/5">
        <div className="flex items-center gap-3 text-cyan-500">
          <Terminal size={18} />
          <span className="font-mono text-xs italic font-black uppercase tracking-tighter">
            // SYSTEM_SHELL_V4
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 space-y-8">
        <SidebarBlock variant="cyber">
          <SidebarBlockHeader>
            <SidebarBlockTitle className="text-cyan-500/60 uppercase text-[9px] font-mono tracking-[0.2em]">
              # NODE_PULSE
            </SidebarBlockTitle>
          </SidebarBlockHeader>
          <SidebarBlockContent className="space-y-3">
            <SidebarBlockItem className="bg-cyan-500/5 border-cyan-500/10">
              <Activity className="size-4 text-cyan-400 animate-pulse" />
              <div className="flex flex-col font-mono">
                <span className="text-[10px] font-bold text-white">UPLINK_US_EAST</span>
                <span className="text-[8px] text-emerald-500">STABLE // 12ms</span>
              </div>
            </SidebarBlockItem>
            <SidebarBlockItem className="bg-rose-500/5 border-rose-500/10">
              <Zap className="size-4 text-rose-500" />
              <div className="flex flex-col font-mono">
                <span className="text-[10px] font-bold text-rose-400">BUFFER_OVERFLOW</span>
                <span className="text-[8px] opacity-40 text-rose-500">CRITICAL // 0x7F</span>
              </div>
            </SidebarBlockItem>
          </SidebarBlockContent>
        </SidebarBlock>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] text-cyan-500/40 uppercase">
            # CONTROL_PLANE
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="font-mono text-xs text-cyan-500/80 italic hover:text-cyan-400">
                {'>'} TRACE_SIGNAL
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="font-mono text-xs text-cyan-500/80 italic hover:text-cyan-400">
                {'>'} FLUSH_KERNEL
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-cyan-500/10">
        <Badge variant="cyber" animated className="w-full justify-center">
          SECURE_ENCLAVE_ACTIVE
        </Badge>
      </SidebarFooter>
    </Sidebar>
  ),
};

/**
 * Immersive glass variant, ideal for sidebars over complex atmospheric layers.
 */
export const GlassMonitor: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <Sidebar {...args} className="bg-transparent border-white/10">
      <SidebarHeader className="p-8">
        <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">
          Environment_Intel
        </span>
      </SidebarHeader>
      <SidebarContent className="p-4 space-y-12">
        <div className="space-y-4 px-4">
          <div className="flex items-center justify-between text-white/40 font-bold uppercase text-[9px] tracking-widest">
            <span>Atmosphere</span>
            <span>98%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[98%] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </div>

        <SidebarMenu className="px-2">
          {['Troposphere', 'Mesosphere', 'Exosphere'].map((layer) => (
            <SidebarMenuItem key={layer}>
              <SidebarMenuButton className="text-white hover:bg-white/10 h-12 rounded-xl px-4 gap-4 transition-all">
                <Globe className="size-4 opacity-40" />
                <span className="font-bold tracking-tight">{layer}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-8 border-t border-white/10">
        <div className="flex items-center gap-3 text-white/60">
          <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono uppercase">Status: Nominal</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  ),
};
