# Testing Checklist

**[← Back to Data Migration](./11-data-migration.md)** | **[Next: Best Practices →](./13-best-practices.md)**

---

## 1. Verify Content Types

- [ ] All 6 components visible in Components section
- [ ] All 3 Single Types visible in Content Manager
- [ ] All 11 Collection Types visible in Content Manager
- [ ] All fields appear correctly
- [ ] pgVector columns exist in database

---

## 2. Test API Endpoints

### Single Types

```bash
curl http://localhost:1337/api/hero
curl http://localhost:1337/api/about
curl http://localhost:1337/api/setting
```

### Collection Types

```bash
curl http://localhost:1337/api/skills
curl http://localhost:1337/api/music-genres
curl http://localhost:1337/api/blog-series
curl http://localhost:1337/api/projects
curl http://localhost:1337/api/experiences
curl http://localhost:1337/api/testimonials
curl http://localhost:1337/api/blog-posts
curl http://localhost:1337/api/awards
curl http://localhost:1337/api/compositions

# Admin only (requires token)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:1337/api/form-submissions

curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:1337/api/easter-egg-completions
```

### Single Entry

```bash
curl http://localhost:1337/api/projects/1
curl http://localhost:1337/api/skills/1
```

### Populated Relations

```bash
curl http://localhost:1337/api/projects?populate=techStack
curl http://localhost:1337/api/experiences?populate=skillsUsed,projectsCompleted
curl http://localhost:1337/api/blog-posts?populate=series,seo
```

### Semantic Search

```bash
curl -X POST http://localhost:1337/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "portfolio with animations",
    "contentType": "projects",
    "limit": 5
  }'
```

### Health Check

```bash
curl http://localhost:1337/api/health
```

---

## 3. Create Test Content

Create at least one entry for each content type to verify:

- [ ] All fields save correctly
- [ ] Media uploads work (Cloudinary)
- [ ] Relations work (Projects ↔ Skills)
- [ ] Draft/Publish workflow works
- [ ] Validation rules enforced

---

## 4. Verify Data Structure

Example response for Projects:

```json
{
  "data": [{
    "id": 1,
    "attributes": {
      "title": "My Portfolio",
      "slug": "my-portfolio",
      "shortDescription": "Personal portfolio",
      "coverImage": {
        "data": {
          "attributes": {
            "url": "https://res.cloudinary.com/..."
          }
        }
      },
      "techStack": {
        "data": [{
          "id": 1,
          "attributes": {
            "name": "React",
            "category": "Frontend"
          }
        }]
      },
      "createdAt": "2025-01-14T00:00:00.000Z",
      "publishedAt": "2025-01-14T00:00:00.000Z"
    }
  }],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "total": 1
    }
  }
}
```

---

**[← Data Migration](./11-data-migration.md)** | **[Next: Best Practices →](./13-best-practices.md)**
