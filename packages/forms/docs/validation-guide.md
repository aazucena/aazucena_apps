# Form Validation Guide

## SUMMARY

Zod-based validation patterns for type-safe form handling with runtime validation.

---

## PRE_BUILT_SCHEMAS

### Contact Form

```typescript
import { contactSchema } from '@aazucena/forms/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} placeholder="Name" />
      {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}

      <input {...form.register('email')} type="email" placeholder="Email" />
      {form.formState.errors.email && <span>{form.formState.errors.email.message}</span>}

      <textarea {...form.register('message')} placeholder="Message" />
      {form.formState.errors.message && <span>{form.formState.errors.message.message}</span>}

      <button type="submit">Send</button>
    </form>
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

// Usage
const form = useForm({
  resolver: zodResolver(signupSchema),
});
```

---

## ASYNC_VALIDATION

### Email Uniqueness Check

```typescript
const emailSchema = z.string().email().refine(
  async (email) => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const { available } = await response.json();
    return available;
  },
  { message: 'Email is already taken' }
);
```

---

**AUTHOR:** aazucena_forms_validation
