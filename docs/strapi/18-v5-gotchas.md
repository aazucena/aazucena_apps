# Strapi v5 Known Issues & Workarounds

**[← Back to Index](./README.md)**

---

## 🎯 Quick Reference

This document lists all known Strapi v5 bugs, gotchas, and workarounds in one place for quick lookup.

**Last Updated:** 2025-12-01

---

## Table of Contents

1. [Lifecycle Hooks Breaking Change](#1-lifecycle-hooks-breaking-change) - 🔴 CRITICAL
2. [JSON Field Serialization Bug](#2-json-field-serialization-bug) - 🔴 CRITICAL
3. [UID Field Auto-Generation Bug](#3-uid-field-auto-generation-bug) - 🟡 HIGH
4. [Enumeration Naming Constraint](#4-enumeration-naming-constraint) - 🟡 HIGH
5. [Component Min/Max Configuration](#5-component-minmax-configuration) - 🟢 MEDIUM
6. [i18n Field-Level Best Practices](#6-i18n-field-level-best-practices) - 🟢 MEDIUM

---

## 1. Lifecycle Hooks Breaking Change

### 🔴 **CRITICAL - Will Cause Duplicate Processing**

**Issue:** Lifecycle hooks behavior changed in Strapi v5 with Draft & Publish enabled.

**What Happens:**

When publishing a draft, Strapi v5 triggers:
1. `beforeDelete` + `afterDelete` on the old published entry
2. `beforeCreate` + `afterCreate` on the new published entry

This causes lifecycle hooks to fire **twice**, creating:
- Duplicate embeddings
- Duplicate processing
- Unexpected side effects

**Affected Operations:**
- Auto-generating embeddings (pgVector)
- Auto-calculating fields (readTime, tableOfContents)
- AI processing (form submissions)
- Any async operation in lifecycle hooks

**❌ Old Approach (v4 - Broken in v5):**
```typescript
// src/api/project/content-types/project/lifecycles.ts
export default {
  async beforeCreate(event) {
    const { data } = event.params;
    // This will fire twice when publishing drafts!
    const embedding = await generateEmbedding(data.description);
    data.descriptionEmbedding = embedding;
  }
};
```

**✅ Recommended Solution (v5 - Document Service Middleware):**
```typescript
// config/middlewares.ts
export default [
  'strapi::errors',
  // ... other middlewares
  {
    name: 'global::embedding-generator',
    config: {},
  },
];

// src/middlewares/embedding-generator.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // Only process successful POST/PUT requests
    if (!['POST', 'PUT'].includes(ctx.request.method) || ctx.status >= 400) {
      return;
    }

    const { uid } = ctx.params;
    const entityId = ctx.response.body?.data?.id;

    // Process asynchronously (don't block response)
    setImmediate(async () => {
      // Generate embeddings here
    });
  };
};
```

**References:**
- [Strapi v5 Breaking Changes - Lifecycle Hooks](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
- [GitHub Issue #2091 - Undocumented Breaking Change](https://github.com/strapi/documentation/issues/2091)
- **[Full Implementation Guide →](./08-pgvector-setup.md#step-3-document-service-middleware-strapi-v5)**

**Impact:** All content types with auto-processing (Projects, Blog Posts, Form Submissions, etc.)

---

## 2. JSON Field Serialization Bug

### 🔴 **CRITICAL - Affects AI Forms & pgVector**

**Issue:** JSON fields are returned as strings instead of objects in Strapi v5.

**Affected Fields:**
- Form Submissions: `structuredData`, `aiTags`, `messageEmbedding`, `summaryEmbedding`
- Blog Posts: `tableOfContents`, `contentEmbedding`
- Music Tracks: `waveformData`
- Projects: `descriptionEmbedding`
- Any JSON field type

**What Happens:**
```typescript
// Expected (v4 behavior)
const post = await strapi.entityService.findOne('api::blog-post.blog-post', id);
console.log(typeof post.tableOfContents); // "object"

// Actual (v5 bug)
console.log(typeof post.tableOfContents); // "string" 😱
```

**❌ Will Break Your Code:**
```typescript
// This will throw TypeError: Cannot read properties of undefined
const firstHeading = post.tableOfContents.headings[0];
```

**✅ Backend Workaround:**
```typescript
// Always parse JSON fields when retrieving
const post = await strapi.entityService.findOne('api::blog-post.blog-post', id);

// Parse JSON fields
const tableOfContents = typeof post.tableOfContents === 'string'
  ? JSON.parse(post.tableOfContents)
  : post.tableOfContents;

const contentEmbedding = typeof post.contentEmbedding === 'string'
  ? JSON.parse(post.contentEmbedding)
  : post.contentEmbedding;
```

**✅ Reusable Utility Function:**
```typescript
// utils/parseJsonField.ts
export const parseJsonField = (field: any): any => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (error) {
      console.error('Failed to parse JSON field:', error);
      return field;
    }
  }
  return field;
};

// Usage
const tableOfContents = parseJsonField(post.tableOfContents);
const contentEmbedding = parseJsonField(post.contentEmbedding);
```

**✅ Frontend Workaround (React):**
```typescript
// hooks/useParseJsonFields.ts
export const useParseJsonFields = <T extends Record<string, any>>(
  data: T | null,
  jsonFields: (keyof T)[]
): T | null => {
  if (!data) return null;

  const parsed = { ...data };
  jsonFields.forEach(field => {
    parsed[field] = parseJsonField(data[field]);
  });

  return parsed;
};

// Usage
const BlogPost = ({ postId }) => {
  const { data: post } = useQuery(['blog-post', postId], fetchPost);

  const parsedPost = useParseJsonFields(post, [
    'tableOfContents',
    'contentEmbedding'
  ]);

  return <div>{parsedPost?.tableOfContents.headings.map(...)}</div>;
};
```

**✅ Form Submissions Specific (Multiple JSON Fields):**
```typescript
// services/formSubmissions.ts
const parseFormSubmission = (submission: any) => ({
  ...submission,
  structuredData: parseJsonField(submission.structuredData),
  aiTags: parseJsonField(submission.aiTags),
  messageEmbedding: parseJsonField(submission.messageEmbedding),
  summaryEmbedding: parseJsonField(submission.summaryEmbedding),
});

// Usage
const submissions = await strapi.entityService.findMany('api::form-submission.form-submission');
const parsed = submissions.map(parseFormSubmission);
```

**References:**
- [GitHub Issue #20114 - JSON Field String Bug](https://github.com/strapi/strapi/issues/20114)
- **[pgVector Setup - JSON Field Workarounds →](./08-pgvector-setup.md#json-field-serialization-bug)**

**Impact:** All content types with JSON fields (10+ fields across 4 content types)

---

## 3. UID Field Auto-Generation Bug

### 🟡 **HIGH - Affects All Slugs**

**Issue:** UID fields (slugs) do not auto-generate correctly from attached fields in Strapi v5.

**Symptoms:**

**If UID is NOT required:**
- Slug field remains empty when creating content
- No error shown, just silently fails

**If UID IS required:**
- Slug uses **collection name** instead of attached field value
- Example: Creating "My Awesome Post" → slug becomes "blog-post" instead of "my-awesome-post"

**Affected Content Types:**
- Music Genres (`slug` from `name`)
- Posts (`slug` from `title`)
- Projects (`slug` from `title`)
- Compositions (`slug` from `title`)

**❌ Expected Behavior (v4):**
```typescript
// Create blog post
{
  "title": "Getting Started with Astro",
  // slug auto-generated: "getting-started-with-astro"
}
```

**😱 Actual Behavior (v5):**
```typescript
// Create blog post
{
  "title": "Getting Started with Astro",
  "slug": ""  // Empty if not required, or "blog-post" if required
}
```

**✅ Workaround 1: Install Plugin (Recommended)**
```bash
npm install strapi-plugin-auto-slug-manager-a-mi13
```

This plugin automatically generates slugs from attached fields.

**✅ Workaround 2: Manual Generation in Middleware**
```typescript
// src/middlewares/slug-generator.ts
import slugify from 'slugify';

export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    if (!['POST', 'PUT'].includes(ctx.request.method) || ctx.status >= 400) {
      return;
    }

    const { uid } = ctx.params;
    const entityId = ctx.response.body?.data?.id;

    // Configure slug fields for each content type
    const slugConfigs = {
      'api::blog-post.blog-post': { from: 'title', to: 'slug' },
      'api::project.project': { from: 'title', to: 'slug' },
      'api::music-genre.music-genre': { from: 'name', to: 'slug' },
      'api::blog-series.blog-series': { from: 'title', to: 'slug' },
      'api::composition.composition': { from: 'title', to: 'slug' },
    };

    const config = slugConfigs[uid];
    if (!config) return;

    setImmediate(async () => {
      const entity = await strapi.documents(uid).findOne({ documentId: entityId });

      if (!entity[config.to] && entity[config.from]) {
        const slug = slugify(entity[config.from], {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        });

        await strapi.db.query(uid).update({
          where: { id: entityId },
          data: { [config.to]: slug },
        });
      }
    });
  };
};
```

**✅ Workaround 3: Frontend Validation**
```typescript
// In admin panel, require users to manually enter slugs
// Add validation to ensure slug is unique

const validateSlug = async (slug: string, contentType: string) => {
  const exists = await strapi.db.query(contentType).findOne({
    where: { slug },
  });

  if (exists) {
    throw new Error('Slug already exists. Please choose a different slug.');
  }
};
```

**References:**
- [GitHub Issue #21472 - UID Field Bug](https://github.com/strapi/strapi/issues/21472)
- **[Core Collection Types - UID Bug Details →](./04-collection-types-core.md#uid-field-auto-generation-bug)**

**Impact:** 5 content types with slug fields

---

## 4. Enumeration Naming Constraint

### 🟡 **HIGH - Will Crash GraphQL Plugin**

**Issue:** Enumeration values that start with numbers or special characters will crash the GraphQL plugin.

**Why:** GraphQL schema generation fails when enum values don't start with alphabetical characters (A-Z, a-z).

**✅ Valid Enum Values:**
```typescript
// All start with letters - SAFE
enum ProjectType {
  WebApp = "Web App",
  MobileApp = "Mobile App",
  DesktopApp = "Desktop App"
}

enum Status {
  InProgress = "In Progress",
  Completed = "Completed",
  OnHold = "On Hold"
}

enum AwardCategory {
  FirstPlace = "First Place",    // ✅ Starts with 'F'
  Award2023 = "Award 2023"       // ✅ Starts with 'A'
}
```

**❌ Invalid Enum Values (Will Crash):**
```typescript
// Starts with numbers - WILL CRASH
enum CompanySize {
  1-10 = "1-10",               // ❌ Starts with number
  11-50 = "11-50",             // ❌ Starts with number
  51-200 = "51-200"            // ❌ Starts with number
}

enum AwardRank {
  1stPlace = "1st Place",      // ❌ Starts with number
  2ndPlace = "2nd Place",      // ❌ Starts with number
  3rdPlace = "3rd Place"       // ❌ Starts with number
}

enum Completion {
  100Percent = "100% Complete" // ❌ Starts with number
}
```

**✅ Fix Invalid Enums:**
```typescript
// Prefix with text
enum CompanySize {
  Employees1To10 = "Employees 1-10",
  Employees11To50 = "Employees 11-50",
  Employees51To200 = "Employees 51-200"
}

// Alternative: Use descriptive words
enum CompanySize {
  Tiny = "Tiny (1-10)",
  Small = "Small (11-50)",
  Medium = "Medium (51-200)"
}

enum AwardRank {
  FirstPlace = "First Place",
  SecondPlace = "Second Place",
  ThirdPlace = "Third Place"
}

enum Completion {
  Complete = "100% Complete"
}
```

**🚨 Known Issue in Docs:**

The **Experience** content type has an invalid `companySize` enumeration that **must be fixed**:

**Before (INVALID):**
```json
{
  "companySize": "1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5000+"
}
```

**After (VALID):**
```json
{
  "companySize": "Employees 1-10, Employees 11-50, Employees 51-200, Employees 201-500, Employees 501-1000, Employees 1001-5000, Employees 5000+"
}
```

**References:**
- [Strapi v4 Docs - Enumeration Constraints](https://docs-v4.strapi.io/user-docs/content-type-builder/configuring-fields-content-type)
- **[Core Collection Types - Enum Naming →](./04-collection-types-core.md#enumeration-naming-constraint)**
- **[Content Types - companySize Fix →](./05-collection-types-content.md#enumeration-naming---critical-fix-required)**

**Impact:** All content types with enumerations (8+ enum fields across 6 content types)

---

## 5. Component Min/Max Configuration

### 🟢 **MEDIUM - Documentation Clarity**

**Issue:** Documentation doesn't explain how to configure min/max for repeatable components.

**What's Unclear:**

Docs say:
```markdown
`stats` - component (content.stats, repeatable, max: 6)
```

But don't explain **where** to set `max: 6`.

**✅ How to Configure:**

1. In Content-Type Builder, select the repeatable component field
2. Click **"Advanced Settings"** tab
3. Set **"Maximum Value"**: 6
4. Set **"Minimum Value"**: 0 (or 1 if required)
5. Click **"Save"**

**Note:** Min/max settings are stored in Strapi's internal configuration, **not in schema.json**.

**Example:**

```typescript
// You WON'T see this in schema.json:
{
  "stats": {
    "type": "component",
    "repeatable": true,
    "component": "content.stats",
    "max": 6  // ❌ Not in schema
  }
}

// You'll only see this:
{
  "stats": {
    "type": "component",
    "repeatable": true,
    "component": "content.stats"
    // ✅ Max is configured in UI
  }
}
```

**References:**
- [Strapi v5 Models Documentation](https://docs.strapi.io/cms/backend-customization/models)
- [GitHub Issue #20495 - Repeatable Component Wording](https://github.com/strapi/strapi/issues/20495)

**Impact:** All content types with repeatable components (Hero, About, Projects, etc.)

---

## 6. i18n Field-Level Best Practices

### 🟢 **MEDIUM - Best Practices**

**Issue:** Documentation shows dual-level i18n configuration but doesn't explain when to use each level.

**Dual-Level Configuration:**

```json
{
  "pluginOptions": {
    "i18n": {
      "localized": true  // Content-type level
    }
  },
  "attributes": {
    "title": {
      "pluginOptions": {
        "i18n": {
          "localized": true  // Field level
        }
      }
    }
  }
}
```

**✅ Localize These Fields:**

- Titles, descriptions, content (text fields)
- URLs, slugs (for SEO)
- Metadata (SEO tags, alt text)
- User-facing messages

**❌ Don't Localize These Fields:**

- IDs, UUIDs (technical identifiers)
- Prices, quantities (shared data)
- Dates, timestamps (unless display format differs)
- Boolean flags (unless meaning changes per locale)
- Taxonomies (skills, genres) - use shared references instead

**Example - Maintenance Mode:**

```json
{
  "enabled": {
    "pluginOptions": {
      "i18n": {
        "localized": false  // ✅ Shared across all locales
      }
    }
  },
  "message": {
    "pluginOptions": {
      "i18n": {
        "localized": true  // ✅ Different per locale
      }
    }
  }
}
```

**⚠️ Warning:** Over-engineering localization creates maintenance nightmares. Be selective.

**Example - Skills Taxonomy:**

**❌ Bad Approach (Over-localized):**
```json
{
  "name": {
    "pluginOptions": {
      "i18n": { "localized": true }
    }
  }
}
// Problem: "React" in English, "React" in French, "React" in Spanish
// Creates duplicate skill entries, breaks skill-to-project relationships
```

**✅ Good Approach (Shared Reference):**
```json
{
  "name": {
    "pluginOptions": {
      "i18n": { "localized": false }  // Keep skill names universal
    }
  },
  "description": {
    "pluginOptions": {
      "i18n": { "localized": true }  // Translate descriptions only
    }
  }
}
```

**References:**
- [Strapi 5 i18n Complete Guide](https://strapi.io/blog/strapi-5-i18n-complete-guide)
- [i18n Best Practices in Strapi](https://strapi.io/blog/i18n-implementation-and-best-practices-in-strapi)
- **[Single Types - i18n Clarification →](./03-single-types.md)**

**Impact:** All content types with i18n enabled (10+ content types)

---

## Quick Lookup Table

| Issue | Severity | Impact | Workaround | Docs |
|-------|----------|--------|-----------|------|
| Lifecycle Hooks | 🔴 CRITICAL | Duplicate processing, embeddings | Use middleware | [08-pgvector-setup.md](./08-pgvector-setup.md#step-3-document-service-middleware-strapi-v5) |
| JSON Field Bug | 🔴 CRITICAL | Strings instead of objects | Parse with `JSON.parse()` | [08-pgvector-setup.md](./08-pgvector-setup.md#json-field-serialization-bug) |
| UID Auto-Generation | 🟡 HIGH | Empty slugs | Install plugin or middleware | [04-collection-types-core.md](./04-collection-types-core.md#uid-field-auto-generation-bug) |
| Enum Naming | 🟡 HIGH | GraphQL crashes | Prefix numbers with text | [04-collection-types-core.md](./04-collection-types-core.md#enumeration-naming-constraint) |
| Component Min/Max | 🟢 MEDIUM | Confusion during setup | Configure in UI Advanced Settings | [Components](./02-components.md) |
| i18n Over-localization | 🟢 MEDIUM | Maintenance burden | Localize selectively | [Single Types](./03-single-types.md) |

---

## Migration Checklist from v4 to v5

Before migrating from Strapi v4 to v5:

- [ ] Replace all lifecycle hooks with middleware
- [ ] Add JSON field parsing to all API responses
- [ ] Install UID auto-generation plugin or create middleware
- [ ] Audit all enumerations for number-starting values
- [ ] Document component min/max settings in UI
- [ ] Review i18n strategy (avoid over-localization)
- [ ] Test Draft & Publish workflows thoroughly
- [ ] Update frontend to handle JSON string serialization

---

## Additional Resources

### Official Strapi v5 Docs
- [Migration Guide v4 → v5](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes)
- [Lifecycle Hooks Breaking Change](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
- [i18n Core Integration](https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/i18n-content-manager-locale)

### GitHub Issues
- [#21472 - UID Field Bug](https://github.com/strapi/strapi/issues/21472)
- [#20114 - JSON Field Bug](https://github.com/strapi/strapi/issues/20114)
- [#2091 - Lifecycle Hooks Undocumented](https://github.com/strapi/documentation/issues/2091)
- [#20495 - Component Min/Max Wording](https://github.com/strapi/strapi/issues/20495)

### Project-Specific Docs
- [pgVector Setup](./08-pgvector-setup.md)
- [Components](./02-components.md)
- [Collection Types - Core](./04-collection-types-core.md)
- [Collection Types - Content](./05-collection-types-content.md)
- [Collection Types - Publishing](./06-collection-types-publishing.md)
- [Collection Types - AI Forms](./07-collection-types-ai.md)

---

**Last Updated:** 2025-12-01

**Maintained By:** Documentation Team

**Questions?** Open an issue or check [Phase 0 Documentation](/docs/phase-0-infrastructure.md)

---

**[← Back to Index](./README.md)**
