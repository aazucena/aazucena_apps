# Music Player & Compositions Showcase

📍 **Full Documentation:** [ROADMAP.md Section 3.16](../../ROADMAP.md#316-music-player--compositions-showcase-)

## Overview

Showcase your music compositions with a persistent background music player and dedicated `/music` page.

**Estimated Effort:** 4-6 days

## Features

### 1. Background Persistent Music Player
- Plays throughout entire portfolio (persists across page navigation)
- Toggleable via existing toolbar audio button
- Uses Astro View Transitions for persistence
- Minimal UI (doesn't obstruct content)

### 2. Dedicated `/music` Page
- Full music showcase page
- Grid/list view of all compositions
- Waveform visualization
- Play, pause, skip controls
- Playlist queue management
- Track metadata display

### 3. Integration with Existing UI
- Links to toolbar audio button
- Mini player widget (bottom-left corner)
- Track change notifications (toast)
- Progress bar

## Tech Stack

- **Howler.js** - Audio playback engine, playlist management
- **wavesurfer.js** - Waveform visualization
- **Astro View Transitions** - Persistent player across pages
- **Strapi** - Compositions content type (CMS)
- **Cloudinary** - Audio file storage

## Implementation

### Phase 1: Strapi Content Type (1 day)

```typescript
// Compositions Content Type
interface Composition {
  title: string;
  slug: string;
  artist: string; // Default: your name
  genre: string[];
  duration: number; // seconds
  compositionDate: Date;
  description: string; // Rich text
  albumArt: Media; // Cloudinary
  audioFile: Media; // Cloudinary MP3/WAV
  waveformData: JSON; // Pre-generated waveform
  lyrics?: string; // Rich text, optional
  featured: boolean;
  order: number;
  downloadEnabled: boolean;
  metadata: {
    bpm?: number;
    key?: string;
    instruments: string[];
    software: string[]; // DAW used
  };
  playCount: number; // Auto-increment
  publishedAt: Date;
}
```

### Phase 2: Music Player Service (1.5 days)

```typescript
// services/musicPlayer.ts
import { Howl, Howler } from 'howler';

class MusicPlayerService {
  private playlist: Composition[] = [];
  private currentIndex = 0;
  private howl: Howl | null = null;
  private listeners: Set<() => void> = new Set();

  async loadPlaylist(compositions: Composition[]) {
    this.playlist = compositions.sort((a, b) => a.order - b.order);
    this.loadTrack(0);
  }

  loadTrack(index: number) {
    if (this.howl) {
      this.howl.unload();
    }

    const track = this.playlist[index];
    this.howl = new Howl({
      src: [track.audioFile.url],
      html5: true,
      onend: () => this.next(),
      onplay: () => this.notifyListeners(),
      onpause: () => this.notifyListeners(),
    });

    this.currentIndex = index;
  }

  play() { this.howl?.play(); }
  pause() { this.howl?.pause(); }
  next() { /* ... */ }
  previous() { /* ... */ }
  seek(time: number) { /* ... */ }

  getCurrentTrack() { return this.playlist[this.currentIndex]; }
  subscribe(callback: () => void) { /* ... */ }
}

export const musicPlayer = new MusicPlayerService();
```

### Phase 3: Mini Player Widget (1 day)

```tsx
// components/MiniPlayer.tsx
import { useEffect, useState } from 'react';
import { musicPlayer } from '@/services/musicPlayer';
import { Play, Pause, SkipForward, SkipBack } from '@mynaui/icons-react';

export function MiniPlayer() {
  const [track, setTrack] = useState(musicPlayer.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = musicPlayer.subscribe(() => {
      setTrack(musicPlayer.getCurrentTrack());
      setIsPlaying(musicPlayer.isPlaying());
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 z-50">
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <img
          src={track.albumArt.url}
          alt={track.title}
          className="w-12 h-12 rounded"
        />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{track.title}</p>
          <p className="text-xs text-gray-400 truncate">{track.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={() => musicPlayer.previous()}>
            <SkipBack className="w-5 h-5" />
          </button>
          <button onClick={() => isPlaying ? musicPlayer.pause() : musicPlayer.play()}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={() => musicPlayer.next()}>
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Phase 4: `/music` Page (1.5 days)

```astro
---
// pages/music.astro
import { strapiClient } from '@/lib/strapi';
import MusicPage from '@/components/music/MusicPage';

const compositions = await strapiClient.getCompositions();
---

<Layout title="Music">
  <MusicPage compositions={compositions} client:load />
</Layout>
```

```tsx
// components/music/MusicPage.tsx
import WaveSurfer from 'wavesurfer.js';
import { CompositionCard } from './CompositionCard';
import { MusicPlayer } from './MusicPlayer';

export function MusicPage({ compositions }: MusicPageProps) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">My Compositions</h1>

      {/* Featured Track */}
      <FeaturedTrack track={compositions.find(c => c.featured)} />

      {/* Compositions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {compositions.map((composition) => (
          <CompositionCard
            key={composition.id}
            composition={composition}
            onPlay={() => musicPlayer.loadAndPlay(composition)}
          />
        ))}
      </div>

      {/* Full Player (when expanded) */}
      <MusicPlayer />
    </div>
  );
}
```

### Phase 5: Waveform Visualization (0.5-1 day)

```tsx
// components/music/Waveform.tsx
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

export function Waveform({ audioUrl }: { audioUrl: string }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4a5568',
        progressColor: '#3b82f6',
        height: 80,
        responsive: true,
      });

      wavesurfer.current.load(audioUrl);
    }

    return () => wavesurfer.current?.destroy();
  }, [audioUrl]);

  return <div ref={waveformRef} className="w-full" />;
}
```

## Integration with Toolbar Audio Button

```tsx
// components/Toolbar.tsx - Update audio button
<button
  onClick={() => {
    const isPlaying = musicPlayer.togglePlayPause();
    setIsSoundMuted(!isPlaying);
  }}
  className="toolbar-button"
>
  {isSoundMuted ? <VolumeOff /> : <VolumeOn />}
</button>
```

## Strapi Webhook (Auto-generate Waveform)

```javascript
// apps/cms/src/api/composition/lifecycles.js
module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Generate waveform data
    const waveformData = await generateWaveform(result.audioFile.url);

    // Update composition
    await strapi.entityService.update('api::composition.composition', result.id, {
      data: { waveformData },
    });
  },
};
```

## Timeline

| Task | Duration |
|------|----------|
| Strapi Content Type | 1 day |
| Music Player Service | 1.5 days |
| Mini Player Widget | 1 day |
| `/music` Page | 1.5 days |
| Waveform Visualization | 0.5-1 day |

**Total:** 4-6 days

## Next Steps

1. Create Compositions content type in Strapi
2. Upload sample compositions to Cloudinary
3. Implement music player service with Howler.js
4. Build mini player widget
5. Create `/music` page with waveform visualization
6. Integrate with toolbar audio button
7. Test persistence across page navigation

## Related Features

- [Strudel.cc Integration](./strudel-integration.md) - Live coding patterns
- [Payment Integration](./payments.md) - Music downloads with Stripe/Ko-fi

---

**Related Documentation:**
- [ROADMAP.md - Full Music Player Implementation](../../ROADMAP.md#316-music-player--compositions-showcase-)
- [Strudel.cc Live Coding Integration](./strudel-integration.md)
