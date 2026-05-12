/**
 * BlogSection Component
 * Blog posts grid with external/internal links
 */

import type { JSX } from "react";
import { useSectionData } from "~/contexts";
import { useAnimation } from "@aazucena/context";
import { NewspaperStack, ViewAllButton } from "~/components/ui/blog";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";

export interface BlogSectionProps extends SectionProps {}

export function BlogSection({
  title = "Blog",
  subtitle = "Thoughts & Insights",
}: BlogSectionProps): JSX.Element {
  const { posts: blogPosts, blog } = useSectionData();
  const { isSoundMuted } = useAnimation();

  return (
    <SectionLayout title={title} subtitle={subtitle} contentWidth="narrow">
      <div className="mt-6 flex flex-col items-center gap-3 md:mt-12 md:gap-8">
        <NewspaperStack
          posts={blogPosts}
          displayConfig={blog.display}
          isSoundMuted={isSoundMuted}
        />

        {/* View All Articles Button - Conditionally shown based on CMS config */}
        {blog.viewAllButton.show && (
          <ViewAllButton
            text={blog.viewAllButton.text}
            href={`/${blog.paths.main}`}
            ariaLabel={blog.viewAllButton.ariaLabel}
          />
        )}
      </div>
    </SectionLayout>
  );
}
