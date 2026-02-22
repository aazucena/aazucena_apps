import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconRenderer } from '@aazucena/ui';
import { Activity, Database, Globe, Shield, Zap, Github, Terminal } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Universal icon bridge for rendering components, string identifiers, or raw SVG markup.
 * - **Integration:** Leverages `getIconComponent` utility to dynamicially resolve icons from the `@aazucena/icons` library.
 * - **UX:** Features smooth `react-inlinesvg` rendering for raw strings with proper error handling and fallback states.
 * - **Optimization:** Memoized component to prevent unnecessary re-renders in high-density data views.
 */
const meta = {
  title: 'Components/Primitives/IconRenderer',
  component: IconRenderer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A polymorphic renderer that unifies the display of various icon formats. Essential for components driven by CMS data or dynamic string IDs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Accepts an IconComponent, a string ID (e.g. "Activity"), or a raw <svg> string',
      table: { category: 'Content' },
    },
    size: {
      control: 'text',
      description: 'Dimensions in pixels or CSS units',
      table: { category: 'Appearance' },
    },
    stroke: {
      control: 'text',
      description: 'Overrides the stroke width or color',
      table: { category: 'Appearance' },
    },
    fallback: {
      control: false,
      description: 'React node to show if rendering fails',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof IconRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation using a direct component import.
 */
export const Basic: Story = {
  args: {
    icon: Activity,
    size: 48,
    className: 'text-primary',
  },
};

/**
 * Resolves a component from the internal library using a string identifier.
 */
export const StringIdentifier: Story = {
  args: {
    icon: 'Shield',
    size: 48,
    className: 'text-emerald-500',
  },
};

/**
 * Renders raw SVG markup as an inline element.
 */
export const RawSVG: Story = {
  args: {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>',
    size: 48,
    className: 'text-amber-500',
  },
};

/**
 * Demonstrates the scale and styling versatility.
 */
export const TechnicalIcons: Story = {
  args: {
    icon: Activity,
  },
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 p-8 border rounded-[2rem] bg-muted/5">
      <div className="flex flex-col items-center gap-4 group">
        <IconRenderer
          icon={Zap}
          size={40}
          className="text-yellow-500 transition-transform group-hover:scale-125"
        />
        <span className="text-[10px] font-black uppercase opacity-40">ENERGY_SIGNAL</span>
      </div>
      <div className="flex flex-col items-center gap-4 group">
        <IconRenderer
          icon="Terminal"
          size={40}
          className="text-cyan-500 transition-transform group-hover:scale-125"
        />
        <span className="text-[10px] font-black uppercase opacity-40">SYSTEM_SHELL</span>
      </div>
      <div className="flex flex-col items-center gap-4 group">
        <IconRenderer
          icon={Database}
          size={40}
          className="text-blue-500 transition-transform group-hover:scale-125"
        />
        <span className="text-[10px] font-black uppercase opacity-40">DATA_CLUSTER</span>
      </div>
      <div className="flex flex-col items-center gap-4 group">
        <IconRenderer
          icon={Github}
          size={40}
          className="text-zinc-400 transition-transform group-hover:scale-125"
        />
        <span className="text-[10px] font-black uppercase opacity-40">SOURCE_CORE</span>
      </div>
    </div>
  ),
};

/**
 * Shows what happens when an invalid icon is provided.
 */
export const ErrorFallback: Story = {
  args: {
    icon: 'NonExistentIcon',
    fallback: (
      <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-lg text-rose-500 text-[10px] font-mono">
        RENDER_FAILED // INVALID_ID
      </div>
    ),
  },
};
