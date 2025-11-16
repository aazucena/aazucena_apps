# Collection Types: AI Forms

**[← Back to Publishing Types](./06-collection-types-publishing.md)** | **[Next: pgVector Setup →](./08-pgvector-setup.md)**

---

## ⚠️ CRITICAL Content Types for AI Features

These content types are **essential** for the AI-powered forms system and Easter Egg challenge.

---

## Collection Type 10: Form Submissions

**Display Name:** `Form Submission`
**API ID:** `form-submission` / `form-submissions`

### Advanced Settings

- **Draft & Publish:** ❌ Disabled (submissions are final)
- **Default sort:** `submittedAt` (descending)

### Fields (Complete List)

| Field Name | Type | Settings |
|------------|------|----------|
| `formType` | Enumeration | Contact, Feedback, Testimonial, Bug Report, Feature Request, Collaboration, Referral, Music Feedback - Required |
| `rawMessage` | Text (Long) | Max 5000, Required |
| `structuredData` | JSON | AI-extracted fields |
| `aiIntent` | Text | Max 100, AI-classified intent |
| `aiSummary` | Text (Long) | Max 500, AI summary (50-150 words) |
| `aiSentiment` | Enumeration | Very Positive, Positive, Neutral, Negative, Very Negative |
| `aiTags` | JSON | AI-generated tags |
| `easterEggDetected` | Boolean | Default: false |
| `submittedAt` | DateTime | Required |
| `submitterIP` | Text | Max 45, IPv4/IPv6 |
| `submitterEmail` | Email | |
| `submitterName` | Text | Max 100 |
| `recaptchaScore` | Number (Decimal) | Min 0, Max 1, reCAPTCHA v3 score |
| `status` | Enumeration | New, In Progress, Resolved, Closed, Spam - Default: New |
| `assignedTo` | Text | Max 100 |
| `internalNotes` | Text (Long) | Max 2000 |
| `relatedProject` | Relation | Many-to-one → Projects |
| `langSmithTraceId` | Text | Max 100, LangSmith trace ID |
| `messageEmbedding` | JSON | 768 dimensions (original message) |
| `summaryEmbedding` | JSON | 768 dimensions (AI summary) |
| `embeddingModel` | Text | Max 50, Default: "gemini-textembedding-gecko" |
| `embeddingGeneratedAt` | DateTime | |

### Critical Features

**pgVector Integration:**
- `messageEmbedding`: Vector of original user message
- `summaryEmbedding`: Vector of AI summary
- Used for similarity search, duplicate detection, RAG context

**AI Pipeline:**
- LangGraph state machine processes submissions
- AI extracts structured data from `rawMessage`
- Generates `aiIntent`, `aiSummary`, `aiSentiment`, `aiTags`
- LangSmith tracking via `langSmithTraceId`

**Lifecycle Hooks:**
- On create: Process through LangGraph AI pipeline
- On create: Generate embeddings asynchronously
- On create: Check for Easter Egg keywords
- On create: Auto-assign based on `formType`

### Metadata for pgVector

Index on: `formType`, `aiSentiment`, `submittedAt`, `status`

Combined filters example:
```sql
"Find similar bug reports from last 30 days with negative sentiment"
```

### Notes

- All submissions retained forever (per requirements)
- Rate limiting: 100 req/min per IP
- See [AI-Powered Forms Documentation](/docs/features/ai-forms.md) for full implementation

---

## Collection Type 11: Easter Egg Completions

**Display Name:** `Easter Egg Completion`
**API ID:** `easter-egg-completion` / `easter-egg-completions`

### Advanced Settings

- **Draft & Publish:** ❌ Disabled (completions are final)
- **Default sort:** `completedAt` (descending)

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `userIdentifier` | Text | Max 100, Required (Session ID, email, username) |
| `challengeType` | Enumeration | Hidden Keyword, Secret Page, Konami Code, Scroll Pattern, Time-Based, Interactive Element, Other - Required, Default: Hidden Keyword |
| `keywordFound` | Text | Max 100, Keyword that triggered Easter Egg |
| `pageUrl` | Text | Max 500, Page where found |
| `completedAt` | DateTime | Required |
| `userIP` | Text | Max 45 |
| `userAgent` | Text (Long) | Max 500 |
| `timeToComplete` | Number | Min 0, Seconds from page load |
| `attemptsCount` | Number | Min 1, Default 1 |
| `rewardClaimed` | Boolean | Default: false |
| `rewardType` | Enumeration | Badge, Confetti, Secret Content, Downloadable, Certificate, Leaderboard Entry, Other |
| `canRetryAt` | DateTime | Time-based blocking |
| `metadata` | JSON | Additional context |

### Global Challenge Features

- `userIdentifier`: Tracks unique users (anonymous session ID)
- `canRetryAt`: Time-based blocking (prevent spam)
- Leaderboard: Sort by `completedAt`, filter by `challengeType`
- Speed tracking via `timeToComplete`

### Example Queries

```bash
# Leaderboard (fastest completions)
GET /api/easter-egg-completions?sort=timeToComplete:asc&pagination[limit]=10

# Check if user already completed
GET /api/easter-egg-completions?filters[userIdentifier][$eq]=session_123

# Statistics
GET /api/easter-egg-completions?filters[challengeType][$eq]=Hidden+Keyword
```

### Notes

- Supports multiple challenge types for future Easter Eggs
- Time-based blocking prevents repeated attempts
- Metadata field for extensibility
- Can display public leaderboard (anonymized)

---

## API Permissions

### Form Submissions

**Public:**
- ✅ `create` only (submit forms)

**Admin Only:**
- ✅ `find`, `findOne`, `update`, `delete`

### Easter Egg Completions

**Public:**
- ✅ `create` only (submit completions)
- ✅ `find` (for leaderboard queries)

**Admin Only:**
- ✅ `findOne`, `update`, `delete`

---

## Integration with Settings

Easter Egg configuration in Settings Single Type:

```json
{
  "easterEggChallenge": "Find the hidden keyword in the contact form",
  "easterEggKeywords": ["konami", "secret", "hidden"],
  "easterEggEnabled": true
}
```

Frontend detection:
```typescript
const keywords = settings.easterEggKeywords;
const found = keywords.find(kw => userMessage.includes(kw));

if (found) {
  // Create Easter Egg Completion
  await strapi.createEntry('easter-egg-completions', {
    userIdentifier: sessionId,
    challengeType: 'Hidden Keyword',
    keywordFound: found,
    completedAt: new Date(),
  });
}
```

---

## Next Steps

**[→ Setup pgVector](./08-pgvector-setup.md)** - Database migration, embeddings, semantic search

---

## Related Documentation

- **[AI-Powered Forms](/docs/features/ai-forms.md)** - Complete AI forms implementation
- **[pgVector Setup](./08-pgvector-setup.md)** - Embedding generation for Form Submissions
- **[Settings Single Type](./03-single-types.md#single-type-3-settings)** - Easter Egg configuration

---

**Last Updated:** 2025-01-15

**[← Publishing Types](./06-collection-types-publishing.md)** | **[Next: pgVector Setup →](./08-pgvector-setup.md)**
