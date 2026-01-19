// @ts-check

/**
 * Strapi v5 Seeding Script for Experiences
 *
 * Seeds 3 work experiences with skills relations and achievements
 * Company logos must be added manually via Strapi UI
 * Run with: docker compose exec strapi npm run seed:experiences
 * Or from host: pnpm seed:experiences (from apps/cms directory)
 * Direct execution: node scripts/seed-experiences.js
 *
 * Data source: apps/portfolio/src/components/animations/sections/data/experiences.ts
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');


const experiencesData = [
  {
    slug: 'full-stack-software-developer-tangle-media',
    company: 'Tangle Media Inc.',
    position: 'Full Stack Software Developer',
    industry: 'Technology',
    companySize: 'small',
    location: 'Lethbridge, AB, Canada',
    startDate: '2021-12-01',
    endDate: '2025-09-30',
    isCurrent: false,
    employmentType: 'Full-time',
    workMode: 'Onsite',
    companyWebsite: 'https://www.tanglemedia.ca',

    description: 'Full-stack software development with focus on scalable web applications and database management',

    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built 25+ reusable UI components reducing development time by 25% and UI-related bugs by 15%' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Migrated 30+ databases (5TB+) with zero data loss using custom Python scripts and validation frameworks' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Managed 50+ client sites with 99.95% uptime through proactive monitoring and rapid incident response' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Developed 15+ multilingual accessible websites achieving Lighthouse scores above 95 and WCAG compliance' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Created 15+ admin dashboards reducing content publishing time from 30 minutes to under 10 minutes' }]
          }
        ]
      }
    ],

    skillsUsed: [
      'Hugo', 'PostCSS', 'SCSS', 'CSS', 'React', 'Vue', 'Svelte', 'JQuery', 'Alpine.js', 'Bootstrap', 'Tailwind', 'ShadCN', 'PHP', 'Laravel', 'DigitalOcean', 'LangChain', 'Stripe', 'OpenAI', 'TypeScript', 'JavaScript', 'Agile', 'MySQL',
      'PostgreSQL', 'Websockets', 'PGP Encryption', 'REST APIs', 'API Design', 'Jira', 'MS SQL', 'Redis', 'Docker', 'CI/CD', 'CircleCI', 'Netlify', 'Accessibility', 'Performance Optimization', 'SEO Optimization', 'Content Management System', 'Cursor',
      'UI/UX Design', 'Database Migration'
    ],

    achievements: []
  },

  {
    slug: 'software-developer-intern-helpusdefend',
    company: 'HelpUsDefend',
    position: 'Software Developer Intern',
    industry: 'Technology',
    companySize: 'startup',
    location: 'Toronto, ON, Canada',
    startDate: '2021-05-01',
    endDate: '2022-01-31',
    isCurrent: false,
    employmentType: 'Internship',
    workMode: 'Remote',

    description: 'Mobile app development internship with focus on AI/ML integration and legacy code refactoring',

    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built proof-of-concept Flutter mobile app with TensorFlow Lite AI camera integration achieving 95% accuracy' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Reduced technical debt by 25% through comprehensive refactoring of legacy codebase' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Implemented automated testing suite improving code coverage from 40% to 75%' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Collaborated with cross-functional teams in an Agile environment to deliver features on schedule' }]
          }
        ]
      }
    ],

    skillsUsed: [
      'Python', 'Django', 'Flutter', 'Dart', 'TensorFlow Lite', 'AI/ML', 'Firebase', 'MongoDB',
      'Mobile Development', 'Automated Testing', 'Agile',
      'Code Refactoring'
    ],

    achievements: []
  },

  {
    slug: 'web-developer-intern-interfaith-food-bank',
    company: 'Interfaith Food Bank',
    position: 'Web Developer Intern',
    industry: 'Non-Profit',
    companySize: 'medium',
    location: 'Lethbridge, AB, Canada',
    startDate: '2019-02-01',
    endDate: '2020-08-31',
    isCurrent: false,
    employmentType: 'Internship',
    workMode: 'Onsite',
    companyWebsite: 'https://www.interfaithfoodbank.ca',

    description: 'Web development internship for non-profit organization building volunteer management system',

    responsibilities: [
      {
        type: 'list',
        format: 'unordered',
        children: [
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Launched volunteer management tool serving 1,000+ active users with real-time scheduling capabilities' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Increased volunteer sign-ups by 35% through intuitive UX design and streamlined registration process' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Built responsive web application using React and Node.js with PostgreSQL database' }]
          },
          {
            type: 'list-item',
            children: [{ type: 'text', text: 'Implemented user authentication and authorization system ensuring data security and privacy' }]
          }
        ]
      }
    ],

    skillsUsed: [
      'PHP', 'WordPress', 'MySQL', 'JQuery', 'Authentication',
      'UX Design', 'Responsive Design', 'Real-time Systems',
      'REST APIs'
    ],

    achievements: []
  }
];

async function seedExperiences() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Experiences...\n');

    let created = 0;
    let existing = 0;
    let skipped = 0;

    for (const experience of experiencesData) {
      // Check if experience already exists
      const existingExperience = await strapi.db
        .query('api::experience.experience')
        .findOne({
          where: {
            company: experience.company,
            position: experience.position
          }
        });

      // Resolve skill relations (many-to-many)
      const skillIds = [];
      const missingSkills = [];

      for (const skillName of experience.skillsUsed) {
        const skill = await strapi.db
          .query('api::skill.skill')
          .findOne({ where: { name: skillName } });

        if (skill) {
          skillIds.push(skill.id);
        } else {
          missingSkills.push(skillName);
        }
      }

      if (missingSkills.length > 0) {
        console.warn(
          `  ⚠️  Missing skills for ${experience.company}: ${missingSkills.join(', ')}`
        );
      }

      if (existingExperience) {
        // Update missing fields
        const updateData = {};
        let hasUpdates = false;

        // Remove temp field and prepare data
        const { skillsUsed, ...experienceData } = experience;

        for (const [key, value] of Object.entries(experienceData)) {
          // Only update if field is null or undefined (not empty string - that's intentional)
          if (existingExperience[key] === null || existingExperience[key] === undefined) {
            // @ts-ignore
            updateData[key] = value;
            hasUpdates = true;
          }
        }

        // Check if skillsUsed needs updating (only if null or undefined, not empty array)
        if (existingExperience.skillsUsed === null || existingExperience.skillsUsed === undefined) {
          // @ts-ignore
          updateData.skillsUsed = skillIds;
          hasUpdates = true;
        }

        if (hasUpdates) {
          await strapi.entityService.update('api::experience.experience', existingExperience.id, {
            data: updateData,
          });
          console.log(`🔄 Updated: ${experience.company} - ${experience.position} - filled missing fields`);
        } else {
          console.log(`✓ Exists: ${experience.company} - ${experience.position}`);
        }
        existing++;
        continue;
      }

      // Create experience with relations
      const { skillsUsed, ...experienceData } = experience; // Remove temp field
      await strapi.entityService.create('api::experience.experience', {
        data: {
          ...experienceData,
          skillsUsed: skillIds, // Many-to-many uses array of IDs
          publishedAt: new Date(), // Auto-publish
        },
      });

      console.log(
        `✅ Created: ${experience.company} - ${experience.position} (${skillIds.length} skills linked)`
      );
      console.log(`  📝 Remember to add company logo via Strapi UI`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${experiencesData.length}`);
    console.log('\n📸 Next Step: Add company logos via Strapi UI');
    console.log('   - Tangle Media Inc.');
    console.log('   - HelpUsDefend');
    console.log('   - Interfaith Food Bank');
    console.log('\n✅ Experiences seeding complete');
  } catch (error) {
    console.error('❌ Error seeding experiences:', error);
    // Log full validation error details
    // @ts-ignore
    if (error.details && error.details.errors) {
      console.error('\n📋 Validation Error Details:');
      // @ts-ignore
      error.details.errors.forEach((err, index) => {
        console.error(`  Error ${index + 1}:`, JSON.stringify(err, null, 2));
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
  seedExperiences()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedExperiences;
