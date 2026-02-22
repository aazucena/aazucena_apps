# Multi-Step Form Wizard Patterns

## SUMMARY

State machine-driven multi-step forms with progress tracking, step validation, and Framer Motion animations, powered by **TanStack Form**.

---

## 🧙 FORMWIZARD_COMPONENT

### Basic Usage with TanStack Form

```typescript
import { FormWizard } from '@aazucena/forms';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { contactFormSchema } from '@aazucena/forms/schemas';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@aazucena/ui';

function ContactWizard() {
  const form = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
  });

  const steps = [
    {
      id: 'personal',
      title: 'Personal Info',
      component: (
        <div className="space-y-4">
          <FormField
            form={form}
            name="name"
            validators={{ onChange: contactFormSchema.shape.name }}
          >
            {(field) => (
              <FormItem>
                <FormLabel required>Name</FormLabel>
                <FormControl>
                  <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          {/* ... email field ... */}
        </div>
      ),
      // Use TanStack's field-level meta to determine validity
      isValid: !form.state.fieldMeta.name?.errors.length && !form.state.fieldMeta.email?.errors.length,
    },
    {
      id: 'review',
      title: 'Review',
      component: (
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <div className="space-y-2">
              <p><strong>Name:</strong> {values.name}</p>
              <p><strong>Email:</strong> {values.email}</p>
            </div>
          )}
        </form.Subscribe>
      ),
      isValid: true,
    },
  ];

  return (
    <FormWizard
      steps={steps}
      onComplete={async () => form.handleSubmit()}
      showChallenge={true}
    />
  );
}
```

---

## 🎯 STEP_CONFIGURATION

### FormStep Interface

```typescript
export interface FormStep {
  id: string; // Unique step identifier
  title: string; // Display name (shown in progress indicator)
  component: ReactNode; // Step content (form fields)
  isValid?: boolean; // Validation state (optional, defaults to true)
}
```

---

## 📊 PROGRESS_INDICATOR

The `FormWizard` includes a built-in progress indicator that automatically scales based on the `steps` array. It handles completed, current, and pending states with `bg-primary` and `bg-muted` colors.

---

## 🔄 STEP_TRANSITIONS

### Framer Motion Animations

Steps transition using a `mode="wait"` `AnimatePresence`.

- **Enter:** Fade in + Slide from right (x: 20 → 0)
- **Exit:** Fade out + Slide to left (x: 0 → -20)

---

## 🎮 NAVIGATION_CONTROLS

The `FormWizard` provides "Back" and "Next/Submit" buttons. The "Next" button is automatically disabled if `currentStep.isValid` is `false`.

### Navigation Guards

Use `useFormDirtyGuard` to prevent users from accidentally losing data during long form sessions.

```typescript
import { useFormDirtyGuard, useFormErrorFocus } from '@aazucena/forms';

function MyForm() {
  const form = useForm({ ... });
  
  // 1. Prevents leaving page if form is dirty
  useFormDirtyGuard();
  
  // 2. Automatically focuses first error on failed submit
  useFormErrorFocus();

  return (
    <Form>
      {/* ... fields ... */}
    </Form>
  );
}
```

---

## 📊 STORE_SYNCHRONIZATION

For complex applications (like dashboards or 3D scenes), you can sync form state into global stores.

### Nanostore Sync (Cross-Framework)

```typescript
import { useFormStoreSync } from '@aazucena/forms';
import { myAnimationStore } from '@aazucena/stores';

function SceneConfigForm() {
  const form = useForm({ ... });
  
  // Syncs form values to a Nanostore for Three.js/PixiJS consumption
  useFormStoreSync(form, myAnimationStore);
}
```

### Redux Sync (Analytics Dashboards)

```typescript
import { useFormReduxSync } from '@aazucena/forms';
import { useDispatch } from 'react-redux';
import { updateTelemetryConfig } from '@aazucena/stores';

function AnalyticsForm() {
  const form = useForm({ ... });
  const dispatch = useDispatch();
  
  // Syncs form values into Redux state on every change
  useFormReduxSync(form, dispatch, updateTelemetryConfig);
}
```

---

**AUTHOR:** aazucena_wizard_intelligence
