# 🎨 @aazucena/icons

**MONOREPO_PACKAGE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Unified icon system combining **@mynaui/icons-react** (800+ icons) with **24 custom brand & tech stack icons** for the AAZUCENA portfolio monorepo.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 OVERVIEW](#-overview)
- [⚡ QUICK_START](#-quick_start)
- [📦 INSTALLATION](#-installation)
- [🏗️ ARCHITECTURE](#️-architecture)
- [🎨 ICON_CATEGORIES](#-icon_categories)
- [🔧 API_REFERENCE](#-api_reference)
- [🎯 USAGE_PATTERNS](#-usage_patterns)
- [🌐 STRAPI_INTEGRATION](#-strapi_integration)
- [📚 RELATED_DOCUMENTATION](#-related_documentation)

---

## 🎯 OVERVIEW

### Purpose

The **@aazucena/icons** package provides a **type-safe, performant icon system** for all applications in the monorepo:

- ✅ **800+ System Icons** from @mynaui/icons-react
- ✅ **24 Custom Icons** (brand, social, tech stack)
- ✅ **Type-Safe Registry** with component mapping
- ✅ **Strapi CMS Integration** (SVG string support)
- ✅ **Navigation Icons** (special subset for menus)
- ✅ **Consistent API** across all icon sources
- ✅ **Tree-Shakeable** (only imports used icons)

### Key Features

| Feature              | Description                             | Status      |
| -------------------- | --------------------------------------- | ----------- |
| **Base Library**     | @mynaui/icons-react v0.3.9              | ✅ Active   |
| **Custom Icons**     | 24 brand-specific SVG components        | ✅ Complete |
| **Registry System**  | Type-safe icon name → component mapping | ✅ Active   |
| **Strapi Support**   | Direct SVG string rendering             | ✅ Active   |
| **Navigation Icons** | Dedicated subset for menu items         | ✅ Active   |
| **TypeScript**       | Full type definitions with IntelliSense | ✅ Active   |

### Package Info

```json
{
  "name": "@aazucena/icons",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts"
    }
  },
  "dependencies": {
    "@mynaui/icons-react": "^0.3.9",
    "@aazucena/types": "workspace:*"
  }
}
```

---

## ⚡ QUICK_START

### Basic Usage

```typescript
import { Code, Terminal, Database } from '@aazucena/icons';

function MyComponent() {
  return (
    <div>
      <Code size={24} className="text-primary" />
      <Terminal size={32} color="#FF5D01" />
      <Database size={20} stroke={2} />
    </div>
  );
}
```

### Custom Icons

```typescript
import { AstroIcon, ReactIcon, GitHubIcon } from '@aazucena/icons';

function TechStack() {
  return (
    <div className="flex gap-4">
      <AstroIcon size={48} className="text-orange-500" />
      <ReactIcon size={48} className="text-blue-400" />
      <GitHubIcon size={48} className="text-gray-800 dark:text-white" />
    </div>
  );
}
```

### Dynamic Icon Loading (Registry)

```typescript
import { getIconComponent } from '@aazucena/icons';
import DOMPurify from 'dompurify'; // IMPORTANT: Sanitize SVG strings

function DynamicIcon({ iconName }: { iconName: string }) {
  const Icon = getIconComponent(iconName);

  // If iconName is SVG string from Strapi, Icon will be the raw SVG
  if (typeof Icon === 'string') {
    // SECURITY: Always sanitize SVG strings from external sources
    const sanitized = DOMPurify.sanitize(Icon, {
      USE_PROFILES: { svg: true, svgFilters: true }
    });
    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
  }

  // Otherwise, it's a React component
  return <Icon size={24} className="text-current" />;
}

// Usage
<DynamicIcon iconName="Code" />
<DynamicIcon iconName="Astro" />
```

### Navigation Icons

```typescript
import { getNavigationIcon } from '@aazucena/icons';

function NavItem({ iconName, label }: { iconName: string; label: string }) {
  const Icon = getNavigationIcon(iconName);

  return (
    <a href="#" className="flex items-center gap-2">
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </a>
  );
}

// Usage
<NavItem iconName="briefcase" label="Projects" />
<NavItem iconName="clock-circle" label="Experience" />
<NavItem iconName="user" label="About" />
```

---

## 📦 INSTALLATION

### From Workspace (Monorepo)

```bash
# In your app's package.json
{
  "dependencies": {
    "@aazucena/icons": "workspace:*"
  }
}
```

```bash
pnpm install
```

### Standalone Installation (External)

```bash
pnpm add @aazucena/icons
# or
npm install @aazucena/icons
# or
yarn add @aazucena/icons
```

**Note:** Requires React 18+ and TypeScript 5+.

---

## 🏗️ ARCHITECTURE

### Directory Structure

```
packages/icons/
├── src/
│   ├── index.ts                 # Main entry point (exports all)
│   ├── registry.ts              # Icon mapping registry
│   ├── types.ts                 # TypeScript definitions
│   └── custom/                  # Custom SVG components
│       ├── index.ts             # Custom icons barrel export
│       ├── AstroIcon.tsx        # Astro framework logo
│       ├── ReactIcon.tsx        # React library logo
│       ├── TailwindIcon.tsx     # Tailwind CSS logo
│       ├── ViteIcon.tsx         # Vite build tool logo
│       ├── RssIcon.tsx          # RSS feed icon
│       ├── BrandIcon.tsx        # AAZUCENA brand logo
│       ├── ScrollDownIcon.tsx   # Scroll indicator
│       ├── EmptyIcon.tsx        # Empty state placeholder
│       ├── GitHubIcon.tsx       # GitHub social logo
│       ├── LinkedInIcon.tsx     # LinkedIn social logo
│       ├── TwitterIcon.tsx      # X/Twitter social logo
│       ├── YoutubeIcon.tsx      # YouTube social logo
│       ├── InstagramIcon.tsx    # Instagram social logo
│       ├── FacebookIcon.tsx     # Facebook social logo
│       ├── TiktokIcon.tsx       # TikTok social logo
│       ├── DiscordIcon.tsx      # Discord social logo
│       ├── TwitchIcon.tsx       # Twitch social logo
│       ├── MastodonIcon.tsx     # Mastodon social logo
│       ├── EmailIcon.tsx        # Email communication icon
│       ├── DownloadIcon.tsx     # Download action icon
│       ├── ImageIcon.tsx        # Image file type icon
│       ├── VectorIcon.tsx       # Vector file type icon
│       ├── AwardBadgeIcon.tsx   # Award/achievement badge
│       └── ViewportsIcon.tsx    # Viewports/responsive icon
├── docs/
│   ├── README.md                # This file
│   ├── icon-catalog.md          # Complete icon reference
│   └── custom-icons-guide.md    # Custom icon creation guide
├── package.json
└── tsconfig.json
```

### Component Architecture

```
┌──────────────────────────────────────────┐
│         @aazucena/icons Package          │
└──────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────┐    ┌──────────▼──────────┐
│ @mynaui/icons │    │   Custom Icons      │
│   (800+)      │    │   (24 components)   │
└───────┬───────┘    └──────────┬──────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   Icon Registry       │
        │  (getIconComponent)   │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   React Components    │
        │  (Portfolio, CMS)     │
        └───────────────────────┘
```

### Data Flow

```
1. Icon Request
   ↓
2. Registry Lookup (registry.ts)
   ↓
3. Component Resolution
   ├─ Custom Icon? → Return custom component
   ├─ @mynaui Icon? → Return library component
   ├─ SVG String? → Return raw SVG
   └─ Not Found? → Return fallback (Code icon)
   ↓
4. Render with Props (size, color, className, stroke)
```

---

## 🎨 ICON_CATEGORIES

### Custom Icons (24 Total)

#### Tech Stack (4)

- `AstroIcon` - Astro framework logo
- `ReactIcon` - React library logo
- `TailwindIcon` - Tailwind CSS logo
- `ViteIcon` - Vite build tool logo

#### Social Media (10)

- `GitHubIcon` - GitHub
- `LinkedInIcon` - LinkedIn
- `TwitterIcon` - X/Twitter
- `YoutubeIcon` - YouTube
- `InstagramIcon` - Instagram
- `FacebookIcon` - Facebook
- `TiktokIcon` - TikTok
- `DiscordIcon` - Discord
- `TwitchIcon` - Twitch
- `MastodonIcon` - Mastodon

#### Brand & UI (10)

- `BrandIcon` - AAZUCENA brand logo
- `RssIcon` - RSS feed
- `EmailIcon` - Email communication
- `ScrollDownIcon` - Scroll indicator
- `EmptyIcon` - Empty state placeholder
- `DownloadIcon` - Download action
- `ImageIcon` - Image file type
- `VectorIcon` - Vector file type
- `AwardBadgeIcon` - Award/achievement badge
- `ViewportsIcon` - Viewports/responsive design

### @mynaui Icons (800+)

Full catalog available in [`icon-catalog.md`](./icon-catalog.md).

**Popular Categories:**

- **Communication** (50+) - Chat, email, phone, notifications
- **Development** (80+) - Code, terminal, git, database
- **UI/UX** (100+) - Layout, navigation, forms, buttons
- **Media** (60+) - Image, video, audio, camera
- **Business** (70+) - Charts, finance, documents, briefcase
- **Social** (40+) - Share, like, comment, profile
- **System** (90+) - Settings, notifications, alerts, power
- **Files** (50+) - Folder, document, archive, cloud
- **Arrows** (60+) - Directional, navigation, flow
- **Shapes** (40+) - Circle, square, triangle, polygon

### Navigation Icons (10)

Special subset for menu/navigation items:

```typescript
{
  briefcase: Briefcase,      // Projects
  'clock-circle': ClockCircle, // Experience
  code: Code,                 // Skills
  'file-text': FileText,      // Blog
  user: User,                 // About
  shield: Shield,             // Security
  rss: Rss,                   // Feed
  map: Map,                   // Journey
  'git-branch': GitBranch,    // Version Control
  send: Send,                 // Contact
}
```

---

## 🔧 API_REFERENCE

### Core Functions

#### `getIconComponent(iconName)`

Maps icon name string to React component or SVG string.

**Type Signature:**

```typescript
function getIconComponent(iconName: string | null | undefined): IconComponent;

type IconComponent = React.ComponentType<MynaIconsProps> | string; // SVG string from Strapi
```

**Parameters:**

- `iconName` (string | null | undefined) - Icon name or SVG string

**Returns:**

- React component with `MynaIconsProps` interface
- SVG string if input starts with `<svg`
- Fallback `Code` icon if not found or null/undefined

**Examples:**

```typescript
// Custom icon
const Icon1 = getIconComponent('Astro'); // AstroIcon component

// @mynaui icon
const Icon2 = getIconComponent('Terminal'); // Terminal component

// SVG string (from Strapi CMS)
const Icon3 = getIconComponent('<svg>...</svg>'); // Raw SVG string

// Null/undefined
const Icon4 = getIconComponent(null); // Code icon (fallback)

// Not found
const Icon5 = getIconComponent('NonExistent'); // Code icon (fallback)
```

---

#### `isValidIconName(iconName)`

Checks if an icon name exists in the registry.

**Type Signature:**

```typescript
function isValidIconName(iconName: string): boolean;
```

**Parameters:**

- `iconName` (string) - Icon name to validate

**Returns:**

- `true` if icon exists in custom icons, @mynaui library, or is SVG string
- `false` otherwise

**Examples:**

```typescript
isValidIconName('Code'); // true (@mynaui icon)
isValidIconName('Astro'); // true (custom icon)
isValidIconName('<svg>...</svg>'); // true (SVG string)
isValidIconName('NonExistent'); // false
```

---

#### `getNavigationIcon(iconName)`

Gets navigation-specific icon component by kebab-case name.

**Type Signature:**

```typescript
function getNavigationIcon(iconName?: string): React.ElementType | null;
```

**Parameters:**

- `iconName` (string | undefined) - Navigation icon name (kebab-case)

**Returns:**

- React component if found
- `null` if not found or undefined

**Examples:**

```typescript
const Icon1 = getNavigationIcon('briefcase'); // Briefcase component
const Icon2 = getNavigationIcon('clock-circle'); // ClockCircle component
const Icon3 = getNavigationIcon('non-existent'); // null
const Icon4 = getNavigationIcon(undefined); // null
```

---

### Type Definitions

#### `MynaIconsProps`

Base props interface for all icons (extends SVG props).

```typescript
interface MynaIconsProps extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number | string; // Icon size (px or string like "2rem")
  stroke?: number | string; // Stroke width (1-4 typical)
  color?: string; // Icon color (CSS color value)
  className?: string; // Tailwind/CSS classes
}
```

**Common Props:**

```typescript
// Size
<Icon size={24} />           // 24px (default)
<Icon size={32} />           // 32px
<Icon size="2rem" />         // 2rem

// Color
<Icon color="#FF5D01" />     // Hex
<Icon color="rgb(255, 93, 1)" /> // RGB
<Icon className="text-primary" /> // Tailwind (recommended)

// Stroke
<Icon stroke={1} />          // Thin lines
<Icon stroke={2} />          // Medium lines (default)
<Icon stroke={3} />          // Thick lines

// Styling
<Icon className="text-blue-500 hover:text-blue-600" />
<Icon className="w-6 h-6" /> // Tailwind size utilities
```

---

## 🎯 USAGE_PATTERNS

### Pattern 1: Static Icon Imports

**Use Case:** Known icon at compile time

```typescript
import { Code, Terminal, Database } from '@aazucena/icons';

function Sidebar() {
  return (
    <nav>
      <a href="/projects">
        <Code size={20} className="text-primary" />
        Projects
      </a>
      <a href="/terminal">
        <Terminal size={20} className="text-secondary" />
        Terminal
      </a>
      <a href="/data">
        <Database size={20} className="text-accent" />
        Data
      </a>
    </nav>
  );
}
```

**Pros:**

- ✅ Tree-shakeable (only imports used icons)
- ✅ Type-safe at compile time
- ✅ Best performance (no registry lookup)

**Cons:**

- ❌ Icon must be known at build time

---

### Pattern 2: Dynamic Icon Registry

**Use Case:** Icon name from CMS or user input

```typescript
import { getIconComponent } from '@aazucena/icons';
import DOMPurify from 'dompurify';

interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
}

function FeatureCard({ iconName, title, description }: FeatureCardProps) {
  const Icon = getIconComponent(iconName);

  // Handle SVG strings from Strapi
  if (typeof Icon === 'string') {
    // SECURITY: Always sanitize SVG strings from external sources
    const sanitized = DOMPurify.sanitize(Icon, {
      USE_PROFILES: { svg: true, svgFilters: true }
    });

    return (
      <div className="feature-card">
        <div
          className="icon-wrapper"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  }

  // Handle React component icons
  return (
    <div className="feature-card">
      <div className="icon-wrapper">
        <Icon size={48} className="text-primary" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

**Pros:**

- ✅ Works with dynamic icon names
- ✅ Supports Strapi SVG strings
- ✅ Automatic fallback to Code icon

**Cons:**

- ❌ All icons included in bundle
- ❌ Runtime lookup overhead

---

## 🌐 STRAPI_INTEGRATION

### Security Considerations

**⚠️ CRITICAL:** When rendering SVG strings from Strapi, you MUST sanitize them to prevent XSS attacks.

**Mitigation Strategies:**

1. **Validate SVG Content with DOMPurify** (REQUIRED)

```typescript
import DOMPurify from 'dompurify';

function SafeSvgRenderer({ svg }: { svg: string }) {
  const sanitized = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true }
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

2. **Restrict Strapi Admin Access**
   - Only trusted users should upload custom SVGs
   - Use Strapi's role-based access control (RBAC)

3. **Content Security Policy (CSP)**

```html
<!-- apps/portfolio/src/layouts/Layout.astro -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
/>
```

---

## 📚 RELATED_DOCUMENTATION

### Package Documentation

- [📖 Icon Catalog](./docs/icon-catalog.md) - Complete icon reference (800+ icons)
- [🎨 Custom Icons Guide](./docs/custom-icons-guide.md) - Creating custom icons

### Related Packages

- [@aazucena/types](../types/README.md) - TypeScript type definitions
- [@aazucena/ui](../ui/README.md) - UI component library
- [@aazucena/design-system](../design-system/README.md) - Design tokens

### External Resources

- [@mynaui/icons-react Documentation](https://icons.mynaui.com/)
- [Strapi Icons Field Plugin](https://github.com/ChristopheCVB/strapi-plugin-icons-field)
- [SVG Optimization](https://jakearchibald.github.io/svgomg/)
- [DOMPurify Security](https://github.com/cure53/DOMPurify)

---

## 📝 NOTES

### Performance Considerations

1. **Tree-Shaking:**
   - ✅ Static imports are tree-shakeable
   - ❌ Registry imports include all icons
   - 💡 Use static imports when icon names are known at build time

2. **Bundle Size:**
   - Base library (@mynaui): ~150KB (all icons)
   - Custom icons: ~8KB (24 icons)
   - Registry overhead: ~2KB

3. **Optimization Tips:**
   - Use static imports for known icons
   - Lazy load icon-heavy components
   - Compress SVG paths (already optimized in custom icons)

### Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ React 18+
- ✅ TypeScript 5+

### Accessibility

- ✅ All icons support `aria-label` via SVG props
- ✅ Use semantic HTML with icon+text combinations
- ✅ Avoid icon-only buttons without labels

```typescript
// ❌ Bad (no label)
<button><Icon /></button>

// ✅ Good (with label)
<button aria-label="Settings"><Icon /></button>

// ✅ Better (visible text)
<button>
  <Icon />
  <span>Settings</span>
</button>
```

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,000

**INTELLIGENCE_THEME** • **ALL_SYSTEMS_OPERATIONAL** 🚀
