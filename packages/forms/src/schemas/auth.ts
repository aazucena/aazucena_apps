import { z } from 'zod';

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
});

/**
 * Registration Schema
 */
export const registrationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Password Request Schema ("Forgot Password")
 */
export const passwordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Password Reset Schema (token-gated)
 */
export const passwordResetSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type PasswordRequestFormData = z.infer<typeof passwordRequestSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

// =============================================================================
// AUTH (EXTENDED) SCHEMAS
// =============================================================================

/**
 * Invitation Schema (team member invite)
 */
export const invitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['viewer', 'editor', 'admin', 'owner']).default('viewer'),
  personalMessage: z.string().max(300).optional(),
  expiresInDays: z.enum(['7', '14', '30', 'never']).default('7'),
  sendCopy: z.boolean().default(false),
});

/**
 * Security Questions Schema (KBA — knowledge-based authentication)
 */
export const securityQuestionsSchema = z.object({
  question1: z.string().min(1, 'Question is required'),
  answer1: z.string().min(3, 'Answer must be at least 3 characters'),
  question2: z.string().min(1, 'Question is required'),
  answer2: z.string().min(3, 'Answer must be at least 3 characters'),
  question3: z.string().min(1, 'Question is required'),
  answer3: z.string().min(3, 'Answer must be at least 3 characters'),
});

/**
 * OTP Verification Schema (one-time password challenge)
 */
export const otpVerificationSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  rememberDevice: z.boolean().default(false),
  trustDuration: z.enum(['session', '7d', '30d']).default('session'),
});

/**
 * MFA Setup Schema (multi-step: method selection → verification)
 */
export const mfaSetupSchema = z.object({
  method: z.enum(['authenticatorApp', 'sms', 'email', 'hardwareKey']),
  contactDetail: z.string().optional(),
  verificationCode: z.string().regex(/^\d{6}$/).optional(),
});

/**
 * Adaptive Auth Schema (risk-based challenge response)
 */
export const adaptiveAuthSchema = z.object({
  challengeResponse: z.string().min(1, 'Response required'),
  trustDevice: z.boolean().default(false),
  trustDuration: z.enum(['session', '7d', '30d']).default('session'),
});

/**
 * SSO Schema (Single Sign-On provider selection)
 */
export const ssoSchema = z.object({
  provider: z.enum(['google', 'github', 'microsoft', 'okta', 'auth0', 'saml', 'oidc']),
  tenantDomain: z.string().optional(),
  ssoEmail: z.string().email().optional().or(z.literal('')),
});

/**
 * Biometric Auth Schema (WebAuthn / device biometric consent)
 */
export const biometricAuthSchema = z.object({
  consentGranted: z.boolean().refine((v) => v === true, { message: 'Consent is required to proceed' }),
  preferredMethod: z.enum(['faceId', 'fingerprint', 'either']).default('either'),
  fallbackMethod: z.enum(['pin', 'password', 'none']).default('password'),
});

/**
 * Certificate Auth Schema (mTLS / client-certificate authentication)
 */
export const certificateAuthSchema = z.object({
  certificatePem: z.string().min(1, 'Certificate is required'),
  privateKeyPem: z.string().optional(),
  passphrase: z.string().optional(),
  rememberCertificate: z.boolean().default(false),
});

/**
 * Token Auth Schema (API key / JWT / OAuth token)
 */
export const tokenAuthSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  tokenType: z.enum(['bearer', 'apiKey', 'jwt', 'oauth']).default('bearer'),
  label: z.string().max(80).optional(),
  expiresAt: z.string().optional(),
});

/**
 * Hardware Key Schema (FIDO2 / WebAuthn security key registration)
 */
export const hardwareKeySchema = z.object({
  keyNickname: z.string().min(1, 'Nickname is required').max(50),
  authenticatorAttachment: z.enum(['platform', 'cross-platform', 'any']).default('any'),
  userVerification: z.enum(['required', 'preferred', 'discouraged']).default('preferred'),
  requireResidentKey: z.boolean().default(false),
  attestationType: z.enum(['none', 'indirect', 'direct']).default('none'),
});

export type InvitationFormData = z.infer<typeof invitationSchema>;
export type SecurityQuestionsFormData = z.infer<typeof securityQuestionsSchema>;
export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;
export type MFASetupFormData = z.infer<typeof mfaSetupSchema>;
export type AdaptiveAuthFormData = z.infer<typeof adaptiveAuthSchema>;
export type SSOFormData = z.infer<typeof ssoSchema>;
export type BiometricAuthFormData = z.infer<typeof biometricAuthSchema>;
export type CertificateAuthFormData = z.infer<typeof certificateAuthSchema>;
export type TokenAuthFormData = z.infer<typeof tokenAuthSchema>;
export type HardwareKeyFormData = z.infer<typeof hardwareKeySchema>;
