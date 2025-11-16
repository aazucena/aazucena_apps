# Best Practices

**[← Back to Testing](./12-testing.md)** | **[Next: Troubleshooting →](./14-troubleshooting.md)**

---

## 1. Field Naming Conventions

- Use **camelCase** (e.g., `coverImage`, not `cover_image`)
- Use descriptive names (`shortDescription` not `desc`)
- Avoid reserved words (`id`, `createdAt`, `updatedAt`, `publishedAt`)

---

## 2. Validation Rules

- Always set **max length** for text fields
- Use **regex validation** for URLs, emails
- Set **min/max values** for numbers
- Mark critical fields as **required**

Examples:
- Text: Max 200, Required
- Proficiency: Min 0, Max 100
- URLs: Regex `^https?://.*`

---

## 3. Performance Optimization

- Use **indexes** on frequently queried fields (slug, category)
- Limit **gallery/media** fields (max 10 images)
- Use **pagination** for large collections
- Populate relations **only when needed**

---

## 4. Content Strategy

- Use **Draft & Publish** for content needing review
- Disable for simple data (skills, settings)
- Use **featured** boolean for homepage highlights
- Use **order** field for manual sorting

---

## 5. SEO & Metadata

- Add SEO component to page-generating types
- Use **slug** fields for clean URLs
- Store **alt text** for accessibility
- Keep metaTitle < 60 chars, metaDescription < 160 chars

---

## 6. Media Management

- Restrict file types (images only, PDF only, audio only)
- Set **max file size** limits in Strapi settings
- Use **Cloudinary transformations** for responsive images
- Always provide **alt text** for accessibility

---

## 7. Security

- Enable **reCAPTCHA v3** for public forms
- Use **rate limiting** (100 req/min per IP)
- Configure **CORS** for allowed origins only
- Use **Draft & Publish** for approval workflows

---

## 8. Database

- Use **pgVector** for semantic search needs
- Index vector columns with **ivfflat**
- Store metadata for efficient filtering
- Async embedding generation (don't block saves)

---

**[← Testing](./12-testing.md)** | **[Next: Troubleshooting →](./14-troubleshooting.md)**
