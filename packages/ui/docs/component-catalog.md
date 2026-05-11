# Component Catalog

## SUMMARY

Complete reference for all 93 production-ready components in the @aazucena/ui library, organized by category with usage examples and type signatures.

---

## 🎨 SHADCN_PRIMITIVES

Accessible UI components built on Radix UI primitives.

### Accordion

Collapsible content sections with keyboard navigation.

```typescript
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@aazucena/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>Section content here</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Props:** `type: 'single' | 'multiple'`, `collapsible: boolean`, `defaultValue: string`

---

### Alert

Status messages with semantic variants.

```typescript
import { Alert, AlertTitle, AlertDescription } from '@aazucena/ui';

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

**Variants:** `default`, `destructive`

---

### Avatar

User profile images with fallback initials.

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@aazucena/ui';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>AA</AvatarFallback>
</Avatar>
```

**Props:** `src: string`, `alt: string`, `fallback: string`

---

### Badge

Inline labels with variant styling.

```typescript
import { Badge } from '@aazucena/ui';

<Badge variant="secondary">New</Badge>
<Badge variant="outline">Beta</Badge>
```

**Variants:** `default`, `secondary`, `destructive`, `outline`

---

### Button

Primary interaction component with variants and sizes.

```typescript
import { Button } from '@aazucena/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes:** `sm`, `md`, `lg`, `icon`

---

### Card

Container component for grouped content.

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@aazucena/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

---

### Command

Command palette for keyboard-driven navigation.

```typescript
import { Command, CommandInput, CommandList, CommandItem } from '@aazucena/ui';

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem onSelect={() => navigate('/')}>Home</CommandItem>
    <CommandItem onSelect={() => navigate('/blog')}>Blog</CommandItem>
  </CommandList>
</Command>
```

---

### Dialog

Modal overlays with accessibility.

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@aazucena/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

---

### Form

Form component with react-hook-form integration.

```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@aazucena/ui';
import { useForm } from 'react-hook-form';

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

### HoverCard

Floating card on hover interactions.

```typescript
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@aazucena/ui';

<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>Additional context</HoverCardContent>
</HoverCard>
```

---

### Input

Text input field with variants.

```typescript
import { Input } from '@aazucena/ui';

<Input type="email" placeholder="you@example.com" />
```

**Types:** `text`, `email`, `password`, `number`, `tel`, `url`

---

### Label

Form label component.

```typescript
import { Label } from '@aazucena/ui';

<Label htmlFor="email">Email Address</Label>
<Input id="email" />
```

---

### Progress

Progress bar with percentage.

```typescript
import { Progress } from '@aazucena/ui';

<Progress value={60} max={100} />
```

---

### ScrollArea

Custom scrollbar container.

```typescript
import { ScrollArea } from '@aazucena/ui';

<ScrollArea className="h-96">
  <div>Long content...</div>
</ScrollArea>
```

---

### Separator

Visual divider line.

```typescript
import { Separator } from '@aazucena/ui';

<Separator orientation="horizontal" />
<Separator orientation="vertical" />
```

---

### Sheet

Side panel overlay (drawer).

```typescript
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@aazucena/ui';

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
    </SheetHeader>
    <div>Sheet content</div>
  </SheetContent>
</Sheet>
```

**Sides:** `left`, `right`, `top`, `bottom`

---

### Skeleton

Loading placeholder animation.

```typescript
import { Skeleton } from '@aazucena/ui';

<Skeleton className="h-12 w-full" />
```

---

### Tabs

Tabbed navigation panels.

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@aazucena/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Textarea

Multi-line text input.

```typescript
import { Textarea } from '@aazucena/ui';

<Textarea placeholder="Enter your message..." rows={4} />
```

---

### Tooltip

Contextual help on hover.

```typescript
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@aazucena/ui';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Helpful tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 🏗️ DOMAIN_COMPONENTS

Content-specific components for blog, projects, experiences, and testimonials.

### BlogCard

Blog post preview card.

```typescript
import { BlogCard } from '@aazucena/ui';

<BlogCard
  title="Post Title"
  excerpt="Brief description of the post..."
  date={new Date('2024-01-15')}
  tags={['React', 'TypeScript']}
  href="/blog/post-slug"
  imageUrl="/cover.jpg"
  author={{ name: 'John Doe', avatar: '/avatar.jpg' }}
/>
```

**Props:** `title`, `excerpt`, `date`, `tags`, `href`, `imageUrl?`, `author?`

---

### ProjectCard

Project showcase card.

```typescript
import { ProjectCard } from '@aazucena/ui';

<ProjectCard
  title="Project Name"
  description="Project description"
  technologies={['Next.js', 'Tailwind', 'PostgreSQL']}
  imageUrl="/project.jpg"
  githubUrl="https://github.com/user/repo"
  liveUrl="https://project.com"
  featured={true}
/>
```

**Props:** `title`, `description`, `technologies`, `imageUrl`, `githubUrl?`, `liveUrl?`, `featured?`

---

### ExperienceCard

Work experience timeline item.

```typescript
import { ExperienceCard } from '@aazucena/ui';

<ExperienceCard
  company="Company Name"
  position="Senior Developer"
  period="2020 - Present"
  description="Role description"
  technologies={['React', 'Node.js']}
  logo="/company-logo.svg"
/>
```

**Props:** `company`, `position`, `period`, `description`, `technologies`, `logo?`

---

### TestimonialCard

Client testimonial display.

```typescript
import { TestimonialCard } from '@aazucena/ui';

<TestimonialCard
  quote="Working with this team was fantastic!"
  author="Jane Smith"
  role="CEO, Company Inc"
  avatar="/jane.jpg"
  rating={5}
/>
```

**Props:** `quote`, `author`, `role`, `avatar?`, `rating?`

---

### EducationItem

Education timeline entry.

```typescript
import { EducationItem } from '@aazucena/ui';

<EducationItem
  institution="University Name"
  degree="Bachelor of Science"
  field="Computer Science"
  period="2016 - 2020"
  logo="/university-logo.svg"
/>
```

**Props:** `institution`, `degree`, `field`, `period`, `logo?`

---

### AwardModal

Award detail modal popup.

```typescript
import { AwardModal } from '@aazucena/ui';

<AwardModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Award Name"
  organization="Awarding Body"
  date={new Date('2023-06-15')}
  description="Award description and significance"
  imageUrl="/award-certificate.jpg"
/>
```

**Props:** `isOpen`, `onClose`, `title`, `organization`, `date`, `description`, `imageUrl?`

---

## 🧭 NAVIGATION_SUITE

Navigation components for app-wide and page-level navigation.

### Navbar

Primary site navigation header.

```typescript
import { Navbar } from '@aazucena/ui';

<Navbar
  logo="/logo.svg"
  links={[
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
  ]}
  currentPath="/blog"
/>
```

**Props:** `logo`, `links`, `currentPath`

---

### CommandPalette

Keyboard-driven command interface (Cmd+K).

```typescript
import { CommandPalette } from '@aazucena/ui';

<CommandPalette
  commands={[
    { id: 'home', label: 'Go Home', action: () => navigate('/') },
    { id: 'search', label: 'Search', action: () => openSearch() },
  ]}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**Props:** `commands`, `isOpen`, `onClose`

---

### Breadcrumbs

Hierarchical navigation trail.

```typescript
import { Breadcrumbs } from '@aazucena/ui';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Post Title', href: '/blog/post-slug' },
  ]}
/>
```

**Props:** `items: Array<{ label: string, href: string }>`

---

### TableOfContents

Page outline navigation.

```typescript
import { TableOfContents } from '@aazucena/ui';

<TableOfContents
  headings={[
    { id: 'intro', text: 'Introduction', level: 2 },
    { id: 'usage', text: 'Usage', level: 2 },
    { id: 'advanced', text: 'Advanced', level: 3 },
  ]}
/>
```

**Props:** `headings: Array<{ id: string, text: string, level: number }>`

---

### Sidebar

Collapsible side navigation panel.

```typescript
import { Sidebar } from '@aazucena/ui';

<Sidebar
  sections={[
    {
      title: 'Getting Started',
      items: [
        { label: 'Installation', href: '/docs/installation' },
        { label: 'Quick Start', href: '/docs/quick-start' },
      ],
    },
  ]}
  currentPath="/docs/installation"
/>
```

**Props:** `sections`, `currentPath`

---

### BackToTop

Scroll-to-top button.

```typescript
import { BackToTop } from '@aazucena/ui';

<BackToTop threshold={300} />
```

**Props:** `threshold?: number` (scroll distance before showing)

---

### ReadingProgress

Reading progress bar.

```typescript
import { ReadingProgress } from '@aazucena/ui';

<ReadingProgress />
```

---

### ScrollDownIndicator

Animated scroll hint.

```typescript
import { ScrollDownIndicator } from '@aazucena/ui';

<ScrollDownIndicator />
```

---

### ScrollIndicators

Composite scroll UI (progress + down indicator).

```typescript
import { ScrollIndicators } from '@aazucena/ui';

<ScrollIndicators showProgress showDownIndicator />
```

**Props:** `showProgress?: boolean`, `showDownIndicator?: boolean`

---

### DetailNavigation

Previous/Next navigation for detail pages.

```typescript
import { DetailNavigation } from '@aazucena/ui';

<DetailNavigation
  prev={{ label: 'Previous Post', href: '/blog/prev-post' }}
  next={{ label: 'Next Post', href: '/blog/next-post' }}
/>
```

**Props:** `prev?`, `next?`

---

## 🎬 ANIMATION_COMPONENTS

Loading states, transitions, and motion components.

### Preloader

Multi-step loading system with theme support.

```typescript
import { Preloader } from '@aazucena/ui';

<Preloader
  steps={[
    { id: 1, name: 'Loading assets', progress: 100 },
    { id: 2, name: 'Initializing', progress: 50 },
  ]}
  onComplete={() => setLoading(false)}
  theme="cyber"
/>
```

**Themes:** `cyber`, `minimal`, `elegant`

---

### SimplePreloader

Minimal loading indicator.

```typescript
import { SimplePreloader } from '@aazucena/ui';

<SimplePreloader progress={75} message="Loading..." />
```

**Props:** `progress: number`, `message?: string`

---

### InteractivePreloader

Preloader with user interaction required.

```typescript
import { InteractivePreloader } from '@aazucena/ui';

<InteractivePreloader
  isComplete={true}
  canProceed={true}
  onProceed={handleProceed}
  message="Click to continue"
/>
```

**Props:** `isComplete`, `canProceed`, `onProceed`, `message?`

---

### InfiniteMovingCards

Continuous scrolling card carousel.

```typescript
import { InfiniteMovingCards } from '@aazucena/ui';

<InfiniteMovingCards
  items={testimonials}
  direction="left"
  speed="slow"
/>
```

**Direction:** `left`, `right`
**Speed:** `slow`, `normal`, `fast`

---

### FlipWordsTagline

Animated word rotation effect.

```typescript
import { FlipWordsTagline } from '@aazucena/ui';

<FlipWordsTagline words={['Developer', 'Designer', 'Creator']} />
```

**Props:** `words: string[]`, `duration?: number`

---

### PhoneDialTabs

Phone-style dial tab navigation.

```typescript
import { PhoneDialTabs } from '@aazucena/ui';

<PhoneDialTabs
  tabs={[
    { id: 'home', label: 'Home', content: <div>Home</div> },
    { id: 'about', label: 'About', content: <div>About</div> },
  ]}
/>
```

**Props:** `tabs: Array<{ id: string, label: string, content: ReactNode }>`

---

### Timeline

Vertical timeline component.

```typescript
import { Timeline } from '@aazucena/ui';

<Timeline
  items={[
    { date: '2024', title: 'Event 1', description: 'Description' },
    { date: '2023', title: 'Event 2', description: 'Description' },
  ]}
/>
```

**Props:** `items: Array<{ date: string, title: string, description: string }>`

---

## 📊 TELEMETRY_COMPONENTS

System status and analytics visualizations.

### IntegrityBadge

Real-time system health indicator.

```typescript
import { IntegrityBadge } from '@aazucena/ui';

<IntegrityBadge status="OPERATIONAL" lastCheck={new Date()} />
```

**Status:** `OPERATIONAL`, `DEGRADED`, `UNKNOWN`, `LOADING`

---

### MetricCard

KPI display card.

```typescript
import { MetricCard } from '@aazucena/ui';

<MetricCard
  title="API Latency"
  value="45ms"
  trend="+5%"
  status="healthy"
/>
```

**Status:** `healthy`, `warning`, `critical`

---

### LogDetailModal

Telemetry log detail view.

```typescript
import { LogDetailModal } from '@aazucena/ui';

<LogDetailModal
  log={{
    event: 'PageView',
    timestamp: new Date(),
    metadata: { path: '/blog', duration: 250 },
  }}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**Props:** `log`, `isOpen`, `onClose`

---

### LogDetailsCard

Log entry summary card.

```typescript
import { LogDetailsCard } from '@aazucena/ui';

<LogDetailsCard
  log={{
    event: 'API_REQUEST',
    level: 'info',
    timestamp: new Date(),
  }}
/>
```

**Props:** `log: { event: string, level: string, timestamp: Date }`

---

### TelemetryFeed

Real-time log stream viewer.

```typescript
import { TelemetryFeed } from '@aazucena/ui';

<TelemetryFeed
  logs={logs}
  onLogClick={handleLogClick}
  filters={{ level: 'error' }}
/>
```

**Props:** `logs`, `onLogClick`, `filters?`

---

### SentinelWatchdog

Automated health monitoring indicator.

```typescript
import { SentinelWatchdog } from '@aazucena/ui';

<SentinelWatchdog
  status="monitoring"
  lastAlert={new Date()}
  alertCount={3}
/>
```

**Status:** `monitoring`, `alerting`, `offline`

---

## 🎨 MISC_COMPONENTS

Utility and decorative components.

### GradientAccent

Decorative gradient overlay.

```typescript
import { GradientAccent } from '@aazucena/ui';

<GradientAccent variant="radial" intensity="high" />
```

**Variants:** `radial`, `linear`, `conic`
**Intensity:** `low`, `medium`, `high`

---

### WatermarkBackground

Branded watermark pattern.

```typescript
import { WatermarkBackground } from '@aazucena/ui';

<WatermarkBackground opacity={0.05} />
```

**Props:** `opacity?: number`

---

### Logo

Site logo component.

```typescript
import { Logo } from '@aazucena/ui';

<Logo size="md" variant="full" />
```

**Sizes:** `sm`, `md`, `lg`
**Variants:** `full`, `icon`, `text`

---

### ResponsiveGrid

Auto-responsive grid layout.

```typescript
import { ResponsiveGrid } from '@aazucena/ui';

<ResponsiveGrid minWidth="300px" gap="1rem">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

**Props:** `minWidth: string`, `gap?: string`

---

### StatusBadge

Status indicator badge.

```typescript
import { StatusBadge } from '@aazucena/ui';

<StatusBadge status="available" label="Available for work" />
```

**Status:** `available`, `busy`, `offline`, `away`

---

### ThemeToggle

Dark/light mode toggle button.

```typescript
import { ThemeToggle } from '@aazucena/ui';

<ThemeToggle />
```

---

### InteractiveCard

Hover-reactive card with effects.

```typescript
import { InteractiveCard } from '@aazucena/ui';

<InteractiveCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</InteractiveCard>
```

---

### GlassCard

Glassmorphism-styled card.

```typescript
import { GlassCard } from '@aazucena/ui';

<GlassCard blur="md">
  <div>Glass card content</div>
</GlassCard>
```

**Blur:** `sm`, `md`, `lg`

---

### Panel

Generic panel container.

```typescript
import { Panel } from '@aazucena/ui';

<Panel title="Panel Title" collapsible>
  <div>Panel content</div>
</Panel>
```

**Props:** `title`, `collapsible?`, `defaultOpen?`

---

### Popover

Floating popover container.

```typescript
import { Popover } from '@aazucena/ui';

<Popover trigger={<Button>Open</Button>}>
  <div>Popover content</div>
</Popover>
```

**Props:** `trigger: ReactNode`, `children: ReactNode`

---

### RelatedLinks

Related content link grid.

```typescript
import { RelatedLinks } from '@aazucena/ui';

<RelatedLinks
  links={[
    { title: 'Related Post 1', href: '/blog/post-1' },
    { title: 'Related Post 2', href: '/blog/post-2' },
  ]}
/>
```

**Props:** `links: Array<{ title: string, href: string, description?: string }>`

---

### SkillBadgeList

Tag list for skills/technologies.

```typescript
import { SkillBadgeList } from '@aazucena/ui';

<SkillBadgeList skills={['React', 'TypeScript', 'Node.js']} />
```

**Props:** `skills: string[]`, `variant?: 'default' | 'outlined'`

---

### TechStackDistribution

Technology usage visualization.

```typescript
import { TechStackDistribution } from '@aazucena/ui';

<TechStackDistribution
  stack={[
    { name: 'React', percentage: 40 },
    { name: 'TypeScript', percentage: 30 },
    { name: 'Node.js', percentage: 30 },
  ]}
/>
```

**Props:** `stack: Array<{ name: string, percentage: number }>`

---

## 🔧 UTILITY_COMPONENTS

Functional components for rendering and data display.

### BlockRenderers

Strapi blocks renderer.

```typescript
import { BlockRenderers } from '@aazucena/ui';

<BlockRenderers blocks={strapiBlocks} />
```

**Props:** `blocks: StrapiBlock[]`

---

### MarkdownRenderer

Markdown to JSX renderer.

```typescript
import { MarkdownRenderer } from '@aazucena/ui';

<MarkdownRenderer content="# Heading\n\nParagraph text" />
```

**Props:** `content: string`

---

### SimpleRichTextRenderer

Simple rich text renderer.

```typescript
import { SimpleRichTextRenderer } from '@aazucena/ui';

<SimpleRichTextRenderer content={richTextContent} />
```

**Props:** `content: RichTextContent`

---

### IconRenderer

Dynamic icon renderer.

```typescript
import { IconRenderer } from '@aazucena/ui';

<IconRenderer icon="home" size={24} color="currentColor" />
```

**Props:** `icon: string`, `size?: number`, `color?: string`

---

## 📦 COMPONENT_PANELS

Composite panel components for settings and info displays.

### SettingsPanel

Application settings panel.

```typescript
import { SettingsPanel } from '@aazucena/ui';

<SettingsPanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  settings={settingsConfig}
/>
```

**Props:** `isOpen`, `onClose`, `settings`

---

### InfoPanel

Information display panel.

```typescript
import { InfoPanel } from '@aazucena/ui';

<InfoPanel title="Information" content={infoData} />
```

**Props:** `title`, `content`

---

## 🌐 SOCIAL_COMPONENTS

Social media integration components.

### SocialMenu

Social media link menu.

```typescript
import { SocialMenu } from '@aazucena/ui';

<SocialMenu
  links={[
    { platform: 'github', url: 'https://github.com/user' },
    { platform: 'twitter', url: 'https://twitter.com/user' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/user' },
  ]}
/>
```

**Props:** `links: Array<{ platform: string, url: string }>`

---

## 🎯 ABOUT_COMPONENTS

About page specific components.

### AskMeAbout

Interests/expertise display.

```typescript
import { AskMeAbout } from '@aazucena/ui';

<AskMeAbout topics={['React', 'System Design', 'Music Production']} />
```

**Props:** `topics: string[]`

---

### HighlightsPanel

Key highlights panel.

```typescript
import { HighlightsPanel } from '@aazucena/ui';

<HighlightsPanel
  highlights={[
    { title: '10+ Years', description: 'Experience' },
    { title: '100+ Projects', description: 'Completed' },
  ]}
/>
```

**Props:** `highlights: Array<{ title: string, description: string }>`

---

### StatCard

Statistics display card.

```typescript
import { StatCard } from '@aazucena/ui';

<StatCard value="150+" label="Projects Completed" icon="briefcase" />
```

**Props:** `value: string`, `label: string`, `icon?: string`

---

### WorkingStyleSection

Working style visualization.

```typescript
import { WorkingStyleSection } from '@aazucena/ui';

<WorkingStyleSection
  styles={[
    { title: 'Agile', description: 'Sprint-based development' },
    { title: 'Test-Driven', description: 'Comprehensive testing' },
  ]}
/>
```

**Props:** `styles: Array<{ title: string, description: string }>`

---

### LearnMoreCard

Call-to-action card.

```typescript
import { LearnMoreCard } from '@aazucena/ui';

<LearnMoreCard
  title="Want to work together?"
  description="Let's discuss your project"
  ctaLabel="Get in touch"
  ctaHref="/contact"
/>
```

**Props:** `title`, `description`, `ctaLabel`, `ctaHref`

---

## 🏆 AWARDS_COMPONENTS

Awards and achievements components.

### HexagonCard

Hexagonal award card.

```typescript
import { HexagonCard } from '@aazucena/ui';

<HexagonCard
  title="Award Name"
  year="2023"
  imageUrl="/award.jpg"
  onClick={handleClick}
/>
```

**Props:** `title`, `year`, `imageUrl`, `onClick?`

---

### SectionLabel

Decorative section label.

```typescript
import { SectionLabel } from '@aazucena/ui';

<SectionLabel text="Awards & Recognition" />
```

**Props:** `text: string`

---

## 📐 PROJECT_COMPONENTS

Project showcase components.

### ViewMoreCard

View more projects card.

```typescript
import { ViewMoreCard } from '@aazucena/ui';

<ViewMoreCard href="/projects" count={15} />
```

**Props:** `href: string`, `count?: number`

---

### PageIndicators

Pagination dots indicator.

```typescript
import { PageIndicators } from '@aazucena/ui';

<PageIndicators
  total={5}
  current={2}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

**Props:** `total: number`, `current: number`, `onPageChange: (page: number) => void`

---

## 🔨 TOOLBAR_COMPONENTS

Toolbar and action buttons.

### Toolbar

Floating action toolbar.

```typescript
import { Toolbar } from '@aazucena/ui';

<Toolbar
  actions={[
    { id: 'share', icon: 'share', onClick: handleShare },
    { id: 'bookmark', icon: 'bookmark', onClick: handleBookmark },
  ]}
/>
```

**Props:** `actions: Array<{ id: string, icon: string, onClick: () => void }>`

---

### ToolbarButton

Individual toolbar button.

```typescript
import { ToolbarButton } from '@aazucena/ui';

<ToolbarButton icon="settings" onClick={handleClick} />
```

**Props:** `icon: string`, `onClick: () => void`, `active?: boolean`

---

## 🔍 EXPERIENCE_COMPONENTS

Work experience display components.

### ExperienceActions

Action buttons for experience items.

```typescript
import { ExperienceActions } from '@aazucena/ui';

<ExperienceActions
  onViewDetails={handleViewDetails}
  onShare={handleShare}
/>
```

**Props:** `onViewDetails: () => void`, `onShare?: () => void`

---

### ExperienceModal

Detailed experience modal.

```typescript
import { ExperienceModal } from '@aazucena/ui';

<ExperienceModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  experience={experienceData}
/>
```

**Props:** `isOpen`, `onClose`, `experience`

---

### CompanyLogo

Company logo display.

```typescript
import { CompanyLogo } from '@aazucena/ui';

<CompanyLogo src="/company-logo.svg" alt="Company Name" size="md" />
```

**Props:** `src: string`, `alt: string`, `size?: 'sm' | 'md' | 'lg'`

---

**AUTHOR:** aazucena_component_intelligence
