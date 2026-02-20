/**
 * ProjectCard Component
 * Individual project card for ProjectsSection carousel
 * Displays project title, description, and tags with click handling
 */

import type { JSX } from "react";
import { GlassCard, Badge } from "../common";

export interface ProjectCardData {
  slug: string;
  title: string;
  description: string;
  tags: Array<{ label: string }>;
}

export interface ProjectCardProps {
  /** Project data to display */
  project: ProjectCardData;
  /** Click handler (receives slug) */
  onClick: (_slug: string) => void;
  /** Maximum number of tags to show before "+N more" */
  maxTags?: number;
}

/**
 * ProjectCard
 *
 * Displays a project with:
 * - Title and description (clamped to 2 lines)
 * - Up to maxTags tags with "+N more" indicator
 * - Hover effects (via GlassCard)
 * - Click navigation
 *
 * @example
 * ```tsx
 * <ProjectCard
 *   project={project}
 *   onClick={(slug) => navigate(`/projects/${slug}`)}
 *   maxTags={3}
 * />
 * ```
 */
export function ProjectCard({
  project,
  onClick,
  maxTags = 3,
}: ProjectCardProps): JSX.Element {
  const visibleTags = project.tags.slice(0, maxTags);
  const hiddenTagsCount = project.tags.length - maxTags;

  return (
    <GlassCard
      hover
      clickable
      padding="lg"
      className="w-[420px] text-left hover:border-cyan-400/30"
      onClick={() => onClick(project.slug)}
    >
      <h3 className="mb-3 text-2xl font-bold text-white">{project.title}</h3>
      <p className="mb-4 line-clamp-2 text-gray-300">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag, tagIndex) => (
          <Badge key={tagIndex} variant="cyan" size="sm">
            {tag.label}
          </Badge>
        ))}

        {hiddenTagsCount > 0 && (
          <Badge variant="white" size="sm">
            +{hiddenTagsCount}
          </Badge>
        )}
      </div>
    </GlassCard>
  );
}
