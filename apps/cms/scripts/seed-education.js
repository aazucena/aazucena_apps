// @ts-check

/**
 * Strapi v5 Seeding Script for Education
 *
 * Seeds 5 education entries based on actual resume data:
 * - BSc Computer Science (Minor: New Media) - University of Lethbridge
 * - Associate Degree in CIT - Lethbridge Polytechnic
 * - Full Stack Software Developer Certificate - IBM
 * - AI Engineering Certificate - IBM
 * - AI Primer Course - ECO Canada
 *
 * Run with: docker compose exec strapi npm run seed:education
 * Or from host: pnpm seed:education (from apps/cms directory)
 * Direct execution: node scripts/seed-education.js
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const educationData = [
  {
    type: 'bachelor',
    degree: 'Bachelor of Science in Computer Science (Minor: New Media)',
    field: 'Computer Science',
    slug: 'bsc-computer-science-uofl',
    institution: 'University of Lethbridge',
    institutionWebsite: 'https://www.ulethbridge.ca/',
    location: 'Lethbridge, Alberta, Canada',
    startDate: '2019-09-01',
    graduationDate: '2023-06-30',
    current: false,
    description: `# Bachelor of Science in Computer Science
**Minor: New Media**

Comprehensive program covering software engineering, algorithms, data structures, system design, and multimedia technologies. The New Media minor provided expertise in digital design, interactive media, and web technologies.

## Key Areas of Study
- Software Engineering & Architecture
- Data Structures & Algorithms
- Database Management Systems
- Web Application Development
- Computer Networks & Operating Systems
- Digital Media Production
- Interactive Design & User Experience`,
    courses: [
      'Pratical Software Development',
      'Data Structures and Algorithms',
      'Introduction to Database Systems',
      'Introduction to Software Engineering',
      'Computer Graphics',
      'Programming Languages',
      'Cryptography',
      'Statistical Methods and Machine Learning',
      'Database Management Systems',
      'Interaction Design',
      'Advanced Web Design',
      'Mobile Application Development',
    ],
    skills: [
      'JavaScript',
      'TypeScript',
      'C++',
      'Haskell',
      'PHP',
      'Node.js',
      'Arduino',
      'Electron',
      'React',
      'Express',
      'Python',
      'SQL',
      'MySQL',
      'HTML5',
      'CSS3',
      'Bootstrap',
      'Tailwind',
      'RESTful API',
      'Database Design',
      'Relational Databases',
      'Object-Relational Mapping',
      'Software Architecture',
      'Software Design Patterns',
      'Event-Driven Architecture',
      'Data Structures',
      'Algorithms',
      'Object-Oriented Programming',
      'Front-End Web Development',
      'Back-End Web Development',
      'Responsive Web Design',
      'UI/UX Design',
      'Figma',
      'JSON',
      'API Development',
      'Websockets',
      'Middleware',
      'Web Servers',
      'AWS',
      'Cloud Computing',
      'Docker',
      'Containerization',
      'CI/CD',
      'DevOps',
      'Application Deployment',
      'Git',
      'GitHub',
      'GitLab',
      'Unit Testing',
      'Debugging',
      'Agile',
      'Software Development Life Cycle',
      'High-Concurrency System Management',
      'Real-Time Data Stream Processing'
    ],
    sort: 0,
    featured: true,
    display: 'featured',
  },
  {
    type: 'associate',
    degree: 'Associate Degree in Computer Information Technology',
    field: 'Computer Information Technology',
    slug: 'associate-cit-lethbridge-polytechnic',
    institution: 'Lethbridge Polytechnic',
    institutionWebsite: 'https://lethbridgecollege.ca/',
    location: 'Lethbridge, Alberta, Canada',
    startDate: '2017-09-01',
    graduationDate: '2019-04-30',
    current: false,
    description: `# Associate Degree in Computer Information Technology

Two-year technical program focused on practical IT skills, programming fundamentals, and system administration. Provided strong foundation for bachelor's degree progression.

## Key Areas of Study
- Programming Fundamentals (Java, C++, Python)
- Web Development (HTML, CSS, JavaScript, PHP)
- Database Design & SQL
- Network Administration
- System Analysis & Design
- IT Project Management`,
    courses: [
      'Computer Hardware Maintenance',
      'HTML and Web Publishing',
      'Introduction to Management',
      'Computer Programming',
      'Database Management Systems',
      'User-Centred Interface Design',
      'Web Programming',
      'IT Integration Seminar',
      'Computer Networking',
      'Operating Systems Theory',
      'Introduction to Linux',
      'IT Field Work',
      'Systems Analysis and Design',
      'Introduction to Marketing',
      'Algorithms and Problem Solving',
      'Mobile App Development',
    ],
    skills: [
      'JavaScript',
      'Java',
      'Java Swing',
      'Gradle',
      'C#',
      'PHP',
      'Object-Oriented Programming',
      'Data Structures',
      'Algorithms',
      'Front-End Web Development',
      'HTML',
      'Cascading Style Sheets (CSS)',
      'Responsive Web Design',
      'Bootstrap',
      'UI/UX Design',
      'Back-End Web Development',
      '.NET',
      'Web Servers',
      'System Design',
      'API Development',
      'SQL',
      'MySQL',
      'OracleSQL',
      'Database Design',
      'Relational Databases',
      'Object-Relational Mapping',
      'Database Management',
      'Git',
      'Version Control',
      'CI/CD',
      'Linux',
      'Operating Systems',
      'Virtual Machines',
      'Software Engineering',
      'Software Development Life Cycle',
      'Software Architecture',
      'Software Design Patterns',
      'Unit Testing',
      'Debugging',
      'Web Applications',
      'Application Development'
    ],
    sort: 1,
    featured: true,
    display: 'featured',
  },
  {
    type: 'certificate',
    degree: 'Full Stack Software Developer Career Certificate',
    field: 'Full-Stack Development',
    slug: 'ibm-fullstack-certificate',
    institution: 'IBM',
    institutionWebsite: 'https://www.ibm.com/',
    location: 'Online',
    startDate: '2025-01-01',
    graduationDate: '2025-09-30',
    current: false,
    description: `# Full Stack Software Developer Career Certificate

Comprehensive IBM professional certificate covering modern full-stack development with cloud-native technologies, microservices, and DevOps practices.

## Key Competencies
- Front-end Development (React, Angular, Vue)
- Back-end Development (Node.js, Python, Java)
- Database Design (SQL, NoSQL)
- Cloud Deployment (IBM Cloud, Kubernetes, Docker)
- DevOps & CI/CD Pipelines
- Microservices Architecture`,
    courses: [
      'Introduction to Software Engineering',
      'Introduction to Cloud Computing',
      'Introduction to HTML, CSS, & JavaScript',
      'Getting Started with Git and GitHub',
      'Developing Front-End Apps with React',
      'Developing Back-End Apps with Node.js and Express',
      'Python for Data Science, AI & Development',
      'Developing AI Applications with Python and Flask',
      'Django Application Development with SQL and Databases',
      'Introduction to Containers w/ Docker, Kubernetes & OpenShift',
      'Application Development using Microservices and Serverless',
      'Full Stack Application Development Capstone Project',
      'Full Stack Software Developer Assessment',
      'Generative AI: Elevate your Software Development Career',
      'Software Developer Career Guide and Interview Preparation'
    ],
    skills: [
      'Software Engineering',
      'Software Development Life Cycle',
      'Front-End Web Development',
      'Back-End Web Development',
      'Python',
      'Software Architecture',
      'Software Design Patterns',
      'Application Deployment',
      'Cloud Computing',
      'Cloud Infrastructure',
      'Cloud Services',
      'Cloud Deployment',
      'Hybrid Cloud Computing',
      'DevOps',
      'Microservices',
      'Serverless Computing',
      'Cloud Platforms',
      'Cloud-Native Computing',
      'Virtual Machines',
      'Containerization',
      'Git',
      'GitHub',
      'Version Control',
      'Responsive Web Design',
      'Cascading Style Sheets (CSS)',
      'HTML',
      'JavaScript',
      'Bootstrap',
      'React',
      'React Redux',
      'JavaScript Frameworks',
      'JSON',
      'Event-Driven Programming',
      'Node.js',
      'RESTful API',
      'Middleware',
      'Web Servers',
      'Database Design',
      'SQL',
      'Relational Databases',
      'Object-Relational Mapping',
      'Database Management',
      'Django',
      'Flask',
      'Unit Testing',
      'Debugging',
      'Integrated Development Environments',
      'CI/CD',
      'Kubernetes',
      'Docker',
      'OpenShift',
      'Istio',
      'YAML',
      'Application Development',
      'Web Applications',
      'Cloud Applications',
      'Software Development Tools',
      'Computer Programming',
      'Programming Principles',
      'Interviewing Skills',
    ],
    credentialUrl: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
    sort: 2,
    featured: true,
    display: 'featured',
  },
  {
    type: 'certificate',
    degree: 'AI Engineering Career Certificate',
    field: 'Artificial Intelligence',
    slug: 'ibm-ai-engineering-certificate',
    institution: 'IBM',
    institutionWebsite: 'https://www.ibm.com/',
    location: 'Online',
    startDate: '2025-01-01',
    graduationDate: '2025-07-31',
    current: false,
    description: `# AI Engineering Career Certificate

IBM professional certificate focused on machine learning, deep learning, and AI application development using industry-standard frameworks and tools.

## Key Competencies
- Machine Learning Fundamentals
- Deep Learning & Neural Networks
- Natural Language Processing (NLP)
- Computer Vision
- AI Model Deployment
- TensorFlow, PyTorch, Keras`,
    courses: [
      'Machine Learning with Python',
      'Introduction to Deep Learning & Neural Networks with Keras',
      'Deep Learning with Keras and TensorFlow',
      'Introduction to Neural Networks and PyTorch',
      'Deep Learning with PyTorch',
      'AI Capstone Project with Deep Learning',
      'Generative AI and LLMs: Architecture and Data Preparation',
      'Gen AI Foundational Models for NLP & Language Understanding',
      'Generative AI Language Modeling with Transformers',
      'Generative AI Engineering and Fine-Tuning Transformers',
      'Generative AI Advance Fine-Tuning for LLMs',
      'Fundamentals of AI Agents Using RAG and LangChain',
      'Project: Generative AI Applications with RAG and LangChain',
    ],
    skills: [
      'Python',
      'Data Science',
      'Machine Learning',
      'Applied Machine Learning',
      'Deep Learning',
      'Artificial Neural Networks',
      'Keras',
      'PyTorch',
      'TensorFlow',
      'Scikit-learn',
      'SciPy',
      'Apache Spark',
      'PySpark',
      'Model Deployment',
      'Model Evaluation',
      'Performance Tuning',
      'Supervised Learning',
      'Unsupervised Learning',
      'Reinforcement Learning',
      'Regression Analysis',
      'Logistic Regression',
      'Classification Algorithms',
      'Decision Tree Learning',
      'Dimensionality Reduction',
      'Feature Engineering',
      'Predictive Modeling',
      'Convolutional Neural Networks (CNNs)',
      'Recurrent Neural Networks (RNNs)',
      'Autoencoders',
      'Transformers',
      'Vision Transformer (ViT)',
      'Transfer Learning',
      'Attention Mechanisms',
      'Positional Encoding',
      'Masking',
      'Computer Vision',
      'Image and Video Processing',
      'Natural Language Processing (NLP)',
      'Text Mining',
      'Document Classification',
      'Embeddings',
      'Large Language Modeling (LLMs)',
      'LLM Application',
      'Prompt Engineering',
      'Generative AI',
      'Generative Model Architectures',
      'Retrieval-Augmented Generation (RAG)',
      'Vector Databases',
      'Hugging Face',
      'LangChain',
      'Gradio (model interfaces)',
      'Building QA / Question-Answering Systems',
      'LLMs Creation (e.g., BERT, GPT)',
      'Recommender Systems',
    ],
    credentialUrl: 'https://www.coursera.org/professional-certificates/ai-engineer',
    sort: 3,
    featured: false,
    display: 'standard',
  },
  {
    type: 'online-course',
    degree: 'Artificial Intelligence (AI) Primer Course',
    field: 'Artificial Intelligence',
    slug: 'eco-canada-ai-primer',
    institution: 'ECO Canada',
    institutionWebsite: 'https://eco.ca/',
    location: 'Online',
    startDate: '2025-01-01',
    graduationDate: '2025-02-28',
    current: false,
    description: `# Artificial Intelligence (AI) Primer Course

Foundational course introducing AI concepts, applications, and ethical considerations in the context of environmental and sustainability sectors.

## Key Topics
- Introduction to AI & Machine Learning
- AI Applications in Environmental Sectors
- Ethical AI Development
- AI for Sustainability & Climate Solutions`,
    courses: [
      'Introduction to Artificial Intelligence (AI)',
      'Key AI Technologies',
      'Ethics and Responsible AI Use',
      'AI Applications and Human-AI Collaboration',
      'Case Studies'
    ],
    skills: [
      'AI Fundamentals',
      'Machine Learning Concepts',
      'AI Ethics',
      'Environmental Applications',
      'OpenAI',
    ],
    credentialUrl: 'https://eco.ca/certifications/',
    sort: 4,
    featured: false,
    display: 'standard',
  },
];

async function seedEducation() {
  /** @type {import('@strapi/strapi').Core.Strapi | null} */
  let strapi = null;

  try {
    // Compile and load Strapi
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();

    console.log('🎓 Seeding Education entries...\n');

    let created = 0;
    let existing = 0;

    for (const education of educationData) {
      // Check if education already exists
      const existingEducation = await strapi.db
        .query('api::education.education')
        .findOne({ where: { slug: education.slug } });

      // Resolve tech stack relations (many-to-many)
      const skillIds = [];
      const missingSkills = [];

      for (const skillName of education.skills) {
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
          `  ⚠️  Missing skills for ${education.degree}: ${missingSkills.join(', ')}`
        );
      }

      if (existingEducation) {
        const updateData = {};
        let hasUpdates = false;
        // Remove temp field and prepare data
        const { skills, ...educationData } = education;

        for (const [key, value] of Object.entries(educationData)) {
          // Only update if field is null or undefined (not empty string - that's intentional)
          if (existingEducation[key] === null || existingEducation[key] === undefined) {
            // @ts-ignore
            updateData[key] = value;
            hasUpdates = true;
          }
        }

        // Check if techStack needs updating (only if null or undefined, not empty array)
        if (existingEducation.skills === null || existingEducation.skills === undefined) {
          // @ts-ignore
          updateData.skills = skillIds;
          hasUpdates = true;
        }

        if (hasUpdates) {
          await strapi.entityService.update('api::education.education', existingEducation.id, {
            data: updateData,
          });
          console.log(`🔄 Updated: ${education.degree} - filled missing fields`);
        } else {
          console.log(`✓ Exists: ${education.degree}`);
        }

        existing++;
        continue;
      }

      const { skills, ...educationData } = education; // Remove temp field
      // Create education entry
      await strapi.entityService.create('api::education.education', {
        data: {
          ...educationData,
          skills: skillIds, // Many-to-many uses array of IDs
        },
      });

      console.log(`✅ Created: ${education.degree}`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Existing: ${existing}`);
    console.log(`   Total: ${educationData.length}`);
    console.log('\n✅ Education seeding complete');
  } catch (error) {
    console.error('❌ Error seeding education:', error);
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
  seedEducation()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedEducation;
