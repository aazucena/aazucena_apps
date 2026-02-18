import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Typography utility wrapper for long-form Markdown or CMS-driven content.
 * - **Design:** Powered by `tailwindcss-typography` with custom brand overrides.
 * - **UX:** Features consistent spacing for headings, lists, and links to ensure maximum readability.
 * - **Variants:** Supports high-fidelity `cyber` (mono) and `legal` (print-optimized) presets.
 */
const meta = {
  title: 'Components/Content/Prose',
  component: Prose,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A wrapper component that applies consistent typographic styles to nested HTML content. Ideal for blog posts, documentation, and legal pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'legal', 'cyber'],
      description: 'The typographic theme',
      table: { category: 'Appearance' }
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg', 'xl'],
      description: 'Base font size and spacing preset',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = (
  <>
    <h1>Project_Intelligence_V4</h1>
    <p>
      Exploring the <strong>neural-adaptive</strong> landscape of modern interfaces. This system leverages 
      high-fidelity telemetry to establish real-time node synchronization across distributed continental sectors.
    </p>
    <h2>Core_Capabilities</h2>
    <ul>
      <li>High-Fandwidth Knowledge Ingestion</li>
      <li>Atmospheric Glass Surfacing</li>
      <li>Decentralized Security Enclaves</li>
    </ul>
    <p>
      For more information, visit our <a href="#">technical documentation</a> or review the latest 
      <a href="#">deployment logs</a>.
    </p>
    <blockquote>
      "The future of computing is not in the hardware, but in the seamless ingestion of human intent."
    </blockquote>
  </>
);

// --- STORIES ---

/**
 * Standard implementation for blog posts and general articles.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    children: sampleContent,
  },
  render: (args) => (
    <div className="w-[800px] p-12 border rounded-[3rem] bg-card shadow-2xl">
      <Prose {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant with mono typography and technical styling.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    size: 'base',
    children: sampleContent,
  },
  render: (args) => (
    <div className="w-[800px] p-12 bg-black border border-cyan-500/20 rounded-xl text-white">
      <Prose {...args} />
    </div>
  ),
};

/**
 * Print-optimized variant for privacy policies and terms of service.
 */
export const LegalDocument: Story = {
  args: {
    variant: 'legal',
    size: 'base',
    children: (
      <>
        <h1>Privacy_Protocol</h1>
        <p>Last Updated: Feb 14, 2026</p>
        <p>This document outlines the security procedures for local data persistence within the Azucena architecture.</p>
        <h2>1. Data_Collection</h2>
        <p>We do not collect personal identifiers. All telemetry is anonymized at the edge node before ingestion.</p>
        <h2>2. Encryption</h2>
        <p>All stored payloads are encrypted using AES-256-GCM standards with keys rotated every 24 hours.</p>
      </>
    ),
  },
  render: (args) => (
    <div className="w-[700px] p-12 bg-white text-zinc-900 border rounded-2xl shadow-sm">
      <Prose {...args} />
    </div>
  ),
};

/**
 * Demonstrates the available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Small (Prose-sm)</p>
        <Prose size="sm" className="w-[600px] border p-6 rounded-xl">
          <p>The neural telemetry engine is reporting optimal pulse intervals across all active nodes in the US_EAST sector.</p>
        </Prose>
      </div>
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Extra Large (Prose-xl)</p>
        <Prose size="xl" className="w-[600px] border p-6 rounded-xl">
          <p>Scaling the synchronized node infrastructure across multiple continental sectors.</p>
        </Prose>
      </div>
    </div>
  ),
};
