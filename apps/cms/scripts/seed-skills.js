// @ts-check

/**
 * Strapi v5 Seeding Script for Skills
 *
 * Seeds 98 skills across 10 categories with relations
 * Run with: docker compose exec strapi npm run seed:skills
 * Or from host: pnpm seed:skills (from apps/cms directory)
 * Direct execution: node scripts/seed-skills.js
 *
 * Data sources:
 * - .claude/plans/strapi-skills-creation-guide.md (original 71 skills)
 * - Experience data requirements (additional 27 skills)
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const skillsData = [
  // Frontend Category (23 skills)
  {
    name: 'React',
    categoryName: 'frontend',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'Modern JavaScript library for building user interfaces with component-based architecture. Primary framework for interactive web applications.',
    sort: 1,
    documentationUrl: 'https://react.dev',
  },
  {
    name: 'Astro',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Modern web framework for content-focused websites with islands architecture. Used in current portfolio project with React integration.',
    sort: 2,
    documentationUrl: 'https://astro.build',
  },
  {
    name: 'TypeScript',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 4,
    description:
      'Typed superset of JavaScript providing static type checking and enhanced developer experience for large-scale applications.',
    sort: 3,
    documentationUrl: 'https://www.typescriptlang.org',
  },
  {
    name: 'JavaScript',
    categoryName: 'frontend',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 8,
    description:
      'Core programming language for web development, enabling dynamic and interactive user experiences across all modern browsers.',
    sort: 4,
    documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    name: 'Tailwind CSS',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 3,
    description:
      'Utility-first CSS framework for rapid UI development with customizable design system and responsive design patterns.',
    sort: 5,
    documentationUrl: 'https://tailwindcss.com',
  },
  {
    name: 'HTML5',
    categoryName: 'frontend',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 10,
    description:
      'Modern semantic markup language for structuring web content with accessibility and SEO best practices.',
    sort: 6,
  },
  {
    name: 'CSS3',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 10,
    description:
      'Modern styling language with advanced features including animations, grid layout, flexbox, and custom properties.',
    sort: 7,
  },
  {
    name: 'Vue.js',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Progressive JavaScript framework for building user interfaces with reactive data binding and component composition.',
    sort: 8,
    documentationUrl: 'https://vuejs.org',
  },
  {
    name: 'Svelte',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Compiler-based framework that shifts work to build time, producing highly optimized vanilla JavaScript.',
    sort: 9,
    documentationUrl: 'https://svelte.dev',
  },
  {
    name: 'jQuery',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 5,
    description:
      'Classic JavaScript library for DOM manipulation, event handling, and AJAX. Used in legacy projects and rapid prototyping.',
    sort: 10,
    documentationUrl: 'https://jquery.com',
  },
  {
    name: 'Bootstrap',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 5,
    description:
      'Popular CSS framework providing pre-built components and responsive grid system for rapid UI development.',
    sort: 11,
    documentationUrl: 'https://getbootstrap.com',
  },
  {
    name: 'Framework7',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Mobile-first framework for building hybrid mobile apps with native look and feel. Used in RPS Royale and Collective Assets projects.',
    sort: 12,
    documentationUrl: 'https://framework7.io',
  },
  {
    name: 'P5.js',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      'Creative coding library for generative art and interactive visualizations. Used for animations in Collective Assets gacha game.',
    sort: 13,
    documentationUrl: 'https://p5js.org',
  },
  {
    name: 'GSAP',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 2,
    description:
      'Professional-grade animation library for creating high-performance web animations with scroll-triggered effects. Core animation system in portfolio.',
    sort: 14,
    documentationUrl: 'https://gsap.com',
  },
  {
    name: 'Three.js',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'JavaScript 3D library for creating WebGL-powered 3D graphics and immersive experiences. Used for atmospheric layers in portfolio.',
    sort: 15,
    documentationUrl: 'https://threejs.org',
  },
  {
    name: 'PixiJS',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Fast 2D rendering engine for creating performant particle systems and interactive graphics. Used for particle effects in portfolio.',
    sort: 16,
    documentationUrl: 'https://pixijs.com',
  },
  {
    name: 'Hugo',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Fast static site generator built with Go, ideal for content-heavy websites with excellent build performance and template flexibility.',
    sort: 17,
    documentationUrl: 'https://gohugo.io',
  },
  {
    name: 'PostCSS',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'CSS transformation tool with JavaScript plugins for autoprefixing, linting, and advanced CSS processing in modern build pipelines.',
    sort: 18,
    documentationUrl: 'https://postcss.org',
  },
  {
    name: 'SCSS',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 5,
    description:
      'CSS preprocessor with variables, nesting, mixins, and functions for writing maintainable and reusable stylesheets.',
    sort: 19,
    documentationUrl: 'https://sass-lang.com',
  },
  {
    name: 'Alpine.js',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Lightweight JavaScript framework for adding interactivity to HTML with minimal overhead. Perfect for enhancing server-rendered pages.',
    sort: 20,
    documentationUrl: 'https://alpinejs.dev',
  },
  {
    name: 'ShadCN',
    categoryName: 'frontend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Beautifully designed UI component library built with Radix UI and Tailwind CSS, providing accessible and customizable components.',
    sort: 21,
    documentationUrl: 'https://ui.shadcn.com',
  },
  {
    name: 'Responsive Design',
    categoryName: 'frontend',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 8,
    description:
      'Design approach ensuring optimal viewing experience across devices using fluid grids, flexible images, and CSS media queries.',
    sort: 22,
  },
  {
    name: 'UI/UX Design',
    categoryName: 'frontend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 6,
    description:
      'User interface and experience design principles focusing on usability, accessibility, visual hierarchy, and user-centered design patterns.',
    sort: 23,
  },

  // Backend Category (14 skills)
  {
    name: 'Node.js',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'JavaScript runtime for building scalable server-side applications with non-blocking I/O and extensive package ecosystem.',
    sort: 1,
    documentationUrl: 'https://nodejs.org',
  },
  {
    name: 'Strapi',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Headless CMS built with Node.js providing customizable API and content management. Powers current portfolio backend with PostgreSQL integration.',
    sort: 2,
    documentationUrl: 'https://strapi.io',
  },
  {
    name: 'Python',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'Versatile programming language for backend development, scripting, data analysis, and machine learning applications.',
    sort: 3,
    documentationUrl: 'https://www.python.org',
  },
  {
    name: 'Django',
    categoryName: 'backend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'High-level Python web framework following MTV architecture with built-in admin interface and ORM.',
    sort: 4,
    documentationUrl: 'https://www.djangoproject.com',
  },
  {
    name: 'PHP',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 5,
    description:
      'Server-side scripting language for web development. Used extensively for WordPress plugin development and custom integrations.',
    sort: 5,
    documentationUrl: 'https://www.php.net',
  },
  {
    name: 'Java',
    categoryName: 'backend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Object-oriented programming language for enterprise applications with strong typing and platform independence.',
    sort: 6,
    documentationUrl: 'https://dev.java',
  },
  {
    name: 'GraphQL',
    categoryName: 'backend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Query language and runtime for APIs providing flexible data fetching with strongly-typed schemas.',
    sort: 7,
    documentationUrl: 'https://graphql.org',
  },
  {
    name: 'REST APIs',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 6,
    description:
      'Architectural style for building scalable web services using HTTP methods and stateless communication.',
    sort: 8,
  },
  {
    name: 'Custom Plugins',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 3,
    description:
      'WordPress plugin development for extending CMS functionality. Built Target Hunger volunteer coordination system with custom MySQL integration.',
    sort: 9,
  },
  {
    name: 'Serial Communication',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      "Protocol for software-hardware data exchange. Used for Arduino-to-software integration in Conductor's Hand and Crunch Time projects.",
    sort: 10,
  },
  {
    name: 'Laravel',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'PHP web application framework with expressive syntax, providing MVC architecture, Eloquent ORM, and comprehensive tooling for rapid development.',
    sort: 11,
    documentationUrl: 'https://laravel.com',
  },
  {
    name: 'API Design',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'RESTful and GraphQL API architecture design focusing on resource modeling, versioning, authentication, and developer-friendly interfaces.',
    sort: 12,
  },
  {
    name: 'Authentication',
    categoryName: 'backend',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'User authentication and authorization systems including JWT, OAuth 2.0, session management, and role-based access control (RBAC).',
    sort: 13,
  },
  {
    name: 'Real-time Systems',
    categoryName: 'backend',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Real-time data synchronization using WebSockets, Server-Sent Events, and pub/sub patterns for live updates and collaborative features.',
    sort: 14,
  },

  // Database Category (6 skills)
  {
    name: 'PostgreSQL',
    categoryName: 'database',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 3,
    description:
      'Advanced open-source relational database with pgVector extension for vector similarity search. Primary database for portfolio CMS.',
    sort: 1,
    documentationUrl: 'https://www.postgresql.org',
  },
  {
    name: 'MySQL',
    categoryName: 'database',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 5,
    description:
      'Popular relational database management system. Used in WordPress projects including Target Hunger volunteer tool with custom schema design.',
    sort: 2,
    documentationUrl: 'https://www.mysql.com',
  },
  {
    name: 'MongoDB',
    categoryName: 'database',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'NoSQL document database with flexible schema design for storing JSON-like documents.',
    sort: 3,
    documentationUrl: 'https://www.mongodb.com',
  },
  {
    name: 'Redis',
    categoryName: 'database',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'In-memory data store for caching, session management, and real-time applications with pub/sub capabilities.',
    sort: 4,
    documentationUrl: 'https://redis.io',
  },
  {
    name: 'Microsoft SQL Server',
    categoryName: 'database',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Enterprise relational database management system with T-SQL support, used for business applications requiring robust transaction processing.',
    sort: 5,
    documentationUrl: 'https://www.microsoft.com/en-us/sql-server',
  },
  {
    name: 'Database Migration',
    categoryName: 'database',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 3,
    description:
      'Database migration strategies including schema versioning, data transformation, and zero-downtime migrations. Migrated 30+ databases (5TB+) with zero data loss.',
    sort: 6,
  },

  // Cloud Category (10 skills)
  {
    name: 'Docker',
    categoryName: 'cloud',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 3,
    description:
      'Containerization platform for packaging applications with dependencies. Used for local development environment with Docker Compose.',
    sort: 1,
    documentationUrl: 'https://docs.docker.com',
  },
  {
    name: 'Railway',
    categoryName: 'cloud',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 1,
    description:
      'Cloud platform for deploying backend services with automated deployments. Hosts Strapi CMS at admin.aazucena.com.',
    sort: 2,
    documentationUrl: 'https://railway.app',
  },
  {
    name: 'Vercel',
    categoryName: 'cloud',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 2,
    description:
      'Frontend cloud platform with automatic deployments and edge network. Hosts portfolio production site with GitHub integration.',
    sort: 3,
    documentationUrl: 'https://vercel.com',
  },
  {
    name: 'AWS',
    categoryName: 'cloud',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Comprehensive cloud computing platform with services for computing, storage, databases, and machine learning.',
    sort: 4,
    documentationUrl: 'https://aws.amazon.com',
  },
  {
    name: 'Firebase',
    categoryName: 'cloud',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 3,
    description:
      'Backend-as-a-Service platform with real-time database, authentication, and hosting. Used in 65square AI app with ML Kit integration.',
    sort: 5,
    documentationUrl: 'https://firebase.google.com',
  },
  {
    name: 'Kubernetes',
    categoryName: 'cloud',
    proficiency: 'learning',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Container orchestration platform for automating deployment, scaling, and management of containerized applications.',
    sort: 6,
    documentationUrl: 'https://kubernetes.io',
  },
  {
    name: 'CI/CD',
    categoryName: 'cloud',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Continuous Integration and Continuous Deployment practices for automating testing and deployment workflows.',
    sort: 7,
  },
  {
    name: 'DigitalOcean',
    categoryName: 'cloud',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 4,
    description:
      'Cloud infrastructure platform providing virtual servers (Droplets), managed databases, and object storage with developer-friendly interface.',
    sort: 8,
    documentationUrl: 'https://www.digitalocean.com',
  },
  {
    name: 'CircleCI',
    categoryName: 'cloud',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Continuous integration and deployment platform with Docker support and parallel test execution for fast, reliable builds.',
    sort: 9,
    documentationUrl: 'https://circleci.com',
  },
  {
    name: 'Netlify',
    categoryName: 'cloud',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Modern web hosting platform with automatic deployments, serverless functions, and edge network for Jamstack applications.',
    sort: 10,
    documentationUrl: 'https://www.netlify.com',
  },

  // Tools Category (19 skills)
  {
    name: 'Git',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 8,
    description:
      'Distributed version control system for tracking code changes and collaboration with branching and merging strategies.',
    sort: 1,
    documentationUrl: 'https://git-scm.com',
  },
  {
    name: 'VS Code',
    categoryName: 'tools',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 6,
    description:
      'Primary code editor with extensive extension ecosystem, IntelliSense, and integrated debugging capabilities.',
    sort: 2,
    documentationUrl: 'https://code.visualstudio.com',
  },
  {
    name: 'Figma',
    categoryName: 'tools',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Collaborative design tool for UI/UX design, prototyping, and design system management.',
    sort: 3,
    documentationUrl: 'https://www.figma.com',
  },
  {
    name: 'Agile',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 4,
    description:
      'Iterative project management methodology emphasizing collaboration, flexibility, and continuous delivery.',
    sort: 4,
  },
  {
    name: 'Jira',
    categoryName: 'tools',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Project management and issue tracking software for agile teams with sprint planning and backlog management.',
    sort: 5,
    documentationUrl: 'https://www.atlassian.com/software/jira',
  },
  {
    name: 'Zod',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'TypeScript-first schema validation library with runtime type checking. Used for API validation in portfolio with 18 validators.',
    sort: 6,
    documentationUrl: 'https://zod.dev',
  },
  {
    name: 'Cloudinary',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Cloud-based media management platform for image and video storage, optimization, and transformation. Integrated with Strapi CMS.',
    sort: 7,
    documentationUrl: 'https://cloudinary.com',
  },
  {
    name: 'WebSockets',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      'Protocol for full-duplex communication over TCP. Used for real-time multiplayer matchmaking in RPS Royale project.',
    sort: 8,
  },
  {
    name: 'Socket.io',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      'JavaScript library for real-time, bidirectional event-based communication with automatic reconnection and room support.',
    sort: 9,
    documentationUrl: 'https://socket.io',
  },
  {
    name: 'Stripe',
    categoryName: 'tools',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Payment processing platform with comprehensive APIs for accepting payments, managing subscriptions, and handling complex billing scenarios.',
    sort: 10,
    documentationUrl: 'https://stripe.com',
  },
  {
    name: 'Cursor',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'AI-powered code editor built on VS Code with context-aware code generation, intelligent refactoring, and natural language commands.',
    sort: 11,
    documentationUrl: 'https://cursor.sh',
  },
  {
    name: 'WordPress',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 5,
    description:
      'Content management system powering 40% of the web. Experience with theme development, plugin creation, and custom post types.',
    sort: 12,
    documentationUrl: 'https://wordpress.org',
  },
  {
    name: 'Content Management Systems',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 6,
    description:
      'Experience with various CMS platforms (WordPress, Directus, Strapi, custom solutions) for content authoring, workflow management, and multi-channel publishing.',
    sort: 13,
  },
  {
    name: 'Automated Testing',
    categoryName: 'tools',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Test automation strategies including unit tests, integration tests, and E2E testing using frameworks like Jest, Vitest, Playwright, and Cypress.',
    sort: 14,
  },
  {
    name: 'Code Refactoring',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'Code restructuring techniques for improving maintainability, reducing technical debt, and applying design patterns without changing behavior.',
    sort: 15,
  },
  {
    name: 'Web Accessibility',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 4,
    description:
      'WCAG 2.1 compliance, ARIA attributes, keyboard navigation, screen reader testing, and inclusive design practices for accessible web applications.',
    sort: 16,
  },
  {
    name: 'Performance Optimization',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 5,
    description:
      'Web performance optimization including code splitting, lazy loading, image optimization, caching strategies, and Core Web Vitals improvement.',
    sort: 17,
  },
  {
    name: 'SEO Optimization',
    categoryName: 'tools',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 4,
    description:
      'Search engine optimization techniques including semantic HTML, meta tags, structured data, sitemap generation, and performance optimization for rankings.',
    sort: 18,
  },
  {
    name: 'PGP Encryption',
    categoryName: 'tools',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Pretty Good Privacy encryption for secure email communication, file encryption, and digital signatures using public-key cryptography.',
    sort: 19,
  },

  // AI Category (6 skills)
  {
    name: 'LangChain',
    categoryName: 'ai',
    proficiency: 'competent',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Framework for building LLM-powered applications with chains, agents, and memory. Planned for AI-powered forms in portfolio.',
    sort: 1,
    documentationUrl: 'https://www.langchain.com',
  },
  {
    name: 'TensorFlow',
    categoryName: 'ai',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      'Open-source machine learning framework for building and training neural networks across platforms.',
    sort: 2,
    documentationUrl: 'https://www.tensorflow.org',
  },
  {
    name: 'TensorFlow Lite',
    categoryName: 'ai',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Lightweight ML framework for on-device inference. Implemented 90%+ accuracy age/gender detection in 65square Flutter app.',
    sort: 3,
    documentationUrl: 'https://www.tensorflow.org/lite',
  },
  {
    name: 'OpenAI',
    categoryName: 'ai',
    proficiency: 'competent',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'API integration for GPT models and embeddings for natural language processing and generation.',
    sort: 4,
    documentationUrl: 'https://platform.openai.com',
  },
  {
    name: 'Machine Learning',
    categoryName: 'ai',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 3,
    description:
      'Building predictive models and intelligent systems using supervised, unsupervised, and reinforcement learning techniques.',
    sort: 5,
  },
  {
    name: 'AI/ML',
    categoryName: 'ai',
    proficiency: 'competent',
    display: 'core',
    yearsOfExperience: 3,
    description:
      'Artificial Intelligence and Machine Learning integration including model training, inference, computer vision, and natural language processing.',
    sort: 6,
  },

  // Mobile Category (6 skills)
  {
    name: 'Flutter',
    categoryName: 'mobile',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 1,
    description:
      'Cross-platform framework for building native iOS and Android apps from single codebase. Built and published 65square app to both app stores.',
    sort: 1,
    documentationUrl: 'https://flutter.dev',
  },
  {
    name: 'Dart',
    categoryName: 'mobile',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Programming language for Flutter development with strong typing and async/await patterns for mobile applications.',
    sort: 2,
    documentationUrl: 'https://dart.dev',
  },
  {
    name: 'Cordova',
    categoryName: 'mobile',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      'Platform for building hybrid mobile apps using HTML, CSS, and JavaScript. Used in RPS Royale and Collective Assets projects.',
    sort: 3,
    documentationUrl: 'https://cordova.apache.org',
  },
  {
    name: 'Material Design',
    categoryName: 'mobile',
    proficiency: 'proficient',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      "Google's design system providing components and guidelines for mobile and web applications with consistent user experience.",
    sort: 4,
    documentationUrl: 'https://m3.material.io',
  },
  {
    name: 'Firebase ML Kit',
    categoryName: 'mobile',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'Mobile SDK for integrating machine learning features. Hosted TensorFlow Lite models for on-device inference in 65square app.',
    sort: 5,
    documentationUrl: 'https://firebase.google.com/products/ml',
  },
  {
    name: 'Mobile Development',
    categoryName: 'mobile',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 3,
    description:
      'Cross-platform mobile app development for iOS and Android including native features, responsive layouts, and app store publishing.',
    sort: 6,
  },

  // Hardware/Embedded Category (4 skills)
  {
    name: 'Arduino',
    categoryName: 'hardware-embedded',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 3,
    description:
      "Microcontroller platform for embedded systems and IoT. Built Conductor's Hand wearable instrument and Crunch Time alarm clock with custom hardware.",
    sort: 1,
    documentationUrl: 'https://www.arduino.cc',
  },
  {
    name: 'C++',
    categoryName: 'hardware-embedded',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 5,
    description:
      'System programming language for performance-critical applications. Used for Arduino programming and low-level hardware control.',
    sort: 2,
  },
  {
    name: 'Electron',
    categoryName: 'hardware-embedded',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      'Framework for building cross-platform desktop applications with web technologies. Built Crunch Time desktop interface with Arduino integration.',
    sort: 3,
    documentationUrl: 'https://www.electronjs.org',
  },
  {
    name: '3D Printing',
    categoryName: 'hardware-embedded',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 2,
    description:
      "Additive manufacturing for creating physical prototypes and custom hardware enclosures. Designed and printed gauntlet for Conductor's Hand project.",
    sort: 4,
  },

  // Music Technology Category (4 skills)
  {
    name: 'Music Composition',
    categoryName: 'music-technology',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 15,
    description:
      'Composition and arrangement across multiple genres. Created original Big Band Jazz soundtrack (4 tracks) for Collective Assets game.',
    sort: 1,
  },
  {
    name: 'Music Performance',
    categoryName: 'music-technology',
    proficiency: 'expert',
    display: 'core',
    yearsOfExperience: 15,
    description:
      'Multi-instrumental performance with formal training in trumpet, guitar, bass, piano, and drums since age 10.',
    sort: 2,
  },
  {
    name: 'Musical Production',
    categoryName: 'music-technology',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 5,
    description:
      'Music production workflow including recording, mixing, mastering, and sound design for game audio and creative projects.',
    sort: 3,
  },
  {
    name: 'DAW',
    categoryName: 'music-technology',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 5,
    description:
      'Digital audio workstation proficiency for music composition, MIDI programming, and audio production in game development context.',
    sort: 4,
  },

  // Audio Engineering Category (7 skills)
  {
    name: 'Audio Programming',
    categoryName: 'audio-engineering',
    proficiency: 'proficient',
    display: 'core',
    yearsOfExperience: 3,
    description:
      'Software development for audio applications including synthesis, effects processing, and real-time audio systems.',
    sort: 1,
  },
  {
    name: 'Mozzi Audio Library',
    categoryName: 'audio-engineering',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      "Arduino audio synthesis library for creating sound generators. Implemented custom audio synthesis in Conductor's Hand wearable instrument.",
    sort: 2,
    documentationUrl: 'https://sensorium.github.io/Mozzi',
  },
  {
    name: 'Tidalcycles',
    categoryName: 'audio-engineering',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Live coding environment for creating algorithmic music patterns with functional programming approach.',
    sort: 3,
    documentationUrl: 'https://tidalcycles.org',
  },
  {
    name: 'WebAudio API',
    categoryName: 'audio-engineering',
    proficiency: 'competent',
    display: 'featured',
    yearsOfExperience: 2,
    description:
      'Browser API for processing and synthesizing audio with precise timing control for web-based audio applications.',
    sort: 4,
    documentationUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
  },
  {
    name: 'Howler.js',
    categoryName: 'audio-engineering',
    proficiency: 'proficient',
    display: 'featured',
    yearsOfExperience: 1,
    description:
      'JavaScript audio library for cross-browser audio playback with sprite support. Planned for portfolio music player feature.',
    sort: 5,
    documentationUrl: 'https://howlerjs.com',
  },
  {
    name: 'Wavesurfer.js',
    categoryName: 'audio-engineering',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Audio waveform visualization library for creating interactive audio players. Planned for portfolio audio showcase.',
    sort: 6,
    documentationUrl: 'https://wavesurfer.xyz',
  },
  {
    name: 'Strudel.cc',
    categoryName: 'audio-engineering',
    proficiency: 'competent',
    display: 'standard',
    yearsOfExperience: 1,
    description:
      'Browser-based live coding environment for Tidalcycles. Planned integration for portfolio music technology showcase.',
    sort: 7,
    documentationUrl: 'https://strudel.cc',
  },
];

async function seedSkills() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🌱 Seeding Skills...\n');

    let created = 0;
    let existing = 0;
    let skipped = 0;

    // Pre-fetch all categories once (avoids N+1 queries)
    console.log('📦 Pre-fetching categories...');
    const categories = await strapi.db.query('api::skill-category.skill-category').findMany();
    const categoryMap = new Map(categories.map((cat) => [cat.name, cat]));

    // Pre-fetch all existing skills once (avoids N+1 queries)
    console.log('📦 Pre-fetching existing skills...');
    const existingSkills = await strapi.db.query('api::skill.skill').findMany();
    const existingSkillsMap = new Map(existingSkills.map((skill) => [skill.name, skill]));

    for (const skill of skillsData) {
      // Resolve category relation from cache
      const category = categoryMap.get(skill.categoryName);

      if (!category) {
        console.error(`❌ Category not found: ${skill.categoryName} for ${skill.name}`);
        skipped++;
        continue;
      }

      // Check if skill already exists in cache
      const existingSkill = existingSkillsMap.get(skill.name);

      if (existingSkill) {
        // Update missing fields
        const updateData = {};
        let hasUpdates = false;

        // Map seed data to database fields
        const fieldMap = {
          name: skill.name,
          category: category.id,
          proficiency: skill.proficiency,
          display: skill.display,
          yearsOfExperience: skill.yearsOfExperience,
          description: skill.description,
          sort: skill.sort,
          documentationUrl: skill.documentationUrl,
        };

        for (const [key, value] of Object.entries(fieldMap)) {
          // Only update if field is null or undefined (not empty string - that's intentional)
          if (existingSkill[key] === null || existingSkill[key] === undefined) {
            // @ts-ignore
            updateData[key] = value;
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          await strapi.db.query('api::skill.skill').update({
            where: { id: existingSkill.id },
            data: updateData,
          });
          console.log(`🔄 Updated: ${skill.name} (${skill.categoryName}) - filled missing fields`);
        } else {
          console.log(`✓ Exists: ${skill.name} (${skill.categoryName})`);
        }
        existing++;
        continue;
      }

      // Create skill with relation
      await strapi.db.query('api::skill.skill').create({
        data: {
          name: skill.name,
          category: category.id, // Many-to-one relation
          proficiency: skill.proficiency,
          display: skill.display,
          yearsOfExperience: skill.yearsOfExperience,
          description: skill.description,
          sort: skill.sort,
          documentationUrl: skill.documentationUrl,
        },
      });

      console.log(`✅ Created: ${skill.name} (${skill.categoryName})`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${skillsData.length}`);
    console.log('\n✅ Skills seeding complete');
  } catch (error) {
    console.error('❌ Error seeding skills:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedSkills()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedSkills;
