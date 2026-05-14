import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ChatTestResults, type TestSummary, type TestCase } from '@aazucena/ui';

const meta: Meta<typeof ChatTestResults> = {
  title: 'Components/Chat/ChatTestResults',
  component: ChatTestResults,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    summary: {
      control: 'object',
      description: 'Summary of the test run (total, passed, failed, skipped, duration).',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    testCases: {
      control: 'object',
      description: 'An array of individual test case results.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the test results section.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Test Results' },
      },
    },
    showTestCases: {
      control: 'boolean',
      description: 'Whether to show the collapsible list of individual test cases.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatTestResults>;

const sampleTestCases: TestCase[] = [
  {
    id: '1',
    name: 'AuthenticationService.login returns valid token',
    status: 'passed',
    duration: 120,
  },
  {
    id: '2',
    name: 'UserService.createUser handles duplicate email',
    status: 'failed',
    errorMessage: 'Expected 409, got 200',
    duration: 350,
  },
  {
    id: '3',
    name: 'ProductService.getProductDetails fetches data',
    status: 'passed',
    duration: 80,
  },
  { id: '4', name: 'OrderService.submitOrder processes correctly', status: 'skipped', duration: 0 },
  {
    id: '5',
    name: 'PaymentGateway.processPayment handles invalid card',
    status: 'passed',
    duration: 200,
  },
];

const calculateSummary = (cases: TestCase[]): TestSummary => {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let duration = 0;

  cases.forEach((c) => {
    if (c.status === 'passed') passed++;
    if (c.status === 'failed') failed++;
    if (c.status === 'skipped') skipped++;
    if (c.duration) duration += c.duration;
  });

  return {
    total: cases.length,
    passed,
    failed,
    skipped,
    duration,
  };
};

export const AllPassed: Story = {
  args: {
    summary: calculateSummary(sampleTestCases.filter((c) => c.status === 'passed')),
    testCases: sampleTestCases.filter((c) => c.status === 'passed'),
  },
};

export const WithFailures: Story = {
  args: {
    summary: calculateSummary(sampleTestCases),
    testCases: sampleTestCases,
  },
};

export const AllSkipped: Story = {
  args: {
    summary: calculateSummary(sampleTestCases.filter((c) => c.status === 'skipped')),
    testCases: sampleTestCases.filter((c) => c.status === 'skipped'),
  },
};

export const CyberVariant: Story = {
  args: {
    summary: calculateSummary(sampleTestCases.slice(0, 3)),
    testCases: sampleTestCases.slice(0, 3),
    variant: 'cyber',
    title: 'CYBER_UNIT_TESTS',
  },
};

export const GlassVariant: Story = {
  args: {
    summary: calculateSummary(sampleTestCases.slice(2, 5)),
    testCases: sampleTestCases.slice(2, 5),
    variant: 'glass',
    title: 'Integration Test Report',
  },
};

export const NoTestCases: Story = {
  args: {
    summary: { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 },
    testCases: [],
    showTestCases: false,
  },
};
