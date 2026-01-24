// @ts-check

/**
 * Strapi v5 Seeding Script for Single Types (Configuration)
 *
 * Seeds all single types with default configuration
 * Run with: docker compose exec strapi node scripts/seed-single-types.js
 * Or from host: pnpm run seed:single (if configured)
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const singleTypesData = {
  'api::hero.hero': {
    flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
    taglineTemplate: 'Turning {flipWord} into elegant code, one pixel at a time.',
    primaryButtonText: 'Get Started',
    showDropdown: true,
    secondaryButtonText: 'View Resume',
    showSecondaryButton: true,
  },
  'api::about.about': {
    tagline: 'Building Products That Drive Impact',
    descriptions: [
      {
        type: 'paragraph',
        children: [{
          type: 'text',
          text: "I'm a full-stack professional who transforms ideas into market-ready products. From rapid MVP development to enterprise-scale systems, I build high-performance SaaS, web, and mobile applications that deliver measurable business impact."
        }]
      }
    ],
    highlights: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Full-Stack Development & Architecture' }]
      }
    ],
    stats: [
      { label: 'Years Experience', value: '4+', sort: 1 },
      { label: 'Databases Migrated', value: '30+', sort: 2 },
      { label: 'Client Sites Managed', value: '50+', sort: 3 }
    ],
  },
  'api::portfolio.portfolio': {
    fullName: 'Aldrin Azucena',
    occupation: 'Full Stack Software Developer',
    email: 'aldrinp.azucena@gmail.com',
    availabilityStatus: 'Open to Opportunities',
    timezone: 'America/Edmonton',
    yearsOfExperience: 4,
    location: 'Albera, Canada',
  },
  'api::website-configuration.website-configuration': {
    siteName: 'Aldrin Azucena',
    siteUrl: 'https://aazucena.com',
    baseUrl: '/',
    metaTitleTemplate: '%s — {siteName}',
    robotsIndex: true,
    robotsFollow: true,
    defaultSEO: {
      metaTitle: 'Aldrin Azucena - Full Stack Developer',
      metaDescription: 'Portfolio of Aldrin Azucena, a full-stack developer specialized in React, Node.js, and high-performance applications.',
      metaViewport: 'width=device-width, initial-scale=1.0',
      metaRobots: 'index, follow',
      twitterCard: 'summary_large_image',
    }
  },
  'api::theme.theme': {
    mode: 'system',
    primaryColor: '#32a0c5',
    primaryColorDark: '#32a0c5',
    secondaryColor: '#3b79bc',
    secondaryColorDark: '#3b79bc',
    accentColor: '#25c6d2',
    accentColorDark: '#25c6d2',
    fontSans: 'Fira Sans',
    fontSerif: 'Fira Sans',
    fontHeading: 'Fira Sans',
    fontCode: 'Fira Code',
  },
  'api::homepage.homepage': {
    title: 'Home',
    sections: [
      { name: 'hero', title: 'Aldrin Azucena', enabled: true, sort: 0 },
      { name: 'about', title: 'About Me', enabled: true, sort: 1 },
      { name: 'projects', title: 'Featured Projects', enabled: true, sort: 2 },
      { name: 'experiences', title: 'Experience', enabled: true, sort: 3 },
      { name: 'skills', title: 'Skills & Technologies', enabled: true, sort: 4 },
      { name: 'testimonials', title: 'Testimonials', enabled: true, sort: 5 },
      { name: 'blog', title: 'Blog', enabled: true, sort: 6 },
      { name: 'awards', title: 'Awards & Certifications', enabled: true, sort: 7 }
    ],
    seo: {
      metaTitle: 'Aldrin Azucena | Full Stack Developer',
      metaDescription: 'Explore the portfolio of Aldrin Azucena, featuring advanced animations and full-stack expertise.',
      metaRobots: 'index, follow',
    }
  },
  'api::animation.animation': {
    enabled: true,
    heavyAnimations: true,
    defaultPerformanceTier: 'auto',
    particleCountLow: 50,
    particleCountMedium: 100,
    particleCountHigh: 200,
    timingFlipText: 3000,
    timingSectionTransition: 1000,
  },
  'api::maintenance.maintenance': {
    enabled: false,
    message: 'The site is currently undergoing maintenance. Please check back later.',
    heroSubtitle: 'Refining the Experience',
    reachOutLabel: 'Reach out directly',
  },
  'api::analytic.analytic': {
    googleAnalyticsEnabled: false,
    vercelAnalyticsEnabled: true,
    vercelSpeedInsightsEnabled: true,
    plausibleEnabled: false,
    sentryEnabled: false,
  },
  'api::blog.blog': {
    postsPerPage: 6,
    permalink: '/%slug%',
    mainPath: 'blog',
    categoryPath: 'category',
    tagPath: 'tag',
    relatedPostsEnabled: true,
    relatedPostsCount: 4,
  },
  'api::project-showcase.project-showcase': {
    searchPlaceholder: 'Search projects by tech, title...', 
    dragHintText: 'Drag to explore more projects',
    viewMoreButtonLabel: 'View More',
    viewMoreButtonSubtitle: 'Explore all projects',
    maxProjectsDisplayed: 7,
    projectsPerPage: 4,
  },
  'api::skill-showcase.skill-showcase': {
    searchPlaceholder: 'Search technologies...',
    emptyMessage: 'No technologies found matching your criteria.',
  },
  'api::experience-showcase.experience-showcase': {
    searchPlaceholder: 'Search experiences...',
  },
  'api::contact-form.contact-form': {
    formTitle: 'Send a Message',
    submitButtonLabel: 'Send Message',
    successMessage: 'Message sent successfully!',
  }
};

async function seedSingleTypes() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Single Types...\n');
    const singleTypes = singleTypesData;
    for (/** @type {[UID.Service, Record<string, any>]} */ const [uid, data] of Object.entries(singleTypes)) {
      console.log(`📦 Seeding ${uid}...`);
      try {
        const existing = await strapi.db.query(uid).findOne({});
        
        if (existing) {
          // @ts-ignore
          await strapi.service(uid).createOrUpdate({
            data: {
              ...data,
              publishedAt: new Date(),
            },
          });
          console.log(`  🔄 Updated existing ${uid}`);
        } else {
          // @ts-ignore
          await strapi.service(service).createOrUpdate({
            data: {
              ...data,
              publishedAt: new Date(),
            },
          });
          console.log(`  ✅ Created new ${uid}`);
        }
      } catch (err) {
          // @ts-ignore
        console.error(`  ❌ Failed to seed ${uid}:`, err.message);
      }
    }

    console.log('\n✅ Single types seeding complete');
  } catch (error) {
    console.error('❌ Error seeding single types:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

if (require.main === module) {
  seedSingleTypes()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedSingleTypes;
