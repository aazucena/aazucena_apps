// @ts-check

/**
 * Master Seed Script - Orchestrates all seed scripts
 *
 * Runs seed scripts in dependency order:
 * 1. Skill Categories (no dependencies)
 * 2. Skills (depends on categories)
 * 3. Projects (depends on skills)
 * 4. Experiences (depends on skills)
 * 5. Education (no dependencies)
 * 6. Pages (no dependencies - legal pages)
 *
 * Run with: docker compose exec strapi npm run seed:all
 * Or from host: pnpm seed:all (from apps/cms directory)
 * Direct execution: node scripts/seed-all.js
 */

const seedSkillCategories = require('./seed-skill-categories');
const seedSkills = require('./seed-skills');
const seedProjects = require('./seed-projects');
const seedExperiences = require('./seed-experiences');
const seedEducation = require('./seed-education');
const seedPages = require('./seed-pages');
const seedSingleTypes = require('./seed-single-types');
const seedTestimonials = require('./seed-testimonials');
const seedAwards = require('./seed-awards');
const seedPosts = require('./seed-posts');
const seedMusic = require('./seed-music');
const seedJourney = require('./seed-journey');
const seedPreloader = require('./seed-preloader');

async function seedAll() {
  console.log('🌱 Starting comprehensive seeding...');
  console.log('═'.repeat(60));
  console.log('');

  try {
    // Step 1: Base Data
    console.log('📦 Step 1: Base Configuration');
    console.log('─'.repeat(60));
    await seedSingleTypes();
    await seedPreloader();
    await seedJourney();
    console.log('');

    // Step 2: Taxonomy
    console.log('📦 Step 2: Taxonomy & Categories');
    console.log('─'.repeat(60));
    await seedSkillCategories();
    await seedMusic(); // Seeds genres
    console.log('');

    // Step 3: Skills
    console.log('📦 Step 3: Skills');
    console.log('─'.repeat(60));
    await seedSkills();
    console.log('');

    // Step 4: Core Content
    console.log('📦 Step 4: Core Content');
    console.log('─'.repeat(60));
    await seedProjects();
    await seedExperiences();
    await seedEducation();
    console.log('');

    // Step 5: Engagement Content
    console.log('📦 Step 5: Engagement Content');
    console.log('─'.repeat(60));
    await seedPosts();
    await seedTestimonials();
    await seedAwards();
    console.log('');

    // Step 6: Legal & Infrastructure
    console.log('📦 Step 6: Legal & Pages');
    console.log('─'.repeat(60));
    await seedPages();
    console.log('');

    // Final summary
    console.log('═'.repeat(60));
    console.log('✅ All seeding completed successfully!');
    console.log('═'.repeat(60));
    console.log('');
    console.log('📝 Next steps:');
    console.log('  1. Open Strapi Admin: http://localhost:1337/admin');
    console.log('  2. Navigate to Content Manager');
    console.log('  3. Add images to projects (coverImage, screenshots)');
    console.log('  4. Review and edit seeded content as needed');
    console.log('  5. Test frontend integration');
    console.log('  6. When ready: Use Transfer Token for production');
    console.log('');
    console.log('📊 Seeded Content:');
    console.log('  - 10+ Single Types (Hero, About, Portfolio, Website, etc.)');
    console.log('  - 10 Skill Categories (with variants)');
    console.log('  - 71 Skills (across all categories)');
    console.log('  - 8 Projects (metadata only, images pending)');
    console.log('  - 3 Experiences (metadata only, logos pending)');
    console.log('  - 5 Education entries (BSc, Associate, IBM certificates)');
    console.log('  - 3 Testimonials (Approved)');
    console.log('  - 3 Awards & Certifications');
    console.log('  - 2 Blog Posts');
    console.log('  - 3 Music Genres & 1 Composition');
    console.log('  - 3 Pages (Privacy, Terms, Contact)');
    console.log('');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seedAll;
