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
} from '@aazucena/ui/components/ui/link-menu.js';
import { TableOfContents } from '@aazucena/ui/components/ui/table-of-contents.js';
import { DetailNavigation } from '@aazucena/ui/components/ui/detail-navigation.js';
import { ArrowLink } from '@aazucena/ui/components/ui/arrow-link.js';
import { GitHub as Github, Twitter } from '@aazucena/icons';

/**
 * ## Accessibility (A11y)
 * - **Semantic Links:** Uses proper anchor tags for navigation.
 * - **Visual Focus:** All interactive items have clear focus rings and hover states.
 * - **ARIA Labels:** External links and icons include descriptive labels where applicable.
 *
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `AAZUCENA_v1`
 */
const meta = {
  title: 'Components/Navigation/Specialized',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'High-level navigation patterns for deep links, table of contents, and directional item-to-item movement.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
} satisfies Meta;

export default meta;

type Story = StoryObj;

/**
 * A rich set of links organized into a visual menu, ideal for sidebars or resource sections.
 */
export const LinkMenuGallery: Story = {
  render: () => (
    <div className="p-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
      <LinkMenu variant="card">
        <LinkMenuHeader>
          <LinkMenuTitle>Project_Resources</LinkMenuTitle>
        </LinkMenuHeader>
        <LinkMenuList>
          <LinkMenuItem>
            <LinkMenuLink href="#">
              <LinkMenuIcon>
                <Github />
              </LinkMenuIcon>
              <LinkMenuContent>
                <LinkMenuLabel>GitHub Repository</LinkMenuLabel>
                <LinkMenuDescription>
                  View the full source code and technical documentation.
                </LinkMenuDescription>
              </LinkMenuContent>
              <LinkMenuExternal />
            </LinkMenuLink>
          </LinkMenuItem>
        </LinkMenuList>
      </LinkMenu>

      <LinkMenu variant="cyber">
        <LinkMenuHeader>
          <LinkMenuTitle variant="cyber">// EXTERNAL_NODES</LinkMenuTitle>
        </LinkMenuHeader>
        <LinkMenuList>
          <LinkMenuItem>
            <LinkMenuLink variant="cyber" href="#">
              <LinkMenuIcon variant="cyber">
                <Twitter />
              </LinkMenuIcon>
              <LinkMenuContent>
                <LinkMenuLabel className="font-mono text-cyan-400">SIGNAL_STREAM</LinkMenuLabel>
                <LinkMenuDescription className="font-mono italic text-[10px]">
                  Real-time telemetry broadcasts.
                </LinkMenuDescription>
              </LinkMenuContent>
            </LinkMenuLink>
          </LinkMenuItem>
        </LinkMenuList>
      </LinkMenu>
    </div>
  ),
};

/**
 * Directional navigation for moving between adjacent items in a collection (e.g., projects, blog posts).
 */
export const DetailNavGallery: Story = {
  render: () => (
    <div className="p-20 space-y-20 max-w-6xl mx-auto">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">
          Standard_Pattern
        </h4>
        <DetailNavigation
          basePath="/projects"
          prevItem={{ slug: 'tracing', title: 'Distributed Tracing' }}
          nextItem={{ slug: 'adaptive', title: 'Adaptive Shell' }}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-mono italic uppercase tracking-widest text-cyan-500/60">
          // CYBER_STREAM
        </h4>
        <DetailNavigation
          variant="cyber"
          basePath="/nodes"
          prevItem={{ slug: 'node-01', title: 'PRIMARY_UPLINK' }}
          nextItem={{ slug: 'node-03', title: 'SECONDARY_BUFFER' }}
        />
      </div>
    </div>
  ),
};

/**
 * Minimalist links with animated indicators for subtle navigation actions.
 */
export const ArrowLinkGallery: Story = {
  render: () => (
    <div className="p-20 space-y-12 flex flex-col items-start max-w-6xl mx-auto">
      <div className="flex gap-12 items-center">
        <ArrowLink href="#">View Full Archive</ArrowLink>
        <ArrowLink variant="cyber" href="#">
          ESTABLISH_UPLINK
        </ArrowLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <ArrowLink variant="card" href="#">
          <h3 className="text-2xl font-black mb-2">EXPLORE_PROJS</h3>
          <p className="opacity-60 text-sm">View full portfolio</p>
        </ArrowLink>
        <ArrowLink variant="card-cyber" href="#">
          <h3 className="text-2xl font-mono italic mb-2">// READ_BLOG</h3>
          <p className="font-mono text-[10px] text-cyan-500/60">NODE_TELEMETRY</p>
        </ArrowLink>
      </div>
    </div>
  ),
};

/**
 * Scroll-synchronized table of contents for long-form documentation.
 */
export const TableOfContentsExample: Story = {
  render: () => (
    <div className="p-20 flex gap-20 max-w-6xl mx-auto">
      <div className="w-64 shrink-0">
        <TableOfContents
          items={[
            { id: '1', title: 'System Architecture', level: 0 },
            { id: '1.1', title: 'Kernel Core', level: 1 },
            { id: '1.2', title: 'Memory Buffer', level: 1 },
            { id: '2', title: 'Interface Fidelity', level: 0 },
            { id: '3', title: 'Deployment Protocol', level: 0 },
          ]}
        />
      </div>
      <div className="prose dark:prose-invert">
        <p className="opacity-40 italic">Scroll context would be active here...</p>
      </div>
    </div>
  ),
};
