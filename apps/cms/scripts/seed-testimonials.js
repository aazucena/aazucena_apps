// @ts-check

/**
 * Strapi v5 Seeding Script for Testimonials
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const testimonialsData = [
  {
    author: 'John Doe',
    authorTitle: 'Senior Engineering Manager',
    company: 'Tangle Media Inc.',
    content:
      'Aldrin consistently delivers high-quality code and demonstrates exceptional problem-solving skills. His ability to tackle complex technical challenges makes him an invaluable team member.',
    rating: 5,
    featured: true,
    approvalStatus: 'Approved',
    relationship: 'Manager',
  },
  {
    author: 'Sarah Miller',
    authorTitle: 'Product Manager',
    company: 'Tech Solutions',
    content:
      'Working with Aldrin has been a pleasure. He translates complex requirements into elegant solutions and always delivers ahead of schedule with exceptional attention to detail.',
    rating: 5,
    featured: true,
    approvalStatus: 'Approved',
    relationship: 'Colleague',
  },
  {
    author: 'Michael Kim',
    authorTitle: 'Tech Lead',
    company: 'Innovate Corp',
    content:
      "Aldrin's expertise in full-stack development and his collaborative approach make him stand out. He's always willing to share knowledge and mentor junior developers.",
    rating: 5,
    featured: true,
    approvalStatus: 'Approved',
    relationship: 'Colleague',
  },
];

async function seedTestimonials() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Testimonials...\n');

    let created = 0;
    let existing = 0;

    for (const data of testimonialsData) {
      const existingEntry = await strapi.db
        .query('api::testimonial.testimonial')
        .findOne({ where: { author: data.author } });

      if (existingEntry) {
        console.log(`✓ Exists: ${data.author}`);
        existing++;
        continue;
      }

      await strapi.entityService.create('api::testimonial.testimonial', {
        data: {
          ...data,
          publishedAt: new Date(),
        },
      });

      console.log(`✅ Created: ${data.author}`);
      created++;
    }

    console.log(`\n📊 Summary: Created ${created}, Existing ${existing}`);
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

if (require.main === module) {
  seedTestimonials()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedTestimonials;
