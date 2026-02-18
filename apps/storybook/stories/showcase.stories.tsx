import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Showcase,
  ShowcaseCaption,
  ShowcaseFigure,
  ShowcaseImage,
} from '@aazucena/ui';
import { Badge, Button } from '@aazucena/ui';
import { Play, Globe, Zap, Search, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout suite for high-fidelity media presentation (Portfolio imagery, Schematic diagrams).
 * - **UX:** Features smooth `duration-1000` image scaling and gradient overlays on hover.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for adaptive aspect ratios.
 * - **Accessibility:** Uses semantic `<figure>` and `<figcaption>` tags for standard-compliant image grouping.
 * - **Composition:** Fully modular parts (Figure, Image, Caption) for flexible media narratives.
 */
const meta = {
  title: 'Components/Data/Showcase',
  component: Showcase,
  subcomponents: {
    ShowcaseFigure,
    ShowcaseImage,
    ShowcaseCaption,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A media presentation system used to display high-fidelity project visuals, diagrams, and figures with automated captions and hover effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'grid'],
      description: 'The layout distribution of the showcase',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Showcase>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for a single high-impact visual.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[800px]">
      <Showcase {...args}>
        <ShowcaseFigure>
          <ShowcaseImage 
            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
            alt="Engineering Schematic" 
            aspect="video"
          />
          <ShowcaseCaption index={1}>System_Architecture_Logic_V4.2</ShowcaseCaption>
        </ShowcaseFigure>
      </Showcase>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and specific technical overlays.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="w-[800px] p-12 bg-black rounded-[3rem] border border-cyan-500/10">
      <Showcase>
        <ShowcaseFigure>
          <div className="relative group">
            <ShowcaseImage 
              variant="cyber"
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              aspect="video"
            />
            <div className="absolute top-6 right-6 z-20">
              <Badge variant="cyber" animated>LIVE_SIGNAL</Badge>
            </div>
          </div>
          <ShowcaseCaption className="font-mono text-cyan-500/60 mt-6 italic">
            // DATA_STREAM_TRACE // SOURCE: NODE_0x7F42
          </ShowcaseCaption>
        </ShowcaseFigure>
      </Showcase>
    </div>
  ),
};

/**
 * Demonstrates the multi-item grid layout for galleries or comparison views.
 */
export const GalleryGrid: Story = {
  args: {
    variant: 'grid',
  },
  render: (args) => (
    <div className="w-[900px]">
      <Showcase {...args}>
        <ShowcaseFigure>
          <ShowcaseImage aspect="square" src="https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000&auto=format&fit=crop" />
          <ShowcaseCaption>Visual_Module_Alpha</ShowcaseCaption>
        </ShowcaseFigure>
        <ShowcaseFigure>
          <ShowcaseImage aspect="square" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000&auto=format&fit=crop" />
          <ShowcaseCaption>Visual_Module_Beta</ShowcaseCaption>
        </ShowcaseFigure>
      </Showcase>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric backgrounds.
 */
export const GlassHero: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="w-[600px] relative z-10">
        <Showcase>
          <ShowcaseFigure>
            <ShowcaseImage 
              variant="glass"
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
              className="border-white/10"
            />
            <ShowcaseCaption className="text-white font-black tracking-[0.4em] mt-8">
              Atmospheric_Reflection_Map
            </ShowcaseCaption>
          </ShowcaseFigure>
        </Showcase>
      </div>
    </div>
  ),
};
