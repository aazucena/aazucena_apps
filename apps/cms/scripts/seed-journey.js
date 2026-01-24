// @ts-check

/**
 * Strapi v5 Seeding Script for Journey Page
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const journeyData = {
  header: {
    title: "The Evolution.",
    description: "An interactive report on growth, technical adaptation, and the logic behind the journey.",
    watermark: "JOURNEY",
    accentColor: "#3b82f6"
  },
  phases: [
    {
      name: "foundation",
      title: "Building the Foundation",
      description: "Early career and academic years focusing on computer science fundamentals.",
      enabled: true,
      items: [
        { title: "CS Fundamentals", description: "Mastering algorithms, data structures, and system design.", variant: "blue" }
      ]
    },
    {
      name: "expansion",
      title: "Scaling Up",
      description: "Transitioning to full-stack development and enterprise-scale applications.",
      enabled: true,
      items: [
        { title: "Full-Stack Shift", description: "Adopting React and Node.js for modern web architectures.", variant: "purple" }
      ]
    }
  ],
  callToAction: {
    title: "Explore the Details.",
    description: "Dive deeper into specific case studies, technical writings, or get in touch.",
    buttons: [
      { label: "Portfolio", url: "/projects", variant: "primary", size: "md", openInNewTab: false },
      { label: "Get in Touch", url: "/contact", variant: "outline", size: "md", openInNewTab: false }
    ]
  }
};

async function seedJourney() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Journey Page...\n');

    await strapi.service('api::journey.journey').createOrUpdate({
      data: {
        ...journeyData,
        publishedAt: new Date()
      }
    });

    console.log('✅ Journey page seeding complete');
  } catch (error) {
    console.error('❌ Error seeding journey:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

if (require.main === module) {
  seedJourney()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedJourney;
