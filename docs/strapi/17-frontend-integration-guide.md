# Frontend API Integration Guide

**[← Back to API Tokens](./16-api-tokens-setup.md)** | **[Next: Testing →](./12-testing.md)**

---

## Overview

This guide walks you through integrating Strapi CMS data into your Astro portfolio application, replacing static data with dynamic CMS content.

**What You'll Learn:**
- ✅ How to fetch CMS data in Astro pages (Native Fetch)
- ✅ How to replace static data with CMS data
- ✅ Caching strategies for optimal performance
- ✅ Error handling and fallbacks
- ✅ Type-safe data fetching
- ✅ **TanStack Query** for client-side features (optional)

---

## Prerequisites

Before starting, ensure you have:

1. ✅ Build/SSR token created in Strapi ([16-api-tokens-setup.md](./16-api-tokens-setup.md))
2. ✅ Token added to `apps/portfolio/.env`
3. ✅ Strapi CMS running at `http://localhost:1337`
4. ✅ Content types populated with data in Strapi admin

---

## Quick Start

### 1. Update Your Token in `.env`

```bash
# apps/portfolio/.env

# Replace 'your-build-ssr-token-here' with your actual token
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=abcd1234your-actual-token-from-strapi-admin
```

**Get your token:**
1. Go to http://localhost:1337/admin
2. Navigate to **Settings** → **API Tokens**
3. Copy your "Build/SSR Token"
4. Paste it in `.env`

---

## File Structure

All the integration utilities have been created:

```
apps/portfolio/src/
├── lib/
│   ├── strapi.ts          # ✅ Core API client (fetchStrapi, createStrapiEntry)
│   └── api.ts             # ✅ Convenient data fetching functions
├── types/
│   └── strapi.ts          # ✅ TypeScript type definitions
└── .env                   # ⚠️ UPDATE: Add your token here
```

---

## Integration Examples

### Example 1: Fetch Hero Data

**Before (Static Data):**
```typescript
// apps/portfolio/src/components/animations/sections/data/hero.ts
export const heroData = {
  title: 'Aldrin Azucena',
  subtitle: 'Full-Stack Developer',
  tagline: 'Building elegant digital experiences',
};
```

**After (CMS Data):**
```astro
---
// apps/portfolio/src/pages/index.astro
import Layout from '../layouts/HomeLayout.astro';
import HeroSection from '~/components/animations/Section';
import { getHero } from '~/lib/api';

// Fetch hero data from CMS
const hero = await getHero();
---

<Layout title={hero.title}>
  <HeroSection client:visible heroData={hero} />
</Layout>
```

---

### Example 2: Fetch Skills

**Before (Static Data):**
```typescript
// apps/portfolio/src/components/animations/sections/data/skills.ts
export const skillCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: ['React', 'Vue.js', 'TypeScript'],
  },
  // ...
];
```

**After (CMS Data):**
```astro
---
// apps/portfolio/src/pages/skills.astro
import { getSkills } from '~/lib/api';

// Fetch all skills from CMS
const skills = await getSkills();

// Or fetch only featured skills
const featuredSkills = await getSkills({ featured: true });

// Or fetch by category
const frontendSkills = await getSkills({ category: 'frontend' });
---

<div class="skills-grid">
  {skills.map((skill) => (
    <div class="skill-card">
      <h3>{skill.name}</h3>
      <p>Proficiency: {skill.proficiency}%</p>
      {skill.icon && <img src={skill.icon} alt={skill.name} />}
    </div>
  ))}
</div>
```

---

### Example 3: Fetch Projects

**Before (Static Data):**
```typescript
// apps/portfolio/src/components/animations/sections/data/projects.ts
export const projects = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'My personal portfolio built with Astro',
    technologies: ['Astro', 'React', 'Tailwind'],
  },
  // ...
];
```

**After (CMS Data):**
```astro
---
// apps/portfolio/src/pages/projects.astro
import { getProjects, getStrapiMediaUrl } from '~/lib/api';

// Fetch all projects
const projects = await getProjects();

// Or fetch only featured projects
const featuredProjects = await getProjects({ featured: true });
---

<div class="projects-grid">
  {projects.map((project) => (
    <article class="project-card">
      {project.coverImage && (
        <img
          src={getStrapiMediaUrl(project.coverImage.url)}
          alt={project.coverImage.alternativeText || project.title}
        />
      )}
      <h2>{project.title}</h2>
      <p>{project.excerpt}</p>
      <div class="tech-stack">
        {project.technologies?.map(tech => (
          <span class="badge">{tech}</span>
        ))}
      </div>
      <a href={`/projects/${project.slug}`}>View Project</a>
    </article>
  ))}
</div>
```

---

### Example 4: Fetch Single Project by Slug

```astro
---
// apps/portfolio/src/pages/projects/[slug].astro
import { getProjectBySlug, getStrapiMediaUrl } from '~/lib/api';

const { slug } = Astro.params;

const project = await getProjectBySlug(slug);

if (!project) {
  return Astro.redirect('/404');
}
---

<article class="project-detail">
  <h1>{project.title}</h1>

  {project.coverImage && (
    <img
      src={getStrapiMediaUrl(project.coverImage.url)}
      alt={project.coverImage.alternativeText || project.title}
    />
  )}

  <div class="content">
    {project.description}
  </div>

  {project.gallery && project.gallery.length > 0 && (
    <div class="gallery">
      {project.gallery.map((image) => (
        <img src={getStrapiMediaUrl(image.url)} alt={image.alternativeText} />
      ))}
    </div>
  )}

  <div class="meta">
    <p>Status: {project.status}</p>
    <p>Category: {project.category}</p>
    {project.projectUrl && (
      <a href={project.projectUrl} target="_blank">Visit Website</a>
    )}
    {project.githubUrl && (
      <a href={project.githubUrl} target="_blank">View Code</a>
    )}
  </div>
</article>
```

---

### Example 5: Fetch Blog Posts with Pagination

```astro
---
// apps/portfolio/src/pages/blog/[...page].astro
import { getPosts } from '~/lib/api';

const page = Number(Astro.params.page) || 1;
const pageSize = 10;

const { posts, meta } = await getPosts({ page, pageSize });
---

<div class="blog-posts">
  {posts.map((post) => (
    <article class="post-card">
      {post.coverImage && (
        <img src={getStrapiMediaUrl(post.coverImage.url)} alt={post.title} />
      )}
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <div class="meta">
        <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
        <span>{post.readingTime} min read</span>
      </div>
      <a href={`/blog/${post.slug}`}>Read More</a>
    </article>
  ))}
</div>

{/* Pagination */}
<div class="pagination">
  {meta.pagination.page > 1 && (
    <a href={`/blog/${meta.pagination.page - 1}`}>← Previous</a>
  )}
  <span>Page {meta.pagination.page} of {meta.pagination.pageCount}</span>
  {meta.pagination.page < meta.pagination.pageCount && (
    <a href={`/blog/${meta.pagination.page + 1}`}>Next →</a>
  )}
</div>
```

---

### Example 6: Fetch Configuration Data

```astro
---
// apps/portfolio/src/layouts/BaseLayout.astro
import { getWebsiteConfiguration, getTheme, getStrapiMediaUrl } from '~/lib/api';

const config = await getWebsiteConfiguration();
const theme = await getTheme();
---

<!DOCTYPE html>
<html lang="en" data-theme={theme.mode}>
<head>
  <meta charset="UTF-8" />
  <title>{config.siteName}</title>
  <meta name="description" content={config.defaultSEO.metaDescription} />

  {/* Favicon */}
  {config.favicon && (
    <link rel="icon" href={getStrapiMediaUrl(config.favicon.url)} />
  )}

  {/* Open Graph */}
  {config.defaultSEO.openGraph && (
    <>
      <meta property="og:title" content={config.defaultSEO.openGraph.ogTitle} />
      <meta property="og:description" content={config.defaultSEO.openGraph.ogDescription} />
      {config.defaultSEO.openGraph.ogImage && (
        <meta property="og:image" content={getStrapiMediaUrl(config.defaultSEO.openGraph.ogImage.url)} />
      )}
    </>
  )}

  <style define:vars={{
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    accentColor: theme.accentColor,
  }}>
    :root {
      --color-primary: var(--primaryColor);
      --color-secondary: var(--secondaryColor);
      --color-accent: var(--accentColor);
    }
  </style>
</head>
<body>
  <slot />
</body>
</html>
```

---

## Caching Strategies

### Build-Time Caching (Static)

For content that rarely changes (config, theme):

```typescript
import { getWebsiteConfiguration } from '~/lib/api';

// Force cache - content is cached at build time
const config = await getWebsiteConfiguration({
  cache: 'force-cache',
});
```

### No Caching (Dynamic)

For frequently changing content (leaderboard, forms):

```typescript
import { getEasterEggLeaderboard } from '~/lib/api';

// No cache - always fetch fresh data
const leaderboard = await getEasterEggLeaderboard(10);
// Uses cache: 'no-store' by default
```

### Custom Caching

```typescript
import { fetchStrapi } from '~/lib/strapi';

const posts = await fetchStrapi('posts', {
  cache: 'no-cache', // Revalidate every request
  query: { /* ... */ },
});
```

**Caching Options:**
- `force-cache` - Cache forever (for static config)
- `no-store` - Never cache (for dynamic data)
- `no-cache` - Revalidate every request
- `default` - Browser default caching

---

## Error Handling

### Basic Error Handling

```astro
---
import { getProjects } from '~/lib/api';

let projects = [];
let error = null;

try {
  projects = await getProjects();
} catch (e) {
  console.error('Failed to fetch projects:', e);
  error = e.message;
}
---

{error ? (
  <div class="error">
    <p>Failed to load projects. Please try again later.</p>
  </div>
) : (
  <div class="projects-grid">
    {projects.map((project) => (
      <ProjectCard project={project} />
    ))}
  </div>
)}
```

### Fallback Data

```typescript
import { getSkills } from '~/lib/api';

let skills = [];

try {
  skills = await getSkills();
} catch (error) {
  console.error('Failed to fetch skills:', error);

  // Fallback to static data
  skills = [
    { name: 'React', proficiency: 90 },
    { name: 'TypeScript', proficiency: 85 },
    // ... fallback data
  ];
}
```

---

## Migration Checklist

### Phase 1: Setup (Completed ✅)
- [x] Build/SSR token created in Strapi
- [x] Token added to `.env`
- [x] Strapi client utilities created
- [x] TypeScript types defined
- [x] Data fetching functions created

### Phase 2: Content Population (Your Turn)
- [ ] Populate Hero data in Strapi admin
- [ ] Add Skills to Strapi
- [ ] Add Projects to Strapi
- [ ] Add Experience entries
- [ ] Add Testimonials
- [ ] Add Blog Posts
- [ ] Upload media (images, audio files)

### Phase 3: Integration (Next Steps)
- [ ] Update `index.astro` to fetch hero data
- [ ] Replace skills static data with CMS
- [ ] Replace projects static data with CMS
- [ ] Replace testimonials static data with CMS
- [ ] Replace blog posts static data with CMS
- [ ] Update layouts with configuration data

### Phase 4: Testing
- [ ] Test all pages load correctly
- [ ] Verify images display properly
- [ ] Check pagination works
- [ ] Test error states
- [ ] Verify caching behavior

---

## Common Patterns

### Pattern 1: Fetching with Relations

```typescript
import { fetchStrapi } from '~/lib/strapi';

const projects = await fetchStrapi('projects', {
  query: {
    populate: {
      coverImage: true,
      gallery: true,
      technologies: true, // Relation to Skills
    },
  },
});
```

### Pattern 2: Filtering

```typescript
import { fetchStrapi } from '~/lib/strapi';

const featuredPosts = await fetchStrapi('posts', {
  query: {
    filters: {
      featured: { $eq: true },
      publishedAt: { $notNull: true },
    },
    sort: ['publishedAt:desc'],
  },
});
```

### Pattern 3: Pagination

```typescript
import { getPosts } from '~/lib/api';

const page = 1;
const pageSize = 10;

const { posts, meta } = await getPosts({ page, pageSize });

console.log('Total posts:', meta.pagination.total);
console.log('Total pages:', meta.pagination.pageCount);
```

### Pattern 4: Localization (i18n)

```typescript
import { fetchStrapi } from '~/lib/strapi';

const hero = await fetchStrapi('hero', {
  query: {
    locale: 'es', // Spanish
    populate: '*',
  },
});
```

---

## Performance Tips

### 1. Use Astro's Static Generation

```typescript
// Static generation (default in Astro)
export const prerender = true; // Force SSG

const projects = await getProjects();
```

### 2. Selective Population

```typescript
// ❌ Don't populate everything
const projects = await fetchStrapi('projects', {
  query: { populate: '*' }, // Slow!
});

// ✅ Populate only what you need
const projects = await fetchStrapi('projects', {
  query: {
    populate: ['coverImage', 'technologies'], // Faster!
  },
});
```

### 3. Pagination for Large Collections

```typescript
// ❌ Don't fetch all posts at once
const allPosts = await fetchStrapi('posts', {
  query: { pagination: { pageSize: 1000 } }, // Slow!
});

// ✅ Use pagination
const { posts } = await getPosts({ page: 1, pageSize: 10 });
```

---

## TanStack Query (Optional - For Client-Side Features)

### When to Use TanStack Query vs Native Fetch

**Use Native Fetch (Current Implementation) for:**
- ✅ Static content fetched at build time (90% of portfolio)
- ✅ Server-side rendering (Astro SSR)
- ✅ Content that rarely changes (hero, about, projects, skills)
- ✅ SEO-critical content (pre-rendered HTML)

**Use TanStack Query for:**
- ✅ Real-time data that updates frequently (leaderboard)
- ✅ Client-side search/filtering
- ✅ Interactive forms with loading/error states
- ✅ User-specific data (favorites, bookmarks)
- ✅ Optimistic updates

### Decision Matrix

| Feature | Recommendation | Reason |
|---------|---------------|--------|
| Hero Section | Native Fetch | Static content, build-time |
| Skills List | Native Fetch | Rarely changes |
| Projects | Native Fetch | Static portfolio items |
| Blog Posts | Native Fetch | Pre-rendered for SEO |
| Easter Egg Leaderboard | **TanStack Query** | Updates in real-time |
| Search Functionality | **TanStack Query** | Client-side filtering |
| Form Submissions | Native Fetch (via API route) | Server-handled |

---

### Installation

```bash
cd apps/portfolio
pnpm add @tanstack/react-query
```

**Bundle Size Impact:** ~45KB (gzipped: ~12KB)

---

### Setup

#### 1. Create Query Client Provider

```typescript
// apps/portfolio/src/providers/QueryProvider.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data fresh for 1 minute
      gcTime: 5 * 60 * 1000, // Cache for 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1, // Retry failed requests once
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show DevTools in development only */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

#### 2. Wrap Your App

```astro
---
// apps/portfolio/src/layouts/BaseLayout.astro
import { QueryProvider } from '~/providers/QueryProvider';
---

<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Portfolio</title>
</head>
<body>
  <QueryProvider client:only="react">
    <slot />
  </QueryProvider>
</body>
</html>
```

---

### Example 1: Easter Egg Leaderboard (Real-Time Updates)

```typescript
// apps/portfolio/src/components/EasterEggLeaderboard.tsx

import { useQuery } from '@tanstack/react-query';

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  completedAt: string;
}

export function EasterEggLeaderboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['easter-eggs', 'leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/easter-eggs/leaderboard');
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return res.json() as Promise<LeaderboardEntry[]>;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });

  if (isLoading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="error">Failed to load leaderboard</div>;
  }

  return (
    <div className="leaderboard">
      <h2>Top Explorers</h2>
      <ol>
        {data?.map((entry, index) => (
          <li key={entry.id}>
            <span className="rank">#{index + 1}</span>
            <span className="username">{entry.username}</span>
            <span className="score">{entry.score} pts</span>
          </li>
        ))}
      </ol>
      <p className="update-info">Updates every 30 seconds</p>
    </div>
  );
}
```

**Usage in Astro:**
```astro
---
// apps/portfolio/src/pages/easter-eggs.astro
import { EasterEggLeaderboard } from '~/components/EasterEggLeaderboard';
---

<Layout>
  <EasterEggLeaderboard client:load />
</Layout>
```

---

### Example 2: Search Functionality (Client-Side Filtering)

```typescript
// apps/portfolio/src/components/ProjectSearch.tsx

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { fetchStrapi } from '~/lib/strapi';
import type { Project } from '~/types/strapi';

export function ProjectSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all projects once (cached)
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: async () => {
      const response = await fetchStrapi<{ data: Project[] }>('projects', {
        query: {
          populate: ['coverImage'],
          pagination: { pageSize: 100 },
        },
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // Projects don't change often (5 min)
  });

  // Client-side filtering (instant, no API calls)
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery) return projects;

    return projects.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some(tech =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [projects, searchQuery]);

  return (
    <div className="project-search">
      <input
        type="search"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <div className="results">
          <p>{filteredProjects.length} projects found</p>
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Example 3: Form Submissions with Mutations

```typescript
// apps/portfolio/src/components/ContactForm.tsx

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'Contact',
          ...data,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      return res.json();
    },
    onSuccess: () => {
      // Reset form on success
      setFormData({ name: '', email: '', message: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending...' : 'Send Message'}
      </button>

      {mutation.isSuccess && (
        <p className="success">Message sent successfully!</p>
      )}

      {mutation.isError && (
        <p className="error">Error: {mutation.error.message}</p>
      )}
    </form>
  );
}
```

---

### Caching Strategies with TanStack Query

```typescript
// Frequent updates (leaderboard)
useQuery({
  queryKey: ['leaderboard'],
  queryFn: fetchLeaderboard,
  staleTime: 20 * 1000, // 20 seconds
  refetchInterval: 30 * 1000, // Refetch every 30s
});

// Rarely changes (projects)
useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // Keep in cache for 10 min
});

// User-specific (no caching)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 0, // Always stale
  gcTime: 0, // No caching
});
```

---

### Query Invalidation

```typescript
// apps/portfolio/src/components/EasterEggComplete.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';

function EasterEggCompleteButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: completeEasterEgg,
    onSuccess: () => {
      // Invalidate leaderboard to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['easter-eggs', 'leaderboard'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()}>
      Complete Challenge
    </button>
  );
}
```

---

### Best Practices

#### 1. Query Keys Structure

```typescript
// ✅ Good - Hierarchical
['projects'] // All projects
['projects', 'featured'] // Featured projects
['projects', { id: '123' }] // Specific project
['projects', 'search', 'react'] // Search results

// ❌ Bad - Flat
['allProjects']
['featuredProjects']
['project123']
['searchReact']
```

#### 2. Prefetching (Advanced)

```typescript
// Prefetch data before user navigates
import { useQueryClient } from '@tanstack/react-query';

function ProjectsList() {
  const queryClient = useQueryClient();

  const prefetchProject = (projectId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['projects', { id: projectId }],
      queryFn: () => getProjectById(projectId),
    });
  };

  return (
    <div>
      {projects.map((project) => (
        <a
          href={`/projects/${project.slug}`}
          onMouseEnter={() => prefetchProject(project.id)} // Prefetch on hover
        >
          {project.title}
        </a>
      ))}
    </div>
  );
}
```

#### 3. Error Boundaries

```typescript
// apps/portfolio/src/components/ErrorBoundary.tsx

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

export function QueryErrorBoundary({ children }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <h2>Something went wrong</h2>
              <pre>{error.message}</pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

---

### Hybrid Approach: Native Fetch + TanStack Query

**Recommended Architecture:**

```typescript
// Static content (build-time) - Native Fetch
// apps/portfolio/src/pages/projects/index.astro
---
import { getProjects } from '~/lib/api';

// Fetched at BUILD TIME (SSG)
const initialProjects = await getProjects();
---

<Layout>
  {/* Static HTML for SEO */}
  <ProjectGrid initialProjects={initialProjects} client:load />
</Layout>
```

```typescript
// Interactive features (client-side) - TanStack Query
// apps/portfolio/src/components/ProjectGrid.tsx

import { useQuery } from '@tanstack/react-query';
import type { Project } from '~/types/strapi';

interface Props {
  initialProjects: Project[]; // From SSG
}

export function ProjectGrid({ initialProjects }: Props) {
  // Use TanStack Query for client-side updates
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: initialProjects, // Use SSG data initially
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Benefits:**
- ✅ Fast initial load (pre-rendered HTML)
- ✅ SEO-friendly (crawlers see static content)
- ✅ Client-side updates after hydration
- ✅ Best of both worlds

---

### When to Install TanStack Query

**Install when you implement:**
1. ✅ Easter Egg leaderboard (real-time updates)
2. ✅ Search functionality (client-side filtering)
3. ✅ User favorites/bookmarks (user-specific data)
4. ✅ Live notifications (WebSocket + React Query)

**Don't install if:**
- ❌ Only building static portfolio pages
- ❌ All content fetched at build time
- ❌ No interactive client-side features

---

### DevTools

TanStack Query includes excellent DevTools for debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**DevTools Features:**
- 📊 View all queries and their state
- 🔄 Manually refetch queries
- 🗑️ Clear cache
- ⏱️ See staleTime and cacheTime
- 🐛 Debug query lifecycle

---

## Troubleshooting

### Issue 1: "STRAPI_TOKEN is not defined"

**Solution:**
```bash
# Check .env file exists
cat apps/portfolio/.env

# Ensure token is set
STRAPI_TOKEN=your-actual-token-here
```

### Issue 2: "Failed to fetch from Strapi"

**Checklist:**
1. Is Strapi running? → `docker compose ps`
2. Is the URL correct? → Check `STRAPI_URL` in `.env`
3. Is the token valid? → Test with curl:
   ```bash
   curl http://localhost:1337/api/hero \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Issue 3: Images not displaying

**Solution:** Use `getStrapiMediaUrl()`:
```typescript
import { getStrapiMediaUrl } from '~/lib/strapi';

// ❌ Wrong
<img src={project.coverImage.url} />

// ✅ Correct
<img src={getStrapiMediaUrl(project.coverImage.url)} />
```

### Issue 4: TypeScript errors

**Solution:** Restart TypeScript server:
```bash
# In VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Next Steps

1. **[→ Populate Content in Strapi](http://localhost:1337/admin)**
2. **[→ Test Integration](./12-testing.md)**
3. **[→ Deploy to Production](./10-security-deployment.md)**

---

**Last Updated:** 2025-12-02
**Status:** Ready for Integration ✅

**[← API Tokens Setup](./16-api-tokens-setup.md)** | **[Next: Testing →](./12-testing.md)**
