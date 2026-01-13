// @ts-check

/**
 * Strapi v5 Seeding Script for Projects
 *
 * Seeds 8 portfolio projects with metadata and tech stack relations
 * Images must be added manually via Strapi UI
 * Run with: docker compose exec strapi npm run seed:projects
 * Or from host: pnpm seed:projects (from apps/cms directory)
 * Direct execution: node scripts/seed-projects.js
 *
 * Data source: .claude/plans/portfolio-projects-documentation-plan.md
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');


const projectsData = [
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    shortDescription:
      'A high-performance portfolio website featuring advanced 3D animations, atmospheric layers, and headless CMS architecture—built with Astro 5.16, React 19.2, and Strapi v5 to showcase full-stack development expertise.',
    description:
      'This portfolio demonstrates modern full-stack architecture: Astro 5.16 as the meta-framework with React 19.2 islands for interactive components, Strapi v5 headless CMS with PostgreSQL 16 + pgVector for content management, and advanced animations using GSAP, Three.js, and PixiJS. The project showcases meticulous attention to performance, type safety, and maintainable code organization through 19 modular API clients, 18 Zod validators, and 17 data transformers.',
    display: 'home',
    projectStatus: 'In Progress',
    projectType: 'Web App',
    repositoryUrl: null, // Private repository
    liveDemoUrl: 'https://aazucena.com',
    startDate: '2024-01-01',
    endDate: null,
    sort: 1,
    tags: [
      { label: 'Full-Stack', color: 'cyan' },
      { label: 'Astro', color: 'purple' },
      { label: 'React', color: 'blue' },
      { label: 'Headless CMS', color: 'green' },
      { label: '3D Animations', color: 'pink' },
    ],
    metrics: [
      { label: 'API Clients', value: '19', description: 'Modular API architecture', sort: 1 },
      { label: 'Zod Validators', value: '18', description: 'Runtime type safety', sort: 2 },
      { label: 'Skills Catalogued', value: '71', description: 'Complete tech stack', sort: 3 },
      { label: 'Database', value: 'PostgreSQL', description: 'With pgVector extension', sort: 4 },
    ],
    seo: {
      metaTitle: 'Aldrin Azucena - Full-Stack Portfolio Website',
      metaDescription:
        'High-performance portfolio featuring advanced 3D animations, Astro 5, React 19, and Strapi v5 headless CMS with PostgreSQL and pgVector.',
      keywords: 'portfolio, full-stack developer, Astro, React, Strapi, TypeScript, 3D animations, GSAP, ThreeJS, headless CMS',
      canonicalURL: 'https://aazucena.com/projects/portfolio-website',
      openGraph: {
        ogTitle: 'Aldrin Azucena - Full-Stack Portfolio with Advanced 3D Animations',
        ogDescription:
          'Modern portfolio showcasing full-stack expertise with Astro 5.16, React 19.2, Strapi v5, and advanced animations using GSAP, Three.js, and PixiJS.',
        ogUrl: 'https://aazucena.com/projects/portfolio-website',
        ogType: 'website',
      },
    },
    techStackNames: [
      'React',
      'Astro',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'HTML5',
      'CSS3',
      'GSAP',
      'Three.js',
      'PixiJS',
      'Node.js',
      'Strapi',
      'PostgreSQL',
      'Docker',
      'Railway',
      'Vercel',
      'Git',
      'Zod',
      'Cloudinary',
      'LangChain',
      'OpenAI',
    ],
  },
  {
    title: 'Video Game History',
    slug: 'gaming-timeline',
    shortDescription:
      'An interactive timeline exploring 50+ years of gaming history (1970s-2020s) with period-appropriate aesthetics—featured in University of Lethbridge\'s New Media showcase for exceptional design and historical research.',
    description:
      'Video Game History takes users on a journey through gaming\'s evolution from the 1970s to 2020. Starting with a terminal console interface reminiscent of early computing, the project progresses through each decade showcasing influential games that shaped the industry. Built with vanilla JavaScript and enhanced with npm packages for 2D SVG animations, the project showcases advanced front-end development skills.',
    display: 'featured',
    projectStatus: 'Completed',
    projectType: 'Web App',
    repositoryUrl: 'https://github.com/aazucena/gaming-timeline',
    liveDemoUrl: 'https://aazucena.github.io/gaming-timeline/',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    sort: 2,
    tags: [
      { label: 'Interactive Timeline', color: 'cyan' },
      { label: 'Gaming History', color: 'purple' },
      { label: 'Vanilla JavaScript', color: 'orange' },
      { label: 'SVG Animations', color: 'pink' },
    ],
    metrics: [
      { label: 'Decades Covered', value: '50+ years', description: '1970s to 2020s', sort: 1 },
      { label: 'Design Achievement', value: 'Featured', description: 'U of L New Media showcase', sort: 2 },
      { label: 'Animation Library', value: '2D SVG', description: 'Custom npm packages', sort: 3 },
    ],
    seo: {
      metaTitle: 'Video Game History - Interactive Timeline | Aldrin Azucena',
      metaDescription:
        'Explore 50+ years of gaming history (1970s-2020s) through an interactive timeline with period-appropriate aesthetics and 2D SVG animations.',
      keywords: 'video game history, interactive timeline, gaming evolution, JavaScript, SVG animations, retro gaming, 1970s-2020s',
      canonicalURL: 'https://aazucena.com/projects/gaming-timeline',
      openGraph: {
        ogTitle: 'Video Game History - 50+ Years of Gaming Evolution',
        ogDescription:
          'Journey through gaming history from 1970s to 2020s with period-appropriate aesthetics and interactive storytelling.',
        ogUrl: 'https://aazucena.com/projects/gaming-timeline',
        ogType: 'website',
      },
    },
    techStackNames: ['JavaScript', 'HTML5', 'CSS3', 'Git'],
  },
  {
    title: 'Conductor\'s Hand',
    slug: 'conductors-hand',
    shortDescription:
      'A wearable musical instrument combining Arduino, custom audio synthesis, and 3D-printed hardware—transforming hand gestures into expressive musical performance through accelerometer-driven synthesis.',
    description:
      'Conductor\'s Hand is an innovative wearable instrument that transforms natural conducting gestures into expressive musical performance. Built with Arduino Nano 33 IoT and the Mozzi Audio Library, the device uses a 9-axis accelerometer to capture hand movements and translate them into real-time audio synthesis. The custom gauntlet design, created with 3D printing, houses the electronics while allowing natural hand movement for intuitive musical expression.',
    display: 'home',
    projectStatus: 'Completed',
    projectType: 'Hardware/Embedded',
    repositoryUrl: null,
    liveDemoUrl: null,
    startDate: '2021-01-01',
    endDate: '2021-12-31',
    sort: 3,
    tags: [
      { label: 'Wearable Tech', color: 'teal' },
      { label: 'Arduino', color: 'cyan' },
      { label: 'Music Technology', color: 'purple' },
      { label: 'Audio Synthesis', color: 'pink' },
      { label: '3D Printing', color: 'orange' },
    ],
    metrics: [
      { label: 'Hardware', value: 'Arduino Nano', description: '33 IoT with 9-axis sensor', sort: 1 },
      { label: 'Audio Library', value: 'Mozzi', description: 'Real-time synthesis', sort: 2 },
      { label: 'Fabrication', value: '3D Printed', description: 'Custom gauntlet design', sort: 3 },
    ],
    seo: {
      metaTitle: 'Conductor\'s Hand - Musical Instrument | Aldrin Azucena',
      metaDescription:
        'Wearable musical instrument combining Arduino, Mozzi audio synthesis, and 3D printing to transform hand gestures into expressive musical performance.',
      keywords: 'wearable instrument, Arduino, audio synthesis, Mozzi, music technology, 3D printing, accelerometer, gesture control',
      canonicalURL: 'https://aazucena.com/projects/conductors-hand',
      openGraph: {
        ogTitle: 'Conductor\'s Hand - Gesture-Controlled Musical Instrument',
        ogDescription:
          'Innovative wearable that transforms conducting gestures into music using Arduino, accelerometer, and real-time audio synthesis.',
        ogUrl: 'https://aazucena.com/projects/conductors-hand',
        ogType: 'website',
      },
    },
    techStackNames: [
      'Arduino',
      'C++',
      'Mozzi Audio Library',
      'Audio Programming',
      '3D Printing',
      'Music Composition',
      'Music Performance',
    ],
  },
  {
    title: 'Crunch Time',
    slug: 'crunch-time',
    shortDescription:
      'A hybrid desktop alarm clock combining Arduino hardware with Electron interface—integrating serial communication, custom PCB design, and real-time hardware-software synchronization for desktop time management.',
    description:
      'Crunch Time is a unique alarm clock that bridges physical and digital worlds through hardware-software integration. The Electron-based desktop interface communicates via serial protocol with custom Arduino hardware, creating a tangible desktop presence. Originally designed for the pandemic era of remote work, the project demonstrates proficiency in cross-platform development, serial communication protocols, and hardware-software integration.',
    display: 'standard',
    projectStatus: 'Completed',
    projectType: 'Desktop App',
    repositoryUrl: null,
    liveDemoUrl: null,
    startDate: '2020-09-01',
    endDate: '2020-12-31',
    sort: 4,
    tags: [
      { label: 'Desktop App', color: 'blue' },
      { label: 'Electron', color: 'teal' },
      { label: 'Arduino', color: 'cyan' },
      { label: 'Hardware Integration', color: 'green' },
    ],
    metrics: [
      { label: 'Platform', value: 'Electron', description: 'Cross-platform desktop', sort: 1 },
      { label: 'Hardware', value: 'Arduino', description: 'Custom PCB design', sort: 2 },
      { label: 'Communication', value: 'Serial Protocol', description: 'Real-time sync', sort: 3 },
    ],
    seo: {
      metaTitle: 'Crunch Time - Hybrid Desktop Alarm Clock | Aldrin Azucena',
      metaDescription:
        'Hybrid alarm clock combining Arduino hardware with Electron desktop interface through serial communication and custom PCB design.',
      keywords: 'Electron app, Arduino, desktop application, serial communication, hardware integration, alarm clock, PCB design',
      canonicalURL: 'https://aazucena.com/projects/crunch-time',
      openGraph: {
        ogTitle: 'Crunch Time - Hardware-Software Hybrid Alarm Clock',
        ogDescription:
          'Desktop alarm clock bridging physical and digital worlds with Electron and Arduino through serial communication.',
        ogUrl: 'https://aazucena.com/projects/crunch-time',
        ogType: 'website',
      },
    },
    techStackNames: [
      'Electron',
      'Arduino',
      'C++',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Serial Communication',
    ],
  },
  {
    title: 'RPS Royale',
    slug: 'rps-royale',
    shortDescription:
      'A real-time multiplayer Rock Paper Scissors game with Firebase backend and WebSocket matchmaking—demonstrating proficiency in mobile-first hybrid app development and real-time networking architecture.',
    description:
      'RPS Royale reimagines the classic Rock Paper Scissors game as a competitive real-time multiplayer experience. Built with Framework7 and Cordova for hybrid mobile deployment, the app features WebSocket-based matchmaking that connects players instantly for head-to-head battles. Firebase provides scalable backend infrastructure for user authentication and match history, while the Material Design interface ensures a polished native-like experience.',
    display: 'standard',
    projectStatus: 'Completed',
    projectType: 'Mobile App',
    repositoryUrl: null,
    liveDemoUrl: null,
    startDate: '2019-05-01',
    endDate: '2020-06-30',
    sort: 5,
    tags: [
      { label: 'Real-Time Multiplayer', color: 'red' },
      { label: 'Mobile App', color: 'teal' },
      { label: 'WebSockets', color: 'purple' },
      { label: 'Firebase', color: 'orange' },
    ],
    metrics: [
      { label: 'Framework', value: 'Framework7', description: 'Mobile-first hybrid', sort: 1 },
      { label: 'Matchmaking', value: 'WebSockets', description: 'Instant player connections', sort: 2 },
      { label: 'Backend', value: 'Firebase', description: 'Authentication & history', sort: 3 },
    ],
    seo: {
      metaTitle: 'RPS Royale - Real-Time Multiplayer Game | Aldrin Azucena',
      metaDescription:
        'Real-time multiplayer Rock Paper Scissors game with WebSocket matchmaking, Firebase backend, and Material Design built with Framework7 and Cordova.',
      keywords: 'real-time multiplayer, mobile game, WebSockets, Firebase, Framework7, Cordova, Material Design, hybrid app',
      canonicalURL: 'https://aazucena.com/projects/rps-royale',
      openGraph: {
        ogTitle: 'RPS Royale - Real-Time Multiplayer Rock Paper Scissors',
        ogDescription:
          'Competitive multiplayer game with WebSocket matchmaking and Firebase backend for instant head-to-head battles.',
        ogUrl: 'https://aazucena.com/projects/rps-royale',
        ogType: 'website',
      },
    },
    techStackNames: [
      'Framework7',
      'Cordova',
      'JavaScript',
      'HTML5',
      'CSS3',
      'WebSockets',
      'Socket.io',
      'Material Design',
      'Firebase',
    ],
  },
  {
    title: 'Collective Assets',
    slug: 'collective-assets',
    shortDescription:
      'A mobile gacha game with original Big Band Jazz soundtrack and P5.js generative art—blending custom music composition, procedural animation, and hybrid mobile development for an innovative rhythm-based experience.',
    description:
      'Collective Assets is a unique mobile gacha game that combines music composition, generative art, and game design into a cohesive creative experience. The standout feature is an original 4-track Big Band Jazz soundtrack composed specifically for the game, rated 10/10 for quality and emotional impact. P5.js powers the generative art system that creates unique visual cards, while Framework7 and Cordova provide the mobile framework.',
    display: 'home',
    projectStatus: 'Completed',
    projectType: 'Mobile App',
    repositoryUrl: null,
    liveDemoUrl: null,
    startDate: '2019-05-01',
    endDate: '2019-09-30',
    sort: 6,
    tags: [
      { label: 'Mobile Game', color: 'purple' },
      { label: 'Music Composition', color: 'pink' },
      { label: 'Generative Art', color: 'cyan' },
      { label: 'P5.js', color: 'teal' },
    ],
    metrics: [
      { label: 'Soundtrack', value: '4 Tracks', description: 'Original Big Band Jazz', sort: 1 },
      { label: 'Music Rating', value: '10/10', description: 'Quality & emotional impact', sort: 2 },
      { label: 'Art System', value: 'P5.js', description: 'Procedural visual cards', sort: 3 },
    ],
    seo: {
      metaTitle: 'Collective Assets - Mobile Gacha Game | Aldrin Azucena',
      metaDescription:
        'Mobile gacha game featuring original Big Band Jazz soundtrack and P5.js generative art system with unique procedural visual cards.',
      keywords: 'mobile game, gacha game, music composition, Big Band Jazz, P5JS, generative art, procedural animation, Framework7',
      canonicalURL: 'https://aazucena.com/projects/collective-assets',
      openGraph: {
        ogTitle: 'Collective Assets - Original Jazz Soundtrack Mobile Game',
        ogDescription:
          'Unique gacha game blending original Big Band Jazz composition with P5.js generative art for procedural visual experiences.',
        ogUrl: 'https://aazucena.com/projects/collective-assets',
        ogType: 'website',
      },
    },
    techStackNames: [
      'Framework7',
      'Cordova',
      'P5.js',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Firebase',
      'Music Composition',
      'Music Performance',
      'Musical Production',
      'DAW',
    ],
  },
  {
    title: '65square - Age & Gender Guesser',
    slug: '65square',
    shortDescription:
      'A Flutter mobile app with on-device TensorFlow Lite achieving 90%+ accuracy in age/gender detection—published to both app stores with Firebase ML Kit integration for child safety advocacy.',
    description:
      '65square demonstrates advanced mobile AI implementation through on-device machine learning. Built with Flutter and Dart for cross-platform deployment, the app uses TensorFlow Lite models hosted via Firebase ML Kit to achieve 90%+ accuracy in real-time age and gender detection. Published to both iOS and Android app stores, the project showcases end-to-end mobile development from concept to production deployment.',
    display: 'home',
    projectStatus: 'Released',
    projectType: 'Mobile App',
    repositoryUrl: null,
    liveDemoUrl: null,
    startDate: '2019-05-01',
    endDate: '2019-09-30',
    sort: 7,
    tags: [
      { label: 'Machine Learning', color: 'purple' },
      { label: 'Flutter', color: 'blue' },
      { label: 'TensorFlow Lite', color: 'orange' },
      { label: 'App Store', color: 'green' },
    ],
    metrics: [
      { label: 'Accuracy', value: '90%+', description: 'Age & gender detection', sort: 1 },
      { label: 'Deployment', value: 'iOS & Android', description: 'Both app stores', sort: 2 },
      { label: 'ML Platform', value: 'Firebase ML Kit', description: 'On-device inference', sort: 3 },
    ],
    seo: {
      metaTitle: '65square - AI Age & Gender Detection | Aldrin Azucena',
      metaDescription:
        'Flutter mobile app with TensorFlow Lite achieving 90%+ accuracy in age/gender detection. Published to iOS and Android app stores with Firebase ML Kit.',
      keywords: 'machine learning, TensorFlow Lite, Flutter, age detection, gender detection, mobile AI, Firebase ML Kit, child safety',
      canonicalURL: 'https://aazucena.com/projects/65square',
      openGraph: {
        ogTitle: '65square - On-Device AI Age & Gender Detection',
        ogDescription:
          'Flutter app with 90%+ accurate TensorFlow Lite models for real-time age and gender detection, published to both app stores.',
        ogUrl: 'https://aazucena.com/projects/65square',
        ogType: 'website',
      },
    },
    techStackNames: [
      'Flutter',
      'Dart',
      'TensorFlow Lite',
      'Firebase',
      'Firebase ML Kit',
      'Material Design',
      'Machine Learning',
    ],
  },
  {
    title: 'Target Hunger Volunteer Tool',
    slug: 'target-hunger-tool',
    shortDescription:
      'A WordPress-based volunteer coordination system serving 5+ years with 59K+ lbs food distributed ($159K+ value)—demonstrating sustainable software design through custom PHP plugins and MySQL schema.',
    description:
      'Target Hunger Volunteer Tool is a WordPress-based management system built to coordinate volunteers, track food distribution, and manage nonprofit operations. Developed in approximately one year, the tool has served the organization continuously for 5+ years, facilitating the distribution of 59,000+ pounds of food valued at over $159,000. The longevity and impact demonstrate sustainable software architecture and thoughtful design that scales with organizational needs.',
    display: 'home',
    projectStatus: 'Maintenance',
    projectType: 'Web App',
    repositoryUrl: null,
    liveDemoUrl: null,
    startDate: '2018-01-01',
    endDate: '2019-01-01',
    sort: 8,
    tags: [
      { label: 'Nonprofit', color: 'green' },
      { label: 'WordPress', color: 'blue' },
      { label: 'Social Impact', color: 'red' },
      { label: 'Custom Plugins', color: 'purple' },
    ],
    metrics: [
      { label: 'Food Distributed', value: '59K+ lbs', description: 'Over 5+ years', sort: 1 },
      { label: 'Impact Value', value: '$159K+', description: 'Community value delivered', sort: 2 },
      { label: 'Service Duration', value: '5+ years', description: 'Continuous operation', sort: 3 },
      { label: 'Development Time', value: '1 year', description: 'Initial build period', sort: 4 },
    ],
    seo: {
      metaTitle: 'Target Hunger Volunteer Tool | Aldrin Azucena',
      metaDescription:
        'WordPress volunteer coordination system serving 5+ years with 59K+ lbs food distributed ($159K+ value). Custom PHP plugins and sustainable architecture.',
      keywords: 'WordPress, nonprofit software, volunteer management, food distribution, custom plugins, PHP, MySQL, social impact',
      canonicalURL: 'https://aazucena.com/projects/target-hunger-tool',
      openGraph: {
        ogTitle: 'Target Hunger - Nonprofit Volunteer Management System',
        ogDescription:
          'Sustainable WordPress tool enabling 59K+ lbs food distribution over 5+ years through custom plugins and volunteer coordination.',
        ogUrl: 'https://aazucena.com/projects/target-hunger-tool',
        ogType: 'website',
      },
    },
    techStackNames: ['PHP', 'MySQL', 'Custom Plugins', 'HTML5', 'CSS3', 'JavaScript'],
  },
];

async function seedProjects() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Projects (metadata only)...\n');

    let created = 0;
    let existing = 0;
    let skipped = 0;

    for (const project of projectsData) {
      // Check if project already exists
      const existingProject = await strapi.db
        .query('api::project.project')
        .findOne({ where: { slug: project.slug } });

      // Resolve tech stack relations (many-to-many)
      const techStackIds = [];
      const missingSkills = [];

      for (const skillName of project.techStackNames) {
        const skill = await strapi.db
          .query('api::skill.skill')
          .findOne({ where: { name: skillName } });

        if (skill) {
          techStackIds.push(skill.id);
        } else {
          missingSkills.push(skillName);
        }
      }

      if (missingSkills.length > 0) {
        console.warn(
          `  ⚠️  Missing skills for ${project.title}: ${missingSkills.join(', ')}`
        );
      }

      if (existingProject) {
        // Update missing fields
        const updateData = {};
        let hasUpdates = false;

        // Remove temp field and prepare data
        const { techStackNames, ...projectData } = project;

        for (const [key, value] of Object.entries(projectData)) {
          // Only update if field is null or undefined (not empty string - that's intentional)
          if (existingProject[key] === null || existingProject[key] === undefined) {
            // @ts-ignore
            updateData[key] = value;
            hasUpdates = true;
          }
        }

        // Check if techStack needs updating (only if null or undefined, not empty array)
        if (existingProject.techStack === null || existingProject.techStack === undefined) {
          // @ts-ignore
          updateData.techStack = techStackIds;
          hasUpdates = true;
        }

        if (hasUpdates) {
          await strapi.entityService.update('api::project.project', existingProject.id, {
            data: updateData,
          });
          console.log(`🔄 Updated: ${project.title} - filled missing fields`);
        } else {
          console.log(`✓ Exists: ${project.title}`);
        }
        existing++;
        continue;
      }

      // Create project with relations
      const { techStackNames, ...projectData } = project; // Remove temp field
      await strapi.entityService.create('api::project.project', {
        data: {
          ...projectData,
          techStack: techStackIds, // Many-to-many uses array of IDs
        },
      });

      console.log(
        `✅ Created: ${project.title} (${techStackIds.length} skills linked)`
      );
      console.log(`  📝 Remember to add images via Strapi UI`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${projectsData.length}`);
    console.log('\n📸 Next Step: Add project images via Strapi UI');
    console.log('   - Cover images');
    console.log('   - Screenshots');
    console.log('   - Demo videos (optional)');
    console.log('\n✅ Projects seeding complete');
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
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
  seedProjects()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedProjects;
