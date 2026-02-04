/**
 * BlogSection Component
 * Blog posts grid with external/internal links
 */

import type { JSX } from 'react';
import { useSectionData } from '~/contexts/animations';
import { ResponsiveGrid } from '~/components/ui/common';
import { BlogCard, ViewAllButton } from '~/components/ui/blog';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface BlogSectionProps extends SectionProps {}

export function BlogSection({ title = 'Blog', subtitle = 'Thoughts & Insights' }: BlogSectionProps): JSX.Element {
  const { posts: blogPosts, blog } = useSectionData();

  // Limit posts to display count from CMS
  const displayedPosts = blogPosts.slice(0, blog.display.postsCount);

  // Map grid columns to ResponsiveGrid cols prop
  const gridColumns = (() => {
    switch (blog.display.gridColumns) {
      case 1:
        return { sm: 1 as const };
      case 2:
        return { sm: 1 as const, md: 2 as const };
      case 3:
        return { sm: 1 as const, md: 3 as const };
      case 4:
        return { sm: 1 as const, md: 2 as const, lg: 4 as const };
      default:
        return { sm: 1 as const, md: 3 as const };
    }
  })();

  return (
    <SectionLayout
      title={title}
      subtitle={subtitle}
      contentWidth="medium"
    >
      <ResponsiveGrid cols={gridColumns} gap="lg" className="mt-12">
        {displayedPosts.map((post, index) => (
          <BlogCard
            key={index}
            post={post}
            displayConfig={blog.display}
          />
        ))}
      </ResponsiveGrid>

      {/* View All Articles Button - Conditionally shown based on CMS config */}
      {blog.viewAllButton.show && (
        <ViewAllButton
          text={blog.viewAllButton.text}
          href={`/${blog.paths.main}`}
          ariaLabel={blog.viewAllButton.ariaLabel}
        />
      )}
    </SectionLayout>
  );
}
