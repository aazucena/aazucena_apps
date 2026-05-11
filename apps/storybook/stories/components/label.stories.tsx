import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@aazucena/ui';
import { Input, Checkbox, Badge } from '@aazucena/ui';
import { InfoCircle as Info } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for semantic form labels.
 * - **Accessibility:** Essential for linking text to form controls via `htmlFor`. Automatically handles focus delegation.
 * - **UX:** Features `select-none` to prevent text selection during interaction and provides disabled states aligned with `peer` controls.
 * - **Design:** Optimized for standard and high-density technical forms.
 */
const meta = {
  title: 'Components/Primitives/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A semantic label component for form controls. Features built-in accessibility and peer-state awareness.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation linked to an input.
 */
export const Basic: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Label htmlFor="node-id">NODE_IDENTIFIER</Label>
      <Input id="node-id" placeholder="e.g. US_EAST_01" />
    </div>
  ),
};

/**
 * Demonstrates the label with an associated checkbox.
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4 border rounded-xl bg-muted/5">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        Accept_Security_Protocol
      </Label>
    </div>
  ),
};

/**
 * Technical implementation with supplementary indicators.
 */
export const TechnicalContext: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="key" className="gap-2">
          Encryption_Key <Info size={12} className="opacity-40" />
        </Label>
        <Badge variant="cyber" size="xs">
          REQUIRED
        </Badge>
      </div>
      <Input id="key" type="password" />
    </div>
  ),
};

/**
 * Visual feedback when the associated control is disabled.
 */
export const DisabledState: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Label htmlFor="disabled-input" className="peer-disabled:opacity-50">
        Locked_Configuration
      </Label>
      <Input id="disabled-input" disabled value="0x7F42_ADMIN_ONLY" />
    </div>
  ),
};
