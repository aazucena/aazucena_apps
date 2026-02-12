# Composition Patterns

## SUMMARY

Strategies for building complex UI components by composing primitive components from @aazucena/ui. Learn factory patterns, compound components, and slot composition techniques.

---

## 🏗️ FACTORY_PATTERN

### Building Cards from Primitives

Compose complex cards using Card primitives:

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '@aazucena/ui';

function ProductCard({ product }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{product.name}</CardTitle>
          {product.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <p className="text-2xl font-bold text-primary-500">${product.price}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Add to Cart
        </Button>
        <Button className="flex-1">Buy Now</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 🧩 COMPOUND_COMPONENTS

### Modal with Compound Pattern

Build modals with flexible sub-components:

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from '@aazucena/ui';

function ProfileModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Manage your account settings</DialogDescription>
        </DialogHeader>

        {/* Custom content composition */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎨 LAYOUT_COMPOSITION

### Multi-Column Layouts

Combine primitives into responsive layouts:

```typescript
import { Card, CardContent, ResponsiveGrid, Avatar, AvatarImage, AvatarFallback, Badge } from '@aazucena/ui';

function TeamGrid({ members }) {
  return (
    <ResponsiveGrid minWidth="300px" gap="1.5rem">
      {members.map((member) => (
        <Card key={member.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {member.role}
              </p>
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </ResponsiveGrid>
  );
}
```

---

## 📋 FORM_COMPOSITION

### Multi-Step Form Wizard

Compose forms with tabs for multi-step workflows:

```typescript
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Textarea,
  Button,
} from '@aazucena/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email(),
  }),
  professionalInfo: z.object({
    company: z.string().min(1, 'Required'),
    position: z.string().min(1, 'Required'),
    bio: z.string().max(500),
  }),
});

function OnboardingWizard() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: { firstName: '', lastName: '', email: '' },
      professionalInfo: { company: '', position: '', bio: '' },
    },
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="personalInfo.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="professional" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="professionalInfo.company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professionalInfo.position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professionalInfo.bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## 🎭 POLYMORPHIC_COMPONENTS

### Flexible Component with "asChild" Pattern

Use Radix UI's `asChild` pattern for component composition:

```typescript
import { Button } from '@aazucena/ui';
import { Link } from 'next/link';

// Button as a link
<Button asChild>
  <Link href="/about">About Us</Link>
</Button>

// Button as a custom element
<Button asChild>
  <a href="https://example.com" target="_blank" rel="noopener">
    External Link
  </a>
</Button>
```

---

### Custom Polymorphic Button

```typescript
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('px-4 py-2 rounded transition-colors', {
  variants: {
    variant: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    },
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={buttonVariants({ variant, className })} ref={ref} {...props} />;
  }
);

export { Button };
```

---

## 🔗 SLOT_COMPOSITION

### Header with Flexible Slots

Create flexible layouts with slot patterns:

```typescript
import { Card, CardHeader, CardTitle, CardContent, Button } from '@aazucena/ui';

interface FlexibleCardProps {
  title: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function FlexibleCard({ title, headerAction, children, footer }: FlexibleCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {headerAction}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

// Usage
<FlexibleCard
  title="Dashboard"
  headerAction={<Button variant="outline" size="sm">Refresh</Button>}
  footer={
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </div>
  }
>
  <p>Card content goes here</p>
</FlexibleCard>
```

---

## 🎨 RENDER_PROPS_PATTERN

### List Component with Render Props

Flexible list rendering with custom item rendering:

```typescript
import { Card, CardContent, ScrollArea } from '@aazucena/ui';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}

function List<T>({ items, renderItem, emptyState }: ListProps<T>) {
  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">{renderItem(item, index)}</CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-neutral-600">{user.email}</p>
      </div>
    </div>
  )}
  emptyState={<p className="text-center text-neutral-600">No users found</p>}
/>
```

---

## 🏛️ PROVIDER_PATTERN

### Theme Provider Context

Wrap components with context providers:

```typescript
import { createContext, useContext, useState } from 'react';
import { ThemeToggle } from '@aazucena/ui';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Usage in components
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header>
      <nav>
        <ThemeToggle
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </nav>
    </header>
  );
}
```

---

## 🌐 PORTAL_PATTERN

### Modal with Portal Rendering

Render modals outside the DOM hierarchy:

```typescript
import { createPortal } from 'react-dom';
import { Dialog, DialogContent } from '@aazucena/ui';
import { useEffect, useState } from 'react';

function PortalModal({ isOpen, onClose, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>{children}</DialogContent>
    </Dialog>,
    document.body
  );
}

// Usage
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      <PortalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Modal Content</h2>
        <p>This modal is rendered in a portal.</p>
      </PortalModal>
    </>
  );
}
```

---

## 🎯 CONTROLLED_VS_UNCONTROLLED

### Controlled Component Pattern

Manage state externally for full control:

```typescript
import { Input, Button } from '@aazucena/ui';
import { useState } from 'react';

function ControlledForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

### Uncontrolled Component Pattern

Use refs for simpler state management:

```typescript
import { Input, Button } from '@aazucena/ui';
import { useRef } from 'react';

function UncontrolledForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <Input type="email" ref={emailRef} defaultValue="" />
      </div>
      <div>
        <label>Password</label>
        <Input type="password" ref={passwordRef} defaultValue="" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## 🧪 HIGHER_ORDER_COMPONENTS

### withLoading HOC

Add loading states to any component:

```typescript
import { Skeleton } from '@aazucena/ui';

function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  SkeletonComponent?: React.ComponentType
) {
  return function WithLoadingComponent({ isLoading, ...props }: P & { isLoading: boolean }) {
    if (isLoading) {
      return SkeletonComponent ? <SkeletonComponent /> : <Skeleton className="h-12 w-full" />;
    }

    return <Component {...(props as P)} />;
  };
}

// Usage
function UserCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
      </CardContent>
    </Card>
  );
}

const UserCardWithLoading = withLoading(UserCard);

// In parent component
<UserCardWithLoading user={user} isLoading={isLoading} />
```

---

**AUTHOR:** aazucena_composition_intelligence
