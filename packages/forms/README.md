# @aazucena/forms : Input_Intelligence_System

## SUMMARY

Comprehensive form management system built on react-hook-form and Zod. Provides multi-step wizard flows, validation schemas, field components, and AI-powered intelligent inquiry firewall for gated scheduling interactions.

---

## 🛠️ TOOLKIT_MANIFEST

| System                 | Protocol        | Description                                                             |
| :--------------------- | :-------------- | :---------------------------------------------------------------------- |
| **Field_Components**   | Input_Standard  | TextField, TextArea, SelectField, CheckboxField, RadioGroup.            |
| **Multi_Step_Wizard**  | State_Machine   | StepForm, WizardProgress, step validation, persistence.                 |
| **Validation_Schemas** | Zod_Runtime     | Pre-built schemas for contact, feedback, testimonial, bug report forms. |
| **Inquiry_Firewall**   | AI_Gating       | Intelligent scheduling system with context-aware filtering.             |
| **Submission_Logic**   | Handler_Factory | Form submission handlers with error handling and success callbacks.     |
| **Accessibility**      | WCAG_Compliant  | Full ARIA support, keyboard navigation, screen reader optimized.        |

---

## 🏗️ SYSTEM_FACTORIES

### [Field Components] : The_Primitives

- **Location:** `src/components/`
- **Logic:** Reusable form fields with built-in validation and error display.
- **Exports:** `TextField`, `TextArea`, `SelectField`, `CheckboxField`, `RadioGroup`.

### [Multi-Step Wizard] : The_Orchestrator

- **Location:** `src/wizard/`
- **Logic:** State machine for multi-step forms with progress tracking.
- **Exports:** `StepForm`, `WizardProvider`, `useWizard`, `WizardProgress`.

### [Validation Schemas] : The_Guards

- **Location:** `src/schemas/`
- **Logic:** Zod validation schemas for common form types.
- **Exports:** `contactSchema`, `feedbackSchema`, `testimonialSchema`, `bugReportSchema`.

### [Inquiry Firewall] : The_Intelligence

- **Location:** `src/firewall/`
- **Logic:** AI-powered scheduling gating with context analysis.
- **Exports:** `InquiryFirewall`, `useInquiryGating`, `validateInquiry`.

---

## 🚦 USAGE_PROTOCOLS

### Basic Form with Validation

```typescript
import { Form, TextField } from '@aazucena/forms';
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TextField name="name" label="Name" placeholder="Your name" />
        <TextField name="email" label="Email" type="email" placeholder="you@example.com" />
        <TextField name="message" label="Message" as="textarea" rows={5} />
        <button type="submit">Send</button>
      </form>
    </Form>
  );
}
```

### Multi-Step Wizard

```typescript
import { StepForm, WizardProvider, WizardProgress } from '@aazucena/forms';

function OnboardingWizard() {
  return (
    <WizardProvider totalSteps={3}>
      <WizardProgress />
      <StepForm
        steps={[
          {
            id: 'personal',
            title: 'Personal Info',
            component: PersonalInfoStep,
            validation: personalInfoSchema,
          },
          {
            id: 'preferences',
            title: 'Preferences',
            component: PreferencesStep,
            validation: preferencesSchema,
          },
          {
            id: 'confirmation',
            title: 'Confirmation',
            component: ConfirmationStep,
          },
        ]}
        onComplete={(data) => {
          console.log('Wizard complete:', data);
        }}
      />
    </WizardProvider>
  );
}
```

### Inquiry Firewall (AI Gating)

```typescript
import { InquiryFirewall, useInquiryGating } from '@aazucena/forms';

function SchedulingForm() {
  const { validateInquiry, isGated, reasoning } = useInquiryGating();

  const handleSubmit = async (data) => {
    const result = await validateInquiry({
      inquiry: data.message,
      context: {
        userType: 'new',
        urgency: data.urgency,
        category: data.category,
      },
    });

    if (result.isGated) {
      // Show alternative options or redirect to self-service
      console.log('Inquiry gated:', result.reasoning);
      return;
    }

    // Proceed with scheduling
    await scheduleCall(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="message" label="What would you like to discuss?" />
      {isGated && <Alert>{reasoning}</Alert>}
      <button type="submit">Schedule Call</button>
    </form>
  );
}
```

---

## ✅ VERIFICATION_SUITE

- **Type Safety:** Full TypeScript + Zod runtime validation.
- **Accessibility:** WCAG AA compliant, keyboard navigation, ARIA labels.
- **Performance:** Field-level re-renders, lazy validation, debounced inputs.
- **Meta-Framework Agnostic:** Works with Next.js, Astro, Remix.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/ui, @aazucena/types, @aazucena/constants
**External:** react-hook-form, zod, @hookform/resolvers

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Import form components
import { Form, TextField } from '@aazucena/forms';
import { contactSchema } from '@aazucena/forms/schemas';
```

### Common Patterns

#### Form with Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      form.setError('root', { message: 'Login failed' });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <TextField name="email" label="Email" {...form.register('email')} />
      <TextField name="password" label="Password" type="password" {...form.register('password')} />
      {form.formState.errors.root && <div>{form.formState.errors.root.message}</div>}
      <button type="submit" disabled={form.formState.isSubmitting}>
        Log In
      </button>
    </form>
  );
}
```

#### Multi-Step Form with Persistence

```typescript
import { WizardProvider, useWizard } from '@aazucena/forms';

function SignupWizard() {
  return (
    <WizardProvider
      totalSteps={3}
      persistence="localStorage"
      persistKey="signup-wizard"
    >
      <WizardContent />
    </WizardProvider>
  );
}

function WizardContent() {
  const {
    currentStep,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    formData,
    updateFormData,
  } = useWizard();

  const steps = [
    <AccountStep key="account" data={formData} onChange={updateFormData} />,
    <ProfileStep key="profile" data={formData} onChange={updateFormData} />,
    <ConfirmationStep key="confirm" data={formData} />,
  ];

  return (
    <div>
      <progress value={currentStep + 1} max={3} />
      {steps[currentStep]}
      <div>
        <button onClick={previousStep} disabled={!canGoPrevious}>
          Back
        </button>
        <button onClick={nextStep} disabled={!canGoNext}>
          {currentStep === 2 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
```

#### Dynamic Field Arrays

```typescript
import { useFieldArray } from 'react-hook-form';

function ProjectForm() {
  const form = useForm();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'technologies',
  });

  return (
    <form>
      <div>
        <label>Technologies</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <TextField name={`technologies.${index}.name`} placeholder="Technology name" />
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ name: '' })}
        >
          Add Technology
        </button>
      </div>
    </form>
  );
}
```

### Troubleshooting

#### Validation Not Working

```typescript
// ❌ Wrong: Missing zodResolver
const form = useForm({
  defaultValues: { email: '' },
});

// ✅ Correct: Add zodResolver
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(contactSchema),
  defaultValues: { email: '' },
});
```

#### Form Not Submitting

```typescript
// ❌ Wrong: Missing form.handleSubmit
<form onSubmit={onSubmit}>

// ✅ Correct: Wrap with form.handleSubmit
<form onSubmit={form.handleSubmit(onSubmit)}>
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
