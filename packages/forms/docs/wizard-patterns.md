# Multi-Step Form Wizard Patterns

## SUMMARY

State machine-driven multi-step forms with progress tracking, step validation, persistence, and Framer Motion animations.

---

## 🧙 FORMWIZARD_COMPONENT

### Basic Usage

```typescript
import { FormWizard } from '@aazucena/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '@aazucena/forms/schemas';

function ContactWizard() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleComplete = async () => {
    const data = form.getValues();
    await submitForm(data);
  };

  const steps = [
    {
      id: 'personal',
      title: 'Personal Info',
      component: (
        <div className="space-y-4">
          <input {...form.register('name')} placeholder="Your Name" />
          <input {...form.register('email')} placeholder="Email Address" />
        </div>
      ),
      isValid: !form.formState.errors.name && !form.formState.errors.email,
    },
    {
      id: 'message',
      title: 'Your Message',
      component: (
        <div className="space-y-4">
          <input {...form.register('subject')} placeholder="Subject" />
          <textarea {...form.register('message')} placeholder="Message" rows={8} />
        </div>
      ),
      isValid: !form.formState.errors.subject && !form.formState.errors.message,
    },
    {
      id: 'review',
      title: 'Review',
      component: (
        <div className="space-y-2">
          <p><strong>Name:</strong> {form.watch('name')}</p>
          <p><strong>Email:</strong> {form.watch('email')}</p>
          <p><strong>Subject:</strong> {form.watch('subject')}</p>
          <p><strong>Message:</strong> {form.watch('message')}</p>
        </div>
      ),
      isValid: true,
    },
  ];

  return (
    <FormWizard
      steps={steps}
      onComplete={handleComplete}
      showChallenge={true}
    />
  );
}
```

**Key Features:**

- **Progress Indicator:** Visual stepper with numbered circles
- **Step Validation:** `isValid` flag prevents navigation to next step
- **Framer Motion:** Smooth transitions between steps (fade + slide)
- **AI Challenge:** Optional Easter egg challenge before final submission

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

**Best Practices:**

1. **Unique IDs:** Use descriptive IDs ('personal', 'contact', 'payment')
2. **Short Titles:** 1-2 words for progress indicator (e.g., 'Info', 'Details', 'Review')
3. **Component Composition:** Each step is a self-contained form section
4. **Validation:** Set `isValid` based on form state to enable/disable "Next" button

---

## 📊 PROGRESS_INDICATOR

### Visual Design

The FormWizard includes a built-in progress indicator:

```typescript
// Progress indicator automatically renders:
// [1]----[2]----[3]
//  ✓      •      ○

// States:
// - Completed: Filled circle with checkmark (bg-primary)
// - Current: Filled circle with number (bg-primary)
// - Pending: Empty circle with number (bg-muted)
```

**Responsive Behavior:**

- Desktop: Step numbers + titles
- Mobile: Step numbers only (titles hidden with `hidden md:block`)

**Styling:**

```typescript
<div className="flex justify-between items-center mb-12">
  {steps.map((step, idx) => (
    <div key={step.id} className="flex flex-col items-center flex-1 relative">
      {/* Circle */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center',
        idx <= currentStepIndex
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
      )}>
        {idx + 1}
      </div>

      {/* Title (Desktop Only) */}
      <span className="text-[10px] uppercase tracking-widest mt-2 font-medium hidden md:block">
        {step.title}
      </span>

      {/* Line Connector */}
      {idx < steps.length - 1 && (
        <div className={cn(
          'absolute top-4 left-[50%] w-full h-[2px] -z-0',
          idx < currentStepIndex ? 'bg-primary' : 'bg-muted'
        )} />
      )}
    </div>
  ))}
</div>
```

---

## 🔄 STEP_TRANSITIONS

### Framer Motion Animations

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep?.id}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {currentStep?.component}
  </motion.div>
</AnimatePresence>
```

**Animation Sequence:**

1. **Exit (Previous Step):**
   - Fade out (opacity: 1 → 0)
   - Slide left (x: 0 → -20)
   - Duration: 300ms

2. **Enter (Next Step):**
   - Fade in (opacity: 0 → 1)
   - Slide right (x: 20 → 0)
   - Duration: 300ms

**Custom Animations:**

```typescript
// Faster transitions
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
>

// Scale + Fade
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.25 }}
>

// Vertical Slide
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

---

## 🎮 NAVIGATION_CONTROLS

### Built-In Navigation

```typescript
const handleNext = () => {
  if (!isLastStep) {
    setCurrentStepIndex((prev) => prev + 1);
  } else {
    onComplete(); // Trigger submission
  }
};

const handleBack = () => {
  setCurrentStepIndex((prev) => prev - 1);
};
```

**Button Logic:**

```typescript
<div className="flex justify-between mt-8">
  {/* Back Button (hidden on first step) */}
  {currentStepIndex > 0 && (
    <Button variant="outline" onClick={handleBack}>
      Back
    </Button>
  )}

  {/* Next/Submit Button */}
  <Button
    onClick={handleNext}
    disabled={!currentStep?.isValid || isSubmitting}
    className="ml-auto"
  >
    {isLastStep ? 'Submit' : 'Next'}
  </Button>
</div>
```

**Keyboard Shortcuts:**

```typescript
// Add keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep?.isValid) {
      handleNext();
    } else if (e.key === 'Escape' && currentStepIndex > 0) {
      handleBack();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentStepIndex, currentStep]);
```

---

## 💾 STATE_PERSISTENCE

### localStorage Pattern

```typescript
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function PersistentWizard() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const STORAGE_KEY = 'contact-form-draft';

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        Object.keys(draft).forEach((key) => {
          form.setValue(key, draft[key]);
        });
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Clear draft on successful submission
  const handleComplete = async () => {
    await submitForm(form.getValues());
    localStorage.removeItem(STORAGE_KEY);
  };

  return <FormWizard steps={steps} onComplete={handleComplete} />;
}
```

**Features:**

- Auto-save on every field change
- Restore draft on page reload
- Clear draft after successful submission

---

## ✅ STEP_VALIDATION

### Field-Level Validation

```typescript
import { useFormState } from 'react-hook-form';

function StepWithValidation() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange', // Validate on every change
  });

  const { errors } = form.formState;

  const steps = [
    {
      id: 'step1',
      title: 'Step 1',
      component: <StepOneFields form={form} />,
      isValid: !errors.field1 && !errors.field2, // Check specific fields
    },
  ];

  return <FormWizard steps={steps} />;
}
```

**Validation Strategies:**

```typescript
// Strategy 1: All fields must be valid
isValid: Object.keys(errors).length === 0;

// Strategy 2: Specific fields only
isValid: !errors.name && !errors.email;

// Strategy 3: Custom validation function
isValid: validateStep1(form.getValues());

// Strategy 4: Async validation
const [isValid, setIsValid] = useState(false);

useEffect(() => {
  const validate = async () => {
    const valid = await checkEmailUniqueness(form.watch('email'));
    setIsValid(valid && !errors.email);
  };

  validate();
}, [form.watch('email'), errors.email]);
```

---

## 🔗 MULTI_SCHEMA_WIZARD

### Separate Schema per Step

```typescript
import { z } from 'zod';

// Step 1: Personal Info
const step1Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// Step 2: Contact Details
const step2Schema = z.object({
  phone: z.string().optional(),
  address: z.string().min(10),
});

// Step 3: Message
const step3Schema = z.object({
  subject: z.string().min(5),
  message: z.string().min(10),
});

// Combined schema for final submission
const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

function MultiSchemaWizard() {
  const form = useForm({
    resolver: zodResolver(fullSchema),
  });

  const steps = [
    {
      id: 'personal',
      title: 'Personal',
      component: <Step1Fields form={form} />,
      isValid: step1Schema.safeParse(form.getValues()).success,
    },
    {
      id: 'contact',
      title: 'Contact',
      component: <Step2Fields form={form} />,
      isValid: step2Schema.safeParse(form.getValues()).success,
    },
    {
      id: 'message',
      title: 'Message',
      component: <Step3Fields form={form} />,
      isValid: step3Schema.safeParse(form.getValues()).success,
    },
  ];

  return <FormWizard steps={steps} />;
}
```

---

## 🎨 CONDITIONAL_STEPS

### Dynamic Step Generation

```typescript
function DynamicWizard() {
  const [formType, setFormType] = useState<'basic' | 'advanced'>('basic');

  const baseSteps = [
    { id: 'info', title: 'Info', component: <InfoStep /> },
  ];

  const advancedSteps = [
    { id: 'details', title: 'Details', component: <DetailsStep /> },
    { id: 'review', title: 'Review', component: <ReviewStep /> },
  ];

  const steps = formType === 'advanced'
    ? [...baseSteps, ...advancedSteps]
    : baseSteps;

  return (
    <div>
      <select value={formType} onChange={(e) => setFormType(e.target.value)}>
        <option value="basic">Basic</option>
        <option value="advanced">Advanced</option>
      </select>

      <FormWizard steps={steps} />
    </div>
  );
}
```

---

## 🧪 TESTING_PATTERNS

### Unit Test: Step Navigation

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { FormWizard } from '@aazucena/forms';

describe('FormWizard', () => {
  const mockSteps = [
    { id: '1', title: 'Step 1', component: <div>Step 1 Content</div> },
    { id: '2', title: 'Step 2', component: <div>Step 2 Content</div> },
  ];

  it('should navigate to next step', () => {
    render(<FormWizard steps={mockSteps} onComplete={jest.fn()} />);

    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
  });

  it('should navigate back', () => {
    render(<FormWizard steps={mockSteps} onComplete={jest.fn()} />);

    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Back'));

    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
  });

  it('should call onComplete on last step', () => {
    const onComplete = jest.fn();
    render(<FormWizard steps={mockSteps} onComplete={onComplete} />);

    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Submit'));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📋 REAL_WORLD_EXAMPLES

### Example 1: Contact Form Wizard

```typescript
import { FormWizard } from '@aazucena/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '@aazucena/forms/schemas';
import { useFormSubmit } from '@aazucena/forms/hooks';

function ContactFormWizard() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      formType: 'Contact',
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const { submitForm, isSubmitting, success, error } = useFormSubmit();

  const handleComplete = async () => {
    await submitForm(form.getValues());
  };

  if (success) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
        <p>Your message has been sent. I'll get back to you soon.</p>
      </div>
    );
  }

  const steps = [
    {
      id: 'personal',
      title: 'Who Are You?',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              {...form.register('name')}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              {...form.register('email')}
              type="email"
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="john@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>
      ),
      isValid: !form.formState.errors.name && !form.formState.errors.email,
    },
    {
      id: 'message',
      title: 'Your Message',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              {...form.register('subject')}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="What's this about?"
            />
            {form.formState.errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              {...form.register('message')}
              className="w-full px-4 py-3 border rounded-lg"
              rows={8}
              placeholder="Tell me more..."
            />
            {form.formState.errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>
        </div>
      ),
      isValid: !form.formState.errors.subject && !form.formState.errors.message,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      component: (
        <div className="space-y-4">
          <div className="bg-muted/50 p-6 rounded-lg space-y-3">
            <div>
              <span className="font-semibold">Name:</span> {form.watch('name')}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {form.watch('email')}
            </div>
            <div>
              <span className="font-semibold">Subject:</span> {form.watch('subject')}
            </div>
            <div>
              <span className="font-semibold">Message:</span>
              <p className="mt-2 whitespace-pre-wrap">{form.watch('message')}</p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      ),
      isValid: true,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Get In Touch</h1>
      <FormWizard
        steps={steps}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
        showChallenge={true}
      />
    </div>
  );
}
```

---

## 🎯 BEST_PRACTICES

### Do's ✅

1. **Validate Each Step:** Set `isValid` based on form state
2. **Persist Drafts:** Use localStorage to save progress
3. **Clear Feedback:** Show validation errors inline
4. **Smooth Animations:** Use Framer Motion for transitions
5. **Keyboard Nav:** Support Enter (next) and Escape (back)
6. **Accessible:** Use semantic HTML and ARIA labels
7. **Responsive:** Hide step titles on mobile
8. **Loading States:** Disable buttons during submission

### Don'ts ❌

1. **Don't Skip Validation:** Allow invalid steps to proceed
2. **Don't Lose Data:** Forget to persist form state
3. **Don't Block Back:** Prevent users from going back
4. **Don't Hide Progress:** Make it unclear which step user is on
5. **Don't Auto-Advance:** Move to next step without user action
6. **Don't Ignore Errors:** Submit without showing validation errors

---

**AUTHOR:** aazucena_wizard_intelligence
