import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from '@aazucena/ui';
import { toast } from '@aazucena/ui';
import { Toaster } from '@aazucena/ui';
import { CloudUpload, File as FileIcon, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Interactive layout primitive for file ingestion and upload sequences.
 * - **UX:** Features automated drag-state handling (`isDragging`) with visual feedback via scaling and border-accents.
 * - **Accessibility:** Uses a hidden native `<input type="file">` for standard browser behavior; supports keyboard trigger via click-delegation.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `backdrop-blur` and technical labels.
 */
const meta = {
  title: 'Components/Forms/Dropzone',
  component: Dropzone,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A drag-and-drop file upload component. Supports multiple files, specific mime-types, and high-fidelity technical styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the dropzone',
      table: { category: 'Appearance' }
    },
    multiple: {
      control: 'boolean',
      description: 'Allow selecting multiple files',
      table: { category: 'Behavior' }
    },
    accept: {
      control: 'text',
      description: 'Comma-separated list of allowed mime-types',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a basic upload state.
 */
export const Basic: Story = {
  render: (args) => (
    <div className="w-[500px]">
      <Toaster />
      <Dropzone 
        {...args} 
        onFilesSelected={(files) => toast.success(`INGESTION_SUCCESS: ${files.length} units received.`)} 
      />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical labels.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-12 bg-black rounded-[3rem] border border-cyan-500/10">
      <div className="flex items-center gap-3 mb-8 px-4">
        <Activity className="size-4 text-cyan-500 animate-pulse" />
        <span className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em]">// SIGNAL_INGESTION_SHELL</span>
      </div>
      <Dropzone 
        {...args} 
        onFilesSelected={(files) => toast.info(`PARSING_PAYLOAD: Found ${files[0].name}`)}
      />
      <p className="mt-6 text-center text-[9px] font-mono text-cyan-500/20 uppercase tracking-widest italic">Awaiting_Secure_Packet_Stream</p>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over complex animated backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="w-[500px] relative z-10">
        <Dropzone {...args} className="border-white/10 shadow-2xl text-white">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20">
            <FileIcon size={32} className="text-white opacity-60" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-widest">Atmospheric_Upload</h3>
            <p className="text-[10px] opacity-40">Drag reflection maps or layer coordinates here.</p>
          </div>
        </Dropzone>
      </div>
    </div>
  ),
};
