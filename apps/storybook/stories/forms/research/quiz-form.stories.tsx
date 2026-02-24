import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { QuizForm } from "@aazucena/forms/templates";
import type { QuizQuestion } from "@aazucena/forms/schemas";

const SAMPLE_QUIZ: QuizQuestion[] = [
  { id: "q1", question: "Which hook manages scroll state in this portfolio?", options: ["useScroll", "useSectionTransition", "usePortfolio", "useGSAP"], correctIndex: 1, points: 1 },
  { id: "q2", question: "What is the initial bundle size before Phase 3 optimization?", options: ["105 KB", "200 KB", "410 KB", "600 KB"], correctIndex: 2, points: 1 },
  { id: "q3", question: "Which library handles 2D particle systems?", options: ["Three.js", "PixiJS", "GSAP", "Framer Motion"], correctIndex: 1, points: 2 },
];

const meta = {
  title: "Forms/Research/QuizForm",
  component: QuizForm,
  parameters: { layout: "centered", docs: { description: { component: "Per-question step quiz with automatic scoring. Calls onSuccess with score and total." } } },
  tags: ["autodocs"],
  argTypes: { variant: { control: "select", options: ["default", "glass", "cyber"], table: { category: "Appearance" } } },
  args: { onSuccess: fn(), onError: fn(), questions: SAMPLE_QUIZ },
} satisfies Meta<typeof QuizForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: "default" } };
export const Glass: Story = { args: { variant: "glass" } };
export const Cyber: Story = { args: { variant: "cyber" } };
