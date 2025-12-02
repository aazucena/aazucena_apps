import type { Core } from '@strapi/strapi';
import slugify from 'slugify';

/**
 * Slug Generator Middleware
 *
 * Automatically discovers and generates slugs for content types with UID fields.
 * No hardcoding needed - analyzes content type schemas at runtime.
 *
 * Fixes Strapi v5 UID auto-generation bug.
 * See: docs/strapi/18-v5-gotchas.md#3-uid-field-auto-generation-bug
 */

interface SlugConfig {
  from: string; // Source field (title, name, etc.)
  to: string;   // Target slug field (slug)
}

interface AttributeConfig {
  type?: string;
  targetField?: string;
  [key: string]: any;
}

// Cache for discovered slug configurations
let slugConfigsCache: Record<string, SlugConfig> | null = null;

/**
 * Auto-discover content types with UID fields
 * Looks for UID fields and their targetField (the source field for slug generation)
 */
function discoverSlugConfigs(strapi: Core.Strapi): Record<string, SlugConfig> {
  if (slugConfigsCache) {
    return slugConfigsCache;
  }

  const configs: Record<string, SlugConfig> = {};
  const contentTypes = strapi.contentTypes;

  for (const [uid, contentType] of Object.entries(contentTypes)) {
    // Skip non-API content types (admin, plugins, etc.)
    if (!uid.startsWith('api::')) continue;

    const attributes = contentType.attributes;
    if (!attributes) continue;

    // Find UID fields (slug fields)
    for (const [attrName, attrConfig] of Object.entries(attributes)) {
      const config = attrConfig as AttributeConfig;

      if (config.type === 'uid' && config.targetField) {
        configs[uid] = {
          from: config.targetField,
          to: attrName,
        };

        strapi.log.debug(`Discovered slug config: ${uid} (${config.targetField} → ${attrName})`);
      }
    }
  }

  slugConfigsCache = configs;
  return configs;
}

export default (_config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();

    // Only process successful POST/PUT requests
    if (!['POST', 'PUT'].includes(ctx.request.method) || ctx.status >= 400) {
      return;
    }

    const { uid } = ctx.params;
    if (!uid) return;

    // Auto-discover slug configurations from content type schemas
    const slugConfigs = discoverSlugConfigs(strapi);
    const slugConfig = slugConfigs[uid];
    if (!slugConfig) return;

    const entityId = ctx.response.body?.data?.id;
    if (!entityId) return;

    // Generate slug asynchronously (don't block response)
    setImmediate(async () => {
      try {
        const entity = await strapi.documents(uid).findOne({ documentId: entityId });

        // Only generate if slug is empty and source field has a value
        if (!entity[slugConfig.to] && entity[slugConfig.from]) {
          const slug = slugify(entity[slugConfig.from], {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
            locale: 'en',
          });

          await strapi.db.query(uid).update({
            where: { id: entityId },
            data: { [slugConfig.to]: slug },
          });

          strapi.log.info(`✅ Generated slug "${slug}" for ${uid}:${entityId}`);
        }
      } catch (error) {
        strapi.log.error(`❌ Slug generation failed for ${uid}:${entityId}`, error);
        // Don't throw - slug generation failure shouldn't block content creation
      }
    });
  };
};
