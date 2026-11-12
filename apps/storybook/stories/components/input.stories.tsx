import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@aazucena/ui';
import { within, userEvent, expect } from 'storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic input primitive for text-based data entry.
 * - **Accessibility:** Supports standard HTML input attributes; focus rings and error states are visually distinct.
 * - **Design:** Includes high-fidelity `glass` and `cyber` variants aligned with the atmospheric design system.
 * - **Performance:** Minimal footprint; styles are managed via CVA for rapid theme switching.
 */
const meta = {
  title: 'Components/Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    // Figma component set in the Avra Design System file (addon-designs Design tab)
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=5-8',
    },
    docs: {
      description: {
        component:
          'The base input component for text, passwords, emails, and files. Supports brand-aligned visual variants.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the input',
      table: { category: 'Appearance' },
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'file', 'tel', 'url'],
      description: 'The HTML input type',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents user interaction',
      table: { category: 'State' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for general data entry.
 */
export const Basic: Story = {
  args: {
    placeholder: 'Enter text here...',
    variant: 'default',
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    placeholder: 'EXECUTE_QUERY...',
    className: 'font-mono text-xs uppercase tracking-widest',
  },
  render: (args) => (
    <div className="w-80 p-8 bg-background border border-signal/10 rounded-card">
      <Input {...args} />
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over complex backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    placeholder: 'Layer coordinate...',
  },
  render: (args) => (
    <div className="p-20 rounded-card">
      <div className="w-80">
        <Input
          {...args}
          className="bg-state border-rule text-foreground placeholder:text-foreground/40 rounded-card h-12 px-6"
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates the native file upload styling.
 */
export const FileUpload: Story = {
  args: {
    type: 'file',
    'aria-label': 'Upload file',
  },
  render: (args) => (
    <div className="w-96 p-6 border rounded-card bg-muted/5">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-1">
        Source_Payload_Upload
      </p>
      <Input {...args} className="h-auto py-4 cursor-pointer" />
    </div>
  ),
};

/**
 * Visual feedback for input in a disabled state.
 */
export const Disabled: Story = {
  args: {
    'aria-label': 'Configuration',
    disabled: true,
    value: 'LOCKED_CONFIGURATION',
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

/**
 * Automated interaction test: type text, verify value, then clear.
 */
export const InteractionTest: Story = {
  args: {
    placeholder: 'Type here...',
    variant: 'default',
  },
  tags: ['!autodocs'],
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Hello World');
    await expect(input).toHaveValue('Hello World');
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
  },
};

/**
 * Keyboard focus shows a 1px signal outline instead of a ring; 4px control radius.
 */
export const FocusVisible: Story = {
  args: { placeholder: 'Focus me' },
  play: async ({ canvasElement }: any) => {
    const input = within(canvasElement).getByRole('textbox');
    await userEvent.tab();
    await expect(input).toHaveFocus();
    const style = getComputedStyle(input);
    await expect(style.outlineStyle).not.toBe('none');
    await expect(style.borderTopLeftRadius).toBe('4px');
  },
};
