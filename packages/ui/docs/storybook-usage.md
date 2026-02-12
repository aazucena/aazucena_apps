# Storybook Usage Guide

## SUMMARY

Comprehensive guide to developing, testing, and documenting components using Storybook 9.1.8 with accessibility testing and Chromatic visual regression integration.

---

## 🚀 GETTING_STARTED

### Running Storybook

```bash
# From packages/ui directory
cd packages/ui
pnpm dev  # Opens http://localhost:6006

# Or from monorepo root
pnpm --filter @aazucena/ui dev
```

---

### Storybook Configuration

Located at `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',      // Essential Storybook addons
    '@storybook/addon-a11y',            // Accessibility testing
    '@storybook/addon-interactions',    // Component interaction testing
    '@storybook/addon-themes',          // Theme switching
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',                    // Auto-generate docs from stories
  },
};

export default config;
```

---

## ✍️ WRITING_STORIES

### Basic Story Structure

```typescript
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',                   // Category/Component name
  component: Button,
  parameters: {
    layout: 'centered',                 // Center component in canvas
  },
  tags: ['autodocs'],                   // Enable auto-generated docs
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'md',
  },
};

// Variant stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

// Size stories
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};
```

---

### Story with Multiple Variants

```typescript
// Card.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with additional information.</p>
      </CardContent>
    </Card>
  ),
};

// Card with footer
export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
        <CardDescription>Are you sure you want to proceed?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This action cannot be undone.</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

// Interactive card
export const Interactive: Story = {
  render: () => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Click to see hover effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card responds to hover interactions.</p>
      </CardContent>
    </Card>
  ),
};
```

---

## 🎨 THEMING_IN_STORYBOOK

### Global Decorators

Configure theming in `.storybook/preview.ts`:

```typescript
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

---

### Theme Switcher

Add dark mode toggle to stories:

```typescript
// Card.stories.ts
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Dark Mode Card</CardTitle>
        <CardDescription>This card is in dark mode</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content adapts to dark theme.</p>
      </CardContent>
    </Card>
  ),
};
```

---

## ♿ ACCESSIBILITY_TESTING

### A11y Addon Integration

The `@storybook/addon-a11y` runs automated accessibility checks on every story.

**Viewing Results:**
1. Open Storybook at http://localhost:6006
2. Select a story
3. Open the "Accessibility" tab in the addons panel
4. Review violations, passes, and incomplete checks

---

### Writing Accessible Stories

```typescript
// Form.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from './form';
import { useForm } from 'react-hook-form';

const meta: Meta = {
  title: 'UI/Form',
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,           // Enforce WCAG color contrast
          },
          {
            id: 'label',
            enabled: true,           // Ensure form inputs have labels
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Accessible form with proper labels
export const AccessibleForm: Story = {
  render: () => {
    const form = useForm();

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    aria-describedby="email-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="email-description" />
              </FormItem>
            )}
          />
          <Button type="submit" aria-label="Submit form">
            Submit
          </Button>
        </form>
      </Form>
    );
  },
};
```

---

### Custom A11y Checks

Disable specific rules for exceptions:

```typescript
export const DecorativeImage: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'image-alt',
            enabled: false,           // Disable alt text check for decorative images
          },
        ],
      },
    },
  },
  render: () => (
    <img
      src="/decorative-pattern.svg"
      role="presentation"              // Mark as decorative
      aria-hidden="true"
    />
  ),
};
```

---

## 🧪 INTERACTION_TESTING

### Play Functions

Test component interactions within Storybook:

```typescript
// Dialog.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Button } from './dialog';

const meta: Meta = {
  title: 'UI/Dialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story with play function
export const OpenDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <p>Dialog content goes here.</p>
        <Button>Close</Button>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the trigger button
    const triggerButton = canvas.getByRole('button', { name: /open dialog/i });
    await userEvent.click(triggerButton);

    // Wait for dialog to appear
    const dialog = await canvas.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Verify dialog title
    const title = within(dialog).getByText(/dialog title/i);
    expect(title).toBeInTheDocument();
  },
};
```

---

### Testing Form Submissions

```typescript
// Form.stories.ts
export const FormSubmission: Story = {
  render: () => {
    const form = useForm();
    const onSubmit = (data) => {
      console.log('Form submitted:', data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the username field
    const usernameInput = canvas.getByPlaceholderText(/enter username/i);
    await userEvent.type(usernameInput, 'testuser');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify form submission (check console.log or mock function)
    expect(usernameInput).toHaveValue('testuser');
  },
};
```

---

## 📸 CHROMATIC_VRT

### Visual Regression Testing

Chromatic captures snapshots of every story and detects visual changes.

**Setup:**

```bash
# Install Chromatic
pnpm add -D chromatic

# Add script to package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<PROJECT_TOKEN>"
  }
}
```

---

### Running Chromatic

```bash
# Run visual regression tests
pnpm chromatic

# Output:
# ✔ Build and test your Storybook
# ✔ Publish your Storybook
# ✔ Test 50 stories across 3 viewports
# ✔ Found 2 visual changes
# View results: https://chromatic.com/build?appId=...
```

---

### Ignoring Elements in Snapshots

Exclude dynamic content from visual tests:

```typescript
// Card.stories.ts
export const WithDynamicTimestamp: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Latest Update</CardTitle>
        <CardDescription>
          <span data-chromatic="ignore">
            Last updated: {new Date().toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
    </Card>
  ),
};
```

---

### Viewport Testing

Test responsiveness across multiple viewports:

```typescript
// Card.stories.ts
export const ResponsiveCard: Story = {
  parameters: {
    chromatic: {
      viewports: [320, 768, 1200],     // Mobile, tablet, desktop
    },
  },
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Responsive Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card adapts to different screen sizes.</p>
      </CardContent>
    </Card>
  ),
};
```

---

## 📚 AUTO_DOCUMENTATION

### MDX Documentation

Create custom documentation pages:

```mdx
{/* Button.mdx */}
import { Meta, Canvas, Story, Controls } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button Component

Buttons are used to trigger actions throughout the application.

## Usage

<Canvas of={ButtonStories.Default} />

## Variants

The button component supports multiple variants:

<Canvas of={ButtonStories.Primary} />
<Canvas of={ButtonStories.Destructive} />
<Canvas of={ButtonStories.Outline} />

## Props

<Controls of={ButtonStories.Default} />

## Best Practices

- Use `variant="destructive"` for destructive actions (delete, remove)
- Use `variant="outline"` for secondary actions
- Always provide meaningful button text or `aria-label` for icon buttons
```

---

### Component Props Table

Auto-generated from TypeScript types:

```typescript
// Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style
   * @default 'default'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';

  /**
   * Render button as a child component (e.g., Link)
   */
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
    // Component implementation
  }
);
```

Storybook automatically generates a props table from JSDoc comments.

---

## 🎯 STORY_ORGANIZATION

### Recommended File Structure

```
src/components/
├── ui/
│   ├── button.tsx
│   ├── Button.stories.ts
│   ├── card.tsx
│   ├── Card.stories.ts
│   └── ...
├── blog/
│   ├── BlogCard.tsx
│   ├── BlogCard.stories.ts
│   └── ...
└── navigation/
    ├── Navbar.tsx
    ├── Navbar.stories.ts
    └── ...
```

---

### Story Naming Convention

```typescript
// Category/SubCategory/Component
const meta: Meta = {
  title: 'UI/Button',                 // ShadCN primitive
  title: 'Domain/BlogCard',           // Domain component
  title: 'Navigation/Navbar',         // Navigation component
  title: 'Telemetry/IntegrityBadge',  // Telemetry component
};
```

---

## 🧰 ADDONS_GUIDE

### Essential Addons

**1. Controls**
- Dynamically edit component props
- Automatically generated from `argTypes`

**2. Actions**
- Log component events (onClick, onChange, etc.)
- Useful for debugging interactions

**3. Viewport**
- Test component responsiveness
- Predefined breakpoints (mobile, tablet, desktop)

**4. Backgrounds**
- Test components on different backgrounds
- Light/dark mode testing

**5. Measure**
- Display component dimensions
- Useful for layout debugging

**6. Outline**
- Visualize component boundaries
- Helps debug spacing and alignment

---

### Custom Addon Configuration

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-themes',
      options: {
        themes: {
          light: 'light',
          dark: 'dark',
        },
      },
    },
  ],
};
```

---

## 🚀 PERFORMANCE_OPTIMIZATION

### Code Splitting Stories

```typescript
// Lazy load heavy components in stories
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const LazyLoaded: Story = {
  render: () => (
    <Suspense fallback={<Skeleton className="h-12 w-full" />}>
      <HeavyComponent />
    </Suspense>
  ),
};
```

---

### Disabling Docs for Performance

```typescript
// Button.stories.ts
const meta: Meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      disable: true,                   // Skip auto-docs generation
    },
  },
};
```

---

## 🔧 TROUBLESHOOTING

### Common Issues

**Issue: Stories not showing up**

```bash
# Ensure stories pattern matches in .storybook/main.ts
stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

# Restart Storybook
pnpm dev
```

**Issue: Tailwind classes not working**

```typescript
// .storybook/preview.ts
import '../src/styles/globals.css';  // Import Tailwind CSS
```

**Issue: TypeScript errors in stories**

```typescript
// Use correct types from @storybook/react
import type { Meta, StoryObj } from '@storybook/react';
```

---

**AUTHOR:** aazucena_storybook_intelligence
