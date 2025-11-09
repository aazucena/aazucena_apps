/**
 * Experience Data
 * Professional work experience and achievements
 */

export interface Experience {
  logo: string;
  logoGradient: string;
  position: string;
  company: string;
  duration: string;
  details: string[];
  skills: string[];
}

export const experiences: Experience[] = [
  {
    logo: 'TM',
    logoGradient: 'from-cyan-400 to-blue-500',
    position: 'Full Stack Software Developer',
    company: 'Tangle Media Inc.',
    duration: 'Dec 2021 – Sep 2025',
    details: [
      'Built 25+ reusable UI components reducing development time by 25% and UI-related bugs by 15%',
      'Migrated 30+ databases (5TB+) with zero data loss using custom Python scripts and validation frameworks',
      'Managed 50+ client sites with 99.95% uptime through proactive monitoring and rapid incident response',
      'Developed 15+ multilingual accessible websites achieving Lighthouse scores above 95 and WCAG compliance',
      'Created 15+ admin dashboards reducing content publishing time from 30 minutes to under 10 minutes'
    ],
    skills: ['React', 'TypeScript', 'Python', 'WordPress', 'MySQL', 'PostgreSQL', 'Accessibility', 'Performance Optimization', 'UI/UX Design', 'Database Migration']
  },
  {
    logo: 'HD',
    logoGradient: 'from-purple-400 to-pink-500',
    position: 'Software Developer Intern',
    company: 'HelpUsDefend',
    duration: 'May 2021 – Jan 2022',
    details: [
      'Built proof-of-concept Flutter mobile app with TensorFlow Lite AI camera integration achieving 95% accuracy',
      'Reduced technical debt by 25% through comprehensive refactoring of legacy codebase',
      'Implemented automated testing suite improving code coverage from 40% to 75%',
      'Collaborated with cross-functional teams in an Agile environment to deliver features on schedule'
    ],
    skills: ['Flutter', 'Dart', 'TensorFlow Lite', 'AI/ML', 'Mobile Development', 'Automated Testing', 'Agile', 'Code Refactoring']
  },
  {
    logo: 'IFB',
    logoGradient: 'from-green-400 to-emerald-500',
    position: 'Web Developer Intern',
    company: 'Interfaith Food Bank',
    duration: 'Feb 2019 – Aug 2020',
    details: [
      'Launched volunteer management tool serving 1,000+ active users with real-time scheduling capabilities',
      'Increased volunteer sign-ups by 35% through intuitive UX design and streamlined registration process',
      'Built responsive web application using React and Node.js with PostgreSQL database',
      'Implemented user authentication and authorization system ensuring data security and privacy'
    ],
    skills: ['React', 'Node.js', 'PostgreSQL', 'Authentication', 'UX Design', 'Responsive Design', 'Real-time Systems', 'REST APIs']
  }
];
