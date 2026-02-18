import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@aazucena/ui';

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
    docs: {
      description: {
        component: 'The base input component for text, passwords, emails, and files. Supports brand-aligned visual variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the input',
      table: { category: 'Appearance' }
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'file', 'tel', 'url'],
      description: 'The HTML input type',
      table: { category: 'Behavior' }
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents user interaction',
      table: { category: 'State' }
    }
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
    <div className="w-80 p-8 bg-black border border-cyan-500/10 rounded-2xl">
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
    <div className="p-20 bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[3rem]">
      <div className="w-80">
        <Input {...args} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl h-12 px-6" />
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
  },
  render: (args) => (
    <div className="w-96 p-6 border rounded-2xl bg-muted/5">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-1">Source_Payload_Upload</p>
      <Input {...args} className="h-auto py-4 cursor-pointer" />
    </div>
  ),
};

/**
 * Visual feedback for input in a disabled state.
 */
export const Disabled: Story = {
  args: {
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
