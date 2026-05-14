import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResponsiveGrid } from '@aazucena/ui';
import { InfiniteScroller } from '@aazucena/ui';
import { ScrollDown, ScrollDownIcon, ScrollDownLabel } from '@aazucena/ui';
import {
  SplitButton,
  SplitButtonPrimary,
  SplitButtonTrigger,
  SplitButtonContent,
  SplitButtonItem,
  SplitButtonMenu,
} from '@aazucena/ui';
import {
  Spotlight,
  SpotlightVisual,
  SpotlightContent,
  SpotlightTitle,
  SpotlightDescription,
} from '@aazucena/ui';
import { Badge } from '@aazucena/ui';
import { Activity, Database } from '@aazucena/icons';

/**
 * ## Accessibility (A11y)
 * - **Motion Sensitivity:** Use `prefers-reduced-motion` to handle infinite scrolling and spotlight effects.
 * - **Keyboard Support:** SplitButton handles focus and dropdown triggers via keyboard standard.
 * - **Layout Adaptability:** Grid and utilities are fully responsive and preserve content flow.
 *
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `Avra_v1`
 */
const meta = {
  title: 'Components/Utilities/Utilities',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Miscellaneous layout and interaction utilities to enhance UI fidelity and user experience.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
} satisfies Meta;

export default meta;

type Story = StoryObj;

/**
 * Responsive grid utility for consistent column layouts across viewport sizes.
 */
export const GridGallery: Story = {
  render: () => (
    <div className="p-20 space-y-20 bg-muted/5 min-h-screen">
      <section className="space-y-8">
        <h2 className="text-sm font-black mb-8 opacity-40 uppercase tracking-widest ml-4">
          3-Column Grid
        </h2>
        <ResponsiveGrid cols={3} gap="lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-40 bg-background border border-dashed rounded-3xl flex items-center justify-center font-mono shadow-sm hover:shadow-md transition-shadow"
            >
              NODE_{i}
            </div>
          ))}
        </ResponsiveGrid>
      </section>
    </div>
  ),
};

/**
 * Infinite horizontal scrolling for showcases, logos, or ticker-like content.
 */
export const ScrollerGallery: Story = {
  render: () => (
    <div className="p-20 space-y-20 bg-background">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">
          Standard_Ticker
        </h4>
        <InfiniteScroller speed="fast">
          {['React', 'Next.js', 'TypeScript', 'GSAP', 'Three.js', 'Tailwind', 'Astro'].map(
            (tech) => (
              <Badge
                key={tech}
                size="lg"
                variant="secondary"
                className="px-8 py-3 rounded-full text-xl"
              >
                {tech}
              </Badge>
            ),
          )}
        </InfiniteScroller>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-mono italic uppercase tracking-widest text-cyan-500/60 ml-4">
          // SPECTRUM_SYNC
        </h4>
        <InfiniteScroller direction="right" speed="slow">
          {['#FE0042', '#00F0FF', '#7000FF', '#FFD600', '#00FF41'].map((color) => (
            <div
              key={color}
              className="w-64 h-32 rounded-2xl shadow-lg"
              style={{ backgroundColor: color }}
            />
          ))}
        </InfiniteScroller>
      </div>
    </div>
  ),
};

/**
 * Visual highlight utility for focusing attention on specific features or items.
 */
export const SpotlightGallery: Story = {
  render: () => (
    <div className="p-20 grid grid-cols-1 gap-8 max-w-4xl mx-auto">
      <Spotlight>
        <SpotlightVisual>
          <Activity />
        </SpotlightVisual>
        <SpotlightContent>
          <SpotlightTitle>System Stability</SpotlightTitle>
          <SpotlightDescription>
            Monitoring kernel-level processes and resource allocation in real-time.
          </SpotlightDescription>
        </SpotlightContent>
      </Spotlight>

      <Spotlight variant="cyber">
        <SpotlightVisual variant="cyber">
          <Database />
        </SpotlightVisual>
        <SpotlightContent>
          <SpotlightTitle variant="cyber">// DATA_ENCLAVE</SpotlightTitle>
          <SpotlightDescription>
            High-security encrypted buffer for sensitive telemetry streams.
          </SpotlightDescription>
        </SpotlightContent>
      </Spotlight>
    </div>
  ),
};

/**
 * A composite button providing a primary action and additional secondary options via a dropdown.
 */
export const SplitButtonGallery: Story = {
  render: () => (
    <div className="p-20 flex flex-col gap-12 items-center justify-center bg-muted/10 min-h-screen">
      <div className="flex gap-12">
        <SplitButton>
          <SplitButtonPrimary>Execute Init</SplitButtonPrimary>
          <SplitButtonMenu>
            <SplitButtonTrigger />
            <SplitButtonContent>
              <SplitButtonItem>Force Restart</SplitButtonItem>
              <SplitButtonItem>Safe Mode</SplitButtonItem>
              <SplitButtonItem>Diagnostic Boot</SplitButtonItem>
            </SplitButtonContent>
          </SplitButtonMenu>
        </SplitButton>

        <SplitButton variant="cyber">
          <SplitButtonPrimary variant="cyber">// CONNECT_NODE</SplitButtonPrimary>
          <SplitButtonMenu>
            <SplitButtonTrigger variant="cyber" />
            <SplitButtonContent variant="cyber">
              <SplitButtonItem>BYPASS_AUTH</SplitButtonItem>
              <SplitButtonItem>DEBUG_MODE</SplitButtonItem>
              <SplitButtonItem>CLEAR_CACHE</SplitButtonItem>
            </SplitButtonContent>
          </SplitButtonMenu>
        </SplitButton>
      </div>

      <div className="mt-12">
        <ScrollDown>
          <ScrollDownIcon />
          <ScrollDownLabel>DISCOVER_MORE</ScrollDownLabel>
        </ScrollDown>
      </div>
    </div>
  ),
};
