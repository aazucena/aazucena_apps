import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based semantic navigation.
 * - **Accessibility:** Uses `aria-label="breadcrumb"` and `aria-current="page"` for standard-compliant screen reader support.
 * - **Design:** Optimized for path-heavy applications with support for ellipses and custom separators.
 * - **Variants:** Features `cyber` and `intel` presets for high-fidelity technical interfaces.
 */
const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  subcomponents: {
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A navigational helper showing the current page position within a site hierarchy.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard breadcrumb implementation for general site navigation.
 */
export const Basic: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * High-performance cyber variant with cyan tints and uppercase typography.
 */
export const Cyber: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList variant="cyber">
        <BreadcrumbItem>
          <BreadcrumbLink variant="cyber" href="/">
            ROOT
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator variant="cyber" />
        <BreadcrumbItem>
          <BreadcrumbEllipsis variant="cyber" />
        </BreadcrumbItem>
        <BreadcrumbSeparator variant="cyber" />
        <BreadcrumbItem>
          <BreadcrumbPage variant="cyber">TERMINAL_ACTIVE</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Technical intelligence variant with letter-spaced typography and minimal weights.
 */
export const Intel: Story = {
  render: () => (
    <div className="p-8 bg-muted/5 border border-dashed rounded-3xl">
      <Breadcrumb>
        <BreadcrumbList variant="intel">
          <BreadcrumbItem>
            <BreadcrumbLink variant="intel" href="/">
              System
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator variant="intel" />
          <BreadcrumbItem>
            <BreadcrumbLink variant="intel" href="/nodes">
              Nodes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator variant="intel" />
          <BreadcrumbItem>
            <BreadcrumbPage variant="intel">Telemetry_Unit_01</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};

/**
 * Transparent variant with backdrop blur, ideal for immersive backgrounds.
 */
export const Glass: Story = {
  render: () => (
    <div className="p-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem]">
      <Breadcrumb>
        <BreadcrumbList variant="glass">
          <BreadcrumbItem>
            <BreadcrumbLink variant="glass" href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator variant="glass" />
          <BreadcrumbItem>
            <BreadcrumbLink variant="glass" href="/docs">
              Docs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator variant="glass" />
          <BreadcrumbItem>
            <BreadcrumbPage variant="glass">Glass_View</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};

/**
 * Demonstrates the use of custom separators (e.g., slashes).
 */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span className="opacity-20">/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span className="opacity-20">/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>API_Reference</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
