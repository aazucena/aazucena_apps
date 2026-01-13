// @ts-check

/**
 * Strapi v5 Seeding Script for Preloader Configuration
 *
 * Seeds default preloader configuration (single-type content)
 * Run with: docker compose exec strapi npm run seed:preloader
 * Or from host: pnpm seed:preloader (from apps/cms directory)
 * Direct execution: node scripts/seed-preloader.js
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function seedPreloader() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Preloader Configuration...\n');

    // Preloader data to seed
    const preloaderData = {
        enabled: true,
        variant: 'interactive',
        theme: 'default',

        title: 'Preparing Your Experience',
        readyTitle: 'Ready to Explore!',
        readySubtitle: 'Your experience is fully optimized and ready',
        readyFooterNote: 'All systems ready for your journey',

        minDisplayTime: 1500,
        maxDisplayTime: 10000,
        animationDuration: 600,

        autoStart: true,
        enableSkip: false,
        lazyLoad: false,
        preloadAssets: false,
        enableAnimations: true,

        transitionType: 'fade',
        showCard: false,

        loadingSteps: [
          {
            stepId: 1,
            name: 'Initializing',
            description: 'Setting up framework',
            // icon: 'Code', // Icon field stores SVG strings - fill manually via Strapi UI
            weight: 20,
            enabled: true,
          },
          {
            stepId: 2,
            name: 'Loading Assets',
            description: 'Images and resources',
            // icon: 'Image', // Icon field stores SVG strings - fill manually via Strapi UI
            weight: 30,
            enabled: true,
          },
          {
            stepId: 3,
            name: 'Optimizing',
            description: 'Performance tweaks',
            // icon: 'Zap', // Icon field stores SVG strings - fill manually via Strapi UI
            weight: 20,
            enabled: true,
          },
        ],

        continueButton: {
          label: 'Enter Website',
          url: '#main-content',
          variant: 'primary',
          size: 'md',
          openInNewTab: false,
        },

        ariaLabel: 'Loading progress',
        ariaLive: 'polite',
        skipButtonAriaLabel: 'Skip loading',

        debug: false,
    };

    // Check if preloader config already exists
    const existing = await strapi.db
      .query('api::preloader.preloader')
      .findOne();

    if (existing) {
      // Update missing fields
      const updateData = {};
      let hasUpdates = false;

      for (const [key, value] of Object.entries(preloaderData)) {
        // Only update if field is null or undefined (not empty string - that's intentional)
        if (existing[key] === null || existing[key] === undefined) {
          // @ts-ignore
          updateData[key] = value;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        await strapi.db.query('api::preloader.preloader').update({
          where: { id: existing.id },
          data: updateData,
        });
        console.log('🔄 Updated: Preloader Configuration (filled missing fields)');
      } else {
        console.log('✓ Exists: Preloader Configuration (all fields populated)');
      }

      console.log('\n📊 Summary:');
      console.log('   Created: 0');
      console.log(hasUpdates ? '   Updated: 1' : '   Existing: 1');
      console.log('   Total: 1');
    } else {
      // Create new preloader config
      await strapi.db.query('api::preloader.preloader').create({
        data: preloaderData,
      });

      console.log('✅ Created: Preloader Configuration');
      console.log('\n📊 Summary:');
      console.log('   Created: 1');
      console.log('   Existing: 0');
      console.log('   Total: 1');
    }

    console.log('\n✅ Preloader configuration seeding complete');
  } catch (error) {
    console.error('❌ Error seeding preloader:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedPreloader()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedPreloader;
