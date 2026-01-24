import type { StrapiPost } from '../validators/posts';
import { 
  transformImage, 
  transformTag, 
  transformSeo, 
  transformWebLink 
} from './utils';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: any; // Blocks content
  coverImage?: ReturnType<typeof transformImage>;
  status?: string;
  sort: number;
  featured: boolean;
  url: string;
  isExternal: boolean;
  tags: ReturnType<typeof transformTag>[];
  seo?: ReturnType<typeof transformSeo>;
  relatedLinks: ReturnType<typeof transformWebLink>[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type BlogPostDetail = BlogPost;

export const DEFAULT_POSTS: BlogPost[] = [];

export function transformPost(data: StrapiPost): BlogPost {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    coverImage: transformImage(data.coverImage),
    status: data.status,
    sort: data.sort ?? 0,
    featured: !!data.featured,
    url: data.url,
    isExternal: !!data.isExternal,
    tags: (data.tags || []).map(transformTag),
    seo: transformSeo(data.seo),
    relatedLinks: (data.relatedLinks || []).map(transformWebLink),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
  };
}

export function transformPostDetail(data: StrapiPost): BlogPostDetail {
  return transformPost(data);
}

export function transformPosts(posts: StrapiPost[]): BlogPost[] {
  if (!posts || posts.length === 0) return DEFAULT_POSTS;

  return posts
    .sort((a, b) => {
      if ((a.sort ?? 0) !== (b.sort ?? 0)) return (a.sort ?? 0) - (b.sort ?? 0);
      return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
    })
    .map(transformPost);
}