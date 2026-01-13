#!/usr/bin/env node
// @ts-check

/**
 * Seed Script Generator
 *
 * Automatically generates seed script templates from Strapi content type schemas
 *
 * Usage:
 *   node scripts/generate-seed.js <content-type-name>
 *
 * Example:
 *   node scripts/generate-seed.js testimonial
 *   node scripts/generate-seed.js award
 *
 * This will create scripts/seed-<plural>.js with proper structure
 */

const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} StrapiSchema
 * @property {string} kind - 'singleType' or 'collectionType'
 * @property {string} collectionName - Database table name
 * @property {Object} info - Schema metadata
 * @property {string} info.singularName - Singular name
 * @property {string} info.pluralName - Plural name
 * @property {string} info.displayName - Display name
 * @property {Record<string, AttributeConfig>} attributes - Field definitions
 */

/**
 * @typedef {Object} AttributeConfig
 * @property {string} type - Field type (string, number, boolean, etc.)
 * @property {boolean} [required] - Whether field is required
 * @property {string[]} [enum] - Enum values if type is enumeration
 * @property {string} [component] - Component path if type is component
 * @property {boolean} [repeatable] - Whether component is repeatable
 */

/**
 * Generate field template based on schema attributes
 * @param {Record<string, AttributeConfig>} attributes - Schema attributes
 * @returns {string} Generated field template code
 */
function generateFieldTemplate(attributes) {
  const fields = [];

  for (const [fieldName, config] of Object.entries(attributes)) {
    // Skip relations for now (handle separately)
    if (config.type === 'relation') continue;

    const comment = `// ${fieldName}: ${config.type}${config.required ? ' (required)' : ''}`;

    switch (config.type) {
      case 'string':
      case 'text':
      case 'richtext':
        fields.push(`    ${comment}\n    ${fieldName}: '',`);
        break;
      case 'email':
        fields.push(`    ${comment}\n    ${fieldName}: 'example@email.com',`);
        break;
      case 'integer':
        fields.push(`    ${comment}\n    ${fieldName}: 0,`);
        break;
      case 'decimal':
      case 'float':
        fields.push(`    ${comment}\n    ${fieldName}: 0.0,`);
        break;
      case 'boolean':
        fields.push(`    ${comment}\n    ${fieldName}: false,`);
        break;
      case 'date':
        fields.push(`    ${comment}\n    ${fieldName}: '2024-01-01',`);
        break;
      case 'datetime':
        fields.push(`    ${comment}\n    ${fieldName}: '2024-01-01T00:00:00.000Z',`);
        break;
      case 'enumeration':
        const enumValues = config.enum || [];
        fields.push(`    ${comment} (options: ${enumValues.join(', ')})\n    ${fieldName}: '${enumValues[0] || ''}',`);
        break;
      case 'json':
      case 'blocks':
        fields.push(`    ${comment}\n    ${fieldName}: [],`);
        break;
      case 'component':
        fields.push(`    ${comment} (component: ${config.component})\n    ${fieldName}: ${config.repeatable ? '[]' : '{}'}, // TODO: Fill component data`);
        break;
      default:
        fields.push(`    ${comment}\n    ${fieldName}: null, // TODO: Set value`);
    }
  }

  return fields.join('\n');
}

/**
 * Generate data structure for single-type content
 * @param {string} displayName - Display name of the content type
 * @param {string} fieldTemplate - Generated field template
 * @returns {string} Generated data structure code
 */
function generateSingleTypeData(displayName, fieldTemplate) {
  return `// ${displayName} configuration data
const configData = {
${fieldTemplate}
};`;
}

/**
 * Generate data structure for collection-type content
 * @param {string} displayName - Display name of the content type
 * @param {string} fieldTemplate - Generated field template
 * @returns {string} Generated data structure code
 */
function generateCollectionTypeData(displayName, fieldTemplate) {
  return `// ${displayName} data (add multiple entries as needed)
const data = [
  {
${fieldTemplate}
  },
  // Add more entries here...
];`;
}

/**
 * Generate seed logic for single-type content
 * @param {string} singularName - Singular name of the content type
 * @returns {string} Generated seed logic code
 */
function generateSingleTypeLogic(singularName) {
  return `    // Check if config already exists
    const existing = await strapi.db
      .query('api::${singularName}.${singularName}')
      .findOne();

    if (existing) {
      // Update missing fields
      const updateData = {};
      let hasUpdates = false;

      for (const [key, value] of Object.entries(configData)) {
        if (existing[key] === null || existing[key] === undefined || existing[key] === '') {
          // @ts-ignore
          updateData[key] = value;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        await strapi.db.query('api::${singularName}.${singularName}').update({
          where: { id: existing.id },
          data: updateData,
        });
        console.log('🔄 Updated: Configuration (filled missing fields)');
      } else {
        console.log('✓ Exists: Configuration (all fields populated)');
      }

      console.log('\\n📊 Summary:');
      console.log('   Created: 0');
      console.log(hasUpdates ? '   Updated: 1' : '   Existing: 1');
      console.log('   Total: 1');
    } else {
      // Create new config
      await strapi.db.query('api::${singularName}.${singularName}').create({
        data: configData,
      });

      console.log('✅ Created: Configuration');
      console.log('\\n📊 Summary:');
      console.log('   Created: 1');
      console.log('   Existing: 0');
      console.log('   Total: 1');
    }`;
}

/**
 * Generate seed logic for collection-type content
 * @param {string} singularName - Singular name of the content type
 * @param {string} pluralName - Plural name of the content type
 * @returns {string} Generated seed logic code
 */
function generateCollectionTypeLogic(singularName, pluralName) {
  return `    let created = 0;
    let existing = 0;

    for (const item of data) {
      // TODO: Update this check based on your unique identifier field
      const existingItem = await strapi.db
        .query('api::${singularName}.${singularName}')
        .findOne({
          where: {
            // TODO: Add unique field check (e.g., slug, email, etc.)
            // slug: item.slug
          }
        });

      if (existingItem) {
        // Update missing fields
        const updateData = {};
        let hasUpdates = false;

        for (const [key, value] of Object.entries(item)) {
          if (existingItem[key] === null || existingItem[key] === undefined || existingItem[key] === '') {
            // @ts-ignore
            updateData[key] = value;
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          await strapi.entityService.update('api::${singularName}.${singularName}', existingItem.id, {
            data: updateData,
          });
          console.log(\`🔄 Updated: \${item.name || item.title || 'Item'} - filled missing fields\`);
        } else {
          console.log(\`✓ Exists: \${item.name || item.title || 'Item'}\`);
        }
        existing++;
        continue;
      }

      // Create new item
      await strapi.entityService.create('api::${singularName}.${singularName}', {
        data: {
          ...item,
          publishedAt: new Date(), // Auto-publish
        },
      });

      console.log(\`✅ Created: \${item.name || item.title || 'Item'}\`);
      created++;
    }

    console.log(\`\\n📊 Summary:\`);
    console.log(\`   Created: \${created}\`);
    console.log(\`   Existing: \${existing}\`);
    console.log(\`   Total: \${data.length}\`);`;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate seed script from content type schema
 * @param {string} contentTypeName - Name of the content type (singular)
 * @returns {void}
 */
function generateSeedScript(contentTypeName) {
  const schemaPath = path.join(
    __dirname,
    '..',
    'src',
    'api',
    contentTypeName,
    'content-types',
    contentTypeName,
    'schema.json'
  );

  // Check if schema exists
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema not found at: ${schemaPath}`);
    console.error(`\nMake sure the content type "${contentTypeName}" exists in src/api/`);
    process.exit(1);
  }

  // Read and parse schema
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  /** @type {StrapiSchema} */
  const schema = JSON.parse(schemaContent);
  const { singularName, pluralName, displayName } = schema.info;
  const attributes = schema.attributes;

  // Determine if it's a single type or collection type
  const isSingleType = schema.kind === 'singleType';

  // Generate field template based on attributes
  const fieldTemplate = generateFieldTemplate(attributes);

  // Generate the seed script content
  const seedScriptContent = `// @ts-check

/**
 * Strapi v5 Seeding Script for ${displayName}
 *
 * Seeds ${isSingleType ? 'configuration for' : 'multiple'} ${pluralName}
 * Run with: docker compose exec strapi npm run seed -- ${pluralName}
 * Or from host: pnpm seed -- ${pluralName} (from apps/cms directory)
 * Direct execution: node scripts/seed-${pluralName}.js
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

${isSingleType ? generateSingleTypeData(displayName, fieldTemplate) : generateCollectionTypeData(displayName, fieldTemplate)}

async function seed${capitalize(pluralName)}() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding ${displayName}...\\n');

${isSingleType ? generateSingleTypeLogic(singularName) : generateCollectionTypeLogic(singularName, pluralName)}

    console.log('\\n✅ ${displayName} seeding complete');
  } catch (error) {
    console.error('❌ Error seeding ${pluralName}:', error);
    // Log full validation error details
    // @ts-ignore
    if (error.details && error.details.errors) {
      console.error('\\n📋 Validation Error Details:');
      // @ts-ignore
      error.details.errors.forEach((err, index) => {
        console.error(\`  Error \${index + 1}:\`, JSON.stringify(err, null, 2));
      });
    }
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seed${capitalize(pluralName)}()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seed${capitalize(pluralName)};
`;

  // Write the seed script
  const outputPath = path.join(__dirname, `seed-${pluralName}.js`);
  fs.writeFileSync(outputPath, seedScriptContent);

  console.log(`✅ Generated seed script: scripts/seed-${pluralName}.js`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Edit scripts/seed-${pluralName}.js and fill in the data`);
  console.log(`   2. Run: npm run seed -- ${pluralName}`);
  console.log(`   3. Or run all: npm run seed -- all`);
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Usage: node scripts/generate-seed.js <content-type-name>');
  console.error('\nExample: node scripts/generate-seed.js testimonial');
  process.exit(1);
}

const contentTypeName = args[0];
generateSeedScript(contentTypeName);
