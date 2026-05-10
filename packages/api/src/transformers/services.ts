import type { StrapiService } from '../validators/services';
import type { Service, ServiceCta, ServicesData } from '@aazucena/types';

export const DEFAULT_SERVICES: ServicesData = {
  services: [
    {
      id: 0,
      title: 'Full-Stack Web Development',
      shortDescription: 'End-to-end web applications with modern frameworks.',
      description:
        'From architecture to deployment, I build scalable web apps using React, Next.js, Astro, and Node.js — with a focus on performance and maintainability.',
      category: 'engineering',
      features: [
        'React / Next.js / Astro front-ends',
        'REST & GraphQL API design',
        'PostgreSQL, Supabase, or your existing DB',
        'CI/CD + Vercel deployment',
      ],
      cta: {
        label: "Let's talk",
        url: '/contact',
        variant: 'primary',
        size: 'md',
        openInNewTab: false,
      },
      sort: 1,
    },
    {
      id: 1,
      title: 'Technical Consulting',
      shortDescription: 'Architecture reviews, tech stack decisions, and team coaching.',
      description:
        'I help teams move faster by identifying bottlenecks, reviewing system architecture, and translating business goals into pragmatic engineering plans.',
      category: 'consulting',
      features: [
        'Architecture audits & roadmaps',
        'Tech stack selection',
        'Code review & mentoring',
        'Performance optimisation',
      ],
      cta: {
        label: 'See my experience',
        url: '/about',
        variant: 'outline',
        size: 'md',
        openInNewTab: false,
      },
      sort: 2,
    },
    {
      id: 2,
      title: 'AI / ML Integration',
      shortDescription: 'LLM-powered features, RAG pipelines, and AI-assisted workflows.',
      description:
        'I design and build production AI integrations using Claude, LangChain, pgVector, and the Vercel AI SDK — from chatbots to semantic search.',
      category: 'ai',
      features: [
        'Claude / GPT integration',
        'RAG & vector search (pgVector)',
        'AI observability with LangSmith',
        'Streaming chat interfaces',
      ],
      cta: {
        label: 'View projects',
        url: '/projects',
        variant: 'outline',
        size: 'md',
        openInNewTab: false,
      },
      sort: 3,
    },
    {
      id: 3,
      title: 'Research & Discovery',
      shortDescription: 'User research, competitive analysis, and technical investigations.',
      description:
        'I conduct structured research to inform better product decisions — from user interviews and usability audits to deep technical investigations and feasibility studies.',
      category: 'research',
      features: [
        'User interviews & usability testing',
        'Competitive & market analysis',
        'Technical feasibility studies',
        'Research synthesis & recommendations',
      ],
      cta: {
        label: 'Learn more',
        url: '/about',
        variant: 'outline',
        size: 'md',
        openInNewTab: false,
      },
      sort: 4,
    },
    {
      id: 4,
      title: 'Creative Direction',
      shortDescription: 'Brand identity, visual storytelling, and design leadership.',
      description:
        'I bring a creative eye to digital products — from establishing visual languages and motion design to art-directing campaigns and interactive experiences.',
      category: 'creative',
      features: [
        'Brand identity & visual systems',
        'Motion design & micro-interactions',
        'Art direction for web & media',
        'Interactive storytelling',
      ],
      cta: {
        label: "Let's create",
        url: '/contact',
        variant: 'primary',
        size: 'md',
        openInNewTab: false,
      },
      sort: 5,
    },
  ],
};

function transformCta(data: {
  label: string;
  url: string;
  variant?: string;
  size?: string;
  openInNewTab?: boolean;
  icon?: unknown;
}): ServiceCta {
  return {
    label: data.label,
    url: data.url,
    variant: (data.variant as ServiceCta['variant']) ?? 'primary',
    size: (data.size as ServiceCta['size']) ?? 'md',
    openInNewTab: data.openInNewTab ?? true,
    icon: data.icon ?? undefined,
  };
}

export function transformService(data: StrapiService): Service {
  return {
    id: data.id,
    title: data.title,
    shortDescription: data.shortDescription ?? '',
    description: typeof data.description === 'string' ? data.description : '',
    icon: data.icon ?? undefined,
    category: data.category,
    features: data.features ?? [],
    price: data.price ?? undefined,
    cta: data.cta ? transformCta(data.cta) : undefined,
    sort: data.sort,
  };
}

export function transformServices(items: StrapiService[]): Service[] {
  return [...items].sort((a, b) => a.sort - b.sort).map(transformService);
}
