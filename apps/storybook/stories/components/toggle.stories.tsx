import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@aazucena/ui';
import {
  Shield,
  Zap,
  Activity,
  Globe,
  Pin,
  TypeBold as Bold,
  TypeItalic as Italic,
} from '@aazucena/icons';
import { within, userEvent, expect } from 'storybook/test';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for two-state button interactions.
 * - **Accessibility:** Built with standard `aria-pressed` attribute; automatically manages state transitions for screen readers.
 * - **UX:** Features `active:scale-95` tactile feedback and consistent hover states across variants.
 * - **Design:** Optimized for technical toolbars, property toggles, and state-aware utility actions.
 */
const meta = {
  title: 'Components/Actions/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A two-state button that can be either on or off.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style of the toggle',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['sm', 'default', 'lg'],
      description: 'Physical dimensions',
      table: { category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction',
      table: { category: 'State' },
    },
    pressed: {
      control: 'boolean',
      description: 'The controlled pressed state',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing an icon-only toggle.
 */
export const Basic: Story = {
  args: {
    children: <Pin size={16} />,
    'aria-label': 'Toggle Pin',
  },
};

/**
 * Demonstrates the toggle with integrated text and icons.
 */
export const WithText: Story = {
  args: {
    variant: 'outline',
    className: 'px-4 gap-3',
    children: (
      <>
        <Shield size={16} />
        <span className="font-bold uppercase tracking-widest text-[10px]">Secure_Enclave</span>
      </>
    ),
  },
};

/**
 * High-performance technical variant used for active telemetry.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="p-8 bg-background border border-signal/10 rounded-card flex items-center gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-signal opacity-40 uppercase tracking-widest">
          Uplink_Sync
        </span>
        <span className="text-[8px] font-mono text-signal/20 uppercase tracking-tighter italic">
          Phase: 0x7F42
        </span>
      </div>
      <Toggle
        aria-label="Toggle activity monitor"
        variant="outline"
        className="h-12 w-12 rounded-card border-signal/30 text-signal data-[state=on]:bg-signal/20 data-[state=on]:text-signal data-[state=on]:border-signal hover:bg-signal/10"
      >
        <Activity size={20} />
      </Toggle>
    </div>
  ),
};

/**
 * Showcase of different size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-3">
        <Toggle size="sm" variant="outline" aria-label="Bold">
          <Bold size={14} />
        </Toggle>
        <p className="text-[9px] font-mono opacity-40 uppercase">SM</p>
      </div>
      <div className="text-center space-y-3">
        <Toggle size="default" variant="outline" aria-label="Bold">
          <Bold size={16} />
        </Toggle>
        <p className="text-[9px] font-mono opacity-40 uppercase">DEFAULT</p>
      </div>
      <div className="text-center space-y-3">
        <Toggle size="lg" variant="outline" aria-label="Bold">
          <Bold size={20} />
        </Toggle>
        <p className="text-[9px] font-mono opacity-40 uppercase">LG</p>
      </div>
    </div>
  ),
};

/**
 * Automated interaction test: click to press, click to unpress.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: {
    children: 'Pin',
    'aria-label': 'Toggle Pin',
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /toggle pin/i });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};
