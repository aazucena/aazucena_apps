import type { Meta, StoryObj } from '@storybook/react-vite';
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from '@aazucena/ui';
import { Globe, Database, Shield, Zap } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Standard HTML `<select>` wrapper for performance and mobile accessibility.
 * - **Accessibility:** Essential for mobile users (uses native wheel/picker). Includes automatic Label linking via `htmlFor`.
 * - **UX:** Features a custom `ChevronDown` indicator while maintaining native OS interaction.
 * - **Design:** Optimized for technical forms with support for `Label` integration and high-density size presets.
 */
const meta = {
  title: 'Components/Primitives/NativeSelect',
  component: NativeSelect,
  subcomponents: { NativeSelectOption, NativeSelectOptGroup } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper for the native select element. Provides standardized styling while preserving the performance and accessibility of the browser’s default picker.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'default'],
      description: 'Physical height of the input',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      description: 'Optional semantic label',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents user interaction',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing region selection with a label.
 */
export const Basic: Story = {
  args: {
    label: 'Target_Region',
    size: 'default',
  },
  render: (args) => (
    <div className="w-80">
      <NativeSelect {...args}>
        <NativeSelectOption value="us">North_America_Core</NativeSelectOption>
        <NativeSelectOption value="eu">European_Union_Relay</NativeSelectOption>
        <NativeSelectOption value="as">Asia_Pacific_Edge</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

/**
 * Technical implementation with semantic opt-groups for node management.
 */
export const Grouped: Story = {
  args: {
    label: 'Node_Topology',
  },
  render: (args) => (
    <div className="w-80">
      <NativeSelect {...args}>
        <NativeSelectOptGroup label="STABLE_NODES">
          <NativeSelectOption value="n1">Unit_0x7F42</NativeSelectOption>
          <NativeSelectOption value="n2">Unit_0x1A2B</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="DEGRADED_NODES">
          <NativeSelectOption value="n3">Unit_0x9C8D</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  ),
};

/**
 * High-density small variant, ideal for toolbars or compact settings.
 */
export const SmallDensity: Story = {
  args: {
    size: 'sm',
    label: 'Protocol_Level',
  },
  render: (args) => (
    <div className="w-64 p-6 border rounded-2xl bg-muted/5">
      <NativeSelect {...args}>
        <NativeSelectOption value="v1">Layer_01_Base</NativeSelectOption>
        <NativeSelectOption value="v2">Layer_02_Ext</NativeSelectOption>
        <NativeSelectOption value="v3">Layer_03_Exp</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

/**
 * Visual feedback when the select is in a disabled state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Locked_Preference',
  },
  render: (args) => (
    <div className="w-80">
      <NativeSelect {...args}>
        <NativeSelectOption>Admin_Default</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};
