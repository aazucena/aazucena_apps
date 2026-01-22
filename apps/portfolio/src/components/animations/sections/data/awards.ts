/**
 * Awards Data
 * Awards and certifications
 */

export interface Award {
  id: string;
  type: 'certification' | 'award';
  title: string;
  shortTitle: string;
  organization: string;
  year: string;
  description: string;
  gradient: string;
  icon: string;
  details?: string[];
  skills?: string[];
  // New CMS fields
  featured?: boolean;
  verificationUrl?: string;
  badgeUrl?: string;
  certificateUrl?: string;
}

export const awards: Award[] = [
  {
    id: 'aws',
    type: 'certification',
    title: 'AWS Certified Solutions Architect',
    shortTitle: 'AWS',
    organization: 'Amazon Web Services',
    year: '2023',
    description: 'Professional-level certification demonstrating expertise in designing distributed systems on AWS cloud infrastructure.',
    gradient: 'from-cyan-400 to-blue-500',
    icon: 'badge',
    details: [
      'Demonstrated ability to design and deploy scalable, highly available systems on AWS',
      'Expertise in selecting appropriate AWS services based on compute, database, storage requirements',
      'Knowledge of cost optimization strategies and architectural best practices',
      'Understanding of security, compliance, and disaster recovery implementations'
    ],
    skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation', 'VPC', 'IAM', 'Cost Optimization']
  },
  {
    id: 'google-cloud',
    type: 'certification',
    title: 'Google Cloud Professional Developer',
    shortTitle: 'Google Cloud',
    organization: 'Google Cloud',
    year: '2022',
    description: 'Certified in building scalable and reliable cloud applications using Google Cloud technologies and best practices.',
    gradient: 'from-purple-400 to-pink-500',
    icon: 'badge',
    details: [
      'Proficiency in designing and building cloud-native applications on Google Cloud Platform',
      'Experience with containerization using GKE (Google Kubernetes Engine)',
      'Knowledge of serverless computing with Cloud Functions and App Engine',
      'Understanding of Google Cloud monitoring, logging, and debugging tools'
    ],
    skills: ['Google Cloud', 'GKE', 'Cloud Functions', 'App Engine', 'BigQuery', 'Cloud Storage', 'Pub/Sub', 'Kubernetes', 'Docker', 'CI/CD']
  },
  {
    id: 'innovation',
    type: 'award',
    title: 'Innovation Award',
    shortTitle: 'Innovation',
    organization: 'Tangle Media Inc.',
    year: '2024',
    description: 'Recognized for developing innovative solutions that significantly improved development efficiency and team productivity.',
    gradient: 'from-yellow-400 to-orange-500',
    icon: 'star',
    details: [
      'Created 25+ reusable UI components reducing development time by 25%',
      'Developed custom database migration framework handling 5TB+ of data with zero data loss',
      'Built automated testing and deployment pipelines increasing release frequency by 40%',
      'Implemented AI-powered code review tools catching bugs 30% earlier in development cycle'
    ],
    skills: ['Innovation', 'Problem Solving', 'Component Design', 'Database Migration', 'Automation', 'DevOps', 'AI Integration']
  },
  {
    id: 'hackathon',
    type: 'award',
    title: 'Hackathon Winner',
    shortTitle: 'Hackathon',
    organization: 'University Tech Challenge',
    year: '2020',
    description: 'First place winner for developing an AI-powered accessibility tool for visually impaired users in a 48-hour hackathon.',
    gradient: 'from-green-400 to-emerald-500',
    icon: 'trophy',
    details: [
      'Led a team of 4 developers in building a mobile app with real-time object detection',
      'Integrated TensorFlow Lite for on-device AI processing with 95% accuracy',
      'Implemented text-to-speech navigation assistance for indoor environments',
      'Pitched solution to panel of judges and secured first place out of 30+ competing teams'
    ],
    skills: ['Mobile Development', 'AI/ML', 'TensorFlow', 'Computer Vision', 'Accessibility', 'Team Leadership', 'Flutter', 'Rapid Prototyping']
  }
];
