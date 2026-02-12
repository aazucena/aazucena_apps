/**
 * SocialMenu Component
 * Social media links expandable menu
 */

import type { JSX } from 'react';
import type { SocialLink } from '@aazucena/types';
import { cn } from '@aazucena/utils';
import { getIconComponent } from '@aazucena/icons';
import { IconRenderer } from '../blocks/IconRenderer.js';
import { X, ChevronRight } from '@aazucena/icons';
import { SOCIAL_PLATFORM_METADATA } from '@aazucena/constants';

export interface SocialMenuProps {
  /** Callback when menu should close */
  onClose: () => void;
  /** Array of social links to display */
  socialLinks?: SocialLink[];
  /** Optional email address - will be auto-injected as first link if provided */
  email?: string;
  /** Optional custom description for email link (falls back to "Send me a message") */
  emailDescription?: string;
  /** Additional className */
  className?: string;
}

export function SocialMenu({
  onClose,
  socialLinks = [],
  email,
  emailDescription,
  className,
}: SocialMenuProps): JSX.Element {
  let displayLinks = [...socialLinks];

  if (email && !displayLinks.some((link) => link.url.includes('mailto:'))) {
    const emailLink: SocialLink = {
      platform: 'Email',
      url: `mailto:${email}`,
      text: 'Email',
      description: emailDescription || 'Send me a message',
      openInNewTab: false,
    };
    displayLinks = [emailLink, ...displayLinks];
  }

  return (
    <div className={cn('max-h-[85vh] overflow-y-auto p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Connect</h3>
        <button
          onClick={onClose}
          className="text-white/60 transition-colors hover:text-white"
          aria-label="Close social menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {displayLinks.length > 0 ? (
          displayLinks.map((link, index) => {
            const icon = getIconComponent(link.platform);
            const description =
              link.description || SOCIAL_PLATFORM_METADATA[link.platform] || 'Connect with me';

            return (
              <a
                key={`${link.platform}-${index}`}
                href={link.url}
                target={link.openInNewTab !== false ? '_blank' : undefined}
                rel={link.openInNewTab !== false ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-white/20">
                  <IconRenderer icon={icon} className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white transition-colors group-hover:text-cyan-400">
                    {link.text || link.platform}
                  </div>
                  <div className="text-xs text-white/60">{description}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40 transition-colors group-hover:text-white/80" />
              </a>
            );
          })
        ) : (
          <div className="py-4 text-center text-white/60">No social links available</div>
        )}
      </div>
    </div>
  );
}
