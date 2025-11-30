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
| `shared.social-links` | `shared` | ✅ Configured | Social media URLs (GitHub, LinkedIn, Twitter, YouTube, Email) |
| `media.audio-metadata` | `media` | ✅ Configured | Music track metadata with enharmonic keys |
| `ui.cta-button` | `ui` | ✅ Configured | CTA buttons with icon picker (@mynaui/icons integration) |
| `ui.image-element` | `ui` | ✅ Configured | Image with required alt text (enforces accessibility) |
| `content.stat` | `content` | ✅ Configured | Statistics display with icon support |
| `content.achievement` | `content` | ✅ Configured | Achievement tracking with icon picker and media badge support |
| `content.education` | `content` | ✅ Configured | Educational credentials with date fields and conditional logic |

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

## Implemented: Social Links Component (shared.social-links)

**Location:** `src/components/shared/social-links.json`

**Component Name:** `social-links`
**Display Name:** `Social Links`
**Icon:** `link`
**Category:** `shared`

**Status:** ✅ Fully Configured

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

## Implemented: CTA Button Component (ui.cta-button)

**Location:** `src/components/ui/cta-button.json`

**Component Name:** `cta-button`
**Display Name:** `CTA Button`
**Icon:** `cursor`
**Category:** `ui`

**Status:** ✅ Fully Configured

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | String | **Max length:** 50, **Required:** true |
| `url` | String | **Max length:** 255, **Required:** true, **Regex:** `^(https?://.*\|/.*\|#.*)` |
| `variant` | Enumeration | **Values:** `primary`, `secondary`, `outline`, `ghost` - **Default:** `primary` |
| `size` | Enumeration | **Values:** `sm`, `md`, `lg` - **Default:** `md` |
| `openInNewTab` | Boolean | **Default:** true |
| `icon` | Custom Field | **Type:** `plugin::icons-field.icon` - Integration with `strapi-plugin-icons-field` v1.1.5 |

### Usage
- Hero (primary and secondary CTAs)

### Icon Picker Integration

The CTA Button component uses `strapi-plugin-icons-field` v1.1.5 for icon selection:

**Plugin Configuration:**
```typescript
// config/plugins.ts
'icons-field': {
  enabled: true,
  config: {
    publicPath: 'icons'
  }
}
```

**Icon Source:** @mynaui/icons v0.3.9
- Icons are automatically copied to `public/icons/mynaui-regular/` via `icons.sh` script
- The script supports multiple categorized icon sources
- Categorization: `icons` folder renamed to `regular` when multiple sources exist

**Enhanced Icons Script Features:**
- Sanitizes folder names (removes "icons" keyword)
- Supports multiple icon categories per package
- Safe path traversal prevention
- Automated installation and file copying

### Best Practices
- **Label:** Keep button text concise (max 50 chars) - use action-oriented language (e.g., "Get Started", "Learn More", "Download")
- **URL:** Regex validation allows external URLs (`https://...`), internal paths (`/about`), and anchor links (`#contact`)
- **Variant:** Matches ShadCN UI button variants for consistent styling
  - `primary` - Main call-to-action (high contrast)
  - `secondary` - Secondary actions (medium emphasis)
  - `outline` - Tertiary actions (low emphasis with border)
  - `ghost` - Minimal emphasis (hover state only)
- **Size:** Choose appropriate size for context (`sm` for tight spaces, `md` for most uses, `lg` for hero sections)
- **openInNewTab:** Defaults to `true` for external links - set to `false` for internal navigation
- **Icon:** Visual selection from @mynaui/icons via `strapi-plugin-icons-field` - icons served from `public/icons/mynaui-regular/`

### Example Frontend Usage
```tsx
// Using the CTA Button component with all fields
import * as MynaIcons from '@mynaui/icons-react';
import { Button } from '@/components/ui/button';

interface CTAButton {
  label: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  openInNewTab: boolean;
  icon?: string;
}

function CTAButton({ cta }: { cta: CTAButton }) {
  const IconComponent = cta.icon ? MynaIcons[cta.icon as keyof typeof MynaIcons] : null;

  return (
    <Button
      variant={cta.variant}
      size={cta.size}
      asChild
    >
      <a
        href={cta.url}
        target={cta.openInNewTab ? '_blank' : '_self'}
        rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {cta.label}
        {IconComponent && <IconComponent className="ml-2 h-4 w-4" />}
      </a>
    </Button>
  );
}

// Example usage
<CTAButton cta={{
  label: "Get Started",
  url: "https://example.com",
  variant: "primary",
  size: "lg",
  openInNewTab: true,
  icon: "ArrowRight"
}} />
```

---

## Implemented: Stats Component (content.stat)

**Location:** `src/components/content/stats.json`

**Component Name:** `stat`
**Display Name:** `Stats`
**Icon:** `chartCircle`
**Category:** `content`

**Status:** ✅ Fully Configured

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `label` | String (Short text) | **Max length:** 50, **Required:** true |
| `value` | String (Short text) | **Max length:** 20, **Required:** true |
| `description` | Text (Long text) | **Max length:** 100, **Required:** false |
| `icon` | Custom Field | **Type:** `plugin::icons-field.icon` - Integration with `strapi-plugin-icons-field` v1.1.5 |
| `sort` | Number (Integer) | **Required:** false |

### Usage
- About (personal stats/achievements)
- Projects (project metrics - optional manual entry)

### Best Practices
- `value` is text (not number) to allow "10+", "1M+", "$500K" formatting
- `sort` controls display sequence (lower numbers appear first)
- `description` provides additional context on hover
- `icon` uses the same icon picker as CTA Button component - visual selection from @mynaui/icons via `strapi-plugin-icons-field`

### Example Stats
- Label: "Years of Experience", Value: "10+", Description: "Building web applications"
- Label: "Projects Completed", Value: "50+", Description: "Across 5 industries"
- Label: "Client Satisfaction", Value: "99%", Description: "Based on 100+ reviews"

### Example Frontend Usage
```tsx
// Using the Stats component with icon picker integration
import * as MynaIcons from '@mynaui/icons-react';

interface Stat {
  label: string;
  value: string;
  description?: string;
  icon?: string;
  sort?: number;
}

function StatCard({ stat }: { stat: Stat }) {
  const IconComponent = stat.icon ? MynaIcons[stat.icon as keyof typeof MynaIcons] : null;

  return (
    <div className="stat-card">
      {IconComponent && <IconComponent className="stat-icon" />}
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.label}</div>
      {stat.description && (
        <div className="stat-description" title={stat.description}>
          {stat.description}
        </div>
      )}
    </div>
  );
}

// Example usage with sorted stats
const stats = [
  { label: "Years of Experience", value: "10+", icon: "Calendar", sort: 1 },
  { label: "Projects Completed", value: "50+", icon: "Briefcase", sort: 2 },
  { label: "Client Satisfaction", value: "99%", icon: "ThumbsUp", sort: 3 }
].sort((a, b) => (a.sort || 0) - (b.sort || 0));

<div className="stats-grid">
  {stats.map((stat, index) => (
    <StatCard key={index} stat={stat} />
  ))}
</div>
```

---

## Implemented: Achievement Component (content.achievement)

**Location:** `src/components/content/achievement.json`

**Component Name:** `achievement`
**Display Name:** `Achievement`
**Icon:** `crown`
**Category:** `content`

**Status:** ✅ Fully Configured

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | String (Short text) | **Max length:** 100, **Required:** true |
| `description` | Text (Long text) | **Max length:** 300, **Required:** true |
| `icon` | Custom Field | **Type:** `plugin::icons-field.icon` - Integration with `strapi-plugin-icons-field` v1.1.5 |
| `badge` | Media (Single image) | **Required:** false, **Allowed types:** Images only |
| `date` | Date | **Type:** Date only, **Required:** false |

### Usage
- Experience section (key achievements at a company/role)
- About section (career milestones)
- Portfolio highlights (project achievements)

### Best Practices
- Use either `icon` (simple, from @mynaui/icons) or `badge` (custom image), not both
- `date` records when achievement was earned
- `description` provides context and impact details
- Icon picker allows visual selection from @mynaui/icons library

### Example Achievements
- Title: "Led team of 5 developers", Description: "Successfully delivered 10 projects on time", Icon: "Users", Date: "2023-06-01"
- Title: "Increased performance by 80%", Description: "Optimized database queries and caching", Icon: "Zap"
- Title: "Mentor of the Year", Description: "Recognized for exceptional mentorship", Badge: "award-badge.png", Date: "2024-03-15"

### Example Frontend Usage
```tsx
// Using the Achievement component with icon picker and media support
import * as MynaIcons from '@mynaui/icons-react';

interface Achievement {
  title: string;
  description: string;
  icon?: string;
  badge?: {
    url: string;
    alternativeText?: string;
  };
  date?: string;
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const IconComponent = achievement.icon
    ? MynaIcons[achievement.icon as keyof typeof MynaIcons]
    : null;

  return (
    <div className="achievement-card">
      <div className="achievement-icon">
        {achievement.badge ? (
          <img
            src={achievement.badge.url}
            alt={achievement.badge.alternativeText || achievement.title}
            className="badge-image"
          />
        ) : IconComponent ? (
          <IconComponent className="icon" />
        ) : null}
      </div>

      <div className="achievement-content">
        <h3 className="achievement-title">{achievement.title}</h3>
        <p className="achievement-description">{achievement.description}</p>
        {achievement.date && (
          <time className="achievement-date">
            {new Date(achievement.date).toLocaleDateString()}
          </time>
        )}
      </div>
    </div>
  );
}

// Example usage with multiple achievements
const achievements = [
  {
    title: "Led team of 5 developers",
    description: "Successfully delivered 10 projects on time",
    icon: "Users",
    date: "2023-06-01"
  },
  {
    title: "Increased performance by 80%",
    description: "Optimized database queries and caching",
    icon: "Zap",
    date: "2023-09-15"
  },
  {
    title: "Mentor of the Year",
    description: "Recognized for exceptional mentorship and guidance",
    badge: { url: "/uploads/award_badge.png", alternativeText: "Mentor Award" },
    date: "2024-03-15"
  }
];

<div className="achievements-grid">
  {achievements.map((achievement, index) => (
    <AchievementCard key={index} achievement={achievement} />
  ))}
</div>
```

---

## Implemented: Image Element Component (ui.image-element)

**Location:** `src/components/ui/image-element.json`

**Component Name:** `image-element`
**Display Name:** `Image Element`
**Icon:** `picture`
**Category:** `ui`

**Status:** ✅ Fully Configured

### Fields (Implemented)

| Field Name | Type | Settings |
|------------|------|----------|
| `src` | Media (Single image) | **Required:** true, **Allowed types:** Images only |
| `altText` | String (Short text) | **Max length:** 150, **Required:** true |

### Usage
- Portfolio (profile image with accessibility-enforced alt text)
- Any content type requiring images with guaranteed alt text
- Prevents "forgot alt text" accessibility bugs

### Best Practices
- **Alt Text Required:** Enforces WCAG accessibility standards by making alt text mandatory
- **Max 150 Characters:** Recommended length for screen readers
- **Reusable:** Can be used across Projects, Blog Posts, Testimonials, etc.
- **Component Pattern:** Encapsulates image + alt text together (no separate fields)

### Accessibility Benefits
- Eliminates possibility of images without alt text
- Enforces accessibility at the content model level
- Reduces manual review burden
- Ensures WCAG AA compliance

### Example Frontend Usage
```tsx
// Using the Image Element component
interface ImageElement {
  src: {
    url: string;
    width: number;
    height: number;
    alternativeText?: string; // Strapi's default, but altText field overrides
  };
  altText: string; // Always present (required field)
}

function ProfileImage({ image }: { image: ImageElement }) {
  return (
    <img
      src={image.src.url}
      alt={image.altText} // Use component's required altText
      width={image.src.width}
      height={image.src.height}
      loading="lazy"
    />
  );
}

// Example usage
<ProfileImage image={{
  src: {
    url: "/uploads/profile.jpg",
    width: 400,
    height: 400
  },
  altText: "Aldrin Azucena profile photo"
}} />
```

### Why Use This Instead of Direct Media Field?
- ✅ **Accessibility Guarantee:** Alt text cannot be forgotten
- ✅ **Consistency:** Same pattern across all content types
- ✅ **Type Safety:** Frontend TypeScript knows altText always exists
- ✅ **Content Quality:** Content editors must provide meaningful descriptions
- ✅ **Regression Prevention:** Can't accidentally remove alt text validation

---

## Implemented: Education Component (content.education)

**Location:** `src/components/content/education.json`

**Component Name:** `education`
**Display Name:** `Education`
**Icon:** `pencil`
**Category:** `content`

**Status:** ✅ Production-Ready (All Critical Issues FIXED)

### Fields (Implemented - Complete with All Fixes Applied)

| Field Name | Type | Settings | Status |
|------------|------|----------|--------|
| `type` | Enumeration | **Required:** true, **Values:** `diploma`, `bachelor`, `master`, `doctorates`, `certificate` | ✅ Original |
| `degree` | String (Short text) | **Max length:** 200, **Required:** true | ✅ Original |
| `field` | String (Short text) | **Max length:** 150, **Required:** true | ✅ Original |
| `institution` | String (Short text) | **Max length:** 200, **Required:** true | ✅ Original |
| `startDate` | Date | **Required:** true | ✅ Original |
| `graduationDate` | Date | **Required:** false, **Conditional:** Only visible when `current` is false | ✅ Original |
| `current` | Boolean | **Required:** true | ✅ Original |
| `location` | String (Short text) | **Max length:** 200, **Required:** false | ✅ FIXED (2025-11-29) |
| `gpa` | Number (Decimal) | **Min:** 0, **Max:** 5, **Required:** false | ✅ FIXED (2025-11-29) |
| `description` | Rich Text (Markdown) | **Max length:** 1000, **Required:** false | ✅ FIXED (2025-11-29) |
| `honors` | String (Short text) | **Max length:** 200, **Required:** false | ✅ FIXED (2025-11-29) |

**Field Count:** 11 fields total (7 original + 4 enhanced optional fields)

### Conditional Logic

The component implements smart conditional visibility:
- When `current` is `true` (in-progress education): `graduationDate` field is hidden
- When `current` is `false` (completed education): `graduationDate` field is visible

This prevents data entry errors and improves UX.

### Usage
- Portfolio (personal educational credentials)
- About section (academic background)
- Experience section (ongoing certifications)

### Best Practices
- **Multi-Record Support:** Designed for diploma + bachelor + master's/PhD pipeline
- **Date Precision:** Uses date type (YYYY-MM-DD) instead of year integers for exact graduation dates
- **Type Validation:** Enumeration ensures consistent education type values
- **Current Education:** Use `current: true` for ongoing programs (e.g., master's in progress)
- **Chronological Order:** Add records from oldest to newest for timeline display
- **Location Context:** Use `location` field for geographic context (e.g., "Lethbridge, AB, Canada")
- **Academic Performance:** Use `gpa` field to showcase academic achievement (scale: 0.0-5.0)
  - ✅ **Supports Weighted GPAs:** Range now 0-5 to accommodate weighted scales (4.0+ for honors courses)
  - Common ranges: Unweighted (0.0-4.0), Weighted (0.0-5.0), International variations
- **Additional Details:** Use `description` field for thesis topics, focus areas, or notable coursework
  - ✅ **Bounded Length:** Max 1000 characters (~150-200 words) prevents bloat while allowing rich context
- **Honors Recognition:** Use `honors` field to store actual honor names
  - ✅ **Stores Honor Names:** String field (max 200 chars) allows "Summa Cum Laude, Dean's List 2021-2023"
  - Examples: "Magna Cum Laude", "Dean's List", "President's Honor Roll", "Phi Beta Kappa"

### ✅ Critical Fixes Applied (2025-11-29)

All critical issues have been resolved. The component is now production-ready.

| Field | Issue | Fixed | Improvement |
|-------|-------|-------|-------------|
| `gpa` | ❌ Range 1.0-4.0 blocked weighted GPAs | ✅ Range 0-5 | **Now supports:** Unweighted (0.0-4.0), Weighted (4.0-5.0), International scales |
| `honors` | ❌ Boolean (lost information) | ✅ String (max 200) | **Now stores:** "Summa Cum Laude, Dean's List 2021-2023" instead of just true/false |
| `description` | ❌ Unbounded (bloat risk) | ✅ Max 1000 chars | **Now balanced:** ~150-200 words (enough context, prevents excessive content) |
| `location` | ✅ Already correct (max 200) | ✅ No change needed | Accommodates full institutional addresses |

**Before (Issues):**
- GPA: min 1, max 4 → ❌ Blocked valid weighted GPAs (4.2, 4.5)
- Honors: boolean → ❌ Lost honor names ("Summa Cum Laude" became just "true")
- Description: unbounded → ❌ Risk of bloated content

**After (Fixed):**
- GPA: min 0, max 5 → ✅ Supports all valid GPAs including weighted (4.0-5.0)
- Honors: string, max 200 → ✅ Stores actual honor names, not just true/false
- Description: max 1000 → ✅ Clear guidance, prevents bloat (~150-200 words)

### Example Data (Demonstrating All Fixes)

```json
{
  "education": [
    {
      "id": 1,
      "type": "diploma",
      "degree": "Diploma in Computer Science",
      "field": "Computer Science",
      "institution": "Your Institution Name",
      "location": "Calgary, AB, Canada",
      "startDate": "2019-09-01",
      "graduationDate": "2021-06-15",
      "current": false,
      "gpa": 3.5,
      "honors": null,
      "description": "<p>Focused on web development and database management. Completed capstone project on responsive web design.</p>"
    },
    {
      "id": 2,
      "type": "bachelor",
      "degree": "B.S. Computer Science",
      "field": "Computer Science",
      "institution": "University of Lethbridge",
      "location": "Lethbridge, AB, Canada",
      "startDate": "2021-09-01",
      "graduationDate": "2023-05-30",
      "current": false,
      "gpa": 3.85,
      "honors": "Summa Cum Laude, Dean's List 2021-2023",
      "description": "<p><strong>Thesis:</strong> Advanced Neural Networks for NLP</p><p><strong>Focus Areas:</strong> AI/ML, Deep Learning, NLP</p>"
    },
    {
      "id": 3,
      "type": "master",
      "degree": "M.S. Artificial Intelligence",
      "field": "Computer Science",
      "institution": "Stanford University",
      "location": "Stanford, CA, USA",
      "startDate": "2023-09-01",
      "current": true,
      "gpa": 4.2,
      "honors": "Graduate Fellowship Recipient",
      "description": "<p>Specializing in Large Language Models and RAG systems. Research on transformer architectures.</p>"
    }
  ]
}
```

**Data Quality Notes (All Fixes Demonstrated):**
- ✅ **GPA Range:** Supports weighted GPAs (4.2 in example 3) - range 0-5 accommodates all scales
- ✅ **Honors as String:** Stores actual honor names ("Summa Cum Laude, Dean's List 2021-2023") not booleans
- ✅ **Description Bounded:** All descriptions under 1000 chars (~150-200 words) - clear, concise context
- ✅ **Location Consistency:** Full geographic context for all institutions (city, state/province, country)
- ✅ **Required Fields:** All records include `type`, `degree`, `field`, `institution`, `startDate`, `current`
- ✅ **Conditional Logic:** `graduationDate` omitted for current education (id: 3) - field automatically hidden

### Example Frontend Usage
```tsx
// Using the Education component (with all fixed fields)
interface Education {
  type: 'diploma' | 'bachelor' | 'master' | 'doctorates' | 'certificate';
  degree: string;
  field: string;
  institution: string;
  startDate: string; // ISO date format
  graduationDate?: string; // Optional, only for completed education
  current: boolean;
  location?: string; // Optional - geographic context (max 200 chars)
  gpa?: number; // Optional - 0.0 to 5.0 scale (supports weighted GPAs)
  description?: string; // Optional - rich text (HTML, max 1000 chars)
  honors?: string; // Optional - honor names (e.g., "Summa Cum Laude, Dean's List")
}

function EducationTimeline({ education }: { education: Education[] }) {
  // Sort chronologically (oldest first)
  const sorted = [...education].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="education-timeline">
      {sorted.map((edu, index) => (
        <div key={index} className="education-item">
          <div className="education-header">
            <div className="education-type">{edu.type}</div>
            {edu.honors && (
              <span className="education-badge honors">{edu.honors}</span>
            )}
            {edu.current && (
              <span className="education-badge current">In Progress</span>
            )}
          </div>

          <h3 className="education-degree">{edu.degree}</h3>
          <p className="education-field">{edu.field}</p>
          <p className="education-institution">
            {edu.institution}
            {edu.location && <span className="education-location"> • {edu.location}</span>}
          </p>

          <time className="education-dates">
            {new Date(edu.startDate).getFullYear()} - {
              edu.current
                ? 'Present'
                : new Date(edu.graduationDate!).getFullYear()
            }
          </time>

          {edu.gpa && (
            <div className="education-gpa">
              GPA: {edu.gpa.toFixed(2)} / {edu.gpa > 4.0 ? '5.0 (weighted)' : '4.0'}
            </div>
          )}

          {edu.description && (
            <div
              className="education-description"
              dangerouslySetInnerHTML={{ __html: edu.description }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Example usage with all fixed fields
<EducationTimeline education={[
  {
    type: "bachelor",
    degree: "B.S. Computer Science",
    field: "Computer Science",
    institution: "University of Lethbridge",
    location: "Lethbridge, AB, Canada",
    startDate: "2021-09-01",
    graduationDate: "2023-05-30",
    current: false,
    gpa: 3.85,
    honors: "Summa Cum Laude, Dean's List 2021-2023",
    description: "<p><strong>Thesis:</strong> Advanced Neural Networks for NLP</p><p><strong>Focus Areas:</strong> AI/ML, Deep Learning, NLP</p>"
  },
  {
    type: "master",
    degree: "M.S. Artificial Intelligence",
    field: "Computer Science",
    institution: "Stanford University",
    location: "Stanford, CA, USA",
    startDate: "2023-09-01",
    current: true,
    gpa: 4.2,
    honors: "Graduate Fellowship Recipient",
    description: "<p>Specializing in Large Language Models and RAG systems. Research on transformer architectures.</p>"
  }
]} />
```

### Design Decisions

**Why Date Fields Instead of Year Integers?**
- ✅ **Precision:** Can display exact graduation dates (May 2023 vs just 2023)
- ✅ **Flexibility:** Frontend can format as needed (full date, month/year, or year only)
- ✅ **Sorting:** Easier to sort chronologically with full dates
- ✅ **Future-Proof:** Supports displaying semesters, quarters, or specific months

**Why Conditional `graduationDate` Field?**
- ✅ **Data Integrity:** Can't enter graduation date for current education
- ✅ **UX:** Cleaner form (no confusing fields when not applicable)
- ✅ **Validation:** Prevents logical errors at the schema level

**Why Separate `type` Field?**
- ✅ **Filtering:** Can filter by education level (e.g., "Show all bachelor's degrees")
- ✅ **Display:** Can show icons or badges based on type
- ✅ **Consistency:** Standardized values prevent typos

---

## Verification Checklist

After creating all components:

- [x] All components visible in `Components` section of Content-Type Builder (9/9 ✅ COMPLETE)
- [x] Each component has correct icon and category
- [x] All fields have appropriate validation (max length, regex, min/max)
- [x] Required fields are marked correctly
- [x] Default values set where appropriate
- [x] Conditional logic working (Education component: graduationDate visibility)

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

With all 9 components ✅ COMPLETE:

1. ✅ **[Create Single Types](./03-single-types.md)** - Portfolio, Website Configuration
2. ✅ **[Create Core Collection Types](./04-collection-types-core.md)** - Skills, Music Genres, Blog Series

---

## Related Documentation

- **[Requirements Summary](./01-requirements-summary.md)** - Why these components exist
- **[Single Types](./03-single-types.md)** - Content types that use these components
- **[Best Practices](./13-best-practices.md)** - Component design patterns

---

**Last Updated:** 2025-11-29

**Recent Changes:**
- ✅ **Education Component FIXED (2025-11-29)** - All critical issues resolved:
  - **GPA Range Fixed:** 0-5 (was 1-4) - now supports weighted GPAs (4.0-5.0)
  - **Honors Type Fixed:** String max 200 (was boolean) - now stores actual honor names
  - **Description Bounded:** Max 1000 chars (was unbounded) - prevents bloat, ~150-200 words
  - **Location Confirmed:** Max 200 (already correct) - accommodates full institutional addresses
- ✅ **Production-Ready Status** - Component now production-ready with all data integrity issues resolved
- ✅ **Field Count:** 11 fields total (7 original + 4 enhanced optional fields)
- ✅ **Example Data Updated** - Demonstrates all fixes: weighted GPA (4.2), honor names ("Summa Cum Laude"), bounded descriptions
- ✅ **Frontend Usage Updated** - TypeScript interface and examples reflect all fixes
- ✅ **Best Practices Expanded** - Comprehensive guidance with fix highlights (weighted GPA support, honor name storage, bounded descriptions)

**Component Count:** 9/9 ✅ COMPLETE
- 3 shared components (SEO, Open Graph, Social Links)
- 1 media component (Audio Metadata)
- 2 ui components (CTA Button, Image Element)
- 3 content components (Stats, Achievement, Education)

**[<- Back to Requirements](./01-requirements-summary.md)** | **[Next: Single Types ->](./03-single-types.md)**
