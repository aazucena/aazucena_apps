# Navigation Patterns

## SUMMARY

Comprehensive guide to implementing navigation systems using @aazucena/ui components, including command palettes, breadcrumbs, table of contents, and responsive navigation patterns.

---

## ⌨️ COMMAND_PALETTE

### Basic Implementation (Cmd+K)

```typescript
import { CommandPalette } from '@aazucena/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const commands = [
    {
      id: 'home',
      label: 'Go Home',
      shortcut: ['⌘', 'H'],
      action: () => router.push('/'),
    },
    {
      id: 'blog',
      label: 'View Blog',
      shortcut: ['⌘', 'B'],
      action: () => router.push('/blog'),
    },
    {
      id: 'projects',
      label: 'View Projects',
      shortcut: ['⌘', 'P'],
      action: () => router.push('/projects'),
    },
    {
      id: 'search',
      label: 'Search',
      shortcut: ['⌘', 'K'],
      action: () => setIsOpen(true),
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      shortcut: ['⌘', 'T'],
      action: () => document.documentElement.classList.toggle('dark'),
    },
  ];

  // Open command palette with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
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
      <CommandPalette
        commands={commands}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      {/* Rest of app */}
    </>
  );
}
```

---

### Grouped Commands

```typescript
const groupedCommands = [
  {
    group: 'Navigation',
    commands: [
      { id: 'home', label: 'Go Home', action: () => router.push('/') },
      { id: 'blog', label: 'View Blog', action: () => router.push('/blog') },
      { id: 'projects', label: 'View Projects', action: () => router.push('/projects') },
    ],
  },
  {
    group: 'Settings',
    commands: [
      { id: 'theme', label: 'Toggle Theme', action: () => toggleTheme() },
      { id: 'profile', label: 'Edit Profile', action: () => router.push('/profile') },
    ],
  },
  {
    group: 'Actions',
    commands: [
      { id: 'logout', label: 'Log Out', action: () => handleLogout() },
    ],
  },
];

<CommandPalette
  commands={groupedCommands}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

---

### Search Integration

```typescript
import { useState, useMemo } from 'react';

function SearchableCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const allCommands = [
    { id: 'home', label: 'Go Home', keywords: ['main', 'index'] },
    { id: 'blog', label: 'View Blog', keywords: ['posts', 'articles'] },
    { id: 'projects', label: 'View Projects', keywords: ['work', 'portfolio'] },
  ];

  const filteredCommands = useMemo(() => {
    if (!search) return allCommands;

    return allCommands.filter((cmd) => {
      const searchLower = search.toLowerCase();
      return (
        cmd.label.toLowerCase().includes(searchLower) ||
        cmd.keywords.some((k) => k.includes(searchLower))
      );
    });
  }, [search, allCommands]);

  return (
    <CommandPalette
      commands={filteredCommands}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSearch('');
      }}
      searchValue={search}
      onSearchChange={setSearch}
      placeholder="Search commands..."
    />
  );
}
```

---

## 🍞 BREADCRUMBS

### Dynamic Breadcrumbs

```typescript
import { Breadcrumbs } from '@aazucena/ui';
import { usePathname } from 'next/navigation';

function BreadcrumbNav() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

    return { label, href };
  });

  // Always include home
  const items = [{ label: 'Home', href: '/' }, ...breadcrumbItems];

  return <Breadcrumbs items={items} />;
}

// Usage in layout
function Layout({ children }) {
  return (
    <>
      <header>
        <BreadcrumbNav />
      </header>
      <main>{children}</main>
    </>
  );
}
```

---

### Custom Breadcrumb Labels

```typescript
const labelMap: Record<string, string> = {
  blog: 'Blog',
  projects: 'Projects',
  'about-us': 'About Us',
  'contact-us': 'Contact',
};

function getBreadcrumbLabel(segment: string): string {
  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

function SmartBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const items = [
    { label: 'Home', href: '/' },
    ...segments.map((segment, index) => ({
      label: getBreadcrumbLabel(segment),
      href: '/' + segments.slice(0, index + 1).join('/'),
    })),
  ];

  return <Breadcrumbs items={items} />;
}
```

---

## 📑 TABLE_OF_CONTENTS

### Auto-Generated from Headings

```typescript
import { TableOfContents } from '@aazucena/ui';
import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

function ArticleWithTOC({ content }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Extract headings from rendered content
    const elements = document.querySelectorAll('article h2, article h3, article h4');

    const extractedHeadings = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: parseInt(el.tagName[1]),
    }));

    setHeadings(extractedHeadings);
  }, [content]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
      <article className="prose dark:prose-invert">{content}</article>
      <aside className="hidden lg:block">
        <div className="sticky top-4">
          <TableOfContents headings={headings} />
        </div>
      </aside>
    </div>
  );
}
```

---

### Active Heading Highlighting

```typescript
import { useState, useEffect } from 'react';

function TableOfContentsWithActive({ headings }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav>
      <ul>
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`pl-${(level - 2) * 4} ${activeId === id ? 'text-primary-500 font-medium' : 'text-neutral-600'}`}
          >
            <a href={`#${id}`}>{text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## 🧭 NAVBAR

### Responsive Navbar

```typescript
import { Navbar, Sheet, SheetTrigger, SheetContent, Button } from '@aazucena/ui';
import { useState } from 'react';
import { useMediaQuery } from '@aazucena/hooks/device';

function ResponsiveNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-950 border-b">
        <div className="flex items-center justify-between p-4">
          <Logo />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <Navbar
      logo="/logo.svg"
      links={navLinks}
      currentPath={window.location.pathname}
    />
  );
}
```

---

### Navbar with Dropdown Menus

```typescript
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@aazucena/ui';

function NavbarWithDropdowns() {
  const navItems = [
    { label: 'Home', href: '/' },
    {
      label: 'Services',
      children: [
        { label: 'Web Development', href: '/services/web' },
        { label: 'Mobile Apps', href: '/services/mobile' },
        { label: 'Consulting', href: '/services/consulting' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) =>
        item.children ? (
          <HoverCard key={item.label}>
            <HoverCardTrigger asChild>
              <button className="font-medium hover:text-primary-500">
                {item.label}
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              <ul className="space-y-2">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <a
                      href={child.href}
                      className="block px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <a
            key={item.href}
            href={item.href}
            className="font-medium hover:text-primary-500"
          >
            {item.label}
          </a>
        )
      )}
    </nav>
  );
}
```

---

## 🔙 BACK_TO_TOP

### Smooth Scroll to Top

```typescript
import { BackToTop } from '@aazucena/ui';

function PageLayout({ children }) {
  return (
    <>
      <main>{children}</main>
      <BackToTop threshold={300} />
    </>
  );
}

// Custom implementation
function CustomBackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
```

---

## 📊 READING_PROGRESS

### Progress Bar

```typescript
import { ReadingProgress } from '@aazucena/ui';

function ArticlePage({ content }) {
  return (
    <>
      <ReadingProgress />
      <article>{content}</article>
    </>
  );
}

// Custom implementation
function CustomReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 dark:bg-neutral-800 z-50">
      <div
        className="h-full bg-primary-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

---

## 🔗 DETAIL_NAVIGATION

### Previous/Next Navigation

```typescript
import { DetailNavigation } from '@aazucena/ui';

function BlogPost({ post, prevPost, nextPost }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>

      <DetailNavigation
        prev={
          prevPost
            ? { label: prevPost.title, href: `/blog/${prevPost.slug}` }
            : undefined
        }
        next={
          nextPost
            ? { label: nextPost.title, href: `/blog/${nextPost.slug}` }
            : undefined
        }
      />
    </article>
  );
}
```

---

## 🎯 SIDEBAR_NAVIGATION

### Collapsible Sidebar

```typescript
import { Sidebar, Button } from '@aazucena/ui';
import { useState } from 'react';

function DocsLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sections = [
    {
      title: 'Getting Started',
      items: [
        { label: 'Installation', href: '/docs/installation' },
        { label: 'Quick Start', href: '/docs/quick-start' },
      ],
    },
    {
      title: 'Components',
      items: [
        { label: 'Button', href: '/docs/components/button' },
        { label: 'Card', href: '/docs/components/card' },
      ],
    },
  ];

  return (
    <div className="flex">
      <Sidebar
        sections={sections}
        currentPath={window.location.pathname}
        collapsed={isSidebarCollapsed}
      />
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 lg:hidden"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? '→' : '←'}
      </Button>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

---

**AUTHOR:** aazucena_navigation_intelligence
