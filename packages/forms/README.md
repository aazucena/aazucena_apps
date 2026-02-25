# @aazucena/forms : Input_Intelligence_System

## SUMMARY

Comprehensive form management system built on **TanStack Form** and **Zod**. Provides multi-step wizard flows, validation schemas, and AI-powered intelligent inquiry firewall for gated scheduling interactions.

---

## 🏗️ SYSTEM_FACTORIES

### [Multi-Step Wizard] : The_Orchestrator

- **Location:** `src/components/FormWizard.tsx`
- **Logic:** State machine for multi-step forms with progress tracking and AI challenge support.
- **Exports:** `FormWizard`.

### [Validation Schemas] : The_Guards

- **Location:** `src/schemas/index.ts`
- **Logic:** Zod validation schemas for 8 core form types (Contact, Feedback, Testimonial, etc.).
- **Exports:** `contactFormSchema`, `feedbackFormSchema`, `anyFormSchema`, and more.

### [Inquiry Firewall] : The_Intelligence

- **Location:** `src/hooks/useEasterEggChallenge.ts`
- **Logic:** AI-powered engagement challenges that gated form submission until a specific interaction is completed.
- **Exports:** `useEasterEggChallenge`.

---

## 🚦 USAGE_PROTOCOLS

### Basic Form with TanStack Form

```typescript
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form, FormMessage } from '@aazucena/ui';
import { ControlledInput, useStrapiFormMutation } from '@aazucena/forms';
import { contactFormSchema } from '@aazucena/forms/schemas';

function ContactForm() {
  const form = useForm({
    defaultValues: { name: '', email: '', message: '' },
    validatorAdapter: zodValidator(),
  });

  const mutation = useStrapiFormMutation('form-submissions', {
    form,
    onSuccess: () => alert('Sent!'),
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <ControlledInput
        name="name"
        label="Name"
        required
        validators={{ onChange: contactFormSchema.shape.name }}
      />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending...' : 'Send Message'}
      </button>
    </Form>
  );
}
```

### Multi-Step Wizard Integration

```typescript
import { FormWizard } from '@aazucena/forms';

function OnboardingWizard() {
  const steps = [
    {
      id: 'step-1',
      title: 'Identity',
      component: <IdentityFields />,
    },
    {
      id: 'step-2',
      title: 'Telemetry',
      component: <TelemetryFields />,
    }
  ];

  return (
    <FormWizard
      steps={steps}
      onComplete={async () => {
        // Final submission logic
      }}
    />
  );
}
```

### Full-Stack Mutation Bridge

```typescript
import { useFormMutation } from '@aazucena/forms';

function AdvancedForm() {
  const form = useForm({ ... });

  const mutation = useFormMutation({
    form,
    mutationFn: (data) => api.submit(data),
    mapServerErrors: (err) => ({
      email: 'This email is already registered in our system.'
    })
  });

  return (
    <Form onSubmit={() => mutation.mutate(form.state.values)}>
      <FormErrorSummary />
      {/* ... fields ... */}
    </Form>
  );
}
```

---

## ✅ VERIFICATION_SUITE

- **Reactivity:** Uses TanStack Form's granular field-level re-rendering for maximum performance.
- **Full-Stack:** Direct integration with TanStack Query mutations and server-side error mapping.
- **Accessibility:** WCAG-compliant error summaries and ARIA-linked field components.
- **Type Safety:** 100% TypeScript coverage with Zod runtime validation.
- **AI Integration:** Built-in support for Easter Egg challenges to prevent automated spam.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/ui, @aazucena/types, @aazucena/api, @aazucena/utils
**External:** @tanstack/react-form, @tanstack/zod-form-adapter, zod, framer-motion

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
