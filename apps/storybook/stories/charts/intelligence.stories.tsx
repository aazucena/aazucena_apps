import type { Meta, StoryObj } from '@storybook/react-vite';
import { TelemetryProvider } from '@aazucena/context';
import { NeuralMap, NeuralNode } from '@aazucena/visualizations';
import { neuralSteps, neuralStepsFailed } from './_mock-data';

/**
 * ## Engineering Standards
 * - **NeuralMap:** AI trajectory visualization showing step-by-step cognitive flow.
 *   Wraps `NeuralNode` instances connected by arrows with reward-based coloring.
 *   Falls back to `NEURAL_MAP_FALLBACK_NODES` when no `graphData` is provided.
 * - **NeuralNode:** Individual node with 4 CVA states — default, active, completed, failed.
 *   Icon is auto-resolved from `type` string (intent → Component, retrieve → Search, etc.).
 * - **TelemetryProvider:** Required context — `useTelemetryConfig()` defaults to `{ baseUrl: '' }`
 *   but wrapping in a provider ensures clean isolation in stories.
 */
const meta = {
  title: 'Charts & Graphs/Intelligence',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AI cognitive flow components: NeuralMap (trajectory visualization) and NeuralNode (individual step node with 4 visual states).',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TelemetryProvider config={{ baseUrl: '' }}>
        <div className="w-full">
          <Story />
        </div>
      </TelemetryProvider>
    ),
  ],
} satisfies Meta;

export default meta;

// ---------------------------------------------------------------------------
// NeuralMap
// ---------------------------------------------------------------------------

export const NeuralMapDefault: StoryObj<typeof NeuralMap> = {
  render: () => <NeuralMap steps={neuralSteps} currentStepIndex={2} />,
};

export const NeuralMapFailed: StoryObj<typeof NeuralMap> = {
  render: () => <NeuralMap steps={neuralStepsFailed} currentStepIndex={3} />,
};

export const NeuralMapWithGraph: StoryObj<typeof NeuralMap> = {
  render: () => (
    <NeuralMap
      steps={neuralSteps}
      currentStepIndex={1}
      graphData={{
        nodes: [
          { id: 'ingest', label: 'Data_Ingest' },
          { id: 'transform', label: 'Transform' },
          { id: 'analyze', label: 'Analysis' },
          { id: 'output', label: 'Output' },
        ],
        edges: [
          { source: 'ingest', target: 'transform' },
          { source: 'transform', target: 'analyze' },
          { source: 'analyze', target: 'output' },
        ],
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// NeuralNode
// ---------------------------------------------------------------------------

export const NodeDefault: StoryObj<typeof NeuralNode> = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <NeuralNode type="analyze_intent" label="Intent Analysis" />
    </div>
  ),
};

export const NodeActive: StoryObj<typeof NeuralNode> = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <NeuralNode type="retrieve_knowledge" label="Knowledge RAG" isActive />
    </div>
  ),
};

export const NodeCompleted: StoryObj<typeof NeuralNode> = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <NeuralNode type="expert_dispatcher" label="Expert Dispatcher" isCompleted />
    </div>
  ),
};

export const NodeFailed: StoryObj<typeof NeuralNode> = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <NeuralNode type="generate_response" label="Cognitive Gen" isFailed />
    </div>
  ),
};

export const NodeStates: StoryObj<typeof NeuralNode> = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-8 flex-wrap">
      <NeuralNode type="analyze_intent" label="Default" />
      <NeuralNode type="retrieve_knowledge" label="Active" isActive />
      <NeuralNode type="expert_dispatcher" label="Completed" isCompleted />
      <NeuralNode type="generate_response" label="Failed" isFailed />
    </div>
  ),
};
