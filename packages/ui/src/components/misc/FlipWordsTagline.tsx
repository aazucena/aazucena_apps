import React, { useMemo } from 'react';
import { useFlipText, type FlipTextOptions } from '@aazucena/hooks';
import { cn } from '@aazucena/utils';

export interface FlipWordsTaglineProps extends FlipTextOptions {
  ref?: React.RefObject<HTMLParagraphElement | null>;
  tag?: string;
  content: string;
  className?: string;
}

export function FlipWord({
  ref,
  word,
}: {
  ref?: React.RefObject<HTMLElement | null>;
  word?: string;
}) {
  return (
    <span className="perspective-1000 inline-block">
      <span
        ref={ref}
        className="inline-block font-semibold text-cyan-400"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {word}
      </span>
    </span>
  );
}

export function FlipWordsTagline({
  content,
  ref,
  tag = 'flipWord',
  words,
  duration = 0.3,
  interval = 3000,
  className,
}: FlipWordsTaglineProps): JSX.Element {
  const { currentWord, elementRef } = useFlipText({
    words,
    duration,
    interval,
  });

  if (!content.includes(`{{${tag}}}`) && !content.includes(`{{ ${tag} }}`)) {
    console.error(`Template tag "{{${tag}}}" or "{{ ${tag} }}" not found in content: "${content}"`);
  }

  const parts = useMemo(() => {
    const tagPattern = new RegExp(`{{\s*${tag}\s*}}`, 'g');
    return content.split(tagPattern);
  }, [content, tag]);

  return (
    <p
      ref={ref}
      className={cn(
        'mb-8 text-center text-xl leading-relaxed text-gray-300 md:text-2xl',
        className,
      )}
    >
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <FlipWord ref={elementRef as any} word={currentWord} />}
        </React.Fragment>
      ))}
    </p>
  );
}
