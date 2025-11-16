# Troubleshooting

**[← Back to Best Practices](./13-best-practices.md)** | **[Next: Implementation Timeline →](./15-implementation-timeline.md)**

---

## Content Type Not Appearing in API

**Solution:**
1. Check API Permissions (Settings → Roles → Public)
2. Ensure content is **published** (if Draft & Publish enabled)
3. Restart Strapi: `docker compose restart strapi`

---

## Relation Not Populating

**Solution:**
1. Use `populate` query parameter: `?populate=techStack`
2. Check relation is bidirectional
3. Ensure related content is published

---

## Media Upload Fails

**Solution:**
1. Verify Cloudinary credentials in `.env`
2. Check Cloudinary upload preset settings
3. Verify file type restrictions
4. Check Docker logs: `docker compose logs strapi`

---

## Validation Error on Save

**Solution:**
1. Check all **required fields** are filled
2. Verify **max length** constraints
3. Check **regex patterns** match format
4. Ensure **min/max values** are within range

---

## TypeScript Type Generation Fails

**Solution:**
1. Ensure `--typescript` flag used during init
2. Run: `pnpm strapi ts:generate-types`
3. Check `types/generated/contentTypes.d.ts` exists

---

## Docker Container Crashes

**Solution:**
```bash
# Check logs
docker compose logs -f strapi

# Verify PostgreSQL running
docker compose ps

# Check database connection
# in config/database.ts

# Rebuild
docker compose up -d --build
```

---

## Component Not Available in Content Type

**Cause:** Component category mismatch

**Solution:**
- Verify component category matches usage
- Example: `ui.cta-button` requires category `ui`

---

## Cannot Create Duplicate Name

**Cause:** Unique constraint on field

**Solution:**
- Use different values
- Or remove uniqueness if duplicates needed

---

## pgVector Extension Error

**Solution:**
```sql
-- Check if installed
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- Use pgvector/pgvector:pg16 Docker image
```

---

## Redis Connection Failed

**Solution:**
```bash
# Test connection
redis-cli ping

# Check firewall
sudo ufw allow 6379

# Temporarily disable Redis in config/plugins.ts
```

---

**[← Best Practices](./13-best-practices.md)** | **[Next: Timeline →](./15-implementation-timeline.md)**
