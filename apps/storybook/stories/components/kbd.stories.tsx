import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, KbdGroup } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Semantic primitive for keyboard shortcuts and hardware key representations.
 * - **Accessibility:** Built with the standard `<kbd>` HTML element for proper screen reader recognition.
 * - **UX:** Features `pointer-events-none` and `select-none` to prevent interference with interactive parent components.
 * - **Design:** Optimized for high-density UI contexts (Tooltips, Menus, Command Palettes).
 */
const meta = {
  title: 'Components/Primitives/Kbd',
  component: Kbd,
  subcomponents: { KbdGroup } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component used to display keyboard shortcuts and command triggers.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for a single key or short combo.
 */
export const Basic: Story = {
  args: {
    children: "⌘K",
  },
};

/**
 * Demonstrates the grouping pattern for multi-step or multi-key shortcuts.
 */
export const ShortcutCombo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-black uppercase tracking-widest opacity-40">Open_Command_Palette</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-xs font-black uppercase tracking-widest opacity-40">Hard_Refresh</span>
        <KbdGroup>
          <Kbd>⇧</Kbd>
          <Kbd>⌘</Kbd>
          <Kbd>R</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};

/**
 * Showcases the specific styling when nested within technical context like tooltips.
 */
export const TechnicalContext: Story = {
  render: () => (
    <div className="p-8 border-2 border-dashed rounded-2xl bg-muted/5 flex flex-col items-center gap-4">
      <div className="bg-zinc-950 text-white p-4 rounded-xl border border-white/10 shadow-2xl flex items-center gap-4">
        <span className="text-[10px] font-mono uppercase tracking-tighter opacity-60">Terminal_Toggle</span>
        <Kbd className="bg-white/10 text-white border-white/20 h-6 px-2 min-w-6 rounded-md">F12</Kbd>
      </div>
      <p className="text-[9px] font-mono opacity-40 italic">// AUTO_LINKING_DETECTED</p>
    </div>
  ),
};
