# Form Validation Guide

## SUMMARY

Zod-based validation patterns for type-safe form handling with high-performance runtime validation using **TanStack Form**.

---

## PRE_BUILT_SCHEMAS

### Contact Form with TanStack Form

```typescript
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { contactFormSchema } from '@aazucena/forms/schemas';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@aazucena/ui';

function ContactForm() {
  const form = useForm({
    defaultValues: { name: '', email: '', message: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      // Submission logic
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FormField
        form={form}
        name="name"
        validators={{
          onChange: contactFormSchema.shape.name,
        }}
      >
        {(field) => (
          <FormItem>
            <FormLabel required>Name</FormLabel>
            <FormControl>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <FormField
        form={form}
        name="email"
        validators={{
          onChange: contactFormSchema.shape.email,
        }}
      >
        {(field) => (
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <input
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <button type="submit" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </Form>
  );
}
```

---

## CUSTOM_SCHEMAS

### Creating Custom Validators

```typescript
import { z } from 'zod';

const signupSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Usage in TanStack Form
const form = useForm({
  defaultValues: { username: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: signupSchema,
  },
});
```

---

## ASYNC_VALIDATION

### Async Validator Factory

For common async checks (e.g., checking if a username is available or validating a GitHub handle), use the `createAsyncValidator` factory.

```typescript
import { createAsyncValidator } from '@aazucena/forms';

// 1. Define the validator
const githubValidator = createAsyncValidator(
  async (username) => {
    const res = await fetch(`https://api.github.com/users/${username}`);
    return res.ok;
  },
  {
    message: 'GitHub user not found',
    debounceMs: 800
  }
);

// 2. Use it in a FormField
<FormField
  form={form}
  name="githubUser"
  validators={githubValidator}
>
  {(field) => (
    <FormItem>
      <FormLabel>GitHub Username</FormLabel>
      <FormControl>
        <input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </FormControl>
      {/* TanStack Form automatically handles the loading state */}
      {field.state.meta.isValidating && (
        <p className="text-[10px] animate-pulse">Checking records...</p>
      )}
      <FormMessage />
    </FormItem>
  )}
</FormField>
```

### Manual Async Validation

If you need more control, you can define async validation directly in the `validators` prop.

```typescript
<FormField
  form={form}
  name="email"
  validators={{
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const response = await fetch(`/api/check-email?email=${value}`);
      const { available } = await response.json();
      return available ? undefined : 'Email is already taken';
    },
  }}
>
  {/* ... field implementation ... */}
</FormField>
```

---

## DATA_INTEGRITY

### Input Transformers

Use `createInputTransformer` to clean or format data before it ever hits the form state. This is useful for slugs, phone numbers, or credit card formatting.

```typescript
import { createInputTransformer } from '@aazucena/forms';

// In your field render:
<input
  value={field.state.value}
  onChange={createInputTransformer(field, (val) => val.toLowerCase().replace(/\s+/g, '-'))}
  placeholder="project-slug"
/>
```

### Comparison Validators

Use `createComparisonValidator` for fields that depend on other field values (e.g., password confirmation or date ranges).

```typescript
import { createComparisonValidator } from '@aazucena/forms';

// In your 'confirmPassword' field:
<FormField
  name="confirmPassword"
  validators={{
    onChange: createComparisonValidator(
      'password',
      (val, password) => val === password,
      'Passwords do not match'
    )
  }}
>
  {/* ... */}
</FormField>
```

---

## DATA_EFFICIENCY

### Optimized Patching

Use `getFormChanges` to extract only the modified values from a form. This is the recommended pattern for `PATCH` requests to Strapi v5.

```typescript
import { getFormChanges } from '@aazucena/forms';

const onSubmit = async ({ value }) => {
  // 1. Get only what changed
  const dirtyData = getFormChanges(form);

  // 2. Efficient PATCH request
  await mutation.mutateAsync(dirtyData);
};
```

---

**AUTHOR:** aazucena_forms_validation
