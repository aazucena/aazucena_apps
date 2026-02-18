import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trend } from '@aazucena/ui/components/ui/trend.js';
import { ThoughtTrace, ThoughtStep } from '@aazucena/ui/components/ui/thought-trace.js';
import { SegmentedControl, SegmentedItem } from '@aazucena/ui/components/ui/segmented-control.js';
import { Playback, PlaybackCounter, PlaybackControls, PlaybackButton, PlaybackActions } from '@aazucena/ui/components/ui/playback.js';
import { Stepper, Step, StepIndicator, StepLabel, StepLine } from '@aazucena/ui/components/ui/stepper.js';
import { Dropzone } from '@aazucena/ui/components/ui/dropzone.js';
import { Play, Pause, ChevronLeft, ChevronRight, Refresh, CogFour as Settings } from '@aazucena/icons';
import { Button } from '@aazucena/ui/components/ui/button.js';

/**
 * ## Accessibility (A11y)
 * - **Interactive Elements:** Uses standard button and input behaviors.
 * - **Semantic Markers:** Steppers and indicators use status attributes for assistive tech.
 * - **Visual Contrast:** High-contrast indicators for critical engineering states (up/down/alert).
 * 
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `AAZUCENA_v1`
 */
const meta = {
  title: 'Components/Dashboard/EngineeringPrimitives',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of low-level dashboard components specialized for engineering telemetry and AI state visualization.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
} satisfies Meta;

export default meta;

type Story = StoryObj;

/**
 * Trend indicators for showing performance delta or status changes.
 */
export const TrendIndicators: Story = {
  render: () => (
    <div className="flex gap-12 items-center p-10 bg-muted/5 rounded-[3rem] border border-dashed">
      <Trend direction="up" value="+24.5%" variant="default" />
      <Trend direction="down" value="-12.2%" variant="pill" />
      <Trend direction="neutral" value="STABLE" variant="ghost" />
    </div>
  ),
};

/**
 * Visualizes AI reasoning or internal system processes as a traceable sequence.
 */
export const AIThoughtTrace: Story = {
  render: () => (
    <div className="w-96 p-8 border border-border rounded-[2.5rem] bg-gradient-to-br from-background to-muted/20">
      <ThoughtTrace variant="ai">
        <ThoughtStep status="completed">Querying kernel metrics</ThoughtStep>
        <ThoughtStep status="completed">Analyzing buffer lag</ThoughtStep>
        <ThoughtStep status="active">Generating inference report</ThoughtStep>
        <ThoughtStep status="pending">Optimizing response</ThoughtStep>
      </ThoughtTrace>
    </div>
  ),
};

/**
 * High-density selectors for switching between models, environments, or protocols.
 */
export const ModelSelector: Story = {
  render: () => (
    <div className="space-y-8 p-10 bg-zinc-50 dark:bg-background border rounded-[3rem] shadow-2xl">
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Primary_Engine</h4>
        <SegmentedControl variant="default">
          <SegmentedItem value="gpt4" isActive>GPT_4O</SegmentedItem>
          <SegmentedItem value="claude">CLAUDE_3.5</SegmentedItem>
          <SegmentedItem value="llama">LLAMA_3</SegmentedItem>
        </SegmentedControl>
      </div>

      <div className="space-y-2">
        <h4 className="text-[10px] font-mono italic uppercase tracking-widest text-cyan-500/60 ml-4">// RUNTIME_ENVIRONMENT</h4>
        <SegmentedControl variant="cyber">
          <SegmentedItem value="stable" isActive variant="cyber">STABLE</SegmentedItem>
          <SegmentedItem value="experimental" variant="cyber">EXPERIMENTAL</SegmentedItem>
        </SegmentedControl>
      </div>
    </div>
  ),
};

/**
 * Standardized stepper for multi-stage system initializations or workflows.
 */
export const StepSequence: Story = {
  render: () => (
    <div className="w-[600px] space-y-12 p-10 border rounded-[3rem] bg-muted/10">
      <Stepper>
        <Step status="completed">
          <StepIndicator index={0} status="completed" />
          <StepLabel>Initialize</StepLabel>
          <StepLine status="completed" />
        </Step>
        <Step status="active">
          <StepIndicator index={1} status="active" />
          <StepLabel>Ingest</StepLabel>
          <StepLine status="active" />
        </Step>
        <Step status="pending">
          <StepIndicator index={2} status="pending" />
          <StepLabel>Complete</StepLabel>
        </Step>
      </Stepper>
    </div>
  ),
};

/**
 * Controller for playing back telemetry streams or simulated agent trajectories.
 */
export const PlaybackController: Story = {
  render: () => (
    <div className="w-[800px] p-10 border rounded-[2rem] bg-background shadow-inner">
      <Playback variant="cyber">
        <PlaybackCounter current={42} total={120} />
        <PlaybackControls>
          <PlaybackButton><ChevronLeft size={16} /></PlaybackButton>
          <PlaybackButton active><Pause size={16} /></PlaybackButton>
          <PlaybackButton><ChevronRight size={16} /></PlaybackButton>
        </PlaybackControls>
        <PlaybackActions>
          <Button variant="ghost" size="icon" className="text-cyan-400">
            <Refresh size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-cyan-400">
            <Settings size={16} />
          </Button>
        </PlaybackActions>
      </Playback>
    </div>
  ),
};

/**
 * File dropzone specialized for ingesting large telemetry datasets or logs.
 */
export const SignalIngestion: Story = {
  render: () => (
    <div className="w-[500px] p-10">
      <Dropzone />
    </div>
  ),
};

