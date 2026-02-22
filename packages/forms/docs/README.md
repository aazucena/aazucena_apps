# @aazucena/forms : Input_Intelligence_System Documentation

## 📚 DOCUMENTATION_INDEX

Complete reference for the aazucena Input Intelligence System.

---

## Quick Start

- **[Validation Guide](./validation-guide.md)** - Zod schemas and custom validators
- **[Wizard Patterns](./wizard-patterns.md)** - Multi-step form state machines
- **[Firewall Integration](./firewall-integration.md)** - AI-powered inquiry gating

---

## Core Topics

### [Field Components] : UI_Integration

Our forms use the `@aazucena/ui` library for the visual presentation layer. The `Form` components in the UI package provide the necessary `variant` support (`default`, `glass`, `cyber`) and are fully compatible with TanStack Form.

### [Multi-Step Wizards] : Orchestration

Managed by the `FormWizard` component in `src/components/FormWizard.tsx`. Provides step tracking, progress indicators, and built-in AI engagement challenges.

### [Validation Schemas] : The_Guards

Centralized Zod validation schemas for all 8 core form types (Contact, Feedback, Testimonial, etc.) located in `src/schemas/index.ts`.

### [Inquiry Firewall] : The_Intelligence

AI-powered scheduling gating system with context-aware filtering via `useEasterEggChallenge.ts`.

---

**MAINTAINER:** aazucena_forms_team
