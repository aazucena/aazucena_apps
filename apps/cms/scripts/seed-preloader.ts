/**
 * Strapi v5 Seeding Script for Preloader Configuration
 *
 * Run this script with: node --loader ts-node/esm scripts/seed-preloader.ts
 * Or better: Add to bootstrap in src/index.ts for auto-seeding
 */

import { createStrapi, compileStrapi } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';

async function seedPreloader() {
  let strapi: Core.Strapi | null = null;

  try {
    // Compile Strapi first
    const appContext = await compileStrapi();

    // Create and load Strapi instance
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Checking preloader configuration...');

    // Check if preloader config already exists
    const existing = await strapi.db
      .query('api::preloader.preloader')
      .findOne();

    if (existing) {
      console.log('✅ Preloader configuration already exists, skipping seed');
      return;
    }

    console.log('🌱 Seeding preloader configuration...');

    // Create default preloader config
    await strapi.db.query('api::preloader.preloader').create({
      data: {
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
            icon: 'Code',
            weight: 20,
            enabled: true,
          },
          {
            stepId: 2,
            name: 'Loading Assets',
            description: 'Images and resources',
            icon: 'Image',
            weight: 30,
            enabled: true,
          },
          {
            stepId: 3,
            name: 'Optimizing',
            description: 'Performance tweaks',
            icon: 'Zap',
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
      },
    });

    console.log('✅ Preloader configuration seeded successfully');
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
seedPreloader()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

export default seedPreloader;
