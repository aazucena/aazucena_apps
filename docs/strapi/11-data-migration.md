# Data Migration Strategy

**[← Back to Security](./10-security-deployment.md)** | **[Next: Testing →](./12-testing.md)**

---

## Migration Script Template

Transfer data from static files to Strapi:

```typescript
// scripts/migrate-to-strapi.ts
import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

class DataMigration {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: STRAPI_URL,
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async migrateSkills(options = {}) {
    const { skills } = await import('../apps/portfolio/src/data/skills.ts');

    for (const skill of skills) {
      if (options.dryRun) {
        console.log(`[DRY RUN] Would create: ${skill.name}`);
        continue;
      }

      try {
        await this.client.post('/api/skills', {
          data: {
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            description: skill.description,
            isFeatured: skill.isFeatured || false,
            isCore: skill.isCore || false,
          },
        });
        console.log(`✅ Created: ${skill.name}`);
      } catch (error) {
        console.error(`❌ Failed: ${skill.name}`);
      }
    }
  }

  async migrateProjects(options = {}) {
    const { projects } = await import('../apps/portfolio/src/data/projects.ts');

    for (const project of projects) {
      const techStackIds = await this.getSkillIdsByNames(project.techStack || []);

      try {
        await this.client.post('/api/projects', {
          data: {
            title: project.title,
            shortDescription: project.shortDescription,
            description: project.description,
            techStack: techStackIds,
            githubUrl: project.githubUrl,
            liveDemoUrl: project.liveDemoUrl,
            featured: true,
            publishedAt: new Date(),
          },
        });
        console.log(`✅ Created project: ${project.title}`);
      } catch (error) {
        console.error(`❌ Failed: ${project.title}`);
      }
    }
  }

  private async getSkillIdsByNames(names: string[]): Promise<number[]> {
    const ids: number[] = [];
    for (const name of names) {
      try {
        const response = await this.client.get(`/api/skills?filters[name][$eq]=${encodeURIComponent(name)}`);
        if (response.data.data.length > 0) {
          ids.push(response.data.data[0].id);
        }
      } catch (error) {
        console.warn(`Skill not found: ${name}`);
      }
    }
    return ids;
  }

  async runAll(options = {}) {
    console.log('Starting migration...\n');
    await this.migrateSkills(options);
    await this.migrateProjects(options);
    console.log('\n✅ Migration complete!');
  }
}

const migration = new DataMigration();
const dryRun = process.argv.includes('--dry-run');
migration.runAll({ dryRun }).catch(console.error);
```

---

## Running Migrations

```bash
# Install dependencies
pnpm add -D axios ts-node

# Dry run (preview)
STRAPI_API_TOKEN=your_token ts-node scripts/migrate-to-strapi.ts --dry-run

# Run actual migration
STRAPI_API_TOKEN=your_token ts-node scripts/migrate-to-strapi.ts

# Verify in admin panel
open http://localhost:1337/admin
```

---

## Handling Missing Data

```typescript
// Generate placeholders for missing images
async function generatePlaceholders() {
  const projects = await strapi.entityService.findMany('api::project.project', {
    filters: { coverImage: { $null: true } },
  });

  for (const project of projects) {
    const placeholderUrl = `https://placehold.co/1200x630/1e293b/f1f5f9?text=${encodeURIComponent(project.title)}`;
    console.log(`Placeholder needed: ${placeholderUrl}`);
  }
}

// Set default values
async function setDefaults() {
  // Set default featured status
  await strapi.db.query('api::project.project').updateMany({
    where: { featured: null },
    data: { featured: true },
  });

  // Set default proficiency
  await strapi.db.query('api::skill.skill').updateMany({
    where: { proficiency: null },
    data: { proficiency: 50 },
  });
}
```

---

**[← Security](./10-security-deployment.md)** | **[Next: Testing →](./12-testing.md)**
