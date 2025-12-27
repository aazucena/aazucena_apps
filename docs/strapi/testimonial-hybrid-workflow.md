# Testimonial API - Hybrid Approval Workflow

## Overview

The Testimonial API implements a **hybrid approval + publish workflow** that separates quality control from visibility management.

### Two Independent Systems

1. **Approval Status** (Quality Gate)
   - One-time decision: Is this testimonial legitimate?
   - States: `Pending` → `Approved` or `Rejected`
   - Tracks: who approved, when, why rejected

2. **Publish Status** (Visibility Control)
   - Ongoing toggle: Is this currently visible on the site?
   - States: `Draft` (unpublished) or `Published`
   - Can change multiple times (for editing)

---

## State Combinations

| Approval Status | Published | Meaning | Frontend Visibility |
|----------------|-----------|---------|---------------------|
| **Pending** | Draft | Awaiting review | ❌ Hidden |
| **Approved** | Draft | Approved but not live yet OR Temporarily hidden for editing | ❌ Hidden |
| **Approved** | Published | **LIVE ON SITE** | ✅ Visible |
| **Rejected** | Draft | Rejected, never goes live | ❌ Hidden |

**Invalid States (prevented by lifecycle hooks):**
- ❌ `Pending` + `Published` (can't publish unapproved content)
- ❌ `Rejected` + `Published` (can't publish rejected content)

---

## API Endpoints

### Standard CRUD (Strapi default)
- `GET /api/testimonials` - List all (respects permissions)
- `GET /api/testimonials/:id` - Get one
- `POST /api/testimonials` - Create new
- `PUT /api/testimonials/:id` - Update
- `DELETE /api/testimonials/:id` - Delete

### Custom Workflow Actions
- `GET /api/testimonials/pending` - Get testimonials awaiting approval
- `GET /api/testimonials/statistics` - Get approval workflow stats
- `POST /api/testimonials/:id/approve` - Approve a testimonial
- `POST /api/testimonials/:id/reject` - Reject with reason (body: `{ rejectionReason: string }`)
- `POST /api/testimonials/:id/publish` - Make visible on site (must be approved first)
- `POST /api/testimonials/:id/unpublish` - Hide from site (for editing)

---

## Common Workflows

### 1. AI Form Submission → Approval → Publish

```typescript
// 1. AI form creates testimonial (automatic)
const testimonial = await strapi.entityService.create('api::testimonial.testimonial', {
  data: {
    author: 'John Doe',
    content: 'Great developer!',
    rating: 5,
    // approvalStatus defaults to 'Pending'
    // publishedAt defaults to null (draft)
  }
});

// 2. Admin approves (via custom endpoint)
await fetch('/api/testimonials/${testimonial.id}/approve', { method: 'POST' });
// Now: approvalStatus = 'Approved', still draft

// 3. Admin publishes (via custom endpoint)
await fetch('/api/testimonials/${testimonial.id}/publish', { method: 'POST' });
// Now: LIVE ON SITE ✅
```

---

### 2. Edit Live Testimonial (Fix Typo)

```typescript
// 1. Testimonial is currently live
// approvalStatus: 'Approved', published: true

// 2. Admin unpublishes for editing
await fetch('/api/testimonials/${id}/unpublish', { method: 'POST' });
// Now: approvalStatus still 'Approved', but draft (hidden from site)

// 3. Admin fixes typo
await strapi.entityService.update('api::testimonial.testimonial', id, {
  data: { content: 'Fixed typo here' }
});

// 4. Admin re-publishes
await fetch('/api/testimonials/${id}/publish', { method: 'POST' });
// Now: LIVE AGAIN ✅
```

**Key Point:** Approval status never changed during editing!

---

### 3. Reject Spam Testimonial

```typescript
// 1. Testimonial submitted
// approvalStatus: 'Pending', draft

// 2. Admin rejects
await fetch(`/api/testimonials/${id}/reject`, {
  method: 'POST',
  body: JSON.stringify({ rejectionReason: 'Spam content detected' })
});

// Result:
// - approvalStatus: 'Rejected'
// - publishedAt: null (auto-unpublished)
// - rejectionReason: 'Spam content detected'
// - approvedBy: 'admin@example.com' (who rejected it)
// - approvedAt: timestamp (when rejected)
```

---

## Frontend Queries

### Public Site (Only Live Testimonials)

```typescript
// Fetch only approved AND published testimonials
const response = await fetch('/api/testimonials?filters[approvalStatus][$eq]=Approved&publicationState=live');
const testimonials = response.data;
```

Or use the helper function:

```typescript
import { getPublicTestimonials } from './utils/queries';

const testimonials = await getPublicTestimonials(strapi, {
  populate: ['avatar'],
  limit: 10
});
```

---

### Admin Panel Queries

```typescript
import {
  getPendingTestimonials,
  getApprovedTestimonials,
  getRejectedTestimonials,
  getTestimonialsBeingEdited,
  getApprovalStatistics
} from './utils/queries';

// Pending approval queue
const pending = await getPendingTestimonials(strapi);

// All approved (including unpublished ones being edited)
const approved = await getApprovedTestimonials(strapi);

// Currently being edited (approved but temporarily hidden)
const beingEdited = await getTestimonialsBeingEdited(strapi);

// Rejected (for audit trail)
const rejected = await getRejectedTestimonials(strapi);

// Dashboard statistics
const stats = await getApprovalStatistics(strapi);
// Returns: { total, pending, approved, rejected, published, beingEdited, approvalRate }
```

---

## Lifecycle Hooks (Automatic Enforcement)

Located in: `apps/cms/src/api/testimonial/content-types/testimonial/lifecycles.ts`

### Automatic Behaviors

1. **New testimonials default to Pending**
   ```typescript
   // You create: { author: 'John', content: '...' }
   // System adds: approvalStatus: 'Pending', submittedAt: now
   ```

2. **Can't publish unapproved testimonials**
   ```typescript
   // ❌ Throws error if you try to publish Pending or Rejected testimonial
   ```

3. **Rejecting auto-unpublishes**
   ```typescript
   // Setting approvalStatus to 'Rejected' automatically sets publishedAt to null
   ```

4. **Approval tracks metadata**
   ```typescript
   // When approving, system auto-sets:
   // - approvedBy: current admin email
   // - approvedAt: current timestamp
   ```

5. **Can't move Approved → Pending**
   ```typescript
   // ❌ Once approved, can only reject (not revert to pending)
   ```

6. **Rejection requires a reason**
   ```typescript
   // ❌ Throws error if rejecting without rejectionReason field
   ```

---

## Helper Functions

Located in: `apps/cms/src/api/testimonial/utils/queries.ts`

All helper functions accept an optional `options` parameter for filtering, sorting, pagination, etc.

```typescript
// Example: Get pending testimonials with author info, limit 5
const pending = await getPendingTestimonials(strapi, {
  populate: ['avatar'],
  limit: 5,
  offset: 0
});

// Example: Approve a testimonial
await approveTestimonial(strapi, testimonialId, 'admin@example.com');

// Example: Reject with reason
await rejectTestimonial(
  strapi,
  testimonialId,
  'Contains inappropriate content',
  'moderator@example.com'
);
```

---

## Security Considerations

### Permissions Setup

In Strapi Admin Panel → Settings → Users & Permissions → Roles:

**Public Role:**
- ✅ `find` (with filters for approved + published only)
- ✅ `findOne` (if needed for detail pages)
- ❌ All other actions

**Authenticated Role:**
- ✅ `create` (for AI form submissions)
- ❌ Approval actions (admin only)

**Admin/Moderator Role:**
- ✅ All actions including custom workflow endpoints

### Rate Limiting

Consider adding rate limiting to:
- `POST /api/testimonials` (prevent spam submissions)
- `POST /api/testimonials/:id/approve` (prevent abuse)

---

## Testing

### Manual Testing Checklist

- [ ] Create new testimonial → defaults to Pending + Draft
- [ ] Try to publish Pending testimonial → should fail
- [ ] Approve testimonial → check approvedBy and approvedAt set
- [ ] Publish approved testimonial → should succeed
- [ ] Unpublish → still approved, just hidden
- [ ] Edit content while unpublished → no approval status change
- [ ] Re-publish → should succeed
- [ ] Reject testimonial with reason → auto-unpublishes
- [ ] Try to reject without reason → should fail
- [ ] Try to move Approved → Pending → should fail
- [ ] Delete approved testimonial → warning logged

### API Testing

See `apps/cms/tests/testimonial-workflow.test.ts` (TODO: create test file)

---

## Analytics Queries

### Average Approval Time

```sql
SELECT AVG(
  EXTRACT(EPOCH FROM (approved_at - submitted_at))
) / 3600 AS avg_approval_hours
FROM testimonials
WHERE approval_status = 'Approved';
```

### Rejection Reasons

```sql
SELECT rejection_reason, COUNT(*) as count
FROM testimonials
WHERE approval_status = 'Rejected'
GROUP BY rejection_reason
ORDER BY count DESC;
```

### Approvals by Admin

```sql
SELECT approved_by, COUNT(*) as count
FROM testimonials
WHERE approval_status IN ('Approved', 'Rejected')
GROUP BY approved_by
ORDER BY count DESC;
```

---

## Troubleshooting

### "Cannot publish testimonial with status Pending"
**Solution:** Approve the testimonial first via `POST /api/testimonials/:id/approve`

### "Rejection reason is required when rejecting"
**Solution:** Include `rejectionReason` in the request body when calling reject endpoint

### "Cannot move testimonial from Approved back to Pending"
**Solution:** Use `Rejected` status instead, or delete and recreate if truly needed

### Testimonial approved but not showing on site
**Check:** Is it published? Use `POST /api/testimonials/:id/publish` or check `publishedAt` field

---

## Migration from Single Workflow

If you previously used ONLY `draftAndPublish`:

```sql
-- Map existing published items to Approved + Published
UPDATE testimonials
SET approval_status = 'Approved',
    approved_by = 'system',
    approved_at = published_at
WHERE published_at IS NOT NULL;

-- Map existing drafts to Pending + Draft
UPDATE testimonials
SET approval_status = 'Pending',
    submitted_at = created_at
WHERE published_at IS NULL;
```

---

## Architecture Decision Record

**Why hybrid workflow?**

1. **Editing without re-approval:** Admins can fix typos in approved testimonials without resetting approval status
2. **Rich metadata:** Track who approved, when, and why rejected
3. **Audit trail:** Analyze approval patterns, rejection reasons, processing time
4. **AI form integration:** AI-submitted testimonials need approval workflow with detailed tracking
5. **Visibility control:** Temporarily hide testimonials for seasonal rotations, A/B testing, etc.

**Why not just `draftAndPublish`?**
- Doesn't track approval metadata (who, when)
- Can't distinguish "rejected" from "draft"
- No rejection reasons for user feedback
- Binary state doesn't support "approved but temporarily hidden"

**Why not just custom `approvalStatus`?**
- No built-in UI for publish/unpublish toggle
- Can't temporarily hide for editing without changing approval
- Strapi's publish toggle is familiar to all admins

---

## Related Files

- Schema: `apps/cms/src/api/testimonial/content-types/testimonial/schema.json`
- Lifecycles: `apps/cms/src/api/testimonial/content-types/testimonial/lifecycles.ts`
- Queries: `apps/cms/src/api/testimonial/utils/queries.ts`
- Actions Controller: `apps/cms/src/api/testimonial/controllers/testimonial-actions.ts`
- Custom Routes: `apps/cms/src/api/testimonial/routes/custom-routes.ts`
