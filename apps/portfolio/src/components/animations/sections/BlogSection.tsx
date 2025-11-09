/**
 * BlogSection Component
 * Blog posts grid with external/internal links
 */

import type { JSX } from 'react';
import { blogPosts } from './data/blog';
import { getTagClasses } from '../utilities/colors';

export function BlogSection(): JSX.Element {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Blog
          <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Thoughts & Insights
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {blogPosts.map((post, index) => (
            <a
              key={index}
              href={post.url}
              target={post.isExternal ? '_blank' : '_self'}
              rel={post.isExternal ? 'noopener noreferrer' : undefined}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            >
              {/* Tags Row */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={getTagClasses(tag.color)}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Title with External Link Icon */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
                {post.isExternal && (
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </div>

              {/* Date and Read Time */}
              <div className="flex items-center gap-3 mb-3">
                <p className="text-sm text-gray-400">{post.date}</p>
                <span className="text-gray-500">•</span>
                <p className="text-sm text-gray-400">{post.readTime}</p>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {post.description}
              </p>
            </a>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="mt-16 flex justify-center">
          <a
            href="/blog"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
            aria-label="View all blog articles"
          >
            View All Articles
          </a>
        </div>
      </div>
    </div>
  );
}
