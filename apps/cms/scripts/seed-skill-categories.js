// @ts-check

/**
 * Strapi v5 Seeding Script for Skill Categories
 *
 * Seeds 10 skill categories with display and variant fields
 * Run with: docker compose exec strapi npm run seed:categories
 * Or from host: pnpm seed:categories (from apps/cms directory)
 * Direct execution: node scripts/seed-skill-categories.js
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const skillCategoriesData = [
  {
    name: 'frontend',
    label: 'Frontend',
    // icon: 'Code', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'cyan-blue',
  },
  {
    name: 'backend',
    label: 'Backend',
    // icon: 'Server', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'purple-pink',
  },
  {
    name: 'database',
    label: 'Database',
    // icon: 'Database', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'green-emerald',
  },
  {
    name: 'cloud',
    label: 'Cloud',
    // icon: 'Cloud', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'blue-indigo',
  },
  {
    name: 'tools',
    label: 'Tools',
    // icon: 'Tool', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'yellow-orange',
  },
  {
    name: 'ai',
    label: 'AI',
    // icon: 'Brain', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'pink-red',
  },
  {
    name: 'mobile',
    label: 'Mobile',
    // icon: 'DeviceMobile', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'teal-cyan',
  },
  {
    name: 'hardware-embedded',
    label: 'Hardware/Embedded',
    // icon: 'Chip', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'orange-red',
  },
  {
    name: 'music-technology',
    label: 'Music Technology',
    // icon: 'MusicNote', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'violet-purple',
  },
  {
    name: 'audio-engineering',
    label: 'Audio Engineering',
    // icon: 'WaveSquare', // Icon field stores SVG strings - fill manually via Strapi UI
    display: 'visible',
    variant: 'indigo-violet',
  },
];

async function seedSkillCategories() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Skill Categories...\n');

    let created = 0;
    let existing = 0;

    for (const category of skillCategoriesData) {
      // Check if category already exists
      const existingCategory = await strapi.db
        .query('api::skill-category.skill-category')
        .findOne({ where: { name: category.name } });

      if (existingCategory) {
        // Update missing fields
        const updateData = {};
        let hasUpdates = false;

        for (const [key, value] of Object.entries(category)) {
          // Only update if field is null or undefined (not empty string - that's intentional)
          if (existingCategory[key] === null || existingCategory[key] === undefined) {
            // @ts-ignore
            updateData[key] = value;
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          await strapi.db.query('api::skill-category.skill-category').update({
            where: { id: existingCategory.id },
            data: updateData,
          });
          console.log(
            `🔄 Updated: ${category.label} (${category.variant}) - filled missing fields`
          );
          existing++;
        } else {
          console.log(`✓ Exists: ${category.label} (${category.variant})`);
          existing++;
        }
        continue;
      }

      // Create new category
      await strapi.db.query('api::skill-category.skill-category').create({
        data: category,
      });

      console.log(`✅ Created: ${category.label} (${category.variant})`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Total: ${skillCategoriesData.length}`);
    console.log('\n✅ Skill Categories seeding complete');
  } catch (error) {
    console.error('❌ Error seeding skill categories:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedSkillCategories()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedSkillCategories;
