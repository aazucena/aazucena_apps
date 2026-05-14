# [Component Patterns] : Factory_Architecture

## SUMMARY

Reusable component patterns and composition strategies for building consistent, maintainable interfaces across the Avra ecosystem. Follows the Factory Pattern principle where components are easily re-instantiated with different data providers.

---

## PATTERN_CATALOG

### 1. FACTORY_PATTERN (Core)

Components designed for reusability with data provider injection.

```typescript
// ❌ Bad: Hardcoded data source
function ProjectCard() {
  const project = useProject(123); // Hardcoded ID
  return <Card>{project.title}</Card>;
}

// ✅ Good: Factory pattern with data injection
interface ProjectCardProps {
  project: Project;
  variant?: 'compact' | 'detailed';
  onSelect?: (id: number) => void;
}

function ProjectCard({ project, variant = 'compact', onSelect }: ProjectCardProps) {
  return (
    <Card variant={variant} onClick={() => onSelect?.(project.id)}>
      <h3>{project.title}</h3>
      {variant === 'detailed' && <p>{project.description}</p>}
    </Card>
  );
}

// Reusable with different data sources
<ProjectCard project={fetchedProject} variant="detailed" />
<ProjectCard project={staticProject} variant="compact" />
```

---

### 2. COMPOUND_COMPONENT_PATTERN

Components that work together to form a cohesive unit.

```typescript
// ✅ Compound component structure
interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined';
}

function Card({ children, variant = 'elevated' }: CardProps) {
  return (
    <div className={cn('rounded-lg', variant === 'elevated' && 'shadow-lg')}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t">{children}</div>;
}

// Compose together
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };

// Usage
<Card>
  <Card.Header><h2>Title</h2></Card.Header>
  <Card.Content><p>Content</p></Card.Content>
  <Card.Footer><Button>Action</Button></Card.Footer>
</Card>
```

---

### 3. RENDER_PROP_PATTERN

Pass rendering logic as a function for maximum flexibility.

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return children(data, loading, error);
}

// Usage
<DataFetcher<Project[]> url="/api/projects">
  {(projects, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return projects?.map((p) => <ProjectCard key={p.id} project={p} />);
  }}
</DataFetcher>
```

---

### 4. POLYMORPHIC_COMPONENT_PATTERN

Components that can render as different HTML elements.

```typescript
type PolymorphicComponentProps<E extends React.ElementType> = {
  as?: E;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<E>;

function Text<E extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: PolymorphicComponentProps<E>) {
  const Component = as || 'span';
  return <Component {...props}>{children}</Component>;
}

// Usage
<Text>Default span</Text>
<Text as="h1">Heading 1</Text>
<Text as="p" className="text-lg">Paragraph</Text>
<Text as={Link} href="/about">Link</Text>
```

---

### 5. CONTROLLED_VS_UNCONTROLLED

Support both controlled and uncontrolled modes.

```typescript
interface ToggleProps {
  // Controlled mode
  checked?: boolean;
  onChange?: (checked: boolean) => void;

  // Uncontrolled mode
  defaultChecked?: boolean;

  // Common
  disabled?: boolean;
}

function Toggle({ checked, onChange, defaultChecked = false, disabled }: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // Use external state if provided (controlled), otherwise use internal state (uncontrolled)
  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;

    // Update internal state if uncontrolled
    if (checked === undefined) {
      setInternalChecked(newValue);
    }

    // Call onChange if provided
    onChange?.(newValue);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn('toggle', isChecked && 'checked', disabled && 'disabled')}
    >
      {isChecked ? 'On' : 'Off'}
    </button>
  );
}

// Controlled usage
<Toggle checked={isOn} onChange={setIsOn} />

// Uncontrolled usage
<Toggle defaultChecked={true} onChange={(checked) => console.log(checked)} />
```

---

### 6. PROVIDER_PATTERN (Context)

Encapsulate shared state with Context API.

```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// Usage
<ThemeProvider>
  <App />
</ThemeProvider>

function Component() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

---

### 7. SLOT_PATTERN (Astro)

Named slots for flexible composition in Astro components.

```astro
---
// BaseLayout.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<html>
  <head>
    <title>{title}</title>
    <slot name="head" />
  </head>
  <body>
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </body>
</html>

<!-- Usage -->
<BaseLayout title="My Page">
  <Fragment slot="head">
    <link rel="stylesheet" href="/custom.css" />
  </Fragment>

  <Fragment slot="header">
    <nav>Navigation</nav>
  </Fragment>

  <h1>Main Content</h1>
  <p>Default slot content</p>

  <Fragment slot="footer">
    <p>&copy; 2026</p>
  </Fragment>
</BaseLayout>
```

---

## COMPOSITION_STRATEGIES

### Strategy 1: Component Composition

Build complex components from simpler ones.

```typescript
// Atomic components
function Avatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="rounded-full w-10 h-10" />;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-1 bg-blue-100 rounded">{children}</span>;
}

// Composed component
function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <Avatar src={user.avatar} alt={user.name} />
        <div>
          <h3>{user.name}</h3>
          <Badge>{user.role}</Badge>
        </div>
      </div>
    </Card>
  );
}
```

### Strategy 2: Higher-Order Components (HOCs)

Add behavior to existing components.

```typescript
function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { loading?: boolean }> {
  return ({ loading, ...props }) => {
    if (loading) return <Spinner />;
    return <Component {...(props as P)} />;
  };
}

// Usage
const ProjectCardWithLoading = withLoading(ProjectCard);
<ProjectCardWithLoading project={project} loading={isLoading} />
```

---

## ANTI_PATTERNS (Avoid)

### ❌ Prop Drilling

```typescript
// Bad: Passing props through many levels
<App theme={theme}>
  <Layout theme={theme}>
    <Sidebar theme={theme}>
      <Menu theme={theme} />
    </Sidebar>
  </Layout>
</App>

// Good: Use Context
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### ❌ God Components

```typescript
// Bad: Component doing too much
function Dashboard() {
  // 500+ lines of logic, state, and JSX
}

// Good: Extract concerns
function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <DashboardMetrics />
      <DashboardCharts />
      <DashboardTable />
    </>
  );
}
```

---

**STATUS:** 📐 ARCHITECTURAL_STANDARD
**AUTHOR:** aazucena_component_factory
