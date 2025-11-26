# Reusable Components

**[← Back to Requirements](./01-requirements-summary.md)** | **[Next: Single Types →](./03-single-types.md)**

---

## Overview

Create these reusable components **BEFORE** creating any content types. Content types will reference these components.

**Creation Location:** `Content-Type Builder > Create new component`

### Currently Implemented Components

The following components have been created in the CMS:

| Component | Category | Status | Description |
|-----------|----------|--------|-------------|
| `shared.seo` | `shared` | ✅ Configured | SEO metadata with nested Open Graph |
| `shared.open-graph` | `shared` | ✅ Configured | Open Graph meta tags (used by SEO) |
| `shared.social-links` | `shared` | ⚠️ Shell only | Fields need to be added |
| `media.audio-metadata` | `media` | ✅ Configured | Music track metadata with enharmonic keys |

### Planned Components

The following components are documented for future implementation:

- `ui.cta-button` - Call-to-action buttons
- `content.stat` - Statistics display
- `content.achievement` - Achievement tracking

---

## Implemented: SEO Component (shared.seo)

**Location:** `src/components/shared/seo.json`

**Component Name:** `seo`
**Display Name:** `seo`
**Icon:** `search`
**Category:** `shared`

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `metaTitle` | String | **Max length:** 60, **Required:** true |
| `metaDescription` | String | **Max length:** 160, **Min length:** 50, **Required:** true |
| `metaImage` | Media (Single image) | **Allowed types:** Images only |
| `openGraph` | Component | References `shared.open-graph` |
| `keywords` | Text | **Regex:** `[^,]+` |
| `metaRobots` | String | **Regex:** `[^,]+` |
| `metaViewport` | String | Viewport settings |
| `canonicalURL` | String | Canonical URL |
| `structuredData` | JSON | Structured data (JSON-LD) |
| `twitterCard` | Enumeration | **Values:** `summary`, `summary_large_image`, `app`, `player` - **Default:** `summary_large_image` |

### Usage
- Any content type requiring SEO metadata
- Blog Posts, Projects, Pages

---

## Implemented: Open Graph Component (shared.open-graph)

**Location:** `src/components/shared/open-graph.json`

**Component Name:** `open-graph`
**Display Name:** `openGraph`
**Icon:** `project-diagram`
**Category:** `shared`

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `ogTitle` | String | **Max length:** 70, **Required:** true |
| `ogDescription` | String | **Max length:** 200, **Required:** true |
| `ogImage` | Media (Single image) | **Allowed types:** Images only |
| `ogUrl` | String | Page URL |
| `ogType` | String | Content type (e.g., "website", "article") |

### Usage
- Nested within `shared.seo` component
- Controls social media preview cards

---

## Component 2: Social Links

**Location:** `Content-Type Builder > Create new component > shared`

**Component Name:** `social-links`
**Display Name:** `Social Links`
**Icon:** `link`
**Category:** `shared`

**Status:** Component created (commit `1593f31`). Fields need to be added via Content-Type Builder.

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `github` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://github\.com/.*` |
| `linkedin` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?linkedin\.com/.*` |
| `twitter` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?(twitter\.com\|x\.com)/.*` |
| `email` | Email | **Required:** false |
| `youtube` | Text (Short text) | **Max length:** 255, **Required:** false, **Regex:** `^https?://(www\.)?youtube\.com/.*` |

**Click "Finish" then "Save"**

### Usage
- About (personal social links)

### Best Practices
- Regex validation ensures only valid URLs are accepted
- Twitter field supports both twitter.com and x.com
- Email field uses built-in email validation

---

## Implemented: Audio Metadata Component (media.audio-metadata)

**Location:** `src/components/media/audio-metadata.json`

**Component Name:** `audio-metadata`
**Display Name:** `Audio Metadata`
**Icon:** `music`
**Category:** `media`

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `bpm` | Number (Integer) | **Min:** 20, **Max:** 300, **Required:** false |
| `timeSignature` | Text (Short text) | **Max length:** 10, **Required:** false, **Default:** `4/4`, **Regex:** `^[1-9]\d{0,1}/(?:2|4|8|16|32)$` |
| `musicalKey` | Enumeration | **Values:** `C`, `C#/D♭`, `D`, `D#/E♭`, `E`, `F`, `F#/G♭`, `G`, `G#/A♭`, `A`, `A#/B♭`, `B` |
| `scale` | Enumeration | **Values:** `major`, `minor`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `aeolian`, `locrian`, `pentatonic_major`, `pentatonic_minor`, `blues`, `harmonic_minor`, `melodic_minor` |
| `instrumental` | Boolean | **Default:** true |
| `duration` | Number (Integer) | **Min:** 1, **Required:** true |
| `waveformData` | JSON | **Required:** false |

### Usage
- Compositions (music track metadata)

### Best Practices
- `bpm` range 20-300 covers most music - **tempo marking is calculated from BPM in the frontend** (no separate field)
- `timeSignature` defines rhythmic structure - regex validates format (numerator: 1-99, denominator: 2, 4, 8, 16, or 32)
  - Valid: `4/4`, `7/8`, `13/16`, `5/4`, `17/8`
  - Invalid: `4/3`, `0/4`, `4/7`, `100/4`
  - Default value: `4/4` (most common time signature in music)
- `musicalKey` uses enharmonic notation (e.g., `C#/D♭`) for musical accuracy
  - Allows filtering by key regardless of notation preference
  - Frontend can display either sharp or flat based on context
- `scale` is the mode/scale type (major, minor, dorian, etc.) - allows filtering by scale
- Combine `musicalKey` + `scale` for display: "G Mixolydian", "C Major", "A Minor"
- `instrumental` defaults to `true` (assumes most tracks are instrumental unless specified)
  - Enables filtering vocal vs instrumental tracks
- `waveformData` stores pre-computed waveform for visualization (generated by wavesurfer.js)
- `duration` is required for music player functionality

### Design Decision: BPM Only (No Tempo Marking Field)

**Tempo marking is NOT stored** - it's calculated from BPM in the frontend/API.

**Rationale:**
- ✅ **Single source of truth** - BPM is objective, tempo marking is derived
- ✅ **No data integrity issues** - Can't have BPM/tempo mismatches
- ✅ **Simpler data model** - One less field to maintain
- ✅ **Frontend flexibility** - Adjust tempo ranges without DB migration

See "Tempo Marking Reference" below for the calculation logic.

### Note on Genres
**Genres are NOT included in this component.** Instead, genres should be handled as a **many-to-many relation** in the Compositions collection type, linking to the Music Genres collection. This allows:
- Multi-genre support (a track can have multiple genres)
- Data consistency (no typos, standardized genre names)
- Easy filtering and analytics
- Genre metadata (descriptions, colors, icons)

### Example Frontend Display

```tsx
// Utility function to calculate tempo marking from BPM
function getTempoMarking(bpm: number): string | null {
  if (!bpm) return null;
  if (bpm < 20) return 'larghissimo';
  if (bpm <= 40) return 'grave';
  if (bpm <= 60) return 'largo';
  if (bpm <= 66) return 'larghetto';
  if (bpm <= 76) return 'adagio';
  if (bpm <= 108) return 'andante';
  if (bpm <= 120) return 'moderato';
  if (bpm <= 156) return 'allegro';
  if (bpm <= 176) return 'vivace';
  if (bpm <= 200) return 'presto';
  return 'prestissimo';
}

// Combine key and scale for display
const keySignature = `${track.musicalKey} ${track.scale}`;
// Output: "G mixolydian" or "A minor"

// Display tempo with calculated marking
const tempoMarking = getTempoMarking(track.bpm);
const tempo = track.bpm
  ? `${track.bpm} BPM${tempoMarking ? ` (${tempoMarking})` : ''}`
  : null;
// Output: "120 BPM (allegro)"

// Complete track description
const trackInfo = {
  key: `${track.musicalKey} ${track.scale}`, // "G mixolydian"
  time: track.timeSignature, // "7/8"
  tempo: tempo, // "120 BPM (allegro)"
  type: track.instrumental ? "Instrumental" : "Vocal",
  duration: formatDuration(track.duration) // "4:20"
};
```

### Tempo Marking Reference (For Frontend Calculation)

Use this guide to calculate tempo marking from BPM in your frontend/API:

| Tempo Marking | BPM Range | Description |
|---------------|-----------|-------------|
| `larghissimo` | <20 | Extremely slow |
| `grave` | 20-40 | Very slow, solemn |
| `largo` | 40-60 | Slow and broad |
| `lento` | 45-60 | Slow |
| `larghetto` | 60-66 | Rather slow |
| `adagio` | 66-76 | Slow and stately |
| `adagietto` | 72-76 | Slightly faster than adagio |
| `andante` | 76-108 | Walking pace |
| `andantino` | 80-108 | Slightly faster than andante |
| `marcia_moderato` | 83-85 | Moderate march tempo |
| `moderato` | 108-120 | Moderate |
| `allegretto` | 112-120 | Moderately fast |
| `allegro` | 120-156 | Fast, lively |
| `vivace` | 156-176 | Lively and fast |
| `presto` | 168-200 | Very fast |
| `prestissimo` | >200 | Extremely fast |

### Waveform Data Format
```json
{
  "waveformData": [0.1, 0.5, 0.8, 0.4, ...]
}
```

### Future Enhancements (Optional Fields)

The following fields can be added later when needed. Strapi supports adding fields to existing components safely.

#### Tier 2: Recording Context (Add when relevant)

| Field Name | Type | Settings | When to Add |
|------------|------|----------|-------------|
| `isLiveRecording` | Boolean | **Default:** false | When you start releasing live recordings |
| `recordingDate` | Date | **Type:** Date only, **Required:** false | When historical context matters (e.g., vault tracks) |

**Benefits:**
- Distinguish studio vs live performances
- Show recording history ("Recorded 2018, Released 2023")
- Filter "live recordings" separately

#### Tier 3: Professional/Technical (Add only if needed)

| Field Name | Type | Settings | When to Add |
|------------|------|----------|-------------|
| `ISRC` | Text (Short text) | **Max length:** 15, **Regex:** `^[A-Z]{2}-?[A-Z0-9]{3}-?\d{2}-?\d{5}$`, **Required:** false | When distributing commercially (Spotify, Apple Music) |
| `sampleRate` | Enumeration | **Values:** `44100`, `48000`, `88200`, `96000`, `192000` | When showcasing technical quality to audiophile clients |
| `bitDepth` | Enumeration | **Values:** `16`, `24`, `32` | When showcasing technical quality to audiophile clients |

**Benefits:**
- `ISRC` - Essential for royalty tracking and commercial distribution
- `sampleRate` / `bitDepth` - Professional audio quality indicators

**Note:** These fields are documented for future reference. Add them when you have actual content that requires them, not "just in case."

---

## Component 4: CTA Button

**Location:** `Content-Type Builder > Create new component > ui`

**Component Name:** `cta-button`
**Display Name:** `CTA Button`
**Icon:** `cursor`
**Category:** `ui`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | Text (Short text) | **Max length:** 50, **Required:** true, **Placeholder:** "e.g., Get Started" |
| `url` | Text (Short text) | **Max length:** 255, **Required:** true, **Regex:** `^(https?://.*\|/.*\|#.*)` |
| `variant` | Enumeration | **Values:** `primary`, `secondary`, `outline`, `ghost` - **Default:** `primary` |
| `size` | Enumeration | **Values:** `sm`, `md`, `lg` - **Default:** `md` |
| `openInNewTab` | Boolean | **Default:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |

**Click "Finish" then "Save"**

### Usage
- Hero (primary and secondary CTAs)

### Best Practices
- `url` regex allows:
  - External URLs: `https://example.com`
  - Internal paths: `/about`
  - Anchor links: `#contact`
- `variant` matches ShadCN UI button variants
- `icon` uses icon names from @mynaui/icons-react package

### Example Frontend Usage
```tsx
import { ArrowRight } from '@mynaui/icons-react';

<Button variant={cta.variant} size={cta.size}>
  {cta.label}
  {cta.icon && <ArrowRight />}
</Button>
```

---

## Component 5: Stats

**Location:** `Content-Type Builder > Create new component > content`

**Component Name:** `stat`
**Display Name:** `Stats`
**Icon:** `chart-bar`
**Category:** `content`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | Text (Short text) | **Max length:** 50, **Required:** true, **Placeholder:** "e.g., Years of Experience" |
| `value` | Text (Short text) | **Max length:** 20, **Required:** true, **Placeholder:** "e.g., 10+" |
| `description` | Text (Short text) | **Max length:** 100, **Required:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `order` | Number (Integer) | **Min:** 0, **Required:** false, **Default:** 0 |

**Click "Finish" then "Save"**

### Usage
- About (personal stats/achievements)
- Projects (project metrics - optional manual entry)

### Best Practices
- `value` is text (not number) to allow "10+", "1M+", "$500K" formatting
- `order` controls display sequence
- `description` provides additional context on hover

### Example Stats
- Label: "Years of Experience", Value: "10+", Description: "Building web applications"
- Label: "Projects Completed", Value: "50+", Description: "Across 5 industries"
- Label: "Client Satisfaction", Value: "99%", Description: "Based on 100+ reviews"

---

## Component 6: Achievement

**Location:** `Content-Type Builder > Create new component > content`

**Component Name:** `achievement`
**Display Name:** `Achievement`
**Icon:** `trophy`
**Category:** `content`

### Fields

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | **Max length:** 100, **Required:** true |
| `description` | Text (Long text) | **Max length:** 300, **Required:** false |
| `icon` | Text (Short text) | **Max length:** 50, **Required:** false, **Placeholder:** "Icon name from @mynaui/icons-react" |
| `badge` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `date` | Date | **Type:** Date only, **Required:** false |

**Click "Finish" then "Save"**

### Usage
- Experience (key achievements at a company)

### Best Practices
- Use either `icon` (simple) or `badge` (custom image), not both
- `date` records when achievement was earned
- `description` provides context and details

### Example Achievements
- Title: "Led team of 5 developers", Description: "Successfully delivered 10 projects on time", Date: "2023-06-01"
- Title: "Increased performance by 80%", Description: "Optimized database queries and caching"
- Title: "Mentor of the Year", Badge: "award-badge.png"

---

## Verification Checklist

After creating all 6 components:

- [ ] All components visible in `Components` section of Content-Type Builder
- [ ] Each component has correct icon and category
- [ ] All fields have appropriate validation (max length, regex, min/max)
- [ ] Required fields are marked correctly
- [ ] Default values set where appropriate

---

## Common Issues

### Issue: Component Not Appearing in Content Type Builder

**Solution:**
```bash
# Restart Strapi
docker compose restart strapi

# Clear Strapi cache
rm -rf .cache
pnpm strapi build --clean
```

---

### Issue: Cannot Use Component in Content Type

**Cause:** Component category doesn't match

**Solution:**
- Verify component category matches what you're trying to use
- Example: `ui.cta-button` requires category `ui`

---

## Next Steps

With all 6 components created:

1. ✅ **[Create Single Types](./03-single-types.md)** - Hero, About, Settings
2. ✅ **[Create Core Collection Types](./04-collection-types-core.md)** - Skills, Music Genres, Blog Series

---

## Related Documentation

- **[Requirements Summary](./01-requirements-summary.md)** - Why these components exist
- **[Single Types](./03-single-types.md)** - Content types that use these components
- **[Best Practices](./13-best-practices.md)** - Component design patterns

---

**Last Updated:** 2025-11-25

**[<- Back to Requirements](./01-requirements-summary.md)** | **[Next: Single Types ->](./03-single-types.md)**
