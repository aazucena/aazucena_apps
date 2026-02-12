# Form Patterns

## SUMMARY

Comprehensive guide to building forms with react-hook-form, Zod validation, multi-step wizards, and error handling patterns using @aazucena/ui components.

---

## 🏗️ BASIC_FORM_SETUP

### Simple Login Form

```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from '@aazucena/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Login successful');
      } else {
        form.setError('root', { message: 'Invalid credentials' });
      }
    } catch (error) {
      form.setError('root', { message: 'Network error' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## ✅ ZOD_VALIDATION

### Advanced Schema Validation

```typescript
import { z } from 'zod';

// Registration form schema
const registrationSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

    email: z.string().email('Invalid email address'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    confirmPassword: z.string(),

    dateOfBirth: z.date().refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18;
      },
      { message: 'You must be at least 18 years old' }
    ),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: undefined,
      acceptTerms: false,
    },
  });

  // Form implementation
}
```

---

### Custom Validators

```typescript
// Custom email domain validator
const emailDomainValidator = (allowedDomains: string[]) =>
  z.string().email().refine(
    (email) => {
      const domain = email.split('@')[1];
      return allowedDomains.includes(domain);
    },
    { message: `Email must be from allowed domains: ${allowedDomains.join(', ')}` }
  );

// Usage
const schema = z.object({
  email: emailDomainValidator(['company.com', 'partner.com']),
});
```

---

## 🔄 ASYNC_VALIDATION

### Username Availability Check

```typescript
import { z } from 'zod';

const usernameSchema = z.string().refine(
  async (username) => {
    const response = await fetch(`/api/check-username?username=${username}`);
    const { available } = await response.json();
    return available;
  },
  { message: 'Username is already taken' }
);

// Usage in form
const form = useForm({
  resolver: zodResolver(z.object({ username: usernameSchema })),
  mode: 'onBlur',  // Validate on blur to avoid excessive API calls
});
```

---

### Debounced Async Validation

```typescript
import { useCallback } from 'react';
import { debounce } from 'lodash';

function SignupForm() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Debounced username check
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length < 3) return;

      const response = await fetch(`/api/check-username?username=${username}`);
      const { available } = await response.json();

      if (!available) {
        form.setError('username', { message: 'Username is already taken' });
      } else {
        form.clearErrors('username');
      }
    }, 500),
    []
  );

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    checkUsername(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

## 🧙 MULTI_STEP_WIZARDS

### State Machine Pattern

```typescript
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, Progress } from '@aazucena/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Step schemas
const step1Schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email(),
});

const step2Schema = z.object({
  company: z.string().min(1, 'Required'),
  position: z.string().min(1, 'Required'),
  yearsExperience: z.number().min(0),
});

const step3Schema = z.object({
  bio: z.string().max(500),
  interests: z.array(z.string()),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type WizardData = Step1Data & Step2Data & Step3Data;

function MultiStepWizard() {
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2' | 'step3'>('step1');
  const [wizardData, setWizardData] = useState<Partial<WizardData>>({});

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: wizardData,
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: wizardData,
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: wizardData,
  });

  const onStep1Submit = (data: Step1Data) => {
    setWizardData((prev) => ({ ...prev, ...data }));
    setCurrentStep('step2');
  };

  const onStep2Submit = (data: Step2Data) => {
    setWizardData((prev) => ({ ...prev, ...data }));
    setCurrentStep('step3');
  };

  const onStep3Submit = async (data: Step3Data) => {
    const finalData = { ...wizardData, ...data };
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData),
    });
  };

  const progressValue = currentStep === 'step1' ? 33 : currentStep === 'step2' ? 66 : 100;

  return (
    <div className="space-y-4">
      <Progress value={progressValue} />

      <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as typeof currentStep)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="step1" disabled={currentStep !== 'step1'}>
            Personal
          </TabsTrigger>
          <TabsTrigger value="step2" disabled={currentStep === 'step1'}>
            Professional
          </TabsTrigger>
          <TabsTrigger value="step3" disabled={currentStep !== 'step3'}>
            Bio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
              <FormField
                control={step1Form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Other fields */}
              <Button type="submit">Next</Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="step2">
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
              {/* Step 2 fields */}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setCurrentStep('step1')}>
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="step3">
          <Form {...step3Form}>
            <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-4">
              {/* Step 3 fields */}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setCurrentStep('step2')}>
                  Back
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 🎯 CONDITIONAL_FIELDS

### Dynamic Form Fields

```typescript
import { useWatch } from 'react-hook-form';

function DynamicForm() {
  const form = useForm({
    defaultValues: {
      accountType: 'personal',
      companyName: '',
      vatNumber: '',
    },
  });

  // Watch accountType to conditionally show fields
  const accountType = useWatch({ control: form.control, name: 'accountType' });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <FormControl>
                <select {...field} className="w-full">
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Conditional business fields */}
        {accountType === 'business' && (
          <>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
}
```

---

## 🚨 ERROR_HANDLING

### Field-Level Errors

```typescript
function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={fieldState.error ? 'border-red-500' : ''}
                  aria-invalid={!!fieldState.error}
                  aria-describedby={fieldState.error ? 'email-error' : undefined}
                />
              </FormControl>
              <FormMessage id="email-error" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

### Form-Level Errors

```typescript
function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Set form-level error
        form.setError('root', {
          type: 'server',
          message: 'Invalid credentials. Please try again.',
        });
      }
    } catch (error) {
      form.setError('root', {
        type: 'network',
        message: 'Network error. Please check your connection.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit">Log In</Button>
      </form>
    </Form>
  );
}
```

---

## 🎨 CUSTOM_FIELD_COMPONENTS

### Reusable Form Field Wrapper

```typescript
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@aazucena/ui';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface CustomFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  render: (field: any) => React.ReactNode;
}

function CustomField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  render,
}: CustomFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{render(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Usage
function MyForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form>
        <CustomField
          control={form.control}
          name="email"
          label="Email Address"
          description="We'll never share your email"
          render={(field) => <Input type="email" {...field} />}
        />
      </form>
    </Form>
  );
}
```

---

## 🔐 FILE_UPLOAD_PATTERNS

### Single File Upload

```typescript
function FileUploadForm() {
  const form = useForm({
    defaultValues: {
      avatar: null as File | null,
    },
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              {value && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(value)}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

**AUTHOR:** aazucena_form_intelligence
