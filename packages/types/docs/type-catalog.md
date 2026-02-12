# Type Catalog

## SUMMARY

Complete reference for all type definitions in @aazucena/types, organized by domain with usage examples and integration patterns.

---

## 🎨 CORE_TYPES

### AnimationConfig (`animations.ts`)

GSAP timeline configuration and animation state.

```typescript
import type { AnimationConfig, AtmosphericLayer, ScrollProgress } from '@aazucena/types';

// GSAP animation configuration
const config: AnimationConfig = {
  duration: 1.5,
  ease: 'power2.out',
  stagger: 0.1,
  delay: 0.2,
};

// Atmospheric layer data
const layer: AtmosphericLayer = {
  name: 'troposphere',
  start: 0.0,
  end: 0.25,
  particles: 100,
  backgroundColor: 'oklch(10% 0.05 250)',
};

// Scroll tracking
const scroll: ScrollProgress = {
  progress: 0.45,
  direction: 'down',
  velocity: 12,
};
```

---

### SiteConfig (`config.ts`)

Global site configuration and theme settings.

```typescript
import type { SiteConfig, ThemeConfig, FeatureFlags } from '@aazucena/types';

const siteConfig: SiteConfig = {
  name: 'Portfolio',
  description: 'My portfolio website',
  url: 'https://example.com',
  author: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  social: {
    github: 'https://github.com/user',
    twitter: 'https://twitter.com/user',
  },
};

const themeConfig: ThemeConfig = {
  defaultTheme: 'dark',
  colors: {
    primary: 'oklch(60% 0.20 250)',
    secondary: 'oklch(65% 0.18 45)',
  },
};

const features: FeatureFlags = {
  enableAnimations: true,
  enableTelemetry: true,
  enableAI: false,
};
```

---

### Enums (`enums.ts`)

Shared enumerations across the application.

```typescript
import type { ContentStatus, PageTemplate, SkillLevel } from '@aazucena/types';

// Content status
const status: ContentStatus = 'published'; // 'draft' | 'published' | 'archived'

// Page template type
const template: PageTemplate = 'editorial'; // 'editorial' | 'legal' | 'landing'

// Skill proficiency
const level: SkillLevel = 'expert'; // 'beginner' | 'intermediate' | 'advanced' | 'expert'
```

---

### IconProps (`icons.ts`)

Type-safe icon system interfaces.

```typescript
import type { IconProps, IconRegistry } from '@aazucena/types';

// Icon component props
const iconProps: IconProps = {
  name: 'home',
  size: 24,
  color: 'currentColor',
  className: 'icon-home',
};

// Icon registry mapping
const registry: IconRegistry = {
  home: HomeIcon,
  user: UserIcon,
  settings: SettingsIcon,
};
```

---

## 🔌 API_TYPES

### Strapi Types (`api/strapi.ts`)

Strapi CMS API response types.

```typescript
import type { StrapiResponse, StrapiEntity, StrapiMedia } from '@aazucena/types';

// Paginated API response
const response: StrapiResponse<Project[]> = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'My Project',
        slug: 'my-project',
        description: 'Project description',
      },
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 10,
    },
  },
};

// Media object
const media: StrapiMedia = {
  id: 1,
  name: 'image.jpg',
  url: 'https://cloudinary.com/.../image.jpg',
  formats: {
    thumbnail: { url: '...', width: 200, height: 200 },
    small: { url: '...', width: 500, height: 500 },
    medium: { url: '...', width: 750, height: 750 },
    large: { url: '...', width: 1000, height: 1000 },
  },
};
```

---

### ClickHouse Types (`api/clickhouse.ts`)

ClickHouse analytics database types.

```typescript
import type { ClickHouseEvent, TelemetryRow, AnalyticsQuery } from '@aazucena/types';

// Base event structure
const event: ClickHouseEvent = {
  event_id: 'evt_123',
  event_name: 'PageView',
  timestamp: Date.now(),
  user_id: 'user_456',
  metadata: { page: '/blog', duration: 250 },
};

// Telemetry table schema
const row: TelemetryRow = {
  id: 'tel_789',
  phase: 'midgame',
  token_count: 1250,
  latency: 850,
  cost_usd: 0.005,
  model: 'claude-sonnet-4.5',
  timestamp: Date.now(),
};

// Query builder
const query: AnalyticsQuery = {
  table: 'events',
  select: ['event_name', 'count() as total'],
  where: [{ field: 'timestamp', operator: '>', value: Date.now() - 86400000 }],
  groupBy: ['event_name'],
  orderBy: [{ field: 'total', direction: 'DESC' }],
  limit: 10,
};
```

---

### API Responses (`api/responses.ts`)

Generic API response wrappers.

```typescript
import type { ApiSuccess, ApiError, PaginationMeta } from '@aazucena/types';

// Successful response
const success: ApiSuccess<Project[]> = {
  success: true,
  data: [/* projects */],
  meta: {
    timestamp: Date.now(),
    requestId: 'req_123',
  },
};

// Error response
const error: ApiError = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    details: { resourceId: '123' },
  },
};

// Pagination metadata
const pagination: PaginationMeta = {
  page: 2,
  pageSize: 25,
  pageCount: 10,
  total: 250,
  hasNextPage: true,
  hasPreviousPage: true,
};
```

---

## 🧩 COMPONENT_PROPS

### Shared Component Props (`components/props.ts`)

```typescript
import type { ButtonProps, CardProps, ModalProps, FormFieldProps } from '@aazucena/types';

// Button props
const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  onClick: () => {},
  children: 'Click Me',
};

// Card props
const cardProps: CardProps = {
  title: 'Card Title',
  description: 'Card description',
  imageUrl: '/image.jpg',
  href: '/detail',
};

// Modal props
const modalProps: ModalProps = {
  isOpen: true,
  onClose: () => {},
  title: 'Modal Title',
  children: <div>Modal content</div>,
};

// Form field props
const fieldProps: FormFieldProps = {
  name: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  error: 'Invalid email',
};
```

---

## 📦 DATA_MODELS

### Content Types (`data/content.ts`)

Blog posts, projects, experiences, and more.

```typescript
import type { Post, Project, Experience, Testimonial, Award, Education, Skill, Page } from '@aazucena/types';

// Blog post
const post: Post = {
  id: 1,
  title: 'My Blog Post',
  slug: 'my-blog-post',
  excerpt: 'Brief description',
  content: '# Heading\n\nContent...',
  coverImage: '/images/post.jpg',
  publishedAt: new Date('2026-02-11'),
  tags: ['React', 'TypeScript'],
  author: {
    name: 'John Doe',
    avatar: '/avatars/john.jpg',
  },
};

// Portfolio project
const project: Project = {
  id: 1,
  title: 'My Project',
  slug: 'my-project',
  description: 'Project description',
  technologies: ['Next.js', 'Tailwind', 'PostgreSQL'],
  imageUrl: '/projects/project.jpg',
  githubUrl: 'https://github.com/user/repo',
  liveUrl: 'https://project.com',
  featured: true,
};

// Work experience
const experience: Experience = {
  id: 1,
  company: 'Tech Company',
  position: 'Senior Developer',
  period: '2020 - Present',
  description: 'Role description',
  responsibilities: ['Task 1', 'Task 2'],
  technologies: ['React', 'Node.js'],
  logo: '/logos/company.svg',
};

// Testimonial
const testimonial: Testimonial = {
  id: 1,
  quote: 'Great work!',
  author: 'Jane Smith',
  role: 'CEO, Company Inc',
  avatar: '/avatars/jane.jpg',
  rating: 5,
};

// Award
const award: Award = {
  id: 1,
  title: 'Best Developer',
  organization: 'Tech Awards',
  date: new Date('2025-12-15'),
  description: 'Award description',
  imageUrl: '/awards/award.jpg',
};

// Education
const education: Education = {
  id: 1,
  institution: 'University Name',
  degree: 'Bachelor of Science',
  field: 'Computer Science',
  period: '2016 - 2020',
  logo: '/logos/university.svg',
};

// Skill
const skill: Skill = {
  id: 1,
  name: 'React',
  level: 'expert',
  category: 'frontend',
  yearsOfExperience: 5,
};

// Static page
const page: Page = {
  id: 1,
  title: 'About',
  slug: 'about',
  content: '# About\n\nPage content...',
  template: 'editorial',
  lastUpdated: new Date('2026-02-01'),
};
```

---

### Agentic Types (`data/agentic.ts`)

AI telemetry and SHADES analysis.

```typescript
import type { AgenticPhase, TelemetryEvent, SHADESAnalysis } from '@aazucena/types';

// Agentic phase (MG = Midgame, EG = Endgame)
const phase: AgenticPhase = 'midgame'; // 'midgame' | 'endgame'

// Telemetry event
const telemetry: TelemetryEvent = {
  phase: 'midgame',
  tokenCount: 1250,
  latency: 850,
  costUsd: 0.005,
  timestamp: Date.now(),
  model: 'claude-sonnet-4.5',
  success: true,
};

// SHADES analysis (Sentiment, History, Alignment, Drive, Economics, Signal)
const shades: SHADESAnalysis = {
  sentiment: 0.75, // -1 to 1
  history: ['interaction_1', 'interaction_2'],
  alignment: 0.92, // 0 to 1
  drive: 'research', // 'research' | 'creative' | 'analytical' | 'social'
  economics: {
    costUsd: 0.15,
    tokenCount: 5000,
    efficiency: 0.88,
  },
  signal: 'high_confidence', // 'high_confidence' | 'medium_confidence' | 'low_confidence'
};
```

---

### AI Types (`data/ai.ts`)

AI/ML model configuration and RAG context.

```typescript
import type { ModelConfig, EmbeddingVector, RAGContext } from '@aazucena/types';

// AI model configuration
const modelConfig: ModelConfig = {
  provider: 'anthropic',
  model: 'claude-sonnet-4.5',
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.9,
};

// Embedding vector
const embedding: EmbeddingVector = {
  id: 'emb_123',
  vector: [0.1, 0.2, 0.3, /* ... 1536 dimensions */],
  metadata: {
    source: 'blog_post_123',
    text: 'Original text content',
    timestamp: Date.now(),
  },
};

// RAG context
const ragContext: RAGContext = {
  query: 'How do I implement authentication?',
  retrievedDocuments: [
    {
      id: 'doc_456',
      content: 'Authentication guide content...',
      score: 0.92,
      metadata: { title: 'Auth Guide', author: 'John' },
    },
  ],
  systemPrompt: 'You are a helpful assistant...',
  conversationHistory: [
    { role: 'user', content: 'Previous question' },
    { role: 'assistant', content: 'Previous answer' },
  ],
};
```

---

### Analytics Types (`data/analytics.ts`)

Web analytics and performance metrics.

```typescript
import type { SessionData, EventData, PerformanceMetrics } from '@aazucena/types';

// User session
const session: SessionData = {
  sessionId: 'ses_789',
  userId: 'user_123',
  startTime: Date.now(),
  endTime: null,
  pageViews: 5,
  events: 12,
  deviceInfo: {
    browser: 'Chrome',
    os: 'Windows',
    type: 'desktop',
  },
  geo: {
    country: 'US',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
  },
};

// Analytics event
const event: EventData = {
  eventId: 'evt_456',
  eventName: 'ButtonClick',
  timestamp: Date.now(),
  userId: 'user_123',
  sessionId: 'ses_789',
  properties: {
    buttonLabel: 'Submit',
    page: '/contact',
  },
};

// Performance metrics
const metrics: PerformanceMetrics = {
  fcp: 1200, // First Contentful Paint
  lcp: 2500, // Largest Contentful Paint
  fid: 50, // First Input Delay
  cls: 0.05, // Cumulative Layout Shift
  ttfb: 400, // Time to First Byte
};
```

---

### Journey Types (`data/journey.ts`)

Timeline and skill evolution data.

```typescript
import type { JourneyNode, SkillEvolution } from '@aazucena/types';

// Journey timeline node
const node: JourneyNode = {
  id: 'node_123',
  date: new Date('2020-06-15'),
  title: 'Started at Tech Company',
  description: 'Joined as Senior Developer',
  type: 'career', // 'career' | 'education' | 'achievement' | 'skill'
  metadata: {
    company: 'Tech Company',
    position: 'Senior Developer',
    technologies: ['React', 'Node.js'],
  },
};

// Skill evolution over time
const skillEvolution: SkillEvolution = {
  skillId: 'skill_456',
  skillName: 'React',
  dataPoints: [
    { date: new Date('2018-01-01'), level: 'beginner', projects: 1 },
    { date: new Date('2020-01-01'), level: 'intermediate', projects: 5 },
    { date: new Date('2023-01-01'), level: 'advanced', projects: 15 },
    { date: new Date('2026-01-01'), level: 'expert', projects: 30 },
  ],
};
```

---

### Navigation Types (`data/navigation.ts`)

Navigation items and breadcrumbs.

```typescript
import type { NavItem, Breadcrumb } from '@aazucena/types';

// Navigation item
const navItem: NavItem = {
  label: 'Blog',
  href: '/blog',
  icon: 'document',
  active: false,
  children: [
    { label: 'All Posts', href: '/blog', active: false },
    { label: 'Categories', href: '/blog/categories', active: false },
  ],
};

// Breadcrumb
const breadcrumb: Breadcrumb = {
  label: 'Blog Post',
  href: '/blog/my-post',
  active: true,
};
```

---

### Rich Text Types (`data/rich-text.ts`)

Strapi Blocks and Markdown content.

```typescript
import type { BlocksContent, MarkdownContent } from '@aazucena/types';

// Strapi Blocks format (JSON array)
const blocks: BlocksContent = [
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Paragraph content' }],
  },
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Heading 2' }],
  },
];

// Markdown content (raw string)
const markdown: MarkdownContent = '# Heading\n\nThis is **bold** text.';
```

---

### Preloader Types (`data/preloader.ts`)

Loading state machine types.

```typescript
import type { PreloaderState, ProgressData } from '@aazucena/types';

// Preloader state
const state: PreloaderState =
  | 'idle'
  | 'loading'
  | 'complete'
  | 'error'
  | 'interactive';

// Progress tracking
const progress: ProgressData = {
  current: 75,
  total: 100,
  percentage: 75,
  message: 'Loading assets...',
  step: 2,
  totalSteps: 3,
};
```

---

**AUTHOR:** aazucena_type_intelligence
