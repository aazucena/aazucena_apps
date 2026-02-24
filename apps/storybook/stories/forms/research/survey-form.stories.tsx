import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { SurveyForm } from '@aazucena/forms/templates';
import type { SurveyQuestion } from '@aazucena/forms/schemas';

const SAMPLE_QUESTIONS: SurveyQuestion[] = [
  { id: 'q1', type: 'rating', question: 'How would you rate the overall portfolio design?', required: true },
  { id: 'q2', type: 'multiple-choice', question: 'Which section did you find most impressive?', options: ['Hero', 'Projects', 'About', 'Journey'], required: true },
  { id: 'q3', type: 'checkbox', question: 'Which technologies would you like to see featured?', options: ['AI/ML', 'WebGL', 'Music', 'DevOps'], required: false },
  { id: 'q4', type: 'textarea', question: 'Any suggestions for improvement?', required: false },
];

const meta = {
  title: 'Forms/Research/SurveyForm',
  component: SurveyForm,
  parameters: { layout: 'centered', docs: { description: { component: 'Dynamic survey with per-question step navigation. Supports rating, multiple-choice, checkbox, and text questions.' } } },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn(), questions: SAMPLE_QUESTIONS, title: 'Portfolio Feedback Survey' },
} satisfies Meta<typeof SurveyForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
