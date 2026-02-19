# @aazucena/layouts : Structure_Intelligence_System

## SUMMARY

Shared layout components and structural patterns for Astro and React applications. Provides responsive grid systems, section wrappers, container components, and reusable layout templates with built-in accessibility and SEO optimization.

---

## 🛠️ TOOLKIT_MANIFEST

| System                   | Protocol         | Description                                                               |
| :----------------------- | :--------------- | :------------------------------------------------------------------------ |
| **Base_Layouts**         | Foundation       | BaseLayout, DashboardLayout, ErrorLayout with meta tag management.        |
| **Section_Wrappers**     | Container_Logic  | Section, SectionLayout with padding, margins, and responsive breakpoints. |
| **Grid_Systems**         | Responsive_Grid  | Grid, GridItem with 12-column system and gap utilities.                   |
| **Container_Components** | Constraint_Width | MainContainer, ProseContainer, Shell with max-width and centering.        |
| **React_Layouts**        | JSX_Templates    | Portable layouts for React-based frameworks (Next.js, Remix).             |
| **Astro_Layouts**        | Component_Slots  | Astro-native layouts with slot-based composition.                         |

---

## 🏗️ SYSTEM_FACTORIES

### [Base Layouts] : The_Foundation

- **Location:** `src/base/`
- **Logic:** Root layout templates with head management, navigation, footer.
- **Exports:** `BaseLayout.astro`, `DashboardLayout.tsx`, `ErrorLayout.astro`.

### [Section Wrappers] : The_Containers

- **Location:** `src/sections/`
- **Logic:** Reusable section components with spacing, backgrounds, and responsive design.
- **Exports:** `Section.tsx`, `SectionLayout.tsx`, `SectionHeader.tsx`.

### [Grid Systems] : The_Structure

- **Location:** `src/grid/`
- **Logic:** Flexible grid system with responsive breakpoints and gap utilities.
- **Exports:** `Grid.tsx`, `GridItem.tsx`, `AutoGrid.tsx`.

### [Container Components] : The_Constraints

- **Location:** `src/containers/`
- **Logic:** Max-width containers for content constraint and centering.
- **Exports:** `MainContainer.tsx`, `ProseContainer.tsx`, `Shell.tsx`.

---

## 🚦 USAGE_PROTOCOLS

### Base Layout (Astro)

```astro
---
// src/pages/index.astro
import BaseLayout from '@aazucena/layouts/BaseLayout.astro';
---

<BaseLayout
  title="Home"
  description="Welcome to my portfolio"
  ogImage="/og-image.jpg"
>
  <h1>Welcome</h1>
  <p>This is the homepage content.</p>
</BaseLayout>
```

### Section Layout (React)

```typescript
import { Section, SectionLayout } from '@aazucena/layouts';

function AboutPage() {
  return (
    <Section id="about" className="bg-gray-50 dark:bg-gray-900">
      <SectionLayout>
        <h2>About Me</h2>
        <p>I'm a full-stack developer with 10 years of experience.</p>
      </SectionLayout>
    </Section>
  );
}
```

### Grid System

```typescript
import { Grid, GridItem } from '@aazucena/layouts';

function ProjectsGrid({ projects }) {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={6}>
      {projects.map((project) => (
        <GridItem key={project.id}>
          <ProjectCard {...project} />
        </GridItem>
      ))}
    </Grid>
  );
}
```

### Prose Container (Blog)

```typescript
import { ProseContainer } from '@aazucena/layouts';

function BlogPost({ content }) {
  return (
    <ProseContainer>
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </ProseContainer>
  );
}
```

---

## ✅ VERIFICATION_SUITE

- **Responsive:** Mobile-first design with breakpoint utilities.
- **Accessibility:** Semantic HTML, ARIA landmarks, skip links.
- **SEO:** Meta tag management, Open Graph, JSON-LD support.
- **Performance:** Minimal CSS, tree-shakeable components.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/ui, @aazucena/utils
**External:** react (peer dependency for React layouts), astro (peer dependency for Astro layouts)

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Import layouts
# For Astro
import BaseLayout from '@aazucena/layouts/BaseLayout.astro';

# For React
import { Section, Grid } from '@aazucena/layouts';
```

### Common Patterns

#### Full Page Layout (Astro)

```astro
---
// src/pages/about.astro
import BaseLayout from '@aazucena/layouts/BaseLayout.astro';
import { MainContainer } from '@aazucena/layouts';
---

<BaseLayout title="About" description="Learn more about me">
  <MainContainer>
    <h1>About Me</h1>
    <p>Full-stack developer specializing in React and TypeScript.</p>
  </MainContainer>
</BaseLayout>
```

#### Dashboard Layout (Next.js)

```typescript
import { DashboardLayout } from '@aazucena/layouts';

export default function DashboardPage({ children }) {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      header={<DashboardHeader />}
    >
      {children}
    </DashboardLayout>
  );
}
```

#### Responsive Grid

```typescript
import { Grid, GridItem } from '@aazucena/layouts';

function ServicesGrid() {
  const services = [
    { id: 1, title: 'Web Development', icon: '💻' },
    { id: 2, title: 'UI/UX Design', icon: '🎨' },
    { id: 3, title: 'Consulting', icon: '💡' },
  ];

  return (
    <Grid
      cols={{ base: 1, sm: 2, lg: 3 }}
      gap={{ base: 4, md: 6 }}
      className="my-8"
    >
      {services.map((service) => (
        <GridItem key={service.id}>
          <div className="p-6 bg-white rounded-lg shadow">
            <span className="text-4xl">{service.icon}</span>
            <h3 className="mt-4 text-xl font-bold">{service.title}</h3>
          </div>
        </GridItem>
      ))}
    </Grid>
  );
}
```

#### Section with Background

```typescript
import { Section, SectionLayout } from '@aazucena/layouts';

function HeroSection() {
  return (
    <Section
      id="hero"
      className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500"
    >
      <SectionLayout className="flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Welcome to My Portfolio</h1>
          <p className="mt-4 text-xl">Full-Stack Developer & Designer</p>
        </div>
      </SectionLayout>
    </Section>
  );
}
```

#### Prose Container for Blog

```typescript
import { ProseContainer } from '@aazucena/layouts';

function BlogPostLayout({ post }) {
  return (
    <ProseContainer>
      <header className="mb-8">
        <h1>{post.title}</h1>
        <p className="text-gray-600">{post.date}</p>
      </header>
      <article
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </ProseContainer>
  );
}
```

#### Auto Grid (Dynamic Columns)

```typescript
import { AutoGrid } from '@aazucena/layouts';

function GalleryGrid({ images }) {
  return (
    <AutoGrid minWidth="250px" gap={4}>
      {images.map((image) => (
        <div key={image.id}>
          <img src={image.url} alt={image.alt} className="w-full rounded" />
        </div>
      ))}
    </AutoGrid>
  );
}
```

### Advanced Usage

#### Custom Breakpoint Grid

```typescript
import { Grid, GridItem } from '@aazucena/layouts';

function CustomGrid() {
  return (
    <Grid
      cols={{
        base: 1,      // Mobile: 1 column
        sm: 2,        // Small: 2 columns
        md: 3,        // Medium: 3 columns
        lg: 4,        // Large: 4 columns
        xl: 6,        // Extra large: 6 columns
      }}
      gap={{ base: 2, md: 4, lg: 6 }}
    >
      {/* Grid items */}
    </Grid>
  );
}
```

#### Nested Layouts

```typescript
import { MainContainer, Section, Grid } from '@aazucena/layouts';

function ProjectsPage() {
  return (
    <MainContainer>
      <Section id="projects" className="py-16">
        <h2 className="text-3xl font-bold mb-8">My Projects</h2>
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </Grid>
      </Section>
    </MainContainer>
  );
}
```

### Troubleshooting

#### Layout Not Centering

```typescript
// ❌ Wrong: Missing container
<div className="bg-gray-50">
  <h1>Not centered</h1>
</div>

// ✅ Correct: Use MainContainer
import { MainContainer } from '@aazucena/layouts';

<MainContainer>
  <h1>Centered content</h1>
</MainContainer>
```

#### Grid Not Responsive

```typescript
// ❌ Wrong: Fixed columns
<Grid cols={3}>

// ✅ Correct: Responsive breakpoints
<Grid cols={{ base: 1, md: 2, lg: 3 }}>
```

#### Section Padding Issues

```typescript
// ❌ Wrong: Custom padding that breaks on mobile
<div className="px-4 py-16">

// ✅ Correct: Use SectionLayout
import { SectionLayout } from '@aazucena/layouts';

<SectionLayout>
  {/* Automatic responsive padding */}
</SectionLayout>
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
