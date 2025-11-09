/**
 * Projects Data
 * Featured projects and portfolio items
 */

export interface Project {
  title: string;
  description: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: 'Hugo UI Component Library',
    description: 'Engineered 25+ standardized, tested components accelerating front-end development by 25% and reducing UI-related bugs by 15%.',
    tags: ['Hugo', 'JavaScript', 'Component Library']
  },
  {
    title: 'Multi-lingual Accessible Websites',
    description: 'Developed and deployed 15+ websites achieving Lighthouse scores above 95 and full WCAG compliance for global accessibility.',
    tags: ['React', 'Vue.js', 'Accessibility']
  },
  {
    title: 'Admin Dashboards Suite',
    description: 'Built 15+ dashboards with Svelte, Vue, and React, reducing content publishing time from 30 minutes to under 10 minutes.',
    tags: ['Svelte', 'Vue.js', 'React']
  },
  {
    title: 'AI-Powered Mobile App',
    description: 'Proof-of-concept Flutter app with TensorFlow Lite AI camera integration achieving 95% accuracy in image recognition.',
    tags: ['Flutter', 'TensorFlow Lite', 'AI/ML']
  },
  {
    title: 'Real-time Collaboration Platform',
    description: 'Built WebSocket-based collaboration tool supporting 1000+ concurrent users with sub-100ms latency for live document editing.',
    tags: ['Node.js', 'WebSockets', 'Redis']
  },
  {
    title: 'E-commerce Storefront',
    description: 'Developed headless e-commerce platform with Next.js and Stripe, achieving 99.9% uptime and processing $2M+ in annual transactions.',
    tags: ['Next.js', 'Stripe', 'TypeScript']
  },
  {
    title: 'DevOps Automation Pipeline',
    description: 'Designed CI/CD pipeline with Docker and GitHub Actions, reducing deployment time from 45 minutes to under 5 minutes.',
    tags: ['Docker', 'GitHub Actions', 'AWS']
  },
  {
    title: 'Analytics Dashboard',
    description: 'Created real-time analytics platform processing 10M+ events daily with interactive data visualizations and custom reporting.',
    tags: ['D3.js', 'React', 'PostgreSQL']
  },
  {
    title: 'Mobile Fitness Tracker',
    description: 'Developed cross-platform fitness app with offline-first architecture, achieving 4.8★ rating with 50K+ active users.',
    tags: ['React Native', 'GraphQL', 'MongoDB']
  },
  {
    title: 'API Gateway Service',
    description: 'Built microservices API gateway handling 100K+ requests/hour with rate limiting, authentication, and caching layers.',
    tags: ['Go', 'Kubernetes', 'gRPC']
  }
];
