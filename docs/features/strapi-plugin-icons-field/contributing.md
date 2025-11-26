# Contributing Guidelines

[← Back to Overview](./README.md)

---

## Welcome Contributors!

Thank you for considering contributing to strapi-plugin-icons-field! This document provides guidelines for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Code Standards](#code-standards)
5. [Commit Convention](#commit-convention)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Ways to Contribute

- 🐛 **Bug reports:** Report issues you encounter
- 💡 **Feature requests:** Suggest new features
- 📖 **Documentation:** Improve or add documentation
- 🧪 **Testing:** Write tests or test new features
- 💻 **Code:** Fix bugs or implement features
- 🌍 **Translations:** Add or improve language translations

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Discuss major changes** in an issue first
3. **Read the documentation** thoroughly
4. **Follow the code standards** outlined below

---

## Development Setup

### Prerequisites

- **Node.js:** >=18
- **Package Manager:** pnpm v10.22.0 (recommended), npm, or yarn
- **Git:** Latest version
- **Strapi:** v5.0.0+

### Clone Repository

```bash
# Fork the repository first on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/strapi-plugin-icons-field.git
cd strapi-plugin-icons-field

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/strapi-plugin-icons-field.git
```

### Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or npm
npm install

# Or yarn
yarn install
```

### Setup Development Environment

```bash
# Link plugin to test Strapi instance
pnpm link

# In your test Strapi project
cd /path/to/test-strapi-project
pnpm link strapi-plugin-icons-field

# Start development server
pnpm develop
```

### Run Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

### Build Plugin

```bash
# Build for production
pnpm build

# Watch mode (for development)
pnpm watch
```

---

## Code Standards

### TypeScript

- **Strict mode enabled:** All code must pass TypeScript strict checks
- **No implicit any:** Explicitly type all variables
- **Use interfaces over types** for object shapes
- **Use Zod for runtime validation**

**Example:**

```typescript
// Good ✅
interface IconMetadata {
  id: string;
  name: string;
  svg: string;
}

const IconSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  svg: z.string()
});

// Bad ❌
type IconMetadata = {
  id: any;
  name: any;
};
```

### Code Style

- **Linting:** ESLint + Prettier
- **Formatting:** 2 spaces, single quotes, semicolons
- **Line length:** 100 characters max
- **File naming:** kebab-case for files, PascalCase for components

**Run linters:**

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Format code
pnpm format
```

### Component Structure

```tsx
// Good ✅
import { useState } from 'react';
import type { FC } from 'react';

interface IconPickerProps {
  onSelect: (icon: IconMetadata) => void;
  initialValue?: IconMetadata;
}

export const IconPicker: FC<IconPickerProps> = ({ onSelect, initialValue }) => {
  const [selected, setSelected] = useState<IconMetadata | null>(initialValue ?? null);

  // Component logic...

  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Service Structure

```typescript
// Good ✅
export default ({ strapi }: { strapi: Strapi }) => ({
  async getManifest(): Promise<IconManifest> {
    // Service logic...
  },

  async invalidateCache(): Promise<void> {
    // Service logic...
  }
});
```

---

## Commit Convention

We follow **Conventional Commits** specification.

### Commit Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic change)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks
- **ci:** CI/CD changes

### Scopes

- **cache:** Icon caching system
- **discovery:** Icon discovery service
- **filter:** Filter system
- **ui:** UI components
- **api:** API endpoints
- **security:** Security features
- **analytics:** Analytics features

### Examples

```bash
# Good ✅
feat(discovery): add automatic icon discovery from node_modules
fix(cache): resolve manifest invalidation race condition
docs(readme): update installation instructions
test(discovery): add unit tests for package resolution
refactor(ui): extract IconGrid into separate component

# Bad ❌
Updated stuff
fix bug
add feature
```

### Commit Message Guidelines

- **Use imperative mood:** "add feature" not "added feature"
- **Be concise:** Subject line <72 characters
- **Explain why:** Include body for complex changes
- **Reference issues:** Include issue number in footer

**Example with body:**

```
feat(discovery): add pnpm workspace resolution

Implements automatic resolution of packages in pnpm workspaces
by walking up the directory tree and checking for pnpm-workspace.yaml.

This enables monorepo support for pnpm users.

Closes #123
```

---

## Pull Request Process

### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feat/your-feature-name
```

### 2. Make Changes

- Write code following standards
- Add tests (85%+ coverage required)
- Update documentation
- Commit with conventional commits

### 3. Test Thoroughly

```bash
# Run all tests
pnpm test

# Check coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint

# Format code
pnpm format
```

### 4. Update Documentation

- Update README.md if needed
- Add/update API documentation
- Update CHANGELOG.md
- Add migration notes if breaking changes

### 5. Push to Your Fork

```bash
git push origin feat/your-feature-name
```

### 6. Open Pull Request

**Title format:** `[Type] Brief description`

**Example:** `[Feature] Add automatic icon discovery from node_modules`

**PR Description Template:**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue

Closes #[issue number]

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
- [ ] Coverage >85%

## Screenshots (if UI changes)

[Add screenshots here]

## Additional Notes

[Any additional information]
```

### 7. Code Review

- Address reviewer feedback
- Make requested changes
- Push updates to same branch
- Re-request review

### 8. Merge

Once approved:
- Squash commits if requested
- Update commit message
- Merge via GitHub

---

## Testing Requirements

### Coverage Targets

- **Unit tests:** 85%+ coverage
- **Integration tests:** 70%+ coverage
- **E2E tests:** 100% critical user flows

### Writing Tests

**Unit Test Example:**

```typescript
// __tests__/unit/services/icon-cache.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { IconCacheService } from '../services/icon-cache';

describe('IconCacheService', () => {
  let cache: IconCacheService;

  beforeEach(() => {
    cache = new IconCacheService(mockStrapi);
  });

  describe('generateManifest', () => {
    it('should generate valid manifest', async () => {
      const manifest = await cache.generateManifest();

      expect(manifest).toMatchObject({
        version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
        icons: expect.any(Array)
      });
    });
  });
});
```

**E2E Test Example:**

```typescript
// __tests__/e2e/icon-selection.spec.ts
import { test, expect } from '@playwright/test';

test('should select icon via keyboard', async ({ page }) => {
  await page.goto('/admin/content-manager');
  await page.click('[data-testid="icon-field"]');

  // Navigate with arrow keys
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');

  await expect(page.locator('[data-testid="selected-icon"]')).toBeVisible();
});
```

---

## Documentation

### Documentation Types

1. **API Documentation:** Document all public APIs
2. **User Guides:** Step-by-step tutorials
3. **Code Comments:** Explain complex logic
4. **README:** Keep up-to-date
5. **CHANGELOG:** Document all changes

### API Documentation Format

```typescript
/**
 * Generate icon manifest from file system
 *
 * Scans the configured icons directory recursively and generates
 * a complete manifest with metadata for all icons.
 *
 * @returns Promise resolving to IconManifest
 * @throws {Error} If icons directory is not accessible
 *
 * @example
 * ```typescript
 * const manifest = await cache.generateManifest();
 * console.log(`Found ${manifest.icons.length} icons`);
 * ```
 */
async generateManifest(): Promise<IconManifest> {
  // Implementation...
}
```

---

## Release Process

### Versioning

We follow **Semantic Versioning (SemVer)**:

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] npm package published
- [ ] GitHub release created

---

## Getting Help

### Resources

- **Documentation:** [docs/](../README.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/strapi-plugin-icons-field/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/strapi-plugin-icons-field/discussions)
- **Strapi Discord:** [#strapi-plugins](https://discord.strapi.io)

### Questions?

- Open a **Discussion** for general questions
- Open an **Issue** for bug reports
- Tag maintainers with `@` for urgent matters

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Featured in README (for significant contributions)

---

## License

By contributing, you agree that your contributions will be licensed under the **MIT License**.

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Thank you for contributing!** 🎉
