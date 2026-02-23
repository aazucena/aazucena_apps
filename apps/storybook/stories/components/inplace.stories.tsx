import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Inplace } from '@aazucena/ui';
import { within, userEvent, expect } from '@storybook/test';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg) |
 * | UX | Click-to-edit pattern — click display to reveal editable content |
 * | Design | Supports controlled and uncontrolled modes, optional close button |
 */
const meta = {
  title: 'Components/Display/Inplace',
  component: Inplace,
  parameters: {
    docs: {
      description: {
        component:
          'A click-to-edit component that toggles between display and edit modes. Shows display content by default; clicking reveals the editable children. Supports controlled mode and an optional close button.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    closable: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Inplace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    display: 'Click to edit',
  },
  render: () => (
    <Inplace display={<span className="text-muted-foreground">Click to edit</span>}>
      <input
        className="rounded border border-input bg-background px-2 py-1 text-sm outline-none"
        defaultValue="Edit me"
      />
    </Inplace>
  ),
};

export const Closable: Story = {
  args: {
    display: 'Click to edit',
  },
  render: () => (
    <Inplace closable display={<span className="text-muted-foreground">Click to edit</span>}>
      <input
        className="rounded border border-input bg-background px-2 py-1 text-sm outline-none"
        defaultValue="Edit me"
      />
    </Inplace>
  ),
};

export const Controlled: Story = {
  args: {
    display: 'Click to edit',
  },
  render: () => {
    const [active, setActive] = React.useState(false);
    return (
      <div className="flex flex-col gap-2">
        <Inplace active={active} onToggle={setActive} closable display={<span>Click to edit</span>}>
          <input
            className="rounded border border-input bg-background px-2 py-1 text-sm outline-none"
            defaultValue="Controlled"
          />
        </Inplace>
        <p className="text-xs text-muted-foreground">Active: {String(active)}</p>
      </div>
    );
  },
};

export const Glass: Story = {
  args: {
    display: 'Click to edit',
  },
  render: () => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Inplace variant="glass" closable display={<span>Click to edit</span>}>
        <input
          className="rounded border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none"
          defaultValue="Glass"
        />
      </Inplace>
    </div>
  ),
};

export const Cyber: Story = {
  args: {
    display: 'CLICK_TO_EDIT',
  },
  render: () => (
    <Inplace variant="cyber" closable display={<span>CLICK_TO_EDIT</span>}>
      <input
        className="rounded border border-cyan-500/30 bg-black/50 px-2 py-1 text-sm text-cyan-50 font-mono outline-none"
        defaultValue="CYBER_VALUE"
      />
    </Inplace>
  ),
};

export const Sizes: Story = {
  args: {
    display: 'Size Field',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Inplace
          key={s}
          size={s}
          display={<span className="text-muted-foreground">Size: {s}</span>}
        >
          <input
            className="rounded border border-input bg-background px-2 py-1 text-sm outline-none"
            defaultValue={s}
          />
        </Inplace>
      ))}
    </div>
  ),
};

/**
 * Automated interaction test: click display to enter edit mode, verify input visible.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: {
    display: 'Click to edit this text',
    variant: 'default',
    size: 'md',
  },
  render: () => (
    <Inplace display={<span>Click to edit this text</span>}>
      <input
        className="rounded border border-input bg-background px-2 py-1 text-sm outline-none"
        defaultValue="Editable value"
        aria-label="Edit field"
      />
    </Inplace>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Initially display is shown, input is hidden
    const displayText = canvas.getByText('Click to edit this text');
    await expect(displayText).toBeVisible();
    // Click to enter edit mode
    await userEvent.click(displayText);
    // Input should now be visible
    const input = canvas.getByRole('textbox', { name: /edit field/i });
    await expect(input).toBeVisible();
  },
};
