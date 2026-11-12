import { Activity, Globe, Search } from '@aazucena/icons';
import {
  Button,
  Logo,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContainer,
  NavbarContent,
  NavbarMobile,
  NavbarMobileTrigger,
} from '@aazucena/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for global site navigation.
 * - **UX:** Features `isScrolled` state handling for dynamic padding, background, and shadow transitions.
 * - **Mobile:** Integrated mobile drawer system with spring-based animations.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity ``.
 * - **Composition:** Fully modular parts (Container, Brand, Content, Actions, Mobile) for flexible navigation assembly.
 */
const meta = {
  title: 'Components/Layout/Navbar',
  component: Navbar,
  subcomponents: {
    NavbarContainer,
    NavbarBrand,
    NavbarContent,
    NavbarActions,
    NavbarMobile,
    NavbarMobileTrigger,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The primary site navigation bar. Supports dynamic transparency on scroll, high-fidelity technical themes, and a complete mobile drawer system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the navbar',
      table: { category: 'Appearance' },
    },
    isScrolled: {
      control: 'boolean',
      description: 'Simulates the page scrolled state',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing the scrolled state with navigation links.
 */
export const Scrolled: Story = {
  args: {
    variant: 'default',
    isScrolled: true,
  },
  render: (args) => (
    <div className="h-[300px] bg-muted/10 relative overflow-hidden">
      <Navbar {...args}>
        <NavbarContainer>
          <NavbarBrand href="/">
            <Logo size="sm" />
            <span className="font-black tracking-tighter uppercase text-xl">Aazucena</span>
          </NavbarBrand>
          <NavbarContent>
            <Button variant="ghost" size="sm" className="rounded-control px-6">
              Projects
            </Button>
            <Button variant="ghost" size="sm" className="rounded-control px-6">
              Journey
            </Button>
            <Button variant="ghost" size="sm" className="rounded-control px-6">
              Intel
            </Button>
          </NavbarContent>
          <NavbarActions>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search size={18} />
            </Button>
            <Button size="sm" className="rounded-control px-8">
              Contact
            </Button>
          </NavbarActions>
        </NavbarContainer>
      </Navbar>
      <div className="flex items-center justify-center h-full pt-20">
        <p className="text-xs opacity-20 uppercase tracking-widest">Main_Page_Content_Area</p>
      </div>
    </div>
  ),
};

/**
 * Initial transparent state, usually seen at the top of a hero section.
 */
export const TransparentTop: Story = {
  args: {
    variant: 'default',
    isScrolled: false,
  },
  render: (args) => (
    <div className="h-[400px] bg-background relative overflow-hidden flex flex-col">
      <Navbar {...args} className="text-foreground">
        <NavbarContainer>
          <NavbarBrand href="/">
            <Logo variant="white" size="sm" />
            <span className="font-black tracking-tighter uppercase text-xl">Aazucena</span>
          </NavbarBrand>
          <NavbarContent className="bg-state border-rule">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-state px-6">
              Archive
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-state px-6">
              Terminal
            </Button>
          </NavbarContent>
          <NavbarActions>
            <Button
              variant="glass"
              size="sm"
              className="bg-state border-rule text-foreground rounded-control px-8"
            >
              UPLINK
            </Button>
          </NavbarActions>
        </NavbarContainer>
      </Navbar>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-foreground text-4xl font-black tracking-tighter opacity-20">
          HERO_BACKGROUND
        </h1>
      </div>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical status indicators.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    isScrolled: true,
  },
  render: (args) => (
    <div className="h-[300px] bg-background relative overflow-hidden">
      <Navbar {...args}>
        <NavbarContainer>
          <NavbarBrand href="/" className="gap-4">
            <Logo variant="cyber" size="sm" />
            <div className="flex flex-col leading-none">
              <span className="font-mono text-signal font-black italic tracking-tighter uppercase text-lg">
                AAZUCENA_LYTICS
              </span>
              <span className="text-[8px] font-mono text-signal/40 uppercase tracking-widest">
                v1.4.2 // Node_Active
              </span>
            </div>
          </NavbarBrand>
          <NavbarContent variant="cyber">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] text-signal hover:text-signal italic px-4"
            >
              {'>'} SCAN_GEO
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] text-signal hover:text-signal italic px-4"
            >
              {'>'} TRACE_SIGNAL
            </Button>
          </NavbarContent>
          <NavbarActions>
            <div className="hidden lg:flex items-center gap-2 mr-4 border-r border-rule pr-6">
              <Activity size={14} className="text-signal animate-pulse" />
              <span className="text-[10px] font-mono text-signal/60 uppercase">Pulse: 12ms</span>
            </div>
            <Button variant="cyber" size="sm" className="px-8 h-10 rounded-control">
              LOGIN_ENCLAVE
            </Button>
          </NavbarActions>
        </NavbarContainer>
      </Navbar>
    </div>
  ),
};

/**
 * Demonstrates the mobile drawer system functionality.
 */
export const MobileDrawer: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="h-[600px] bg-muted/10 relative overflow-hidden">
        <Navbar isScrolled={true}>
          <NavbarContainer>
            <NavbarBrand href="/">
              <Logo size="sm" />
              <span className="font-bold">Aazucena</span>
            </NavbarBrand>
            <NavbarActions>
              <NavbarMobileTrigger onClick={() => setIsOpen(true)} />
            </NavbarActions>
          </NavbarContainer>
        </Navbar>

        <NavbarMobile isOpen={isOpen} onClose={() => setIsOpen(false)} variant="default">
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="justify-start text-xl font-black tracking-tighter uppercase h-12"
              >
                Projects
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-xl font-black tracking-tighter uppercase h-12"
              >
                Journey
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-xl font-black tracking-tighter uppercase h-12"
              >
                Blog
              </Button>
            </div>
            <div className="pt-8 border-t space-y-6">
              <div className="flex items-center gap-3 px-4">
                <Globe className="size-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">Select Node</span>
              </div>
              <Button className="w-full h-14 rounded-full font-black uppercase tracking-widest">
                Connect_Uplink
              </Button>
            </div>
          </div>
        </NavbarMobile>
      </div>
    );
  },
};
