import { describe, expect, it } from 'vitest';
import { loginSchema, registrationSchema } from './index';

describe('form schemas', () => {
  it('reports an invalid email as a readable message', () => {
    const result = loginSchema.safeParse({ email: 'nope', password: 'secret123' });
    expect(result.success).toBe(false);
    const message = String(result.error?.issues[0]?.message);
    expect(message).toBe('Invalid email address');
  });

  it('keeps the object shape on a refined schema', () => {
    // Zod 3 wrapped .refine() in ZodEffects, which has no .shape
    expect((registrationSchema as { shape?: Record<string, unknown> }).shape?.email).toBeDefined();
  });

  it('still rejects mismatched passwords through refine', () => {
    const result = registrationSchema.safeParse({
      name: 'Rin',
      email: 'rin@example.com',
      password: 'Password123!',
      confirmPassword: 'Password124!',
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toContain('Passwords do not match');
  });
});
