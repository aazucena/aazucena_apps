import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollSpy } from '@aazucena/ui';
import { cn } from '@aazucena/utils'; // Assuming cn utility is available

const meta: Meta<typeof ScrollSpy> = {
  title: 'Components/Utilities/ScrollSpy',
  component: ScrollSpy,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    containerSelector: {
      control: 'text',
      description: 'CSS selector for the scrollable container.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    headerSelector: {
      control: 'text',
      description: 'CSS selector for the headings to spy on (e.g., "h2, h3").',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    offset: {
      control: 'number',
      description: 'Offset from the top of the viewport for activation.',
      table: { category: 'State', type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    onActiveHeadingChange: {
      action: 'activeHeadingChanged',
      description: 'Callback function when the active heading changes.',
      table: { category: 'Behavior', type: { summary: '() => void' } },
    },
    children: {
      control: false,
      description: 'Optional children to render, e.g., a Table of Contents component.',
      table: { category: 'Content', type: { summary: 'React.ReactNode' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollSpy>;

const ArticleContent = () => (
  <div id="article-content" className="prose dark:prose-invert max-w-2xl mx-auto py-12">
    <h1 className="text-4xl font-bold mb-8">Comprehensive Guide to UI Components</h1>
    <h2 id="introduction" className="text-3xl font-semibold mt-10 mb-4">
      1. Introduction
    </h2>
    <p>
      Welcome to this detailed guide on the various UI components available in our design system. We
      aim to provide a robust and flexible set of tools for building modern applications.
    </p>
    <h3 id="principles" className="text-2xl font-medium mt-8 mb-3">
      1.1 Design Principles
    </h3>
    <p>
      Our components are built with accessibility, reusability, and performance in mind. Each
      component follows a clear contract and integrates seamlessly with our theming system.
    </p>
    <h2 id="core-components" className="text-3xl font-semibold mt-10 mb-4">
      2. Core Components
    </h2>
    <p>
      This section dives into the fundamental building blocks of our UI library, including buttons,
      inputs, and basic layout primitives.
    </p>
    <h3 id="buttons" className="text-2xl font-medium mt-8 mb-3">
      2.1 Buttons
    </h3>
    <p>
      Buttons are interactive elements that trigger an action when clicked. They come in various
      styles and sizes.
    </p>
    <h3 id="inputs" className="text-2xl font-medium mt-8 mb-3">
      2.2 Inputs
    </h3>
    <p>
      Input fields allow users to enter data. We support various types, including text, numbers, and
      passwords.
    </p>
    <h2 id="advanced-patterns" className="text-3xl font-semibold mt-10 mb-4">
      3. Advanced Patterns
    </h2>
    <p>
      Beyond the core, we offer complex composite components for richer user experiences, such as
      data tables, modals, and navigation systems.
    </p>
    <h3 id="data-tables" className="text-2xl font-medium mt-8 mb-3">
      3.1 Data Tables
    </h3>
    <p>
      Our data table component provides sorting, pagination, and filtering capabilities for large
      datasets.
    </p>
    <h3 id="modals" className="text-2xl font-medium mt-8 mb-3">
      3.2 Modals and Dialogs
    </h3>
    <p>
      Modals are disruptive overlays used for critical user interactions or displaying supplementary
      information.
    </p>
    <h2 id="conclusion" className="text-3xl font-semibold mt-10 mb-4">
      4. Conclusion
    </h2>
    <p>
      By leveraging these components, developers can quickly assemble sophisticated interfaces while
      maintaining design consistency and high performance.
    </p>
  </div>
);

const TableOfContents = ({ activeHeadingId }: { activeHeadingId: string | null }) => (
  <nav className="sticky top-20 right-0 w-64 p-4 space-y-2 text-sm">
    <h3 className="font-semibold mb-2">Table of Contents</h3>
    <ul>
      {['introduction', 'principles', 'core-components', 'buttons', 'inputs', 'advanced-patterns', 'data-tables', 'modals', 'conclusion'].map(
        (id) => (
          <li key={id} className="ml-2">
            <a
              href={`#${id}`}
              className={cn(
                'block py-1 transition-colors hover:text-primary',
                activeHeadingId === id ? 'text-primary font-medium' : 'text-muted-foreground',
                id.startsWith('principles') || id.startsWith('buttons') || id.startsWith('inputs') || id.startsWith('data-tables') || id.startsWith('modals') ? 'ml-4' : ''
              )}
            >
              {id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </a>
          </li>
        ),
      )}
    </ul>
  </nav>
);

export const Default: Story = {
  args: {
    containerSelector: '#scroll-container',
    headerSelector: 'h2, h3',
    offset: 20, // Offset for fixed header/navbar
  },
  render: (args) => {
    return (
      <div id="scroll-container" className="h-screen overflow-y-auto relative bg-background flex">
        {/* Simulate fixed header */}
        <header className="fixed top-0 left-0 w-full bg-card h-16 border-b z-10 flex items-center px-6">
          <h1 className="text-xl font-bold">App Header</h1>
        </header>

        <div className="flex flex-grow mt-16"> {/* Adjust content to be below fixed header */}
          <ScrollSpy {...args}>
            {(activeHeadingId) => (
              <div className="flex-shrink-0 w-64 pt-4 hidden md:block">
                <TableOfContents activeHeadingId={activeHeadingId} />
              </div>
            )}
          </ScrollSpy>
          <main className="flex-grow pt-4">
            <ArticleContent />
          </main>
        </div>
      </div>
    );
  },
};

export const CustomOffset: Story = {
  args: {
    containerSelector: '#scroll-container-offset',
    headerSelector: 'h2',
    offset: 100, // Larger offset
  },
  render: (args) => {
    return (
      <div id="scroll-container-offset" className="h-screen overflow-y-auto relative bg-muted/5">
        {/* Simulate fixed header */}
        <header className="fixed top-0 left-0 w-full bg-primary/10 h-24 border-b z-10 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-primary">Large Fixed Header</h1>
        </header>

        <div className="flex flex-grow mt-24"> {/* Adjust content to be below fixed header */}
          <ScrollSpy {...args}>
            {(activeHeadingId) => (
              <div className="flex-shrink-0 w-64 pt-4 hidden md:block">
                <TableOfContents activeHeadingId={activeHeadingId} />
              </div>
            )}
          </ScrollSpy>
          <main className="flex-grow pt-4">
            <ArticleContent />
          </main>
        </div>
      </div>
    );
  },
};
