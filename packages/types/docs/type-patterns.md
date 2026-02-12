# Type Patterns Guide

## SUMMARY

Advanced TypeScript patterns for @aazucena/types: discriminated unions, type guards, Zod runtime validation, generics, and immutable patterns.

---

## 🔀 DISCRIMINATED_UNIONS

### Basic Pattern

```typescript
// Define discriminated union with 'type' field
type ApiResponse =
  | { type: 'success'; data: Project[] }
  | { type: 'error'; error: string };

// Type narrowing with type guard
function handleResponse(response: ApiResponse) {
  if (response.type === 'success') {
    // TypeScript knows response.data exists
    console.log(response.data);
  } else {
    // TypeScript knows response.error exists
    console.error(response.error);
  }
}
```

---

### Complex Example

```typescript
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: LoadingState<T>) {
  switch (state.status) {
    case 'idle':
      return 'Not started';
    case 'loading':
      return `Loading... ${state.progress}%`;
    case 'success':
      return `Loaded ${state.data}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}
```

---

### Exhaustiveness Checking

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'rectangle'; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      // Exhaustiveness check: TypeScript error if case is missing
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

---

## 🛡️ TYPE_GUARDS

### typeof Guards

```typescript
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // TypeScript knows value is string
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number
    return value.toFixed(2);
  }
}
```

---

### instanceof Guards

```typescript
function handleError(error: Error | string) {
  if (error instanceof Error) {
    // TypeScript knows error is Error
    console.error(error.message);
    console.error(error.stack);
  } else {
    // TypeScript knows error is string
    console.error(error);
  }
}
```

---

### Custom Type Guards

```typescript
// User-defined type guard
function isPost(item: Post | Project): item is Post {
  return 'publishedAt' in item && 'tags' in item;
}

function displayItem(item: Post | Project) {
  if (isPost(item)) {
    // TypeScript knows item is Post
    console.log(item.publishedAt);
    console.log(item.tags);
  } else {
    // TypeScript knows item is Project
    console.log(item.technologies);
    console.log(item.githubUrl);
  }
}
```

---

### Array Type Guards

```typescript
function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === 'string');
}

function processInput(input: unknown) {
  if (isStringArray(input)) {
    // TypeScript knows input is string[]
    input.forEach((str) => console.log(str.toUpperCase()));
  }
}
```

---

## ✅ ZOD_INTEGRATION

### Runtime Validation

```typescript
import { z } from 'zod';
import type { Post } from '@aazucena/types';

// Define Zod schema matching TypeScript type
const PostSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(200),
  content: z.string(),
  coverImage: z.string().url().optional(),
  publishedAt: z.date(),
  tags: z.array(z.string()),
});

// Validate at runtime
function validatePost(data: unknown): Post {
  return PostSchema.parse(data); // Throws if invalid
}

// Safe validation
function safeValidatePost(data: unknown): Post | null {
  const result = PostSchema.safeParse(data);
  return result.success ? result.data : null;
}
```

---

### Type Inference from Zod

```typescript
import { z } from 'zod';

// Define schema first
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;
// Equivalent to:
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   age: number;
// }
```

---

### Zod Transformations

```typescript
import { z } from 'zod';

const DateStringSchema = z.string().transform((str) => new Date(str));

const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  createdAt: DateStringSchema, // Transforms string to Date
});

type Project = z.infer<typeof ProjectSchema>;
// Project.createdAt is Date, not string
```

---

### Zod with Discriminated Unions

```typescript
import { z } from 'zod';

const ApiResponseSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('success'),
    data: z.array(z.any()),
  }),
  z.object({
    type: z.literal('error'),
    error: z.string(),
  }),
]);

type ApiResponse = z.infer<typeof ApiResponseSchema>;
// ApiResponse is a discriminated union
```

---

## 🎨 GENERICS

### Basic Generic Function

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // T is inferred as number
const str = identity('hello'); // T is inferred as string
```

---

### Generic Constraints

```typescript
// Constrain T to have 'id' and 'name' properties
function findById<T extends { id: number; name: string }>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id);
}

const post = findById(posts, 1); // Works
const project = findById(projects, 2); // Works
```

---

### Generic Types

```typescript
// Generic ApiResponse type
type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta: {
    timestamp: number;
    requestId: string;
  };
};

// Usage with specific types
const postsResponse: ApiResponse<Post[]> = {
  success: true,
  data: [/* posts */],
  meta: { timestamp: Date.now(), requestId: 'req_123' },
};

const projectResponse: ApiResponse<Project> = {
  success: true,
  data: { /* project */ },
  meta: { timestamp: Date.now(), requestId: 'req_456' },
};
```

---

### Generic Component Props

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={posts}
  renderItem={(post) => <PostCard post={post} />}
  keyExtractor={(post) => post.id}
/>
```

---

## 🔒 IMMUTABLE_PATTERNS

### Readonly Properties

```typescript
// Immutable user type
type User = {
  readonly id: string;
  readonly email: string;
  name: string; // mutable
};

const user: User = {
  id: 'user_123',
  email: 'user@example.com',
  name: 'John',
};

user.name = 'Jane'; // OK
user.id = 'user_456'; // Error: readonly property
user.email = 'new@example.com'; // Error: readonly property
```

---

### Readonly Arrays

```typescript
// Readonly array (cannot push/pop/splice)
const tags: readonly string[] = ['react', 'typescript'];

tags[0] = 'vue'; // Error: readonly
tags.push('next'); // Error: method doesn't exist on readonly array

// Create new array instead
const newTags = [...tags, 'next']; // OK
```

---

### Readonly Utility Type

```typescript
type Post = {
  id: number;
  title: string;
  tags: string[];
};

// Make all properties readonly
type ReadonlyPost = Readonly<Post>;
// Equivalent to:
// type ReadonlyPost = {
//   readonly id: number;
//   readonly title: string;
//   readonly tags: readonly string[];
// }

const post: ReadonlyPost = { id: 1, title: 'Post', tags: ['react'] };
post.title = 'New Title'; // Error: readonly
```

---

### Deep Readonly

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Post = {
  id: number;
  author: {
    name: string;
    email: string;
  };
};

type ImmutablePost = DeepReadonly<Post>;

const post: ImmutablePost = {
  id: 1,
  author: { name: 'John', email: 'john@example.com' },
};

post.id = 2; // Error: readonly
post.author.name = 'Jane'; // Error: deeply readonly
```

---

## 🔧 UTILITY_TYPES

### Pick & Omit

```typescript
type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  publishedAt: Date;
  tags: string[];
};

// Pick specific properties
type PostPreview = Pick<Post, 'id' | 'title' | 'slug'>;
// { id: number; title: string; slug: string; }

// Omit specific properties
type PostWithoutContent = Omit<Post, 'content'>;
// { id: number; title: string; slug: string; publishedAt: Date; tags: string[]; }
```

---

### Partial & Required

```typescript
type Post = {
  id: number;
  title: string;
  slug: string;
  publishedAt: Date;
};

// Make all properties optional
type PartialPost = Partial<Post>;
// { id?: number; title?: string; slug?: string; publishedAt?: Date; }

// Make all properties required (opposite of Partial)
type RequiredPost = Required<PartialPost>;
// { id: number; title: string; slug: string; publishedAt: Date; }
```

---

### Record

```typescript
// Create object type with specific keys and value type
type StatusMap = Record<'idle' | 'loading' | 'success' | 'error', string>;
// Equivalent to:
// type StatusMap = {
//   idle: string;
//   loading: string;
//   success: string;
//   error: string;
// }

const statusMessages: StatusMap = {
  idle: 'Not started',
  loading: 'Loading...',
  success: 'Complete',
  error: 'Failed',
};
```

---

### Extract & Exclude

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';

// Extract specific types from union
type SuccessOrError = Extract<Status, 'success' | 'error'>;
// 'success' | 'error'

// Exclude specific types from union
type NotIdle = Exclude<Status, 'idle'>;
// 'loading' | 'success' | 'error'
```

---

## 🔍 CONDITIONAL_TYPES

### Basic Conditional Type

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

---

### Conditional Type with infer

```typescript
// Extract return type of function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getPost(): Post {
  return { /* post */ };
}

type PostType = ReturnType<typeof getPost>; // Post
```

---

### Conditional Type for Array Elements

```typescript
type ElementType<T> = T extends (infer E)[] ? E : T;

type A = ElementType<string[]>; // string
type B = ElementType<number[]>; // number
type C = ElementType<boolean>; // boolean (not an array)
```

---

## 🎯 PRACTICAL_PATTERNS

### Safe API Response Type

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchPosts(): Promise<ApiResponse<Post[]>> {
  try {
    const response = await fetch('/api/posts');
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Usage with type narrowing
const response = await fetchPosts();
if (response.success) {
  console.log(response.data); // TypeScript knows data exists
} else {
  console.error(response.error); // TypeScript knows error exists
}
```

---

### Builder Pattern

```typescript
class PostBuilder {
  private post: Partial<Post> = {};

  setTitle(title: string): this {
    this.post.title = title;
    return this;
  }

  setSlug(slug: string): this {
    this.post.slug = slug;
    return this;
  }

  setContent(content: string): this {
    this.post.content = content;
    return this;
  }

  build(): Post {
    if (!this.post.title || !this.post.slug || !this.post.content) {
      throw new Error('Missing required fields');
    }
    return this.post as Post;
  }
}

// Usage
const post = new PostBuilder()
  .setTitle('My Post')
  .setSlug('my-post')
  .setContent('Content here')
  .build();
```

---

### Type-Safe Event Emitter

```typescript
type EventMap = {
  'post:created': { post: Post };
  'post:updated': { post: Post };
  'post:deleted': { id: number };
};

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: Partial<Record<keyof T, ((data: any) => void)[]>> = {};

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach((callback) => callback(data));
  }
}

// Usage
const emitter = new TypedEventEmitter<EventMap>();

emitter.on('post:created', (data) => {
  console.log(data.post); // TypeScript knows data.post exists
});

emitter.emit('post:created', { post: myPost });
emitter.emit('post:deleted', { id: 123 });
```

---

**AUTHOR:** aazucena_pattern_intelligence
