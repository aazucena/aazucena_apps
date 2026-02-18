import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LinkMenu,
  LinkMenuContent,
  LinkMenuDescription,
  LinkMenuExternal,
  LinkMenuHeader,
  LinkMenuIcon,
  LinkMenuItem,
  LinkMenuLabel,
  LinkMenuLink,
  LinkMenuList,
  LinkMenuTitle,
} from '@aazucena/ui';
import { Github, Linkedin, Twitter, Discord, Globe, Shield, Zap, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite navigation component for grouping external resources and social links.
 * - **UX:** Features hover-triggered link displacement and optional external-link indicators.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for high-impact card elevation.
 * - **Composition:** Fully modular parts (Header, List, Item, Link, Icon, Content) for flexible navigation blocks.
 */
const meta = {
  title: 'Components/Navigation/LinkMenu',
  component: LinkMenu,
  subcomponents: {
    LinkMenuHeader,
    LinkMenuTitle,
    LinkMenuList,
    LinkMenuItem,
    LinkMenuLink,
    LinkMenuIcon,
    LinkMenuContent,
    LinkMenuLabel,
    LinkMenuDescription,
    LinkMenuExternal,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A structured list of links with support for icons, descriptions, and visual variants. Ideal for social footers or resource sidebars.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card', 'glass', 'cyber'],
      description: 'The visual theme of the menu container',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof LinkMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for connecting external professional networks.
 */
export const Basic: Story = {
  args: {
    variant: 'card',
  },
  render: (args) => (
    <div className="w-[400px]">
      <LinkMenu {...args}>
        <LinkMenuHeader>
          <LinkMenuTitle>Connect_Channels</LinkMenuTitle>
        </LinkMenuHeader>
        <LinkMenuList>
          <LinkMenuItem>
            <LinkMenuLink href="#">
              <LinkMenuIcon><Github /></LinkMenuIcon>
              <LinkMenuContent>
                <LinkMenuLabel>GitHub_Repository</LinkMenuLabel>
                <LinkMenuDescription>View the full source code and technical documentation.</LinkMenuDescription>
              </LinkMenuContent>
              <LinkMenuExternal />
            </LinkMenuLink>
          </LinkMenuItem>
          <LinkMenuItem>
            <LinkMenuLink href="#">
              <LinkMenuIcon><Linkedin /></LinkMenuIcon>
              <LinkMenuContent>
                <LinkMenuLabel>LinkedIn_Intel</LinkMenuLabel>
                <LinkMenuDescription>Professional network and engineering updates.</LinkMenuDescription>
              </LinkMenuContent>
              <LinkMenuExternal />
            </LinkMenuLink>
          </LinkMenuItem>
        </LinkMenuList>
      </LinkMenu>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[400px]">
      <LinkMenu {...args}>
        <LinkMenuHeader className="border-cyan-500/10">
          <div className="flex items-center gap-3 text-cyan-500">
            <Activity className="size-4 animate-pulse" />
            <LinkMenuTitle className="font-mono italic uppercase tracking-tighter">// NODE_DIRECTORIES</LinkMenuTitle>
          </div>
        </LinkMenuHeader>
        <LinkMenuList>
          <LinkMenuItem>
            <LinkMenuLink variant="cyber" href="#">
              <LinkMenuIcon variant="cyber"><Zap /></LinkMenuIcon>
              <LinkMenuContent>
                <LinkMenuLabel className="font-mono">SIGNAL_STREAM</LinkMenuLabel>
                <LinkMenuDescription className="font-mono text-[10px] opacity-40 uppercase">Real-time telemetry</LinkMenuDescription>
              </LinkMenuContent>
            </LinkMenuLink>
          </LinkMenuItem>
          <LinkMenuItem>
            <LinkMenuLink variant="cyber" href="#">
              <LinkMenuIcon variant="cyber"><Shield /></LinkMenuIcon>
              <LinkMenuContent>
                <LinkMenuLabel className="font-mono">SECURITY_LOGS</LinkMenuLabel>
                <LinkMenuDescription className="font-mono text-[10px] opacity-40 uppercase">Enclave_Access_Archive</LinkMenuDescription>
              </LinkMenuContent>
            </LinkMenuLink>
          </LinkMenuItem>
        </LinkMenuList>
      </LinkMenu>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="w-[350px] relative z-10">
        <LinkMenu {...args} className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          <LinkMenuHeader className="border-white/10">
            <LinkMenuTitle className="text-white">Resource_Map</LinkMenuTitle>
          </LinkMenuHeader>
          <LinkMenuList>
            <LinkMenuItem>
              <LinkMenuLink variant="glass" href="#" className="text-white">
                <LinkMenuIcon variant="glass" className="bg-white/10 border-white/20"><Globe /></LinkMenuIcon>
                <LinkMenuContent>
                  <LinkMenuLabel>Global_Nodes</LinkMenuLabel>
                  <LinkMenuDescription className="text-white/40">Visualized edge network</LinkMenuDescription>
                </LinkMenuContent>
              </LinkMenuLink>
            </LinkMenuItem>
          </LinkMenuList>
        </LinkMenu>
      </div>
    </div>
  ),
};
