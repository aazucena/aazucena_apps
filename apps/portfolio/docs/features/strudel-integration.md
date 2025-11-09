# Strudel.cc Live Coding Integration

📍 **Full Documentation:** [ROADMAP.md Section 3.16.1](../../ROADMAP.md#3161-strudelcc-live-coding-integration-)

## Overview

Integrate Strudel.cc (browser-based TidalCycles) into your `/music` page for interactive live coding pattern demonstrations.

**Estimated Effort:** 9-13 days

## Why Strudel.cc?

Since you have TidalCycles experience, Strudel.cc is a **brilliant unique differentiator** that sets your portfolio apart:

- **Uniqueness Factor:** 10/10 (vs 3/10 for typical music players)
- **Technical Showcase:** Demonstrates live coding skills
- **Interactive:** Visitors can modify and play with patterns
- **Educational:** Great for blog posts and tutorials
- **Browser-Native:** No Haskell/SuperCollider setup needed

## Tech Stack

- **@strudel/core** - Pattern engine
- **@strudel/webaudio** - Web Audio output
- **@strudel/codemirror** - Code editor with syntax highlighting
- **@strudel/embed** - Embedded player widget

## Implementation

### Phase 1: Extend Strapi Composition Model (0.5 day)

```typescript
// Extended Composition Content Type
interface Composition {
  // ... existing fields

  // TidalCycles/Strudel specific
  strudelPattern?: string;        // The TidalCycles code
  isLiveCoded: boolean;            // Was this live coded?
  patternComplexity: 'beginner' | 'intermediate' | 'advanced';
  allowRemix: boolean;             // Can visitors modify?
  strudelVersion: string;          // Version compatibility
  patternDescription?: string;     // Explain the pattern
  patternTags: string[];           // ['percussion', 'polyrhythm', 'ambient']
}
```

### Phase 2: StrudelPlayer Component (4-5 days)

```tsx
// components/music/StrudelPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import { evaluate } from '@strudel/core';
import { getAudioContext, webaudioOutput } from '@strudel/webaudio';
import { StrudelMirror } from '@strudel/codemirror';
import { Play, Pause, RotateCcw } from '@mynaui/icons-react';

interface StrudelPlayerProps {
  pattern: string;
  editable?: boolean;
  autoplay?: boolean;
  showControls?: boolean;
}

export function StrudelPlayer({
  pattern,
  editable = false,
  autoplay = false,
  showControls = true,
}: StrudelPlayerProps) {
  const [code, setCode] = useState(pattern);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const playPattern = async () => {
    try {
      setError(null);
      const ctx = getAudioContext();

      const { pattern: parsedPattern } = await evaluate(code);
      const { stop } = parsedPattern.pipe(webaudioOutput).start();

      stopRef.current = stop;
      setIsPlaying(true);
    } catch (err) {
      setError(err.message);
      console.error('Strudel evaluation error:', err);
    }
  };

  const stopPattern = () => {
    stopRef.current?.();
    setIsPlaying(false);
  };

  const resetPattern = () => {
    setCode(pattern);
    stopPattern();
  };

  useEffect(() => {
    if (autoplay) {
      playPattern();
    }

    return () => stopPattern();
  }, []);

  return (
    <div className="strudel-player border border-gray-700 rounded-lg overflow-hidden">
      {/* Code Editor */}
      <div className="bg-gray-900">
        {editable ? (
          <StrudelMirror
            value={code}
            onChange={setCode}
            theme="dark"
            height="200px"
          />
        ) : (
          <pre className="p-4 text-sm font-mono overflow-x-auto">
            <code>{code}</code>
          </pre>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between bg-gray-800 p-4">
          <div className="flex gap-2">
            <button
              onClick={isPlaying ? stopPattern : playPattern}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play Pattern
                </>
              )}
            </button>

            {editable && (
              <button
                onClick={resetPattern}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
          </div>

          {editable && (
            <span className="text-sm text-gray-400">
              Edit the pattern above and press Play!
            </span>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border-t border-red-800 p-4">
          <p className="text-sm text-red-400">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
```

### Phase 3: Pattern Library Page (2-3 days)

```tsx
// pages/patterns.astro or pages/music/patterns.astro
---
import { strapiClient } from '@/lib/strapi';
import PatternLibrary from '@/components/music/PatternLibrary';

const patterns = await strapiClient.getCompositions({
  filters: { isLiveCoded: true },
});
---

<Layout title="Live Coding Patterns">
  <PatternLibrary patterns={patterns} client:load />
</Layout>
```

```tsx
// components/music/PatternLibrary.tsx
import { StrudelPlayer } from './StrudelPlayer';
import { useState } from 'react';

export function PatternLibrary({ patterns }: { patterns: Composition[] }) {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredPatterns = patterns.filter(
    p => filter === 'all' || p.patternComplexity === filter
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Live Coding Patterns</h1>
      <p className="text-gray-400 mb-8">
        Interactive TidalCycles patterns powered by Strudel.cc. Try editing and remixing!
      </p>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level as any)}
            className={`px-4 py-2 rounded-lg ${
              filter === level ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Pattern Grid */}
      <div className="space-y-8">
        {filteredPatterns.map((pattern) => (
          <div key={pattern.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{pattern.title}</h2>
                <p className="text-gray-400 mt-2">{pattern.patternDescription}</p>

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                  {pattern.patternTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs ${
                pattern.patternComplexity === 'beginner' ? 'bg-green-900/30 text-green-300' :
                pattern.patternComplexity === 'intermediate' ? 'bg-yellow-900/30 text-yellow-300' :
                'bg-red-900/30 text-red-300'
              }`}>
                {pattern.patternComplexity}
              </span>
            </div>

            <StrudelPlayer
              pattern={pattern.strudelPattern!}
              editable={pattern.allowRemix}
              showControls
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Phase 4: Blog Integration (2-3 days)

**Use Strudel in Blog Posts:**

```mdx
---
title: "Understanding Polyrhythms with Strudel"
tags: ['music', 'live-coding', 'tutorial']
---

# Understanding Polyrhythms with Strudel

Polyrhythms are fascinating! Let's explore with some live code:

<StrudelPlayer
  pattern={`stack(
    sound("bd bd bd bd"),
    sound("hh hh hh hh hh hh")
  )`}
  editable
/>

Try changing the number of beats in each layer!

## More Complex Example

<StrudelPlayer
  pattern={`stack(
    sound("bd*4"),
    sound("hh*6"),
    sound("sn*5")
  ).fast(2)`}
  editable
/>
```

### Phase 5: Atmospheric Integration (1-2 days)

**Sync Strudel Patterns with Portfolio Atmospheric Layers:**

```tsx
// Trigger atmospheric transitions based on musical patterns
import { usePortfolio } from '@/contexts/PortfolioContext';

export function AtmosphericStrudelPlayer({ pattern }: Props) {
  const { setAtmosphericLayer } = usePortfolio();

  useEffect(() => {
    // Parse pattern for mood
    const mood = analyzePatternMood(pattern);

    // Update atmospheric layer based on mood
    if (mood === 'dark') {
      setAtmosphericLayer('thermosphere');
    } else if (mood === 'energetic') {
      setAtmosphericLayer('stratosphere');
    }
  }, [pattern]);

  return <StrudelPlayer pattern={pattern} />;
}
```

## Example Patterns to Include

### Beginner: Simple Drum Pattern
```javascript
sound("bd sd hh sd")
```

### Intermediate: Polyrhythm
```javascript
stack(
  sound("bd*4"),
  sound("hh*6"),
  sound("sn*5")
).fast(2)
```

### Advanced: Generative Melody
```javascript
note(
  run(8).slow(4)
    .add(60)
    .scale('C:minor')
).sound('sawtooth')
  .lpf(sine.range(200, 2000).slow(8))
  .room(0.5)
```

## Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Extend Strapi Model | 0.5 day |
| 2 | StrudelPlayer Component | 4-5 days |
| 3 | Pattern Library Page | 2-3 days |
| 4 | Blog Integration | 2-3 days |
| 5 | Atmospheric Integration | 1-2 days |

**Total:** 9-13 days

## Benefits

- **Unique Portfolio Feature:** Stand out from typical portfolios
- **Interactive Learning:** Educational for visitors
- **Showcase Skills:** Live coding, music theory, creative coding
- **Content Creation:** Blog posts, tutorials, pattern library
- **Community Engagement:** Share patterns, accept remixes

## Next Steps

1. Install Strudel packages
2. Extend Compositions content type in Strapi
3. Build StrudelPlayer component
4. Create pattern library page
5. Write blog posts with interactive patterns
6. Integrate with atmospheric layers (optional)

---

**Related Documentation:**
- [ROADMAP.md - Full Strudel Integration](../../ROADMAP.md#3161-strudelcc-live-coding-integration-)
- [Music Player](./music-player.md)
- [Machine Learning](./machine-learning.md) - For AI pattern generation
