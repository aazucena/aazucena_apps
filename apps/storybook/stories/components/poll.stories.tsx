import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Poll } from '@aazucena/ui';

const meta: Meta<typeof Poll> = {
  title: 'Components/Feedback/Poll',
  component: Poll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    question: {
      control: 'text',
      description: 'The question for the poll.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    options: {
      control: 'object',
      description: 'An array of poll options, each with an id, text, and initial votes.',
      table: { category: 'Content', type: { summary: 'object' } },
    },
    onVote: {
      action: 'voted',
      description: 'Callback function when a user submits their vote.',
      table: { category: 'Behavior', type: { summary: '() => void' } },
    },
    hasVoted: {
      control: 'boolean',
      description: 'Simulates whether the user has already voted.',
      table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the poll component.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    initialVotes: {
      control: 'object',
      description: 'Override initial vote counts for options (e.g., { "option1": 10, "option2": 5 }).',
      table: { category: 'Content', type: { summary: 'object' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Poll>;

const defaultOptions = [
  { id: 'option1', text: 'Option A', votes: 0 },
  { id: 'option2', text: 'Option B', votes: 0 },
  { id: 'option3', text: 'Option C', votes: 0 },
];

export const Default: Story = {
  args: {
    question: 'What is your favorite color?',
    options: defaultOptions,
  },
};

export const WithInitialVotes: Story = {
  args: {
    question: 'Which framework do you prefer?',
    options: [
      { id: 'react', text: 'React', votes: 0 },
      { id: 'vue', text: 'Vue', votes: 0 },
      { id: 'angular', text: 'Angular', votes: 0 },
    ],
    initialVotes: { react: 10, vue: 7, angular: 3 },
  },
};

export const UserHasVoted: Story = {
  args: {
    question: 'What is your favorite pet?',
    options: [
      { id: 'dog', text: 'Dog', votes: 15 },
      { id: 'cat', text: 'Cat', votes: 12 },
      { id: 'bird', text: 'Bird', votes: 5 },
    ],
    initialVotes: { dog: 15, cat: 12, bird: 5 },
    hasVoted: true,
  },
};

export const CyberVariant: Story = {
  args: {
    question: 'Which programming language is best?',
    options: [
      { id: 'js', text: 'JavaScript', votes: 20 },
      { id: 'py', text: 'Python', votes: 15 },
      { id: 'ts', text: 'TypeScript', votes: 25 },
    ],
    initialVotes: { js: 20, py: 15, ts: 25 },
    variant: 'cyber',
    hasVoted: true,
  },
};

export const GlassVariant: Story = {
  args: {
    question: 'Favorite dessert?',
    options: [
      { id: 'icecream', text: 'Ice Cream', votes: 8 },
      { id: 'cake', text: 'Cake', votes: 6 },
      { id: 'pie', text: 'Pie', votes: 4 },
    ],
    initialVotes: { icecream: 8, cake: 6, pie: 4 },
    variant: 'glass',
  },
};
