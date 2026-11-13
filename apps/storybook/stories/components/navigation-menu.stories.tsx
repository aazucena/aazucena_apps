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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=22-37',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'A sophisticated navigation system for complex sites. Features drop-down content panels with support for multi-column grids and high-fidelity themes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- HELPERS ---

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string; icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-card p-4 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group/item',
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-3 mb-1">
            {icon && (
              <div className="text-primary opacity-40 group-hover/item:opacity-100 transition-opacity">
                {icon}
              </div>
            )}
            <div className="text-sm font-black tracking-tight uppercase">{title}</div>
          </div>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

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
                    className="flex h-full w-full select-none flex-col justify-end rounded-card p-8 no-underline outline-none border border-primary/10"
                    href="/"
                  >
                    <Activity className="size-10 text-primary mb-4" />
                    <div className="mb-2 text-xl font-black tracking-tighter uppercase">
                      aazucena/ui
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      High-fidelity React components optimized for decentralized intelligence
                      terminals.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Introduction" icon={<Globe size={14} />}>
                Standard-compliant design primitives.
              </ListItem>
              <ListItem href="#" title="Infrastructure" icon={<Database size={14} />}>
                Multi-node telemetry ingestion layers.
              </ListItem>
              <ListItem href="#" title="Security" icon={<Shield size={14} />}>
                RSA-4096 enclave authentication protocols.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle({ variant: 'default' })}
            href="#"
          >
            Archive
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Cyber variant: signal rule and Fira Code labels.
 */
export const CyberTerminal: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className="font-mono">
        <NavigationMenuItem>
          <NavigationMenuTrigger variant="intel" className="text-signal italic">
            // TERMINAL
          </NavigationMenuTrigger>
          <NavigationMenuContent variant="cyber">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background border border-signal/20 rounded-card">
              <ListItem
                href="#"
                title="SCAN_GEO"
                icon={<Globe size={14} />}
                className="hover:bg-signal/10 hover:text-signal"
              >
                Execute geospatial signal trace.
              </ListItem>
              <ListItem
                href="#"
                title="SYNC_KERNEL"
                icon={<Zap size={14} />}
                className="hover:bg-signal/10 hover:text-signal"
              >
                Initialize node pulse calibration.
              </ListItem>
              <ListItem
                href="#"
                title="AUTH_LOGS"
                icon={<Shield size={14} />}
                className="hover:bg-signal/10 hover:text-signal"
              >
                Review enclave access patterns.
              </ListItem>
              <ListItem
                href="#"
                title="EXIT_SHELL"
                icon={<Terminal size={14} />}
                className="hover:bg-alert/10 hover:text-alert"
              >
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
    <div className="p-40 rounded-card relative overflow-hidden flex items-center justify-center">
      <NavigationMenu className="relative z-10">
        <NavigationMenuList className="bg-state border border-rule rounded-control px-4 py-1.5">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-state text-foreground font-black uppercase tracking-widest text-[10px]">
              Environment
            </NavigationMenuTrigger>
            <NavigationMenuContent variant="glass">
              <ul className="grid w-[400px] gap-3 p-6 bg-state border border-rule rounded-card text-foreground">
                <ListItem href="#" title="Atmosphere" className="hover:bg-state text-foreground">
                  Troposphere to Exosphere phases.
                </ListItem>
                <ListItem href="#" title="Telemetry" className="hover:bg-state text-foreground">
                  Real-time environmental metrics.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'bg-transparent hover:bg-state text-foreground font-black uppercase tracking-widest text-[10px]',
              )}
              href="#"
            >
              Status
              <div className="ml-2 size-1.5 rounded-full bg-success animate-pulse" />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};
