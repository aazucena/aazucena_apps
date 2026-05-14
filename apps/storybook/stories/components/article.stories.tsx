import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose } from '@aazucena/ui';
import { MarkdownRenderer } from '@aazucena/ui';
import { ReadingProgress } from '@aazucena/ui';
import { ReadingTime, ReadingTimeIcon, ReadingTimeValue } from '@aazucena/ui';

/**
 * ## Accessibility (A11y)
 * - **Visual Hierarchy:** Large headings and consistent vertical rhythm for readability.
 * - **Reading Indicators:** Non-interactive visual cues (progress bar, time) to aid long-form content consumption.
 * - **Semantic HTML:** Uses `<header>`, `<article>`, and headings (`h1`-`h3`) correctly.
 *
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `Avra_v1`
 */
const meta = {
  title: 'Components/Content/Article',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A composite layout pattern for long-form content, integrating Prose, MarkdownRenderer, ReadingProgress, and ReadingTime.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
} satisfies Meta;

export default meta;

type Story = StoryObj;

const mockMarkdown = `# Engineering High-Fidelity Interfaces

This article explores the **intersection** of telemetry and user experience.

## 1. System Topology
The architecture relies on a decentralized node network.

> 'The fidelity of an interface is directly proportional to its ability to mirror real-time system states.'

### Performance Metrics
- **Ingestion:** 1.2M events/sec
- **Latency:** < 15ms
- **Throughput:** 4.8 GB/s

## 2. Adaptive Rendering
Our render pipeline prioritizes content availability while lazily loading expensive canvas layers. This ensures a low Time-to-Interactive (TTI) even on hardware with limited capabilities.

\`\`\`typescript
const renderPipeline = async (context: RenderContext) => {
  const { viewport, priority } = context;
  await hydrateLayer(priority.CRITICAL);
  requestIdleCallback(() => hydrateLayer(priority.LOW));
};
\`\`\`
`;

/**
 * The standard editorial article layout.
 */
export const Default: Story = {
  render: () => (
    <div className="relative pt-20">
      <ReadingProgress variant="default" className="fixed top-0 left-0 w-full z-50" />
      <div className="max-w-3xl mx-auto px-6 pb-40">
        <header className="mb-12 border-b pb-8">
          <h1 className="text-5xl font-black tracking-tighter mb-4">The_Adaptive_Buffer</h1>
          <ReadingTime variant="muted">
            <ReadingTimeIcon />
            <ReadingTimeValue>8 MIN READ</ReadingTimeValue>
          </ReadingTime>
        </header>

        <Prose>
          <MarkdownRenderer content={mockMarkdown} />
        </Prose>
      </div>
    </div>
  ),
};

/**
 * The high-tech, cybernetic variant for technical logs and protocol documentation.
 */
export const Cyber: Story = {
  render: () => (
    <div className="relative pt-20 bg-background border min-h-screen text-foreground selection:bg-cyan-500/30">
      <ReadingProgress variant="cyber" className="fixed top-0 left-0 w-full z-50" />
      <div className="max-w-3xl mx-auto px-6 pb-40">
        <header className="mb-12 border-b border-cyan-500/20 pb-8">
          <h1 className="text-5xl font-mono italic font-black tracking-tighter text-cyan-400 mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
            // CORE_PROTOCOL_v4
          </h1>
          <ReadingTime variant="cyber">
            <ReadingTimeIcon />
            <ReadingTimeValue>ACCESS_TIME: 12ms</ReadingTimeValue>
          </ReadingTime>
        </header>

        <Prose variant="cyber">
          <MarkdownRenderer content={mockMarkdown} />
        </Prose>
      </div>
    </div>
  ),
};

/**
 * An atmospheric, glass-morphic variant suitable for immersive storytelling.
 */
export const Glass: Story = {
  render: () => (
    <div className="relative pt-20 bg-gradient-to-br from-indigo-500/10 via-background to-sky-500/10 min-h-screen">
      <ReadingProgress variant="glass" className="fixed top-0 left-0 w-full z-50" />
      <div className="max-w-3xl mx-auto px-6 pb-40 glass-morphism rounded-[3rem] p-12 mt-12 border border-white/10 shadow-2xl">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 mb-4">
            Atmospheric_Ingestion
          </h1>
          <ReadingTime variant="muted">
            <ReadingTimeIcon />
            <ReadingTimeValue>15 MIN READ</ReadingTimeValue>
          </ReadingTime>
        </header>

        <Prose>
          <MarkdownRenderer content={mockMarkdown} />
        </Prose>
      </div>
    </div>
  ),
};
