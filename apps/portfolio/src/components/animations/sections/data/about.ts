/**
 * About Data
 * Personal information and statistics
 */

export interface AboutData {
  name: string;
  title: string;
  tagline: string;
  flipWords: string[];
  descriptions: string[];
  highlights: string[];
  stats: Array<{
    value: string;
    label: string;
  }>;
  education: {
    degree: string;
    institution: string;
    year: string;
  };
}

export const aboutData: AboutData = {
  name: 'Aldrin Azucena',
  title: 'Full Stack Software Developer',
  tagline: 'Building Products That Drive Impact',
  flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
  descriptions: [
    'I\'m a full-stack professional who transforms ideas into market-ready products. From rapid MVP development to enterprise-scale systems, I build high-performance SaaS, web, and mobile applications that deliver measurable business impact.',
    'With expertise spanning TypeScript, Python, PHP, and Java, I leverage AI-powered workflows to create smarter, scalable solutions. I specialize in legacy system modernization, complex database migrations, and delivering secure, compliant applications that users love.'
  ],
  highlights: [
    'Full-Stack Development & Architecture',
    'MVP to Enterprise Scaling',
    'AI-Integrated Applications',
    'Secure & Compliant Engineering',
    'Legacy System Modernization',
    'Clear Communication & Collaboration'
  ],
  stats: [
    { value: '4+', label: 'Years Experience' },
    { value: '30+', label: 'Databases Migrated' },
    { value: '50+', label: 'Client Sites Managed' }
  ],
  education: {
    degree: 'B.S. Computer Science',
    institution: 'University of Lethbridge',
    year: '2023'
  }
};
