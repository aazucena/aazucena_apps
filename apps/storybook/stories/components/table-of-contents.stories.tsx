import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableOfContents } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Scroll-synced navigational helper for long-form content.
 * - **UX:** Features automated header scanning and high-fidelity `IntersectionObserver` logic for active state tracking.
 * - **Hierarchy:** Supports nested tree structures (H2 -> H3) with automated indentation and parent tracking.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `backdrop-blur`.
 * - **Responsiveness:** Automatically hidden on smaller viewports (`hidden xl:block`).
 */
const meta = {
  title: 'Components/Navigation/TableOfContents',
  component: TableOfContents,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A dynamic navigation sidebar that automatically scans the page for headings and tracks the users scroll position.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the floating panel',
      table: { category: 'Appearance' }
    },
    position: {
      control: 'radio',
      options: ['top-right', 'top-left'],
      description: 'Fixed positioning on the screen',
      table: { category: 'Layout' }
    },
    containerSelector: {
      control: 'text',
      description: 'CSS selector for the content area to scan',
      table: { category: 'Behavior', defaultValue: { summary: 'main' } }
    }
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for documentation or blog posts. **Scroll the preview below.**
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    position: 'top-right',
    containerSelector: '#basic-content',
  },
  render: (args) => (
    <div className="relative p-20 max-w-4xl mx-auto min-h-[150vh]">
      <TableOfContents {...args} />
      <div id="basic-content" className="space-y-32">
        <section>
          <h2 id="intro" className="text-4xl font-black tracking-tighter uppercase mb-8">Introduction</h2>
          <p className="text-lg opacity-60 leading-relaxed">Scroll down to see the Contents panel update its active state automatically.</p>
          <div className="h-96 bg-muted/10 rounded-[3rem] border-2 border-dashed mt-12" />
        </section>
        <section>
          <h2 id="arch" className="text-4xl font-black tracking-tighter uppercase mb-8">System_Architecture</h2>
          <div className="space-y-12 pl-8 border-l-2">
            <h3 id="kernel" className="text-2xl font-bold uppercase">Kernel_Processing</h3>
            <div className="h-64 bg-muted/10 rounded-2xl" />
            <h3 id="uplink" className="text-2xl font-bold uppercase">Global_Uplink</h3>
            <div className="h-64 bg-muted/10 rounded-2xl" />
          </div>
        </section>
        <section>
          <h2 id="security" className="text-4xl font-black tracking-tighter uppercase mb-8">Security_Enclave</h2>
          <div className="h-screen bg-muted/10 rounded-[3rem] border-2 border-dashed" />
        </section>
      </div>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    position: 'top-left',
    containerSelector: '#cyber-content',
  },
  render: (args) => (
    <div className="relative p-20 max-w-4xl mx-auto bg-black min-h-[150vh] border-x border-cyan-500/10">
      <TableOfContents {...args} />
      <div id="cyber-content" className="space-y-32 font-mono">
        <section>
          <h2 id="init" className="text-cyan-500 italic text-4xl mb-8 uppercase tracking-tighter">// 01_INITIALIZATION</h2>
          <div className="h-96 border border-cyan-500/20 bg-cyan-500/5 rounded-xl" />
        </section>
        <section>
          <h2 id="sync" className="text-cyan-500 italic text-4xl mb-8 uppercase tracking-tighter">// 02_BUFFER_SYNC</h2>
          <div className="space-y-12">
            <h3 id="packets" className="text-cyan-400 text-xl uppercase"># PACKET_TRACE</h3>
            <div className="h-64 border border-cyan-500/20 bg-cyan-500/5 rounded-xl" />
          </div>
        </section>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    position: 'top-right',
    containerSelector: '#glass-content',
  },
  render: (args) => (
    <div className="relative min-h-[150vh] bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-20">
      <div className="absolute inset-0 bg-black/20" />
      <div className="max-w-4xl mx-auto relative z-10">
        <TableOfContents {...args} className="border-white/10" />
        <div id="glass-content" className="space-y-32 text-white">
          <section>
            <h2 id="troposphere" className="text-5xl font-black uppercase tracking-tighter mb-8">Troposphere_Layer</h2>
            <div className="h-96 glass border-white/10 rounded-[3rem]" />
          </section>
          <section>
            <h2 id="mesosphere" className="text-5xl font-black uppercase tracking-tighter mb-8">Mesosphere_Layer</h2>
            <div className="h-screen glass border-white/10 rounded-[3rem]" />
          </section>
        </div>
      </div>
    </div>
  ),
};
