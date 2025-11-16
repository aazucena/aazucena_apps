# Collection Types: Content

**[← Back to Core Collection Types](./04-collection-types-core.md)** | **[Next: Collection Types - Publishing →](./06-collection-types-publishing.md)**

---

## Overview

These Collection Types represent the main content of the portfolio: Projects, Work Experience, and Testimonials. They have dependencies on Core Collection Types (Skills).

---

## Collection Type 4: Projects

**Display Name:** `Project`
**API ID:** `project` / `projects`

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Default sort:** `order` (ascending)
- **i18n:** ✅ Enabled

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | Max 200, Required |
| `slug` | UID | Attached to `title`, Required |
| `shortDescription` | Text (Long text) | Max 300, Required |
| `description` | Rich Text (Markdown) | Required |
| `coverImage` | Media (Single image) | Required |
| `coverImageAlt` | Text (Short text) | Max 150 |
| `screenshots` | Media (Multiple images) | Max 10 |
| `demoVideo` | Media (Single file) | Video only |
| `gallery` | Media (Multiple images) | Max 10 |
| `techStack` | Relation | Many-to-many → Skills |
| `githubUrl` | Text | Max 255, Regex: `^https?://github\.com/.*` |
| `repositoryUrl` | Text | Max 255, Regex: `^https?://.*` |
| `liveDemoUrl` | Text | Max 255, Regex: `^https?://.*` |
| `projectType` | Enumeration | Web App, Mobile App, Desktop App, Library, API, CLI Tool, Game, Music Production, Other |
| `metrics` | Component | `content.stat`, Min 0, Max 5 |
| `featured` | Boolean | Default: true |
| `isFeaturedOnHome` | Boolean | Default: false |
| `order` | Number (Integer) | Min 0, Default 0 |
| `startDate` | Date | Date only |
| `endDate` | Date | Date only |
| `status` | Enumeration | In Progress, Completed, Maintenance, Archived |
| `tags` | Text | Max 255 |
| `viewCount` | Number (Integer) | Min 0, Default 0 |
| `descriptionEmbedding` | JSON | 768 dimensions |
| `descriptionEmbeddingModel` | Text | Max 50, Default: "gemini-textembedding-gecko" |
| `descriptionEmbeddingGeneratedAt` | DateTime | |
| `seo` | Component | `meta.seo-metadata`, Min 0, Max 1 |

### Notes

- Cached in Redis (per requirements)
- `featured` defaults to true (all projects on projects page)
- pgVector for semantic search
- `metrics` allows optional manual statistics

See [08-pgvector-setup.md](./08-pgvector-setup.md) for embedding implementation.

---

## Collection Type 5: Experience

**Display Name:** `Experience`
**API ID:** `experience` / `experiences`

### Advanced Settings

- **Draft & Publish:** ✅ Enabled
- **Default sort:** `startDate` (descending)
- **i18n:** ✅ Enabled

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `company` | Text | Max 150, Required |
| `position` | Text | Max 150, Required |
| `companyLogo` | Media (Single image) | |
| `companyLogoAlt` | Text | Max 150 |
| `companyIndustry` | Enumeration | Technology, Finance, Healthcare, Education, Entertainment, Retail, Manufacturing, Government, Non-Profit, Startup, Other |
| `companySize` | Enumeration | 1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5000+ |
| `location` | Text | Max 150 |
| `startDate` | Date | Date only, Required |
| `endDate` | Date | Date only |
| `isCurrent` | Boolean | Default: false |
| `description` | Rich Text (Markdown) | Required |
| `highlights` | Rich Text (Markdown) | |
| `achievements` | Component | `content.achievement`, Min 0, Max 10 |
| `skillsUsed` | Relation | Many-to-many → Skills |
| `projectsCompleted` | Relation | Many-to-many → Projects |
| `employmentType` | Enumeration | Full-time, Part-time, Contract, Freelance, Internship - Required |
| `companyWebsite` | Text | Max 255, Regex: `^https?://.*` |
| `order` | Number (Integer) | Min 0, Default 0 |

### Notes

- Enhanced with company metadata (industry, size)
- `achievements` component for structured tracking
- Relations to Skills and Projects for comprehensive history

---

## Collection Type 6: Testimonials

**Display Name:** `Testimonial`
**API ID:** `testimonial` / `testimonials`

### Advanced Settings

- **Draft & Publish:** ✅ Enabled (approval workflow)
- **Default sort:** `createdAt` (descending)
- **i18n:** ✅ Enabled

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `author` | Text | Max 100, Required |
| `authorTitle` | Text | Max 150 |
| `company` | Text | Max 100 |
| `content` | Text (Long text) | Max 1000, Required |
| `avatar` | Media (Single image) | |
| `rating` | Number (Integer) | Min 1, Max 5, Required, Default 5 |
| `featured` | Boolean | Default: false |
| `projectRelated` | Relation | Many-to-one → Projects |
| `relationship` | Enumeration | Client, Colleague, Manager, Mentee, Collaborator, Other |
| `approvalStatus` | Enumeration | Pending, Approved, Rejected - Default: Pending |
| `approvedBy` | Text | Max 100 |
| `approvedAt` | DateTime | |
| `rejectionReason` | Text (Long text) | Max 500 |
| `submittedAt` | DateTime | |
| `authorEmail` | Email | |
| `authorLinkedIn` | Text | Max 255, Regex: `^https?://(www\.)?linkedin\.com/.*` |
| `contentEmbedding` | JSON | 768 dimensions |
| `contentEmbeddingModel` | Text | Max 50, Default: "gemini-textembedding-gecko" |
| `contentEmbeddingGeneratedAt` | DateTime | |
| `aiSentiment` | Enumeration | Very Positive, Positive, Neutral, Negative, Very Negative |
| `aiTags` | JSON | |

### Lifecycle Hooks

- On approval/rejection: Send email to author (per requirements)
- On rejection: Validate `rejectionReason` is provided
- On save: Generate embedding for `content`

### Notes

- Email notifications on approval/rejection
- Rejection reason required when rejected
- All testimonials retained forever
- pgVector for semantic search and duplicate detection

---

## API Endpoints

### Projects

```bash
GET /api/projects
GET /api/projects?filters[featured][$eq]=true
GET /api/projects/1?populate=techStack,seo,metrics
```

### Experience

```bash
GET /api/experiences
GET /api/experiences?filters[isCurrent][$eq]=true
GET /api/experiences/1?populate=skillsUsed,projectsCompleted,achievements
```

### Testimonials

```bash
GET /api/testimonials
GET /api/testimonials?filters[approvalStatus][$eq]=Approved
GET /api/testimonials/1?populate=projectRelated
```

---

## Next Steps

**[→ Create Publishing Collection Types](./06-collection-types-publishing.md)** - Blog Posts, Awards, Compositions

---

**Last Updated:** 2025-01-15

**[← Back to Core Collection Types](./04-collection-types-core.md)** | **[Next: Publishing Collection Types →](./06-collection-types-publishing.md)**
