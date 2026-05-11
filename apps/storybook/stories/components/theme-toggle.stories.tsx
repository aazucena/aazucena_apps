import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from '@aazucena/ui';
import { ThemeProvider } from 'next-themes';

/**
 * ## Engineering Standards
 * - **Pattern:** Interactive utility primitive for global theme orchestration (Dark/Light).
 * - **UX:** Features smooth `rotate` and `scale` icon transitions with tactile `active:scale-95` feedback.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`, `ghost`) with support for high-fidelity `backdrop-blur`.
 * - **Architecture:** Consumes `@aazucena/hooks` `useTheme` for centralized state management.
 * - **Accessibility:** Built with standard Button semantics and `aria-label="Toggle theme"`.
 */
const meta = {
  title: 'Components/Primitives/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A persistent toggle component for switching between light and dark visual themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'ghost'],
      description: 'The visual style of the toggle button',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['sm', 'default', 'lg'],
      description: 'Physical dimensions',
      table: { category: 'Appearance' },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for general site-wide theme switching.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'default',
  },
};

/**
 * High-performance cyber variant with neon borders and mono-alignment.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="p-12 bg-black rounded-[3rem] border border-cyan-500/10 flex flex-col items-center gap-6">
      <span className="text-[10px] font-mono text-cyan-500 opacity-40 uppercase tracking-[0.4em]">
        Atmosphere_Shift
      </span>
      <ThemeToggle {...args} />
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for top-level toolbars or floating overlays.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    size: 'lg',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem] shadow-2xl">
      <ThemeToggle {...args} />
    </div>
  ),
};

/**
 * Minimalist ghost version for placement within dense navigation bars.
 */
export const GhostNavigation: Story = {
  args: {
    variant: 'ghost',
    size: 'sm',
  },
  render: (args) => (
    <div className="flex items-center gap-6 px-6 py-2 border rounded-full bg-card shadow-sm">
      <span className="text-xs font-black uppercase tracking-widest opacity-40">System_Mode</span>
      <ThemeToggle {...args} />
    </div>
  ),
};

/**
 * Comparison of the available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center space-y-2">
        <ThemeToggle size="sm" variant="default" />
        <p className="text-[10px] font-mono opacity-40">SM</p>
      </div>
      <div className="text-center space-y-2">
        <ThemeToggle size="default" variant="default" />
        <p className="text-[10px] font-mono opacity-40">DEFAULT</p>
      </div>
      <div className="text-center space-y-2">
        <ThemeToggle size="lg" variant="default" />
        <p className="text-[10px] font-mono opacity-40">LG</p>
      </div>
    </div>
  ),
};
