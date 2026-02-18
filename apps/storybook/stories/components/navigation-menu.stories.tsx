import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import React from 'react';
import { Globe, Shield, Activity, Zap, Database, Terminal } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based complex navigation system for multi-layered application architecture.
 * - **UX:** Features sequential menu activation and smooth viewport transitions for nested content.
 * - **Accessibility:** Full keyboard focus management, ARIA roles for menus/submenus, and compliant link states.
 * - **Variants:** Supports high-fidelity `glass`, `cyber`, and specialized `intel` (mono) presets.
 */
const meta = {
  title: 'Components/Navigation/NavigationMenu',
  component: NavigationMenu,
  subcomponents: {
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuViewport,
    NavigationMenuIndicator,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A sophisticated navigation system for complex sites. Features drop-down content panels with support for multi-column grids and high-fidelity themes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- HELPERS ---

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-2xl p-4 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group/item",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3 mb-1">
            {icon && <div className="text-primary opacity-40 group-hover/item:opacity-100 transition-opacity">{icon}</div>}
            <div className="text-sm font-black tracking-tight uppercase">{title}</div>
          </div>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

// --- STORIES ---

/**
 * Standard implementation for documentation-heavy sites.
 */
export const Basic: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-bold">Architecture</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 no-underline outline-none focus:shadow-md border border-primary/10"
                    href="/"
                  >
                    <Activity className="size-10 text-primary mb-4" />
                    <div className="mb-2 text-xl font-black tracking-tighter uppercase">
                      aazucena/ui
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      High-fidelity React components optimized for decentralized intelligence terminals.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Introduction" icon={<Globe size={14}/>}>
                Standard-compliant design primitives.
              </ListItem>
              <ListItem href="#" title="Infrastructure" icon={<Database size={14}/>}>
                Multi-node telemetry ingestion layers.
              </ListItem>
              <ListItem href="#" title="Security" icon={<Shield size={14}/>}>
                RSA-4096 enclave authentication protocols.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle({ variant: 'default' })} href="#">
            Archive
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className="font-mono">
        <NavigationMenuItem>
          <NavigationMenuTrigger variant="intel" className="text-cyan-500 italic">
            // TERMINAL
          </NavigationMenuTrigger>
          <NavigationMenuContent variant="cyber">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-black border border-cyan-500/20 rounded-2xl shadow-2xl">
              <ListItem href="#" title="SCAN_GEO" icon={<Globe size={14}/>} className="hover:bg-cyan-500/10 hover:text-cyan-400">
                Execute geospatial signal trace.
              </ListItem>
              <ListItem href="#" title="SYNC_KERNEL" icon={<Zap size={14}/>} className="hover:bg-cyan-500/10 hover:text-cyan-400">
                Initialize node pulse calibration.
              </ListItem>
              <ListItem href="#" title="AUTH_LOGS" icon={<Shield size={14}/>} className="hover:bg-cyan-500/10 hover:text-cyan-400">
                Review enclave access patterns.
              </ListItem>
              <ListItem href="#" title="EXIT_SHELL" icon={<Terminal size={14}/>} className="hover:bg-rose-500/10 hover:text-rose-400">
                Terminate active session identifiers.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle({ variant: 'intel' })} href="#">
            // ARCHIVE
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Immersive glass variant, ideal for floating navigation over animated atmospheric layers.
 */
export const GlassAtmospheric: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-sm" />
      <NavigationMenu className="relative z-10">
        <NavigationMenuList className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-3xl shadow-2xl">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px]">
              Environment
            </NavigationMenuTrigger>
            <NavigationMenuContent variant="glass">
              <ul className="grid w-[400px] gap-3 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl text-white">
                <ListItem href="#" title="Atmosphere" className="hover:bg-white/10 text-white">
                  Troposphere to Exosphere phases.
                </ListItem>
                <ListItem href="#" title="Telemetry" className="hover:bg-white/10 text-white">
                  Real-time environmental metrics.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px]")} href="#">
              Status
              <div className="ml-2 size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};
