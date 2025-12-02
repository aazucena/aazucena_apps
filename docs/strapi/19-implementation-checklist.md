# Collection Types Implementation Checklist

**[← Back to Index](./README.md)**

---

## Pre-Flight Checklist
- [ ] Strapi v5 running at `http://localhost:1337/admin`
- [ ] PostgreSQL 16 + pgVector ready (`docker compose up` successful)
- [ ] Can access Content Manager
- [ ] **READ FIRST:** [18-v5-gotchas.md](./18-v5-gotchas.md) (bookmark critical sections)
- [ ] Have [04-collection-types-core.md](./04-collection-types-core.md) and [05-collection-types-content.md](./05-collection-types-content.md) open for reference
- [ ] **Verify slug-generator middleware:** Check `apps/cms/config/middlewares.ts` contains `'global::slug-generator'`
- [ ] If missing, add to middlewares array:
  ```typescript
  export default [
    'strapi::errors',
    // ... other middlewares
    {
      name: 'global::slug-generator',
      config: {},
    },
  ];
  ```

---

## Phase A: Core Collection Types (45-60 min)

### 1. Skills (15 min)

**Settings:**
- [ ] Content-Type Builder → **Create new collection type**
- [ ] Display Name: `Skill` | API ID: `skill` / `skills`
- [ ] Draft & Publish: **❌ DISABLE**
- [ ] Default sort: `order` (ascending)
- [ ] i18n: **✅ ENABLE**

**Fields (11 total):**
| Field | Type | Config |
|-------|------|--------|
| `name` | Short text | Max 100, Required, Unique |
| `category` | Enum | Values: Frontend, Backend, Database, DevOps, Design, Tools, Music Production, Other |
| `proficiency` | Integer | Min 0, Max 100, Default 50 |
| `icon` | Single image | Optional |
| `description` | Long text | Max 500 |
| `yearsOfExperience` | Decimal | Min 0, Max 50 |
| `isFeatured` | Boolean | Default: false |
| `isCore` | Boolean | Default: false |
| `url` | Short text | Max 255, Regex: `^https?://.*` |
| `order` | Integer | Min 0, Default 0 |

- [ ] **Click "Save"**
- [ ] Test API: `GET http://localhost:1337/api/skills` → Should return 200

---

### 2. Music Genres (10 min)

**Settings:**
- [ ] Content-Type Builder → **Create new collection type**
- [ ] Display Name: `Music Genre` | API ID: `music-genre` / `music-genres`
- [ ] Draft & Publish: **❌ DISABLE**
- [ ] Default sort: `name` (ascending)
- [ ] i18n: **✅ ENABLE**

**Fields (7 total):**
| Field | Type | Config |
|-------|------|--------|
| `name` | Short text | Max 100, Required, Unique |
| `slug` | UID | Attached to `name`, **Required** ⚠️ |
| `description` | Long text | Max 500 |
| `color` | Short text | Max 7, Regex: `^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$` |
| `icon` | Short text | Max 50 (icon name from @mynaui/icons) |
| `coverImage` | Single image | Optional |
| `order` | Integer | Min 0, Default 0 |

- [ ] **Click "Save"**
- [ ] ⚠️ **UID Known Issue:** See [18-v5-gotchas.md - UID Auto-Generation Bug](./18-v5-gotchas.md#3-uid-field-auto-generation-bug) for workarounds
- [ ] Test API: `GET http://localhost:1337/api/music-genres` → Should return 200

---

### 3. Posts (Blog Articles) (10 min)

**Note:** Blog architecture was simplified - single `post` collection type instead of separate Blog Series. See [Collection Types: Publishing](./06-collection-types-publishing.md) for details.

**Settings:**
- [ ] Content-Type Builder → **Create new collection type**
- [ ] Display Name: `Post` | API ID: `post` / `posts`
- [ ] Draft & Publish: **✅ ENABLE**
- [ ] Default sort: `sort` (ascending)
- [ ] i18n: **✅ ENABLE**

**Fields (7 total):**
| Field | Type | Config |
|-------|------|--------|
| `title` | Short text | Max 200, Required |
| `slug` | UID | Attached to `title`, **Required** ⚠️ |
| `description` | Markdown | Required |
| `coverImage` | Component | ui.image-element, Optional |
| `status` | Enum | Values: Planned, In Progress, Completed, On Hold |
| `sort` | Integer | Min 0, Default 0 |
| `featured` | Boolean | Default: false |

- [ ] **Click "Save"**
- [ ] ⚠️ **UID Known Issue:** Same as Music Genres
- [ ] Test API: `GET http://localhost:1337/api/posts` → Should return 200

---

## Phase B: Content Collection Types (45-60 min)

### 4. Projects (25 min)

**Settings:**
- [ ] Content-Type Builder → **Create new collection type**
- [ ] Display Name: `Project` | API ID: `project` / `projects`
- [ ] Draft & Publish: **✅ ENABLE**
- [ ] Default sort: `order` (ascending)
- [ ] i18n: **✅ ENABLE**

**Fields (22 total):**
| Field | Type | Config |
|-------|------|----------|
| `title` | Short text | Max 200, Required |
| `slug` | UID | Attached to `title`, Required ⚠️ |
| `shortDescription` | Long text | Max 300, Required |
| `description` | Markdown | Required |
| `coverImage` | Single image | Required |
| `coverImageAlt` | Short text | Max 150 |
| `screenshots` | Multiple images | Max 10 |
| `demoVideo` | Single file | Video only |
| `gallery` | Multiple images | Max 10 |
| `githubUrl` | Short text | Max 255, Regex: `^https?://github\.com/.*` |
| `repositoryUrl` | Short text | Max 255, Regex: `^https?://.*` |
| `liveDemoUrl` | Short text | Max 255, Regex: `^https?://.*` |
| `projectType` | Enum | Web App, Mobile App, Desktop App, Library, API, CLI Tool, Game, Music Production, Other |
| `featured` | Boolean | Default: true |
| `isFeaturedOnHome` | Boolean | Default: false |
| `order` | Integer | Min 0, Default 0 |
| `startDate` | Date | Date only |
| `endDate` | Date | Date only |
| `status` | Enum | In Progress, Completed, Maintenance, Archived |
| `tags` | Short text | Max 255 |
| `viewCount` | Integer | Min 0, Default 0 |
| `descriptionEmbedding` | JSON | For pgVector (768 dimensions) |

- [ ] **Click "Save"**
- [ ] ⚠️ **UID Known Issue:** See gotchas doc
- [ ] Test API: `GET http://localhost:1337/api/projects` → Should return 200

**Relation Setup (after Experience & Skills created):**
- [ ] Add relation: `techStack` → Many-to-many → Skills
- [ ] Add component: `metrics` → Repeatable → `content.stat` (Min 0, Max 5)
- [ ] Add component: `seo` → Single → `meta.seo-metadata` (Max 1)

---

### 5. Experience (20 min)

**Settings:**
- [ ] Content-Type Builder → **Create new collection type**
- [ ] Display Name: `Experience` | API ID: `experience` / `experiences`
- [ ] Draft & Publish: **✅ ENABLE**
- [ ] Default sort: `startDate` (descending)
- [ ] i18n: **✅ ENABLE**

**Fields (15 total):**
| Field | Type | Config |
|-------|------|--------|
| `company` | Short text | Max 150, Required |
| `position` | Short text | Max 150, Required |
| `companyLogo` | Single image | Optional |
| `companyLogoAlt` | Short text | Max 150 |
| `companyIndustry` | Enum | Technology, Finance, Healthcare, Education, Entertainment, Retail, Manufacturing, Government, Non-Profit, Startup, Other |
| `companySize` | Enum | **Employees 1-10, Employees 11-50, Employees 51-200, Employees 201-500, Employees 501-1000, Employees 1001-5000, Employees 5000+** ⚠️ CRITICAL |
| `location` | Short text | Max 150 |
| `startDate` | Date | Required |
| `endDate` | Date | Optional |
| `isCurrent` | Boolean | Default: false |
| `description` | Markdown | Required |
| `highlights` | Markdown | Optional |
| `employmentType` | Enum | Full-time, Part-time, Contract, Freelance, Internship |
| `companyWebsite` | Short text | Max 255, Regex: `^https?://.*` |
| `order` | Integer | Min 0, Default 0 |

- [ ] **CRITICAL:** `companySize` enum must use **"Employees 1-10"** format (not "1-10")
- [ ] See [18-v5-gotchas.md - Enumeration Naming](./18-v5-gotchas.md#4-enumeration-naming-constraint)
- [ ] **Click "Save"**
- [ ] Test API: `GET http://localhost:1337/api/experiences` → Should return 200

**Relation Setup (after Skills & Projects created):**
- [ ] Add relation: `skillsUsed` → Many-to-many → Skills
- [ ] Add relation: `projectsCompleted` → Many-to-many → Projects
- [ ] Add component: `achievements` → Repeatable → `content.achievement` (Min 0, Max 10)

---

### 6. Testimonials (15 min)

**Settings:**
- [ ] Content-Type Builder → **Create new collection type**
- [ ] Display Name: `Testimonial` | API ID: `testimonial` / `testimonials`
- [ ] Draft & Publish: **✅ ENABLE**
- [ ] Default sort: `createdAt` (descending)
- [ ] i18n: **✅ ENABLE**

**Fields (18 total):**
| Field | Type | Config |
|-------|------|--------|
| `author` | Short text | Max 100, Required |
| `authorTitle` | Short text | Max 150 |
| `company` | Short text | Max 100 |
| `content` | Long text | Max 1000, Required |
| `avatar` | Single image | Optional |
| `rating` | Integer | Min 1, Max 5, Required, Default 5 |
| `featured` | Boolean | Default: false |
| `relationship` | Enum | Client, Colleague, Manager, Mentee, Collaborator, Other |
| `approvalStatus` | Enum | Pending, Approved, Rejected |
| `approvedBy` | Short text | Max 100 |
| `approvedAt` | DateTime | Optional |
| `rejectionReason` | Long text | Max 500 |
| `submittedAt` | DateTime | Optional |
| `authorEmail` | Email | Optional |
| `authorLinkedIn` | Short text | Max 255, Regex: `^https?://(www\.)?linkedin\.com/.*` |
| `contentEmbedding` | JSON | For pgVector (768 dimensions) |
| `aiSentiment` | Enum | Very Positive, Positive, Neutral, Negative, Very Negative |
| `aiTags` | JSON | For AI tagging |

- [ ] **Click "Save"**
- [ ] Test API: `GET http://localhost:1337/api/testimonials` → Should return 200

**Relation Setup:**
- [ ] Add relation: `projectRelated` → Many-to-one → Projects

---

## Phase C: Next Steps (After Content Types)

### Relations to Create (after all types exist)
- [ ] Skills → Projects (Many-to-many)
- [ ] Experience → Skills (Many-to-many)
- [ ] Experience → Projects (Many-to-many)
- [ ] Testimonials → Projects (Many-to-one)
- [ ] Music Genres → Compositions (One-to-many, after Compositions created)

### Components to Verify
- [ ] `content.stat` exists (for Projects metrics)
- [ ] `content.achievement` exists (for Experience achievements)
- [ ] `meta.seo-metadata` exists (for Projects SEO)

---

## Critical Gotchas Checklist

### 1. Enumeration Values MUST Start with Letters
- [ ] ✅ `Employees 1-10` (starts with E)
- [ ] ✅ `In Progress` (starts with I)
- [ ] ❌ **Avoid:** `1-10`, `2nd Place`, `100% Complete`
- [ ] **Reference:** [18-v5-gotchas.md - Enumeration Naming](./18-v5-gotchas.md#4-enumeration-naming-constraint)

### 2. UID Fields Don't Auto-Generate
- [ ] ✅ **GOOD NEWS:** Slug generator middleware already implemented (`apps/cms/src/middlewares/slug-generator.ts`)
- [ ] Verify middleware is enabled in `config/middlewares.ts`
- [ ] Test slug generation: Create Music Genre without slug → Should auto-generate
- [ ] **Fallback:** If middleware doesn't work → Install `strapi-plugin-auto-slug-manager-a-mi13`
- [ ] **Reference:** [18-v5-gotchas.md - UID Auto-Generation Bug](./18-v5-gotchas.md#3-uid-field-auto-generation-bug)

### 3. i18n Configuration
- [ ] ✅ Enable i18n at **content-type level** for all types
- [ ] ✅ Localize: Titles, descriptions, content
- [ ] ❌ Don't localize: IDs, enums, technical fields, taxonomies (Skills, Genres)
- [ ] **Reference:** [18-v5-gotchas.md - i18n Best Practices](./18-v5-gotchas.md#6-i18n-field-level-best-practices)

### 4. Component Min/Max Settings
- [ ] When adding repeatable component: Click **Advanced Settings**
- [ ] Set **Minimum Value** and **Maximum Value**
- [ ] **Example:** For `metrics` (Max 5): Set in UI, not in code
- [ ] **Reference:** [18-v5-gotchas.md - Component Min/Max](./18-v5-gotchas.md#5-component-minmax-configuration)

### 5. JSON Fields Will Be Strings
- [ ] `descriptionEmbedding`, `contentEmbedding`, `aiTags` will be strings in API responses
- [ ] Backend: Use `JSON.parse()` when retrieving
- [ ] Frontend: Parse before using
- [ ] **Reference:** [18-v5-gotchas.md - JSON Field Bug](./18-v5-gotchas.md#2-json-field-serialization-bug)

### 6. Draft & Publish Lifecycle Hooks
- [ ] If using hooks for embedding generation: Use **middleware** not lifecycle hooks
- [ ] Lifecycle hooks fire twice (beforeCreate + afterCreate) when publishing
- [ ] **Reference:** [18-v5-gotchas.md - Lifecycle Hooks](./18-v5-gotchas.md#1-lifecycle-hooks-breaking-change)

### 7. JSON Fields Testing
- [ ] Create test content with JSON field (e.g., Project with descriptionEmbedding)
- [ ] Query via API: `curl http://localhost:1337/api/projects/1`
- [ ] Check if JSON field is string: `typeof response.data.attributes.descriptionEmbedding`
- [ ] If string → Add JSON.parse() wrapper to all backend queries
- [ ] Create frontend utility: `parseJsonField(field)` (see 18-v5-gotchas.md)
- [ ] Test in browser console before integration
- [ ] **Reference:** [18-v5-gotchas.md - JSON Field Bug](./18-v5-gotchas.md#2-json-field-serialization-bug)

---

## API Testing Commands

### Quick Validation Tests

**Core Types:**
```bash
# Skills
curl "http://localhost:1337/api/skills"

# Music Genres
curl "http://localhost:1337/api/music-genres"

# Posts (Blog Articles)
curl "http://localhost:1337/api/posts"
```

**Content Types:**
```bash
# Projects
curl "http://localhost:1337/api/projects"

# Experience
curl "http://localhost:1337/api/experiences"

# Testimonials
curl "http://localhost:1337/api/testimonials"
```

**With Relations:**
```bash
# Projects with Skills and metrics
curl "http://localhost:1337/api/projects/1?populate=techStack,metrics,seo"

# Experience with Skills and Achievements
curl "http://localhost:1337/api/experiences/1?populate=skillsUsed,achievements"

# Testimonials with related project
curl "http://localhost:1337/api/testimonials/1?populate=projectRelated"
```

---

## Common Issues & Fixes

| Issue | Solution | Reference |
|-------|----------|-----------|
| Enum starts with number → GraphQL crashes | Prefix with text: "Employees 1-10" | [Gotchas - Enum](./18-v5-gotchas.md#4-enumeration-naming-constraint) |
| Slug field empty after creating content | Install auto-slug plugin or create middleware | [Gotchas - UID](./18-v5-gotchas.md#3-uid-field-auto-generation-bug) |
| JSON field is string not object | Always use `JSON.parse()` in backend | [Gotchas - JSON](./18-v5-gotchas.md#2-json-field-serialization-bug) |
| Component min/max not working | Configure in Content-Type Builder UI, not code | [Gotchas - Components](./18-v5-gotchas.md#5-component-minmax-configuration) |
| Unique field allows duplicates | Verify "Unique" toggle is ON in field settings | [04-collection-types-core.md](./04-collection-types-core.md#collection-type-1-skills) |
| Relation field missing | Create related type first, then add relation | [05-collection-types-content.md](./05-collection-types-content.md) |

---

## Success Checklist

After completing all phases:

- [ ] All collection types created (Skills, Music Genres, Posts, Projects, Experience, Testimonials, Awards, Compositions, Form Submissions, Easter Egg Completions)
- [ ] All fields have correct validation (max length, regex, min/max)
- [ ] All enum values start with alphabetical characters
- [ ] Default values set correctly for boolean and number fields
- [ ] i18n enabled at content-type level (NOT field-level for taxonomies)
- [ ] Components linked (metrics, achievements, seo)
- [ ] All 6 API endpoints return 200 OK
- [ ] No UID field auto-generation plugin installed? → Create slug middleware
- [ ] Created test data in at least 3 content types
- [ ] Relations working (Skills → Projects, etc.)

---

## Time Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Phase A: Core Types (Skills, Genres, Posts) | 45-60 min | |
| Phase B: Content Types (Projects, Experience, Testimonials) | 45-60 min | |
| Phase C: Relations & Testing | 15-20 min | |
| **Total** | **2-2.5 hours** | |

---

## Next Steps

After completing this checklist:

1. **[→ Create Publishing Collection Types](./06-collection-types-publishing.md)** (Blog Posts, Awards, Compositions)
2. **[→ Create AI Forms Types](./07-collection-types-ai.md)** (Form Submissions, Easter Eggs)
3. **[→ Set Up pgVector](./08-pgvector-setup.md)** (Embeddings & semantic search)

---

**Last Updated:** 2025-12-01

**[← Back to Index](./README.md)** | **[Next: Publishing Types →](./06-collection-types-publishing.md)**
