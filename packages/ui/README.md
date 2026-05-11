# @aazucena/ui : Component_Intelligence_Library

## SUMMARY

Comprehensive component library with 80+ production-ready React components. Built on ShadCN UI primitives and extended with custom compositions, domain-specific components, and intelligence-gated telemetry visualizations.

---

## 🛠️ TOOLKIT_MANIFEST

| System                    | Protocol          | Description                                                             |
| :------------------------ | :---------------- | :---------------------------------------------------------------------- |
| **ShadCN_Primitives**     | Radix_UI          | 20+ accessible UI components (Button, Dialog, Form, Input, etc.).       |
| **Domain_Components**     | Content_Cards     | Blog cards, project cards, experience items, testimonials.              |
| **Navigation_Suite**      | Command_Palette   | Navbar, breadcrumbs, command palette (Cmd+K), table of contents.        |
| **Animation_Components**  | Motion_System     | Preloader system, infinite cards, flip text, gradient accents.          |
| **Block_Renderers**       | Content_Engine    | Markdown/rich text rendering, icon handling, Strapi blocks.             |
| **Telemetry_Components**  | Intelligence_UI   | System status indicators, metrics cards, log viewers, integrity badges. |
| **Storybook_Integration** | Component_Dev     | 50+ stories with accessibility testing and theme support.               |
| **Chromatic_VRT**         | Visual_Regression | Automated visual regression testing for component consistency.          |

---

## 🏗️ SYSTEM_FACTORIES

### [ShadCN Primitives] : The_Foundation

- **Location:** `src/components/ui/`
- **Logic:** Radix UI-based accessible components (Button, Card, Dialog, Form).
- **Pattern:** Variant-driven styling via class-variance-authority.

### [Domain Components] : The_Compositions

- **Location:** `src/components/{blog,projects,experience,misc}/`
- **Logic:** BlogCard, ProjectCard, ExperienceCard, TestimonialCard.
- **Pattern:** Compose primitives into domain-specific layouts.

### [Navigation Suite] : The_Orchestrator

- **Location:** `src/components/navigation/`
- **Logic:** Navbar, CommandPalette, Breadcrumbs, TableOfContents.
- **Pattern:** Keyboard-driven navigation (Cmd+K) with search.

### [Preloader System] : The_Initializer

- **Location:** `src/components/preloader/`
- **Logic:** Multi-step loading system with theme support (cyber, minimal, elegant).
- **Pattern:** Preloader, SimplePreloader, InteractivePreloader.

### [Telemetry Components] : The_Intelligence

- **Location:** `src/components/{status,logs,misc}/`
- **Logic:** IntegrityBadge, MetricCard, LogDetailModal.
- **Pattern:** Real-time system health monitoring and telemetry visualization.

---

## 🚦 USAGE_PROTOCOLS

### Basic Primitives

```typescript
import { Button, Card, CardHeader, CardContent } from '@aazucena/ui';

<Card>
  <CardHeader><h2>Card Title</h2></CardHeader>
  <CardContent>
    <p>Card content goes here</p>
    <Button variant="primary">Click Me</Button>
  </CardContent>
</Card>
```

### Domain Components

```typescript
import { BlogCard, ProjectCard, ExperienceCard } from '@aazucena/ui';

<BlogCard title="Post Title" excerpt="..." date={new Date()} tags={['react']} href="/blog/post" />
<ProjectCard title="Project" technologies={['Next.js']} imageUrl="/project.jpg" />
<ExperienceCard company="Company" position="Senior Dev" period="2020 - Present" />
```

### Navigation Suite

```typescript
import { CommandPalette, Breadcrumbs, TableOfContents } from '@aazucena/ui';

<CommandPalette commands={[{ id: 'home', label: 'Go Home', action: () => navigate('/') }]} />
<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }]} />
<TableOfContents headings={pageHeadings} />
```

### Telemetry Visualization

```typescript
import { IntegrityBadge, MetricCard, LogDetailModal } from '@aazucena/ui';

<IntegrityBadge status="OPERATIONAL" lastCheck={new Date()} />
<MetricCard title="API Latency" value="45ms" trend="+5%" status="healthy" />
<LogDetailModal log={{ event: 'PageView', timestamp: new Date() }} isOpen={true} />
```

---

## ✅ VERIFICATION_SUITE

- **Accessibility:** WCAG AA compliance via Radix UI primitives.
- **Performance:** Tree-shakeable exports, lazy loading support.
- **Type Safety:** Full TypeScript with strict mode enabled.
- **Theming:** CSS variables for dark/light modes.
- **Storybook:** 50+ stories with accessibility testing.
- **Chromatic:** Automated visual regression testing.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/constants, @aazucena/context, @aazucena/design-system, @aazucena/hooks, @aazucena/icons, @aazucena/utils
**External:** React 19, @radix-ui/\*, @strapi/blocks-react-renderer, framer-motion, lucide-react, react-hook-form, zod, tailwindcss

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Import components
import { Button, Card, BlogCard } from '@aazucena/ui';

# 3. Start Storybook for development
cd packages/ui
pnpm dev  # Opens http://localhost:6006
```

### Common Patterns

#### Building Card Layouts

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@aazucena/ui';

function ProductCard({ product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={product.image} alt={product.name} />
        <p className="text-2xl font-bold">${product.price}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Add to Cart</Button>
        <Button>Buy Now</Button>
      </CardFooter>
    </Card>
  );
}
```

#### Form Handling with Validation

```typescript
import { Button, Input, Label, Form, FormField, FormItem, FormLabel, FormMessage } from '@aazucena/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input placeholder="you@example.com" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="••••••••" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Log In</Button>
      </form>
    </Form>
  );
}
```

#### Command Palette (Cmd+K)

```typescript
import { CommandPalette } from '@aazucena/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function AppLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const commands = [
    { id: 'home', label: 'Go Home', action: () => router.push('/') },
    { id: 'blog', label: 'View Blog', action: () => router.push('/blog') },
    { id: 'projects', label: 'View Projects', action: () => router.push('/projects') },
    { id: 'search', label: 'Search', action: () => setIsOpen(true) },
    { id: 'theme', label: 'Toggle Theme', action: () => document.documentElement.classList.toggle('dark') },
  ];

  // Open with Cmd+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CommandPalette commands={commands} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {children}
    </>
  );
}
```

#### Modal & Sheet Patterns

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button } from '@aazucena/ui';

function ProfileModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Manage your account settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Profile content */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sheet for side panels
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@aazucena/ui';

function SettingsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Settings</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        {/* Settings content */}
      </SheetContent>
    </Sheet>
  );
}
```

#### Blog & Content Cards

```typescript
import { BlogCard, ProjectCard, ExperienceCard } from '@aazucena/ui';

function BlogGrid({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          title={post.title}
          excerpt={post.excerpt}
          date={post.publishedAt}
          tags={post.tags}
          href={`/blog/${post.slug}`}
          imageUrl={post.coverImage}
          author={{
            name: post.author.name,
            avatar: post.author.avatar,
          }}
        />
      ))}
    </div>
  );
}

function ProjectShowcase({ projects }) {
  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          imageUrl={project.image}
          githubUrl={project.githubUrl}
          liveUrl={project.liveUrl}
          featured={project.featured}
        />
      ))}
    </div>
  );
}
```

#### Preloader System

```typescript
import { Preloader, SimplePreloader, InteractivePreloader } from '@aazucena/ui';
import { useState, useEffect } from 'react';

function AppPreloader() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([
    { id: 1, name: 'Loading assets', progress: 0 },
    { id: 2, name: 'Initializing', progress: 0 },
    { id: 3, name: 'Finalizing', progress: 0 },
  ]);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setSteps((prev) =>
        prev.map((step, i) => ({
          ...step,
          progress: Math.min(step.progress + Math.random() * 30, 100),
        }))
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const allComplete = steps.every((step) => step.progress >= 100);
    if (allComplete) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [steps]);

  if (!loading) return null;

  return (
    <Preloader
      steps={steps}
      onComplete={() => setLoading(false)}
      theme="cyber"
    />
  );
}

// Simple version
function SimpleLoader({ isLoading }) {
  if (!isLoading) return null;

  return <SimplePreloader progress={75} message="Loading content..." />;
}

// Interactive version
function InteractiveLoader({ isComplete, canProceed, onProceed }) {
  return (
    <InteractivePreloader
      isComplete={isComplete}
      canProceed={canProceed}
      onProceed={onProceed}
      message={canProceed ? 'Click to continue' : 'Loading...'}
    />
  );
}
```

### Advanced Usage

#### Custom Theming

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          // ... other shades
        },
      },
    },
  },
};

// globals.css
:root {
  --primary-50: 210 100% 98%;
  --primary-100: 210 100% 95%;
  /* ... */
}

.dark {
  --primary-50: 210 15% 10%;
  --primary-100: 210 15% 15%;
  /* ... */
}
```

#### Variant Styling with CVA

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva('px-4 py-2 rounded', {
  variants: {
    variant: {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-500 text-white',
      outline: 'border-2 border-primary-500 text-primary-500',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

<Button className={buttonVariants({ variant: 'outline', size: 'lg' })}>
  Custom Button
</Button>
```

#### Storybook Development

```bash
# Start Storybook
pnpm dev

# Build Storybook
pnpm build-storybook

# Run visual regression tests
pnpm chromatic

# Test accessibility
pnpm test-storybook
```

### Troubleshooting

#### Component Not Rendering

```typescript
// ❌ Wrong: Importing from wrong path
import { Button } from '@aazucena/ui/components/ui/button';

// ✅ Correct: Use barrel export
import { Button } from '@aazucena/ui';
```

#### Tailwind Classes Not Working

```typescript
// ❌ Wrong: Dynamic classes
const variant = 'primary';
<Button className={`bg-${variant}-500`} />; // Won't work with Tailwind JIT

// ✅ Correct: Use variants or full class names
import { buttonVariants } from '@aazucena/ui';

<Button className={buttonVariants({ variant: 'primary' })} />;

// Or use cn() utility for dynamic classes
import { cn } from '@aazucena/ui/lib/utils';

<Button className={cn('bg-primary-500', isActive && 'ring-2')} />;
```

#### Form Validation Not Triggering

```typescript
// ❌ Wrong: Missing zodResolver
import { useForm } from 'react-hook-form';

const form = useForm({ defaultValues: { email: '' } });

// ✅ Correct: Add zodResolver
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { email: '' },
});
```

#### Modal Not Closing

```typescript
// ❌ Wrong: Missing onOpenChange
<Dialog>
  <DialogContent>{/* Content */}</DialogContent>
</Dialog>;

// ✅ Correct: Control open state
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button onClick={() => setOpen(true)}>Open</Button>
  </DialogTrigger>
  <DialogContent>{/* Content */}</DialogContent>
</Dialog>;
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
