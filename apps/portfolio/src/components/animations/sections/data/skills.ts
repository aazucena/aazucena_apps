/**
 * Skills Data
 * Technical skills and technologies
 */

export interface SkillCategory {
  id: string;
  label: string;
  gradient: string;
  icon: string; // SVG path or component reference
  skills: string[];
}

export const techStackBadges = [
  'TypeScript',
  'React',
  'Python',
  'Node.js',
  'PostgreSQL',
  'AWS'
];

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    gradient: 'from-cyan-400 to-blue-500',
    icon: 'code', // Identifier for the icon
    skills: ['React', 'Vue.js', 'Svelte', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3']
  },
  {
    id: 'backend',
    label: 'Backend',
    gradient: 'from-purple-400 to-pink-500',
    icon: 'server',
    skills: ['Node.js', 'Python', 'Django', 'PHP', 'Java', 'GraphQL', 'REST APIs']
  },
  {
    id: 'database',
    label: 'Database',
    gradient: 'from-green-400 to-emerald-500',
    icon: 'database',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis']
  },
  {
    id: 'cloud',
    label: 'Cloud',
    gradient: 'from-blue-400 to-indigo-500',
    icon: 'cloud',
    skills: ['Docker', 'AWS', 'Firebase', 'Kubernetes', 'CI/CD']
  },
  {
    id: 'tools',
    label: 'Tools',
    gradient: 'from-yellow-400 to-orange-500',
    icon: 'tools',
    skills: ['Git', 'Figma', 'VS Code', 'Agile', 'Jira']
  },
  {
    id: 'ai',
    label: 'AI',
    gradient: 'from-pink-400 to-red-500',
    icon: 'ai',
    skills: ['LangChain', 'TensorFlow', 'OpenAI', 'Machine Learning']
  }
];
