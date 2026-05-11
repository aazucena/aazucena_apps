import type { Meta, StoryObj } from '@storybook/react-vite';
import { Share, ShareAction, ShareGroup, ShareHeader } from '@aazucena/ui';
import { Github, Linkedin, Twitter, LinkOne as Link, Discord, Send } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout component for social sharing and resource distribution.
 * - **UX:** Features `active:scale-90` tactile feedback on actions and built-in semantic labels.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for high-impact neon accents.
 * - **Composition:** Fully modular parts (Header, Group, Action) for flexible placement at the end of content.
 */
const meta = {
  title: 'Components/Actions/Share',
  component: Share,
  subcomponents: { ShareHeader, ShareGroup, ShareAction } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A social sharing and link distribution module. Ideal for the footer of blog posts, projects, or telemetry reports.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual theme of the container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Share>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a group of social sharing actions.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px] p-8 border rounded-[2rem] bg-card">
      <Share {...args}>
        <ShareHeader>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold tracking-tight">Share_Intelligence</span>
            <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
              Broadcast this report
            </span>
          </div>
          <ShareGroup>
            <ShareAction label="Twitter" href="#">
              <Twitter size={18} />
            </ShareAction>
            <ShareAction label="LinkedIn" href="#">
              <Linkedin size={18} />
            </ShareAction>
            <ShareAction label="Copy Link" href="#">
              <Link size={18} />
            </ShareAction>
          </ShareGroup>
        </ShareHeader>
      </Share>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-8 bg-black border border-cyan-500/10 rounded-xl">
      <Share {...args}>
        <ShareHeader>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500/60">
            // BROADCAST_SIGNAL_ENCLAVE
          </span>
          <ShareGroup>
            <ShareAction variant="cyber" href="#">
              <Github size={18} />
            </ShareAction>
            <ShareAction variant="cyber" href="#">
              <Twitter size={18} />
            </ShareAction>
            <ShareAction variant="cyber" href="#">
              <Discord size={18} />
            </ShareAction>
          </ShareGroup>
        </ShareHeader>
      </Share>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic backgrounds.
 */
export const GlassAtmospheric: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="w-[500px] relative z-10">
        <Share className="border-t-white/10">
          <ShareHeader>
            <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">
              Cloud_Distribution
            </span>
            <ShareGroup>
              <ShareAction
                variant="glass"
                className="bg-white/10 border-white/20 text-white rounded-full"
              >
                <Send size={18} />
              </ShareAction>
              <ShareAction
                variant="glass"
                className="bg-white/10 border-white/20 text-white rounded-full"
              >
                <Link size={18} />
              </ShareAction>
            </ShareGroup>
          </ShareHeader>
        </Share>
      </div>
    </div>
  ),
};
