/**
 * NewspaperStack Component
 * Stacked newspaper card effect for the homepage blog section.
 * Clicking the card cycles through posts; the "Read Article" link navigates.
 */

import { useState, useRef, useEffect, type JSX } from "react";
import { gsap } from "gsap";
import type { BlogPost } from "@aazucena/types";
import type { BlogConfigData } from "@aazucena/types";
import {
  getPostExcerpt,
  formatPostDate,
  calculateReadTime,
  getTagClasses,
} from "@aazucena/utils";
import { getPostDateTime } from "~/lib/utils/blog";

export interface NewspaperStackProps {
  posts: BlogPost[];
  displayConfig: BlogConfigData["display"];
}

// Resting transforms per layer (0 = front, 2 = furthest back)
const REST = [
  { rotate: -1, x: 0, y: 0 },
  { rotate: 4, x: 0, y: 0 },
  { rotate: -6, x: 0, y: 0 },
];

// Fanned transforms on hover
const FANNED = [
  { rotate: -1, x: 0, y: -14 },
  { rotate: 12, x: 52, y: 16 },
  { rotate: -14, x: -52, y: 26 },
];

export function NewspaperStack({
  posts,
  displayConfig,
}: NewspaperStackProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [frontIndex, setFrontIndex] = useState(0);
  const isCycling = useRef(false);

  // Cap the stack at 3 posts
  const displayPosts = posts.slice(0, 3);
  const count = displayPosts.length;
  const canCycle = count > 1;
  const frontPost = displayPosts[frontIndex] ?? null;

  // Hover: fan out / collapse back
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onEnter = () => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          rotation: FANNED[i]?.rotate ?? 0,
          x: FANNED[i]?.x ?? 0,
          y: FANNED[i]?.y ?? 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    };

    const onLeave = () => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          rotation: REST[i]?.rotate ?? 0,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });
      });
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Animate the new front card in every time frontIndex changes
  useEffect(() => {
    const front = cardRefs.current[0];
    if (!front) return;
    gsap.fromTo(
      front,
      { y: -16, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
    );
  }, [frontIndex]);

  const cycle = () => {
    if (!canCycle || isCycling.current) return;
    isCycling.current = true;

    const front = cardRefs.current[0];
    if (!front) {
      isCycling.current = false;
      return;
    }

    gsap.to(front, {
      y: 24,
      opacity: 0,
      scale: 0.95,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        setFrontIndex((prev) => (prev + 1) % count);
        gsap.set(front, { y: 0, opacity: 1, scale: 1 });
        isCycling.current = false;
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <div
        ref={containerRef}
        className="group relative mx-auto w-full max-w-lg pb-4 md:pb-6"
        onClick={canCycle ? cycle : undefined}
        style={{ cursor: canCycle ? "pointer" : "default" }}
      >
        {/* Back decorative cards — absolute, peek behind the front */}
        {[2, 1].map((i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute inset-0 rounded-3xl border border-gray-200/80 bg-[#f0ede6] dark:border-white/8 dark:bg-[#1e1d19]"
            style={{
              transform: `rotate(${REST[i]!.rotate}deg)`,
              zIndex: i === 1 ? 10 : 5,
            }}
            aria-hidden="true"
          >
            <DecorativeLines />
          </div>
        ))}

        {/* Front card — in document flow to set container height */}
        <div
          ref={(el) => {
            cardRefs.current[0] = el;
          }}
          className="relative z-20 overflow-hidden rounded-3xl border border-gray-200 bg-[#faf8f3] shadow-2xl dark:border-white/10 dark:bg-[#1e1d19]"
          style={{ transform: `rotate(${REST[0]!.rotate}deg)` }}
        >
          {frontPost ? (
            <PostContent post={frontPost} displayConfig={displayConfig} />
          ) : (
            <EmptyContent />
          )}
        </div>
      </div>

      {/* Dot indicators + cycle hint — only shown when there are multiple posts */}
      {canCycle && (
        <div className="mt-2 flex items-center gap-3">
          {displayPosts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (i === frontIndex || isCycling.current) return;
                isCycling.current = true;
                const front = cardRefs.current[0];
                if (!front) {
                  isCycling.current = false;
                  return;
                }
                gsap.to(front, {
                  y: 24,
                  opacity: 0,
                  scale: 0.95,
                  duration: 0.22,
                  ease: "power2.in",
                  onComplete: () => {
                    setFrontIndex(i);
                    gsap.set(front, { y: 0, opacity: 1, scale: 1 });
                    isCycling.current = false;
                  },
                });
              }}
              aria-label={`Show post ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === frontIndex
                  ? "w-6 bg-blue-500"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500"
              }`}
            />
          ))}
          <span className="ml-1 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase dark:text-gray-600">
            Tap to browse
          </span>
        </div>
      )}
    </div>
  );
}

function PostContent({
  post,
  displayConfig,
}: {
  post: BlogPost;
  displayConfig: BlogConfigData["display"];
}): JSX.Element {
  return (
    <div className="p-8 md:p-10">
      {/* Masthead */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[0.35em] text-gray-400 uppercase dark:text-gray-500">
          Journal · Aldrin Azucena
        </span>
        {post.featured && (
          <span className="text-[9px] font-black tracking-[0.25em] text-yellow-600 uppercase dark:text-yellow-500">
            Featured
          </span>
        )}
      </div>
      <div className="mb-5 h-px bg-gray-300 dark:bg-white/10" />

      {/* Tags */}
      {displayConfig.showTags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span key={i} className={getTagClasses(tag.color)}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="mb-4 text-2xl leading-tight font-black tracking-tight text-gray-900 md:text-3xl dark:text-white">
        {post.title}
      </h3>

      {/* Byline */}
      {(displayConfig.showDate || displayConfig.showReadTime) && (
        <div className="mb-4 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
          {displayConfig.showDate && (
            <time dateTime={getPostDateTime(post)}>
              {formatPostDate(post as { publishedAt: string })}
            </time>
          )}
          {displayConfig.showDate && displayConfig.showReadTime && (
            <span>·</span>
          )}
          {displayConfig.showReadTime && (
            <span>{calculateReadTime(post.description)}</span>
          )}
        </div>
      )}

      <div className="mb-5 h-px bg-gray-200 dark:bg-white/5" />

      {/* Excerpt */}
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {getPostExcerpt(post.description)}
      </p>

      {/* Read link — stopPropagation so clicking it doesn't also trigger cycle */}
      <a
        href={post.url}
        target={post.isExternal ? "_blank" : "_self"}
        rel={post.isExternal ? "noopener noreferrer" : undefined}
        onClick={(e) => e.stopPropagation()}
        className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Read Article
        <svg
          className="h-3 w-3 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  );
}

function DecorativeLines(): JSX.Element {
  return (
    <div className="flex h-full flex-col gap-3 p-8 pt-10 opacity-20">
      <div className="h-px w-full bg-gray-500 dark:bg-gray-400" />
      <div className="h-2 w-3/4 rounded-full bg-gray-400 dark:bg-gray-500" />
      <div className="h-2 w-full rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="h-2 w-5/6 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="mt-2 h-px w-full bg-gray-400 dark:bg-gray-500" />
      <div className="h-2 w-2/3 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-2 w-4/5 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

function EmptyContent(): JSX.Element {
  return (
    <div className="p-8 md:p-10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[0.35em] text-gray-400 uppercase dark:text-gray-500">
          Journal · Aldrin Azucena
        </span>
      </div>
      <div className="mb-8 h-px bg-gray-300 dark:bg-white/10" />
      <p className="text-sm text-gray-400 dark:text-gray-500">
        No posts yet. Check back soon.
      </p>
    </div>
  );
}
