import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@aazucena/ui';
import { Label } from '@aazucena/ui';
import { within, userEvent, expect } from 'storybook/test';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for boolean selection.
 * - **Accessibility:** Uses standard `aria-checked` states and maintains focus rings for keyboard users.
 * - **Design:** Supports high-fidelity `cyber` variant with glowing borders and mono typography alignment.
 * - **State:** Handles `checked`, `unchecked`, `indeterminate`, and `disabled` states.
 */
const meta = {
  title: 'Components/Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A control that allows the user to toggle between checked and unchecked states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual style of the checkbox',
      table: { category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction',
      table: { category: 'State' },
    },
    checked: {
      control: 'boolean',
      description: 'The checked state of the checkbox',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard checkbox implementation with a label.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and high-contrast borders.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="flex items-center gap-3 p-6 bg-black rounded-xl border border-white/5">
      <Checkbox {...args} id="cyber-lock" />
      <Label
        htmlFor="cyber-lock"
        className="font-mono text-cyan-400 cursor-pointer tracking-widest text-[10px]"
      >
        ENCRYPT_PAYLOAD_VOLUME
      </Label>
    </div>
  ),
};

/**
 * Demonstrates the checkbox in a disabled state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox {...args} id="disabled-opt" />
      <Label htmlFor="disabled-opt" className="opacity-50">
        Locked Configuration
      </Label>
    </div>
  ),
};

/**
 * Multiple checkboxes in a vertical group for selection lists.
 */
export const Checklist: Story = {
  render: () => (
    <div className="space-y-4 w-64 p-6 border rounded-2xl bg-muted/5">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">
        MODULE_SUBSCRIPTION
      </h4>
      <div className="flex items-center justify-between group">
        <Label
          htmlFor="c1"
          className="text-xs cursor-pointer group-hover:text-primary transition-colors"
        >
          Telemetry_Core
        </Label>
        <Checkbox id="c1" defaultChecked />
      </div>
      <div className="flex items-center justify-between group">
        <Label
          htmlFor="c2"
          className="text-xs cursor-pointer group-hover:text-primary transition-colors"
        >
          AI_Orchestrator
        </Label>
        <Checkbox id="c2" />
      </div>
      <div className="flex items-center justify-between group">
        <Label
          htmlFor="c3"
          className="text-xs cursor-pointer group-hover:text-primary transition-colors"
        >
          Edge_Ingestion
        </Label>
        <Checkbox id="c3" defaultChecked />
      </div>
    </div>
  ),
};

/**
 * Automated interaction test: click to check, click to uncheck, Space key.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="interaction-test" />
      <Label htmlFor="interaction-test" className="cursor-pointer">
        Toggle me
      </Label>
    </div>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    // Space key toggle
    checkbox.focus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
  },
};
