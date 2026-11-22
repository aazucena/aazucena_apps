/**
 * NewspaperStack Component
 * Stacked newspaper card effect for the homepage blog section.
 * Clicking the card cycles through posts; the "Read Article" link navigates.
 */

import { useState, useRef, useEffect, type JSX } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@aazucena/hooks";
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
  isSoundMuted?: boolean;
}

function playPaperSound(isMuted: boolean): void {
  if (isMuted || typeof window === "undefined") return;
  const ctx = new AudioContext();
  const bufferSize = Math.floor(ctx.sampleRate * 0.04); // 40ms burst
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2500; // paper's characteristic mid-high frequency range
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
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
  isSoundMuted = false,
}: NewspaperStackProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [frontIndex, setFrontIndex] = useState(0);
  // GSAP ignores the reduced-motion media query: a zero duration jumps to the end state
  const motionScale = usePrefersReducedMotion() ? 0 : 1;
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
          duration: 0.5 * motionScale,
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
          duration: 0.6 * motionScale,
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
  }, [motionScale]);

  // Animate the new front card in every time frontIndex changes
  useEffect(() => {
    const front = cardRefs.current[0];
    if (!front) return;
    gsap.fromTo(
      front,
      { y: -16, opacity: 0, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.35 * motionScale,
        ease: "power2.out",
      },
    );
  }, [frontIndex, motionScale]);

  const cycle = () => {
    if (!canCycle || isCycling.current) return;
    isCycling.current = true;
    playPaperSound(isSoundMuted);

    const front = cardRefs.current[0];
    if (!front) {
      isCycling.current = false;
      return;
    }

    gsap.to(front, {
      y: 24,
      opacity: 0,
      scale: 0.95,
      duration: 0.22 * motionScale,
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
            className="border-rule bg-panel-raised rounded-card absolute inset-0 border"
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
          className="border-rule bg-panel rounded-card relative z-20 overflow-hidden border"
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
        <div className="mt-2 flex items-center gap-0">
          {displayPosts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (i === frontIndex || isCycling.current) return;
                isCycling.current = true;
                playPaperSound(isSoundMuted);
                const front = cardRefs.current[0];
                if (!front) {
                  isCycling.current = false;
                  return;
                }
                gsap.to(front, {
                  y: 24,
                  opacity: 0,
                  scale: 0.95,
                  duration: 0.22 * motionScale,
                  ease: "power2.in",
                  onComplete: () => {
                    setFrontIndex(i);
                    gsap.set(front, { y: 0, opacity: 1, scale: 1 });
                    isCycling.current = false;
                  },
                });
              }}
              aria-label={`Show post ${i + 1}`}
              className="group focus-visible:outline-signal flex min-h-6 min-w-6 items-center justify-center focus-visible:outline-1 focus-visible:outline-offset-2"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-[width,background-color] duration-(--motion-base) ${
                  i === frontIndex
                    ? "bg-signal w-6"
                    : "bg-rule-strong group-hover:bg-muted-foreground w-1.5"
                }`}
              />
            </button>
          ))}
          <span className="micro-label text-muted-foreground ml-1">
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
    <div className="p-5 sm:p-8 md:p-10">
      {/* Masthead */}
      <div className="mb-3 flex items-center justify-between">
        <span className="micro-label text-muted-foreground">
          Journal · Aldrin Azucena
        </span>
        {post.featured && (
          <span className="micro-label text-signal">Featured</span>
        )}
      </div>
      <div className="bg-rule mb-4 h-px" />

      {/* Tags */}
      {displayConfig.showTags && post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span key={i} className={getTagClasses(tag.color)}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="text-foreground mb-3 text-xl leading-tight font-semibold tracking-tight sm:text-2xl md:text-3xl">
        {post.title}
      </h3>

      {/* Byline */}
      {(displayConfig.showDate || displayConfig.showReadTime) && (
        <div className="micro-label text-muted-foreground mb-3 flex items-center gap-3">
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

      <div className="bg-rule mb-4 h-px" />

      {/* Excerpt */}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {getPostExcerpt(post.description)}
      </p>

      {/* Read link — stopPropagation so clicking it doesn't also trigger cycle */}
      <a
        href={post.url}
        target={post.isExternal ? "_blank" : "_self"}
        rel={post.isExternal ? "noopener noreferrer" : undefined}
        onClick={(e) => e.stopPropagation()}
        className="micro-label text-signal hover:text-foreground focus-visible:text-foreground group mt-4 inline-flex items-center gap-1.5 transition-colors"
      >
        Read Article
        <svg
          className="hover-nudge h-3 w-3 [--nudge-x:4px]"
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
      <div className="bg-muted-foreground h-px w-full" />
      <div className="bg-muted-foreground h-2 w-3/4 rounded-full" />
      <div className="bg-rule-strong h-2 w-full rounded-full" />
      <div className="bg-rule-strong h-2 w-5/6 rounded-full" />
      <div className="bg-muted-foreground mt-2 h-px w-full" />
      <div className="bg-rule-strong h-2 w-2/3 rounded-full" />
      <div className="bg-rule-strong h-2 w-full rounded-full" />
      <div className="bg-rule-strong h-2 w-4/5 rounded-full" />
    </div>
  );
}

function EmptyContent(): JSX.Element {
  return (
    <div className="p-5 sm:p-8 md:p-10">
      <div className="mb-3 flex items-center justify-between">
        <span className="micro-label text-muted-foreground">
          Journal · Aldrin Azucena
        </span>
      </div>
      <div className="bg-rule mb-6 h-px" />
      <p className="text-muted-foreground text-sm">
        No posts yet. Check back soon.
      </p>
    </div>
  );
}
