import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  TechStack,
  TechStackGroup,
  TechStackIcon,
  TechStackItem,
  TechStackLabel,
} from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic metadata primitive for representing technical toolkits and stacks.
 * - **UX:** Features hover-triggered scale and grayscale-removal for interactive feedback.
 * - **Aesthetics:** Aligned with site-wide themes (`default`, `cyber`, `bright`) with support for high-fidelity technical color tokens.
 * - **Architecture:** Leverages `IconRenderer` for polymorphic SVG/Image support; includes built-in fallbacks for common technologies.
 * - **Composition:** Fully modular parts (Group, Item, Icon, Label) for flexible stack assembly.
 */
const meta = {
  title: 'Components/Data/TechStack',
  component: TechStack,
  subcomponents: {
    TechStackGroup,
    TechStackItem,
    TechStackIcon,
    TechStackLabel,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A visual representation of a technology stack. Automatically handles icons, labels, and grayscale-hover effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bright', 'cyber'],
      description: 'The overall theme of the stack',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof TechStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a muted grayscale stack that colors on hover.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <TechStack {...args}>
      <TechStackGroup>
        <TechStackItem>
          <TechStackIcon name="Astro" />
          <TechStackLabel>Astro</TechStackLabel>
        </TechStackItem>
        <TechStackItem>
          <TechStackIcon name="React" />
          <TechStackLabel>React</TechStackLabel>
        </TechStackItem>
        <TechStackItem>
          <TechStackIcon name="Tailwind" />
          <TechStackLabel>Tailwind</TechStackLabel>
        </TechStackItem>
        <TechStackItem>
          <TechStackIcon name="Vite" />
          <TechStackLabel>Vite</TechStackLabel>
        </TechStackItem>
      </TechStackGroup>
    </TechStack>
  ),
};

/**
 * High-performance cyber variant with neon glow and mono-typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="p-12 bg-background rounded-card border border-signal/10">
      <div className="flex flex-col items-center gap-8">
        <span className="text-[10px] font-mono text-signal/40 uppercase tracking-[0.4em]">
          # CORE_SYSTEM_STACK
        </span>
        <TechStack {...args}>
          <TechStackGroup>
            <TechStackItem variant="cyber">
              <TechStackIcon name="React" className="text-signal" />
              <TechStackLabel className="font-mono italic">UI_ENGINE</TechStackLabel>
            </TechStackItem>
            <TechStackItem variant="cyber">
              <TechStackIcon name="Tailwind" className="text-signal" />
              <TechStackLabel className="font-mono italic">CSS_ENCLAVE</TechStackLabel>
            </TechStackItem>
            <TechStackItem variant="cyber">
              <TechStackIcon name="Vite" className="text-signal" />
              <TechStackLabel className="font-mono italic">SYNC_BOOT</TechStackLabel>
            </TechStackItem>
          </TechStackGroup>
        </TechStack>
      </div>
    </div>
  ),
};

/**
 * High-visibility variant where icons are always colored.
 */
export const HighVisibility: Story = {
  args: {
    variant: 'bright',
  },
  render: (args) => (
    <div className="p-8 border rounded-card bg-muted/5">
      <TechStack {...args}>
        <TechStackGroup>
          <TechStackItem variant="color">
            <TechStackIcon name="Astro" />
            <TechStackLabel className="text-warning">Astro_V5</TechStackLabel>
          </TechStackItem>
          <TechStackItem variant="color">
            <TechStackIcon name="React" />
            <TechStackLabel className="text-signal">React_19</TechStackLabel>
          </TechStackItem>
          <TechStackItem variant="color">
            <TechStackIcon name="Tailwind" />
            <TechStackLabel className="text-signal">Tailwind_4</TechStackLabel>
          </TechStackItem>
        </TechStackGroup>
      </TechStack>
    </div>
  ),
};

/**
 * Large format grid implementation for a "Skills" section.
 */
export const SkillsGrid: Story = {
  render: () => (
    <div className="w-[600px] p-12 border rounded-card bg-card">
      <h3 className="text-xl font-black tracking-tighter uppercase mb-8">Expertise_Nodes</h3>
      <TechStackGroup className="gap-8">
        {[
          { name: 'TypeScript', color: 'text-signal' },
          { name: 'Node.js', color: 'text-success' },
          { name: 'PostgreSQL', color: 'text-series-3' },
          { name: 'Next.js', color: 'text-foreground' },
          { name: 'Docker', color: 'text-signal' },
          { name: 'AWS', color: 'text-warning' },
        ].map((item) => (
          <TechStackItem key={item.name} className="flex-col items-center gap-3">
            <div
              className={cn(
                'p-4 rounded-card bg-muted/50 border flex items-center justify-center size-16 hover:scale-110 transition-transform group',
                item.color,
              )}
            >
              <span className="font-black text-xl">{item.name.charAt(0)}</span>
            </div>
            <TechStackLabel className="opacity-40">{item.name}</TechStackLabel>
          </TechStackItem>
        ))}
      </TechStackGroup>
    </div>
  ),
};

// Helper for stories
const cn = (...args: any[]) => args.filter(Boolean).join(' ');
