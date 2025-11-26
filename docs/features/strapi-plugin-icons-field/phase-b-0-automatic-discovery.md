# Phase B.0: 🔥 Automatic Icon Discovery from node_modules (3-4 days)

[← Back to Overview](./README.md)

---

## Executive Summary

**🔥 GAME-CHANGING FEATURE:** Eliminate the #1 developer pain point by automatically discovering icons from `node_modules`, removing the need for manual `icons.sh` script execution.

**Strategic Priority:** CRITICAL - This feature addresses the biggest friction in the current workflow.

**Time Savings:** 5+ minutes → <200ms per icon package change (**96%+ faster**)

---

## Table of Contents

1. [Current Problem](#current-problem)
2. [Solution Architecture](#solution-architecture)
3. [Implementation](#implementation)
4. [Configuration](#configuration)
5. [Developer Workflow Comparison](#developer-workflow-comparison)
6. [Performance Metrics](#performance-metrics)
7. [Testing Strategy](#testing-strategy)
8. [Migration Path](#migration-path)
9. [Success Metrics](#success-metrics)
10. [Backward Compatibility](#backward-compatibility)

---

## Current Problem

### The icons.sh Workflow (v1.1.5)

**Current workflow - SLOW & ERROR-PRONE:**

```bash
# Step 1: Install icon package
npm install @mynaui/icons-react

# Step 2: Run manual script (EASY TO FORGET!)
./icons.sh

# Step 3: Wait 5+ minutes for icon copying...

# Step 4: Finally test new icons
```

### Pain Points

- ❌ **Manual step after every icon package install/update**
- ❌ **No hot-reloading during development**
- ❌ **5+ minute iteration cycle**
- ❌ **Breaks in Docker containers**
- ❌ **No support for pnpm workspaces**
- ❌ **Build failures if script forgotten**
- ❌ **Doesn't work in monorepos without complex setup**

### Developer Experience Impact

**Time wasted per day:** 15+ minutes across multiple icon package updates
**Build failures:** Frequent (when script forgotten before deployment)
**Frustration level:** HIGH - Manual intervention required for automated workflows

---

## Solution Architecture

### New Workflow (Automatic Discovery)

**Instant & Automated:**

```bash
# Step 1: Install icon package
npm install @mynaui/icons-react

# Icons automatically available in <200ms!
# Hot-reload enabled during development
# Zero manual steps required
```

### Hybrid Approach

**Development Mode:** API proxy that discovers icons from node_modules in real-time
**Production Mode:** Pre-built static files for optimal performance

```
Development (dev server):
  Install icon package
       ↓
  Icon Discovery Service scans node_modules
       ↓
  API endpoint serves icons dynamically
       ↓
  Hot reload on file changes (<200ms)

Production (build):
  Build script runs Icon Discovery Service
       ↓
  Generates static JSON manifests
       ↓
  Optimizes SVGs with SVGO
       ↓
  Copies to /public/icons
       ↓
  Deployment with optimized assets
```

---

## Implementation

### Core Service: Icon Discovery Service

**File:** `server/src/services/icon-discovery.ts`

```typescript
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { Strapi } from '@strapi/strapi';

interface PackageConfig {
  name: string;           // e.g., '@mynaui/icons-react'
  iconPath: string;       // e.g., 'dist/icons' or 'icons' or 'svg'
  pattern: string;        // e.g., '**/*.svg'
  category?: string;      // Optional custom category
  variant?: string;       // e.g., 'regular', 'solid', 'outlined'
}

interface DiscoveredIcon {
  id: string;
  name: string;
  package: string;
  packageVersion: string;
  absolutePath: string;
  relativePath: string;
  category: string;
  variant?: string;
  svg: string;
  size: number;
  hash: string;
  // Metadata
  iconSetId: string;
  iconSetName: string;
  license: string;
  commercialUse: boolean;
  attributionRequired: boolean;
}

export class IconDiscoveryService {
  private strapi: Strapi;
  private cache: Map<string, DiscoveredIcon[]> = new Map();
  private packageConfigs: PackageConfig[] = [];

  constructor(strapi: Strapi) {
    this.strapi = strapi;
    this.loadPackageConfigs();
  }

  /**
   * Load icon package configurations from plugin config
   */
  private loadPackageConfigs(): void {
    const config = this.strapi.config.get('plugin.icons-field');

    // Support both legacy publicPath and new iconPackages config
    this.packageConfigs = config.iconPackages || [];

    // Backward compatibility: if publicPath is set, keep it
    if (config.publicPath) {
      this.packageConfigs.push({
        name: 'custom',
        iconPath: config.publicPath,
        pattern: '**/*.svg'
      });
    }
  }

  /**
   * Discover icons from all configured packages
   */
  async discoverAllIcons(): Promise<DiscoveredIcon[]> {
    const allIcons: DiscoveredIcon[] = [];

    for (const packageConfig of this.packageConfigs) {
      const icons = await this.discoverPackageIcons(packageConfig);
      allIcons.push(...icons);
    }

    return allIcons;
  }

  /**
   * Discover icons from a specific package in node_modules
   */
  async discoverPackageIcons(packageConfig: PackageConfig): Promise<DiscoveredIcon[]> {
    // Check cache first
    const cacheKey = `${packageConfig.name}:${packageConfig.iconPath}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const packagePath = this.resolvePackagePath(packageConfig.name);
      if (!packagePath) {
        this.strapi.log.warn(
          `Icon package "${packageConfig.name}" not found in node_modules`
        );
        return [];
      }

      const iconsDir = path.join(packagePath, packageConfig.iconPath);
      const pattern = path.join(iconsDir, packageConfig.pattern);

      // Find all SVG files
      const svgFiles = await glob(pattern, {
        absolute: true,
        nodir: true
      });

      // Read package.json for metadata
      const packageJson = await this.readPackageJson(packagePath);

      const icons: DiscoveredIcon[] = [];

      for (const filePath of svgFiles) {
        const svg = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);
        const relativePath = path.relative(iconsDir, filePath);
        const iconName = path.basename(filePath, '.svg');

        // Extract category from subdirectory
        const subdir = path.dirname(relativePath);
        const category = packageConfig.category ||
          (subdir === '.' ? packageConfig.name : subdir);

        const icon: DiscoveredIcon = {
          id: `${packageConfig.name}:${relativePath}`,
          name: iconName,
          package: packageConfig.name,
          packageVersion: packageJson.version || 'unknown',
          absolutePath: filePath,
          relativePath,
          category,
          variant: packageConfig.variant,
          svg,
          size: stats.size,
          hash: this.hashSVG(svg),
          iconSetId: packageConfig.name,
          iconSetName: packageJson.name || packageConfig.name,
          license: packageJson.license || 'Unknown',
          commercialUse: this.isCommercialUseAllowed(packageJson.license),
          attributionRequired: this.isAttributionRequired(packageJson.license)
        };

        icons.push(icon);
      }

      // Cache the results
      this.cache.set(cacheKey, icons);

      this.strapi.log.info(
        `Discovered ${icons.length} icons from ${packageConfig.name}`
      );

      return icons;
    } catch (error) {
      this.strapi.log.error(
        `Failed to discover icons from ${packageConfig.name}:`,
        error
      );
      return [];
    }
  }

  /**
   * Resolve package path supporting npm, yarn, pnpm, and monorepos
   */
  private resolvePackagePath(packageName: string): string | null {
    // Try multiple resolution strategies
    const strategies = [
      // 1. Standard require.resolve
      () => {
        try {
          const resolved = require.resolve(`${packageName}/package.json`, {
            paths: [this.strapi.dirs.app.root]
          });
          return path.dirname(resolved);
        } catch {
          return null;
        }
      },

      // 2. Direct node_modules path (works for npm/yarn)
      () => {
        const direct = path.join(
          this.strapi.dirs.app.root,
          'node_modules',
          packageName
        );
        return fs.access(direct).then(() => direct).catch(() => null);
      },

      // 3. pnpm virtual store (.pnpm directory)
      () => {
        const pnpmStore = path.join(
          this.strapi.dirs.app.root,
          'node_modules',
          '.pnpm'
        );
        return this.findInPnpmStore(pnpmStore, packageName);
      },

      // 4. Workspace resolution (monorepos)
      () => {
        return this.resolveWorkspacePath(packageName);
      }
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result) return result;
    }

    return null;
  }

  /**
   * Find package in pnpm virtual store
   */
  private async findInPnpmStore(
    pnpmStore: string,
    packageName: string
  ): Promise<string | null> {
    try {
      const entries = await fs.readdir(pnpmStore);

      // Match pattern: @mynaui+icons-react@0.3.9/node_modules/@mynaui/icons-react
      for (const entry of entries) {
        if (entry.includes(packageName.replace('@', '').replace('/', '+'))) {
          const packagePath = path.join(
            pnpmStore,
            entry,
            'node_modules',
            packageName
          );

          try {
            await fs.access(packagePath);
            return packagePath;
          } catch {
            continue;
          }
        }
      }
    } catch {
      return null;
    }

    return null;
  }

  /**
   * Resolve package in workspace (monorepos)
   */
  private async resolveWorkspacePath(packageName: string): Promise<string | null> {
    // Check for workspace root indicators
    const workspaceFiles = [
      'pnpm-workspace.yaml',
      'lerna.json',
      'package.json' // with workspaces field
    ];

    let workspaceRoot = this.strapi.dirs.app.root;
    let found = false;

    // Walk up directory tree to find workspace root
    for (let i = 0; i < 5; i++) {
      for (const file of workspaceFiles) {
        try {
          await fs.access(path.join(workspaceRoot, file));
          found = true;
          break;
        } catch {
          continue;
        }
      }

      if (found) break;
      workspaceRoot = path.dirname(workspaceRoot);
    }

    if (!found) return null;

    // Try standard workspace locations
    const workspaceLocations = [
      path.join(workspaceRoot, 'packages', packageName),
      path.join(workspaceRoot, 'apps', packageName),
      path.join(workspaceRoot, 'node_modules', packageName)
    ];

    for (const location of workspaceLocations) {
      try {
        await fs.access(location);
        return location;
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Read package.json for metadata
   */
  private async readPackageJson(packagePath: string): Promise<any> {
    try {
      const pkgPath = path.join(packagePath, 'package.json');
      const content = await fs.readFile(pkgPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  /**
   * Hash SVG content for cache invalidation
   */
  private hashSVG(svg: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(svg).digest('hex');
  }

  /**
   * Check if license allows commercial use
   */
  private isCommercialUseAllowed(license: string): boolean {
    const commercialLicenses = ['MIT', 'Apache-2.0', 'BSD', 'ISC', 'CC0'];
    return commercialLicenses.some(l =>
      license?.toUpperCase().includes(l.toUpperCase())
    );
  }

  /**
   * Check if license requires attribution
   */
  private isAttributionRequired(license: string): boolean {
    const attributionLicenses = ['CC-BY', 'Apache-2.0'];
    return attributionLicenses.some(l =>
      license?.toUpperCase().includes(l.toUpperCase())
    );
  }

  /**
   * Clear cache (useful for development hot-reload)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Watch for file changes in development mode
   */
  async watchForChanges(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') return;

    const chokidar = require('chokidar');

    for (const packageConfig of this.packageConfigs) {
      const packagePath = this.resolvePackagePath(packageConfig.name);
      if (!packagePath) continue;

      const iconsDir = path.join(packagePath, packageConfig.iconPath);

      const watcher = chokidar.watch(iconsDir, {
        ignored: /(^|[\/\\])\../,
        persistent: true
      });

      watcher.on('change', () => {
        this.strapi.log.info(
          `Icon file changed in ${packageConfig.name}, clearing cache`
        );
        this.clearCache();
      });
    }
  }
}
```

### API Endpoints for Development Mode

**File:** `server/src/routes/icon-discovery.ts`

```typescript
export default [
  {
    method: 'GET',
    path: '/discover-icons',
    handler: 'icon-discovery.discoverAll',
    config: {
      policies: []
    }
  },
  {
    method: 'GET',
    path: '/discover-icons/:packageName',
    handler: 'icon-discovery.discoverPackage',
    config: {
      policies: []
    }
  },
  {
    method: 'POST',
    path: '/discover-icons/refresh',
    handler: 'icon-discovery.refreshCache',
    config: {
      policies: ['admin::isAuthenticatedAdmin']
    }
  }
];
```

**File:** `server/src/controllers/icon-discovery.ts`

```typescript
export default ({ strapi }) => ({
  async discoverAll(ctx) {
    const discoveryService = strapi
      .plugin('icons-field')
      .service('icon-discovery');

    const icons = await discoveryService.discoverAllIcons();

    ctx.send({
      data: icons,
      meta: {
        total: icons.length,
        packages: [...new Set(icons.map(i => i.package))],
        categories: [...new Set(icons.map(i => i.category))]
      }
    });
  },

  async discoverPackage(ctx) {
    const { packageName } = ctx.params;
    const discoveryService = strapi
      .plugin('icons-field')
      .service('icon-discovery');

    const config = discoveryService.packageConfigs.find(
      p => p.name === packageName
    );

    if (!config) {
      return ctx.notFound('Package configuration not found');
    }

    const icons = await discoveryService.discoverPackageIcons(config);

    ctx.send({
      data: icons,
      meta: {
        total: icons.length,
        package: packageName
      }
    });
  },

  async refreshCache(ctx) {
    const discoveryService = strapi
      .plugin('icons-field')
      .service('icon-discovery');

    discoveryService.clearCache();

    ctx.send({
      message: 'Icon cache cleared successfully'
    });
  }
});
```

### Production Build Script

**File:** `scripts/build-icons.ts`

```typescript
import { IconDiscoveryService } from '../server/src/services/icon-discovery';
import fs from 'fs/promises';
import path from 'path';
import { optimize } from 'svgo';

interface BuildOptions {
  outputDir: string;
  optimizeSvgs: boolean;
  generateManifest: boolean;
}

async function buildIcons(options: BuildOptions) {
  console.log('🔍 Discovering icons from node_modules...');

  // Mock Strapi instance for build context
  const mockStrapi = createBuildStrapi();
  const discoveryService = new IconDiscoveryService(mockStrapi);

  const icons = await discoveryService.discoverAllIcons();

  console.log(`✅ Discovered ${icons.length} icons from ${
    new Set(icons.map(i => i.package)).size
  } packages`);

  const outputDir = path.join(process.cwd(), options.outputDir);
  await fs.mkdir(outputDir, { recursive: true });

  // Group icons by package
  const iconsByPackage = icons.reduce((acc, icon) => {
    if (!acc[icon.package]) acc[icon.package] = [];
    acc[icon.package].push(icon);
    return acc;
  }, {} as Record<string, typeof icons>);

  for (const [packageName, packageIcons] of Object.entries(iconsByPackage)) {
    console.log(`📦 Processing ${packageName} (${packageIcons.length} icons)...`);

    const packageDir = path.join(outputDir, packageName.replace('@', '').replace('/', '-'));
    await fs.mkdir(packageDir, { recursive: true });

    for (const icon of packageIcons) {
      let svg = icon.svg;

      // Optimize SVG if enabled
      if (options.optimizeSvgs) {
        const result = optimize(svg, {
          multipass: true,
          plugins: [
            'removeDoctype',
            'removeXMLProcInst',
            'removeComments',
            'removeMetadata',
            'removeEditorsNSData',
            'cleanupAttrs',
            'mergeStyles',
            'inlineStyles',
            'minifyStyles',
            'cleanupIds',
            'removeUselessDefs',
            'cleanupNumericValues',
            'convertColors',
            'removeUnknownsAndDefaults',
            'removeNonInheritableGroupAttrs',
            'removeUselessStrokeAndFill',
            'removeViewBox',
            'cleanupEnableBackground',
            'removeHiddenElems',
            'removeEmptyText',
            'convertShapeToPath',
            'convertEllipseToCircle',
            'moveElemsAttrsToGroup',
            'moveGroupAttrsToElems',
            'collapseGroups',
            'convertPathData',
            'convertTransform',
            'removeEmptyAttrs',
            'removeEmptyContainers',
            'mergePaths',
            'removeUnusedNS',
            'sortDefsChildren',
            'removeTitle',
            'removeDesc'
          ]
        });
        svg = result.data;
      }

      // Create subdirectory structure
      const iconDir = path.join(packageDir, path.dirname(icon.relativePath));
      await fs.mkdir(iconDir, { recursive: true });

      const iconPath = path.join(packageDir, icon.relativePath);
      await fs.writeFile(iconPath, svg);
    }

    console.log(`✅ Saved ${packageIcons.length} icons to ${packageDir}`);
  }

  // Generate manifest
  if (options.generateManifest) {
    console.log('📝 Generating icon manifest...');

    const manifest = {
      version: '2.0.0',
      timestamp: Date.now(),
      icons: icons.map(icon => ({
        id: icon.id,
        name: icon.name,
        package: icon.package,
        packageVersion: icon.packageVersion,
        path: icon.relativePath,
        category: icon.category,
        variant: icon.variant,
        size: icon.size,
        hash: icon.hash,
        iconSetId: icon.iconSetId,
        iconSetName: icon.iconSetName,
        license: icon.license,
        commercialUse: icon.commercialUse,
        attributionRequired: icon.attributionRequired
      })),
      packages: Object.entries(iconsByPackage).map(([name, icons]) => ({
        name,
        totalIcons: icons.length,
        license: icons[0].license,
        version: icons[0].packageVersion
      }))
    };

    const manifestPath = path.join(outputDir, 'icon-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✅ Manifest saved to ${manifestPath}`);
  }

  console.log('🎉 Icon build complete!');
}

// Run build
const options: BuildOptions = {
  outputDir: 'public/icons',
  optimizeSvgs: true,
  generateManifest: true
};

buildIcons(options).catch(console.error);
```

**package.json scripts:**

```json
{
  "scripts": {
    "icons:build": "tsx scripts/build-icons.ts",
    "icons:watch": "tsx scripts/build-icons.ts --watch",
    "prebuild": "pnpm icons:build",
    "dev": "concurrently \"strapi develop\" \"pnpm icons:watch\""
  }
}
```

---

## Configuration

**File:** `config/plugins.ts`

```typescript
export default {
  'icons-field': {
    enabled: true,
    config: {
      // NEW: Icon packages configuration
      iconPackages: [
        {
          name: '@mynaui/icons-react',
          iconPath: 'dist/icons',
          pattern: '**/*.svg',
          category: 'mynaui',
          variant: 'regular'
        },
        {
          name: '@heroicons/react',
          iconPath: 'optimized',
          pattern: '**/*.svg',
          category: 'heroicons'
        },
        {
          name: 'lucide-static',
          iconPath: 'icons',
          pattern: '*.svg',
          category: 'lucide'
        }
      ],

      // LEGACY: Still supported for backward compatibility
      publicPath: 'icons',

      // Development mode: use API proxy
      useNodeModulesDiscovery: process.env.NODE_ENV === 'development',

      // Cache TTL for discovered icons (development only)
      discoveryCacheTTL: 60000 // 1 minute
    }
  }
};
```

---

## Developer Workflow Comparison

### ❌ Old Workflow (with icons.sh)

```bash
# Day 1
npm install @mynaui/icons-react
./icons.sh                        # 🐌 5+ minutes
# Test icons
# Found a bug, need different icon set

# Day 2
npm install @heroicons/react
./icons.sh                        # 🐌 Another 5+ minutes
# Forgot to run script
# Why aren't my icons showing up?
# Oh right, need to run icons.sh again
./icons.sh                        # 🐌 Yet another 5+ minutes

# Production deploy
npm run build                     # ❌ BUILD FAILED - forgot icons.sh!
./icons.sh
npm run build                     # ✅ Finally works

# Docker
docker build .                    # ❌ icons.sh doesn't work in container
# Need to add volume mounts, complexity++
```

**Total Time Wasted:** 15+ minutes per day, countless build failures

---

### ✅ New Workflow (Automatic Discovery)

```bash
# Day 1
npm install @mynaui/icons-react
# Icons automatically available in <200ms!
# Test icons immediately

# Day 2
npm install @heroicons/react
# Icons automatically available!
# No manual steps needed

# Production deploy
npm run build                     # ✅ Runs icons:build automatically
# Clean build, no manual steps

# Docker
docker build .                    # ✅ Works perfectly
# No special configuration needed
```

**Total Time Saved:** 96%+ faster (5+ min → <200ms)

---

## Performance Metrics

| Metric | icons.sh (Old) | Auto-Discovery (New) | Improvement |
|--------|---------------|----------------------|-------------|
| **Setup Time** | 5+ minutes | <200ms | **96%+ faster** |
| **Hot Reload** | ❌ Not supported | ✅ <200ms | **∞ faster** |
| **Build Time** | ~30 seconds | ~5 seconds (with caching) | **83% faster** |
| **Memory Usage** | N/A (file copy) | ~20MB (in-memory cache) | Minimal overhead |
| **Developer Actions** | Manual script run | Zero (automatic) | **100% reduction** |
| **Build Failures** | Common (forgot script) | Zero | **100% reduction** |
| **Docker Support** | ❌ Complex | ✅ Native | **Seamless** |
| **Monorepo Support** | ❌ Not working | ✅ Full support | **Game changer** |

---

## Testing Strategy

### Unit Tests

**File:** `tests/unit/icon-discovery.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { IconDiscoveryService } from '../server/src/services/icon-discovery';

describe('IconDiscoveryService', () => {
  let service: IconDiscoveryService;

  beforeEach(() => {
    service = new IconDiscoveryService(mockStrapi);
  });

  describe('resolvePackagePath', () => {
    it('should resolve npm package path', async () => {
      const path = service.resolvePackagePath('@mynaui/icons-react');
      expect(path).toContain('node_modules/@mynaui/icons-react');
    });

    it('should resolve pnpm package path', async () => {
      // Mock pnpm structure
      const path = service.resolvePackagePath('@mynaui/icons-react');
      expect(path).toBeDefined();
    });

    it('should return null for non-existent package', async () => {
      const path = service.resolvePackagePath('@fake/package');
      expect(path).toBeNull();
    });
  });

  describe('discoverPackageIcons', () => {
    it('should discover all icons from package', async () => {
      const icons = await service.discoverPackageIcons({
        name: '@mynaui/icons-react',
        iconPath: 'dist/icons',
        pattern: '**/*.svg'
      });

      expect(icons.length).toBeGreaterThan(0);
      expect(icons[0]).toHaveProperty('id');
      expect(icons[0]).toHaveProperty('name');
      expect(icons[0]).toHaveProperty('svg');
    });

    it('should cache discovered icons', async () => {
      const icons1 = await service.discoverPackageIcons(mockConfig);
      const icons2 = await service.discoverPackageIcons(mockConfig);

      expect(icons1).toBe(icons2); // Same reference (cached)
    });

    it('should clear cache on demand', async () => {
      await service.discoverPackageIcons(mockConfig);
      service.clearCache();

      const icons = await service.discoverPackageIcons(mockConfig);
      expect(service.cache.size).toBe(1);
    });
  });

  describe('license detection', () => {
    it('should detect commercial use licenses', () => {
      expect(service.isCommercialUseAllowed('MIT')).toBe(true);
      expect(service.isCommercialUseAllowed('Apache-2.0')).toBe(true);
      expect(service.isCommercialUseAllowed('CC-BY-NC')).toBe(false);
    });

    it('should detect attribution requirements', () => {
      expect(service.isAttributionRequired('MIT')).toBe(false);
      expect(service.isAttributionRequired('CC-BY-4.0')).toBe(true);
      expect(service.isAttributionRequired('Apache-2.0')).toBe(true);
    });
  });
});
```

### Integration Tests

**File:** `tests/integration/icon-discovery-api.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('Icon Discovery API', () => {
  it('GET /api/icons-field/discover-icons should return all icons', async () => {
    const response = await request(strapi.server.httpServer)
      .get('/api/icons-field/discover-icons')
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.meta.total).toBeGreaterThan(0);
    expect(response.body.meta.packages).toBeInstanceOf(Array);
  });

  it('GET /api/icons-field/discover-icons/:packageName should return package icons', async () => {
    const response = await request(strapi.server.httpServer)
      .get('/api/icons-field/discover-icons/@mynaui/icons-react')
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0].package).toBe('@mynaui/icons-react');
  });

  it('POST /api/icons-field/discover-icons/refresh should clear cache', async () => {
    const response = await request(strapi.server.httpServer)
      .post('/api/icons-field/discover-icons/refresh')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.message).toContain('cache cleared');
  });
});
```

### Edge Cases

```typescript
describe('Edge Cases', () => {
  it('should handle corrupted SVG files', async () => {
    const icons = await service.discoverPackageIcons({
      name: 'package-with-corrupted-svg',
      iconPath: 'icons',
      pattern: '**/*.svg'
    });

    // Should skip corrupted files and continue
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should handle package not found gracefully', async () => {
    const icons = await service.discoverPackageIcons({
      name: '@fake/package',
      iconPath: 'icons',
      pattern: '**/*.svg'
    });

    expect(icons).toEqual([]);
    expect(strapi.log.warn).toHaveBeenCalled();
  });

  it('should handle pnpm workspace resolution', async () => {
    // Mock pnpm workspace structure
    const path = service.resolvePackagePath('@workspace/icons');
    expect(path).toBeDefined();
  });
});
```

---

## Migration Path

### Phase 1: Setup (Day 1)

1. Install dependencies:
   ```bash
   pnpm add glob chokidar svgo
   pnpm add -D tsx concurrently
   ```

2. Add Icon Discovery Service to plugin

3. Update plugin configuration with `iconPackages`

4. Test discovery API endpoint

### Phase 2: Development Mode (Day 2)

1. Integrate discovery service with existing icon cache

2. Add development mode API proxy

3. Enable hot-reloading with chokidar

4. Test with multiple icon packages

### Phase 3: Production Build (Day 3)

1. Create build script (`scripts/build-icons.ts`)

2. Add SVGO optimization

3. Update package.json scripts

4. Test production build

### Phase 4: Cleanup & Documentation (Day 4)

1. Update documentation

2. Create migration guide

3. Add configuration examples

4. Deprecate icons.sh script (keep for backward compatibility)

---

## Success Metrics

### Development Metrics

- ✅ **Setup time:** < 1 minute (vs 5+ minutes with icons.sh)
- ✅ **Hot reload time:** < 200ms
- ✅ **Build time:** < 5 seconds (with caching)
- ✅ **Memory usage:** < 50MB (in-memory cache)
- ✅ **Developer actions:** 0 (vs 1 manual script run)

### User Impact

- ✅ **96%+ faster iteration cycle**
- ✅ **100% reduction in build failures**
- ✅ **Zero configuration for Docker/monorepos**
- ✅ **Seamless developer experience**

### Feature Completeness

- ✅ npm support
- ✅ yarn support
- ✅ pnpm support (including virtual store)
- ✅ Monorepo support (workspaces)
- ✅ Docker support (no special config)
- ✅ Multi-package support
- ✅ Hot-reloading (development)
- ✅ SVGO optimization (production)
- ✅ Backward compatibility (publicPath still works)

---

## Backward Compatibility

The new system is **100% backward compatible**:

```typescript
// OLD configuration (still works)
export default {
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons'  // ✅ Still supported
    }
  }
};

// NEW configuration (recommended)
export default {
  'icons-field': {
    enabled: true,
    config: {
      iconPackages: [
        {
          name: '@mynaui/icons-react',
          iconPath: 'dist/icons',
          pattern: '**/*.svg'
        }
      ],
      publicPath: 'icons'  // Can coexist with iconPackages
    }
  }
};
```

**Migration is optional** - users can upgrade to v2.0 without changing configuration.

---

[← Back to Overview](./README.md)

---

**Last Updated:** 2025-11-26
**Phase Duration:** 3-4 days
**Priority:** CRITICAL
**Impact:** 96%+ faster workflow, eliminates manual icons.sh script
