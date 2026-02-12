# API Modules Guide

## SUMMARY

Domain-organized API clients providing type-safe access to 30+ Strapi endpoints.

---

## CONTENT_MODULES

### Projects

```typescript
import { fetchProjects, fetchProjectBySlug } from '@aazucena/api';

// Fetch all projects
const projects = await fetchProjects();

// Fetch single project by slug
const project = await fetchProjectBySlug('portfolio-redesign');
```

### Blog Posts

```typescript
import { fetchPosts, fetchPostBySlug, fetchFeaturedPosts } from '@aazucena/api';

// All posts with pagination
const posts = await fetchPosts({ page: 1, pageSize: 10 });

// Featured posts only
const featured = await fetchFeaturedPosts();

// Single post
const post = await fetchPostBySlug('introduction-to-react-19');
```

### Experiences

```typescript
import { fetchExperiences, fetchEducation } from '@aazucena/api';

// Work experiences
const experiences = await fetchExperiences();

// Education history
const education = await fetchEducation();
```

---

## CONFIGURATION_MODULES

### Website Configuration

```typescript
import { fetchWebsiteConfig } from '@aazucena/api';

const config = await fetchWebsiteConfig();
console.log(config.siteName, config.siteUrl, config.seoDefaults);
```

### Navigation

```typescript
import { fetchNavigationConfig } from '@aazucena/api';

const nav = await fetchNavigationConfig();
// Returns: { header: NavItem[], footer: NavItem[] }
```

---

## PARALLEL_FETCHING

```typescript
import {
  fetchHomepage,
  fetchProjects,
  fetchExperiences,
  fetchWebsiteConfig,
} from '@aazucena/api';

// Fetch multiple endpoints in parallel
const [homepage, projects, experiences, config] = await Promise.all([
  fetchHomepage(),
  fetchProjects(),
  fetchExperiences(),
  fetchWebsiteConfig(),
]);
```

---

**AUTHOR:** aazucena_api_modules
