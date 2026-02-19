# 📖 ICON_CATALOG

**REFERENCE_DOCUMENTATION** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete reference for all **824 icons** in the @aazucena/icons package:

- **24 Custom Icons** (brand, social, tech stack)
- **800+ @mynaui Icons** (system icons library)

---

## 📋 TABLE_OF_CONTENTS

- [🎨 CUSTOM_ICONS](#-custom_icons)
- [📚 MYNAUI_ICONS_LIBRARY](#-mynaui_icons_library)
- [🔍 SEARCH_GUIDE](#-search_guide)
- [🎯 USAGE_EXAMPLES](#-usage_examples)
- [📝 NAMING_CONVENTIONS](#-naming_conventions)

---

## 🎨 CUSTOM_ICONS

All 24 custom icons built specifically for the AAZUCENA portfolio.

### Tech Stack Icons (4)

#### AstroIcon

**Description:** Astro framework official logo
**Use Case:** Footer tech stack, project technologies
**Colors:** Orange gradient (#FF5D01, #BC52EE)

```typescript
import { AstroIcon } from '@aazucena/icons';
<AstroIcon size={48} className="text-orange-500" />
```

---

#### ReactIcon

**Description:** React library official logo
**Use Case:** Footer tech stack, project technologies
**Colors:** React Blue (#61DAFB)

```typescript
import { ReactIcon } from '@aazucena/icons';
<ReactIcon size={48} className="text-blue-400" />
```

---

#### TailwindIcon

**Description:** Tailwind CSS official logo
**Use Case:** Footer tech stack, project technologies
**Colors:** Tailwind Cyan (#06B6D4)

```typescript
import { TailwindIcon } from '@aazucena/icons';
<TailwindIcon size={48} className="text-cyan-500" />
```

---

#### ViteIcon

**Description:** Vite build tool official logo
**Use Case:** Footer tech stack, project technologies
**Colors:** Vite Purple (#646CFF), Yellow (#FFCE1A)

```typescript
import { ViteIcon } from '@aazucena/icons';
<ViteIcon size={48} className="text-purple-500" />
```

---

### Social Media Icons (10)

#### GitHubIcon

**Description:** GitHub official logo (monochrome)
**Use Case:** Social links, profile connections
**Colors:** Inherits currentColor (works in light/dark mode)

```typescript
import { GitHubIcon } from '@aazucena/icons';
<GitHubIcon size={24} className="text-gray-800 dark:text-white" />
```

---

#### LinkedInIcon

**Description:** LinkedIn official logo
**Use Case:** Social links, professional network
**Colors:** LinkedIn Blue (#0A66C2)

```typescript
import { LinkedInIcon } from '@aazucena/icons';
<LinkedInIcon size={24} className="text-blue-600" />
```

---

#### TwitterIcon

**Description:** X/Twitter official logo (monochrome)
**Use Case:** Social links, profile connections
**Aliases:** `X` (both names work)
**Colors:** Inherits currentColor

```typescript
import { TwitterIcon } from '@aazucena/icons';
<TwitterIcon size={24} className="text-gray-800 dark:text-white" />
```

---

#### YoutubeIcon

**Description:** YouTube official logo
**Use Case:** Social links, video content
**Colors:** YouTube Red (#FF0000)

```typescript
import { YoutubeIcon } from '@aazucena/icons';
<YoutubeIcon size={24} className="text-red-600" />
```

---

#### InstagramIcon

**Description:** Instagram official logo
**Use Case:** Social links, visual content
**Colors:** Instagram Gradient (Purple to Orange)

```typescript
import { InstagramIcon } from '@aazucena/icons';
<InstagramIcon size={24} className="text-pink-600" />
```

---

#### FacebookIcon

**Description:** Facebook official logo
**Use Case:** Social links, community
**Colors:** Facebook Blue (#1877F2)

```typescript
import { FacebookIcon } from '@aazucena/icons';
<FacebookIcon size={24} className="text-blue-600" />
```

---

#### TiktokIcon

**Description:** TikTok official logo
**Use Case:** Social links, short-form video
**Colors:** TikTok Cyan/Magenta

```typescript
import { TiktokIcon } from '@aazucena/icons';
<TiktokIcon size={24} className="text-black dark:text-white" />
```

---

#### DiscordIcon

**Description:** Discord official logo
**Use Case:** Social links, community chat
**Colors:** Discord Purple (#5865F2)

```typescript
import { DiscordIcon } from '@aazucena/icons';
<DiscordIcon size={24} className="text-indigo-600" />
```

---

#### TwitchIcon

**Description:** Twitch official logo
**Use Case:** Social links, livestreaming
**Colors:** Twitch Purple (#9146FF)

```typescript
import { TwitchIcon } from '@aazucena/icons';
<TwitchIcon size={24} className="text-purple-600" />
```

---

#### MastodonIcon

**Description:** Mastodon official logo
**Use Case:** Social links, decentralized network
**Colors:** Mastodon Purple (#6364FF)

```typescript
import { MastodonIcon } from '@aazucena/icons';
<MastodonIcon size={24} className="text-purple-600" />
```

---

### Brand & UI Icons (10)

#### BrandIcon

**Description:** AAZUCENA brand logo (custom designed)
**Use Case:** Site header, branding
**Colors:** Brand colors (customizable)

```typescript
import { BrandIcon } from '@aazucena/icons';
<BrandIcon size={120} className="text-primary" />
```

---

#### RssIcon

**Description:** RSS feed icon (standard RSS symbol)
**Use Case:** Blog feed, subscription
**Colors:** RSS Orange (#FF6600)

```typescript
import { RssIcon } from '@aazucena/icons';
<RssIcon size={20} className="text-orange-500" />
```

---

#### EmailIcon

**Description:** Email envelope icon
**Use Case:** Contact links, communication
**Colors:** Inherits currentColor

```typescript
import { EmailIcon } from '@aazucena/icons';
<EmailIcon size={24} className="text-gray-700 dark:text-gray-300" />
```

---

#### ScrollDownIcon

**Description:** Animated scroll indicator (chevron down)
**Use Case:** Hero section, page scrolling cue
**Colors:** Inherits currentColor

```typescript
import { ScrollDownIcon } from '@aazucena/icons';
<ScrollDownIcon size={32} className="text-white animate-bounce" />
```

---

#### EmptyIcon

**Description:** Empty state placeholder (broken image)
**Use Case:** Missing data, placeholder
**Colors:** Gray tones

```typescript
import { EmptyIcon } from '@aazucena/icons';
<EmptyIcon size={48} className="text-gray-400" />
```

---

#### DownloadIcon

**Description:** Download arrow icon (alternative to @mynaui Download)
**Use Case:** File downloads, export actions
**Aliases:** `DownloadAlt` (registry maps both names)
**Colors:** Inherits currentColor

```typescript
import { DownloadIcon } from '@aazucena/icons';
<DownloadIcon size={20} className="text-primary" />
```

---

#### ImageIcon

**Description:** Image file type icon (photo/picture)
**Use Case:** Media galleries, file uploads
**Colors:** Inherits currentColor

```typescript
import { ImageIcon } from '@aazucena/icons';
<ImageIcon size={24} className="text-blue-500" />
```

---

#### VectorIcon

**Description:** Vector file type icon (SVG/design files)
**Use Case:** Design assets, vector graphics
**Colors:** Inherits currentColor

```typescript
import { VectorIcon } from '@aazucena/icons';
<VectorIcon size={24} className="text-purple-500" />
```

---

#### AwardBadgeIcon

**Description:** Award/achievement badge icon
**Use Case:** Awards section, achievements
**Colors:** Gold/yellow tones

```typescript
import { AwardBadgeIcon } from '@aazucena/icons';
<AwardBadgeIcon size={32} className="text-yellow-500" />
```

---

#### ViewportsIcon

**Description:** Responsive viewports icon (devices)
**Use Case:** Responsive design indicators
**Colors:** Inherits currentColor

```typescript
import { ViewportsIcon } from '@aazucena/icons';
<ViewportsIcon size={24} className="text-gray-700" />
```

---

## 📚 MYNAUI_ICONS_LIBRARY

### Overview

The @mynaui/icons-react library provides **800+ professionally designed icons** across multiple categories. All icons follow a consistent 24x24px grid with 2px stroke width.

**Key Features:**

- ✅ **Consistent Design Language** - Uniform stroke width, corner radius
- ✅ **Outline Style** - Clean, modern aesthetic
- ✅ **Highly Optimized** - Small file sizes, performant
- ✅ **Fully Tree-Shakeable** - Import only what you use
- ✅ **TypeScript Support** - Full type definitions

**Official Documentation:** [icons.mynaui.com](https://icons.mynaui.com/)

---

### Communication Icons (50+)

**Use Case:** Chat, messaging, email, notifications

#### Popular Icons:

```typescript
import {
  Chat, // Chat bubble
  ChatCircle, // Chat with circle background
  Message, // Email/message
  MessageCircle, // Message notification
  Send, // Send message (paper plane)
  Mail, // Email envelope
  Inbox, // Inbox tray
  Phone, // Phone call
  PhoneCall, // Phone ringing
  Bell, // Notification bell
  BellRing, // Active notification
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Chat size={20} className="text-blue-500" />
<Send size={24} className="text-primary" />
<Bell size={20} className="text-gray-600" />
```

---

### Development Icons (80+)

**Use Case:** Code, programming, version control, databases

#### Popular Icons:

```typescript
import {
  Code, // Code brackets <>
  Terminal, // Terminal/console
  BrandGithub, // GitHub logo
  GitBranch, // Git branch
  GitCommit, // Git commit
  GitMerge, // Git merge
  GitPullRequest, // Pull request
  Database, // Database cylinder
  Server, // Server rack
  Servers, // Multiple servers
  Cloud, // Cloud storage
  Container, // Docker container
  Package, // Package/npm
  Bug, // Bug/debugging
  Wrench, // Tools/settings
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Code size={24} className="text-green-500" />
<Terminal size={20} className="text-gray-800" />
<Database size={32} className="text-blue-600" />
```

---

### UI/UX Icons (100+)

**Use Case:** User interface, navigation, forms, buttons

#### Popular Icons:

```typescript
import {
  Layout, // Layout grid
  LayoutSidebar, // Sidebar layout
  Menu, // Hamburger menu
  X, // Close icon
  ChevronDown, // Chevron down
  ChevronUp, // Chevron up
  ChevronLeft, // Chevron left
  ChevronRight, // Chevron right
  ArrowLeft, // Arrow left
  ArrowRight, // Arrow right
  ArrowUp, // Arrow up
  ArrowDown, // Arrow down
  Plus, // Plus icon
  Minus, // Minus icon
  Search, // Search magnifier
  Filter, // Filter funnel
  Settings, // Settings gear
  CogFour, // Settings (4 cogs)
  Home, // Home icon
  Grid, // Grid view
  List, // List view
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Menu size={24} className="text-gray-800" />
<ChevronDown size={16} className="text-gray-600" />
<Search size={20} className="text-primary" />
```

---

### Media Icons (60+)

**Use Case:** Images, video, audio, camera

#### Popular Icons:

```typescript
import {
  Image, // Image/photo
  Images, // Multiple images
  Camera, // Camera
  Video, // Video camera
  Film, // Film strip
  Music, // Music note
  MusicNote, // Musical note
  Microphone, // Microphone
  Headphones, // Headphones
  Speaker, // Speaker
  VolumeHigh, // Volume high
  VolumeLow, // Volume low
  VolumeMute, // Volume muted
  Play, // Play button
  Pause, // Pause button
  Stop, // Stop button
  SkipForward, // Skip forward
  SkipBack, // Skip back
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Music size={24} className="text-purple-500" />
<Camera size={32} className="text-blue-500" />
<Play size={20} className="text-green-500" />
```

---

### Business Icons (70+)

**Use Case:** Finance, analytics, charts, documents

#### Popular Icons:

```typescript
import {
  Briefcase, // Briefcase
  ChartBar, // Bar chart
  ChartLine, // Line chart
  ChartPie, // Pie chart
  TrendingUp, // Trending up
  TrendingDown, // Trending down
  Calculator, // Calculator
  CreditCard, // Credit card
  Wallet, // Wallet
  Receipt, // Receipt
  ShoppingCart, // Shopping cart
  Tag, // Price tag
  FileText, // Document
  File, // File
  Folder, // Folder
  FolderOpen, // Open folder
  Document, // Document page
  Clipboard, // Clipboard
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Briefcase size={24} className="text-gray-700" />
<ChartBar size={32} className="text-blue-600" />
<TrendingUp size={20} className="text-green-500" />
```

---

### Social Icons (40+)

**Use Case:** Social media, sharing, engagement

#### Popular Icons:

```typescript
import {
  Share, // Share icon
  ShareAndroid, // Android share
  Heart, // Heart/like
  HeartFilled, // Filled heart
  Star, // Star
  StarFilled, // Filled star
  ThumbsUp, // Thumbs up
  ThumbsDown, // Thumbs down
  Users, // Multiple users
  User, // Single user
  UserCircle, // User with circle
  UserPlus, // Add user
  UserMinus, // Remove user
  UserCheck, // Verified user
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Share size={20} className="text-gray-600" />
<HeartFilled size={24} className="text-red-500" />
<StarFilled size={20} className="text-yellow-500" />
```

---

### System Icons (90+)

**Use Case:** System controls, settings, notifications, power

#### Popular Icons:

```typescript
import {
  CogFour, // Settings (4 cogs)
  Settings, // Settings gear
  Power, // Power button
  Refresh, // Refresh/reload
  Download, // Download
  Upload, // Upload
  Link, // Link/hyperlink
  LinkExternal, // External link
  Copy, // Copy
  Clipboard, // Clipboard
  Check, // Checkmark
  CheckCircle, // Check in circle
  XCircle, // X in circle
  AlertCircle, // Alert/warning
  AlertTriangle, // Warning triangle
  Info, // Info icon
  Help, // Help/question
  Trash, // Delete/trash
  Edit, // Edit/pencil
  Lock, // Lock/secure
  Unlock, // Unlock
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Settings size={24} className="text-gray-700" />
<Check size={20} className="text-green-500" />
<AlertTriangle size={24} className="text-yellow-500" />
```

---

### Files Icons (50+)

**Use Case:** File management, documents, archives

#### Popular Icons:

```typescript
import {
  File, // Generic file
  FileText, // Text document
  FilePlus, // Add file
  FileMinus, // Remove file
  FileCheck, // Approved file
  FileX, // Rejected file
  FileCode, // Code file
  FileImage, // Image file
  FileVideo, // Video file
  FileAudio, // Audio file
  FileZip, // Zip archive
  FilePdf, // PDF file
  Folder, // Folder
  FolderOpen, // Open folder
  FolderPlus, // Create folder
  Archive, // Archive
  CloudDownload, // Download from cloud
  CloudUpload, // Upload to cloud
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<FileText size={24} className="text-blue-500" />
<Folder size={32} className="text-yellow-500" />
<CloudDownload size={20} className="text-green-500" />
```

---

### Arrows Icons (60+)

**Use Case:** Navigation, directional indicators, flow

#### Popular Icons:

```typescript
import {
  ArrowLeft, // Arrow left
  ArrowRight, // Arrow right
  ArrowUp, // Arrow up
  ArrowDown, // Arrow down
  ArrowUpRight, // Diagonal up-right
  ArrowDownLeft, // Diagonal down-left
  ArrowBack, // Back arrow
  ArrowForward, // Forward arrow
  ChevronLeft, // Chevron left
  ChevronRight, // Chevron right
  ChevronUp, // Chevron up
  ChevronDown, // Chevron down
  ChevronsLeft, // Double chevron left
  ChevronsRight, // Double chevron right
  CornerDownLeft, // Corner down-left
  CornerDownRight, // Corner down-right
  Maximize, // Expand/maximize
  Minimize, // Collapse/minimize
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<ArrowRight size={20} className="text-primary" />
<ChevronDown size={16} className="text-gray-600" />
<Maximize size={24} className="text-gray-800" />
```

---

### Shapes Icons (40+)

**Use Case:** Design elements, geometric shapes

#### Popular Icons:

```typescript
import {
  Circle, // Circle outline
  CircleFilled, // Filled circle
  Square, // Square outline
  SquareFilled, // Filled square
  Triangle, // Triangle
  Hexagon, // Hexagon
  Pentagon, // Pentagon
  Octagon, // Octagon
  Star, // Star outline
  StarFilled, // Filled star
  Diamond, // Diamond shape
  Heart, // Heart outline
  HeartFilled, // Filled heart
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<CircleFilled size={16} className="text-green-500" />
<StarFilled size={24} className="text-yellow-500" />
<HeartFilled size={20} className="text-red-500" />
```

---

### Weather Icons (30+)

**Use Case:** Weather conditions, forecasts

#### Popular Icons:

```typescript
import {
  Sun, // Sunny
  Moon, // Moon
  Cloud, // Cloudy
  CloudRain, // Rainy
  CloudSnow, // Snowy
  CloudLightning, // Thunderstorm
  Wind, // Windy
  Droplet, // Water droplet
  Snowflake, // Snowflake
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Sun size={32} className="text-yellow-500" />
<CloudRain size={24} className="text-blue-500" />
<Snowflake size={20} className="text-cyan-400" />
```

---

### Time & Calendar Icons (25+)

**Use Case:** Dates, time, scheduling

#### Popular Icons:

```typescript
import {
  Calendar, // Calendar
  CalendarPlus, // Add event
  CalendarCheck, // Confirmed event
  Clock, // Clock
  ClockCircle, // Clock in circle
  Timer, // Timer
  Hourglass, // Hourglass
  Watch, // Wristwatch
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Calendar size={24} className="text-gray-700" />
<Clock size={20} className="text-blue-500" />
<Timer size={24} className="text-green-500" />
```

---

### Device Icons (35+)

**Use Case:** Devices, hardware, screens

#### Popular Icons:

```typescript
import {
  Monitor, // Desktop monitor
  Laptop, // Laptop
  Tablet, // Tablet
  Mobile, // Mobile phone
  DeviceMobile, // Mobile device
  Keyboard, // Keyboard
  Mouse, // Mouse
  Printer, // Printer
  Camera, // Camera
  Wifi, // WiFi signal
  Bluetooth, // Bluetooth
  Battery, // Battery
  BatteryCharging, // Charging battery
  Chip, // Microchip/CPU
} from '@aazucena/icons';
```

**Example Usage:**

```typescript
<Mobile size={24} className="text-gray-800" />
<Wifi size={20} className="text-green-500" />
<BatteryCharging size={24} className="text-blue-500" />
```

---

## 🔍 SEARCH_GUIDE

### Finding the Right Icon

#### Method 1: Browse Official Website

Visit [icons.mynaui.com](https://icons.mynaui.com/) to:

- ✅ Search by keyword
- ✅ Browse by category
- ✅ Preview icon designs
- ✅ Copy import statements

#### Method 2: TypeScript IntelliSense

```typescript
import {} from /* Type to see autocomplete */ '@aazucena/icons';
// IntelliSense will show all 824+ available icons
```

#### Method 3: Registry Lookup

```typescript
import { isValidIconName } from '@aazucena/icons';

// Check if icon exists
const exists = isValidIconName('Code'); // true
const missing = isValidIconName('NonExistent'); // false
```

---

### Search Tips

#### 1. Think in Categories

- Need a **social** icon? → Look in Social Icons section
- Need a **development** icon? → Look in Development Icons section
- Need a **UI** icon? → Look in UI/UX Icons section

#### 2. Use Synonyms

Many icons have multiple names:

- "Settings" = "CogFour", "Gear"
- "Delete" = "Trash", "Remove"
- "Edit" = "Pencil", "Write"

#### 3. Check Variants

Icons often have multiple variants:

- `User` vs `UserCircle` vs `UserPlus`
- `Heart` vs `HeartFilled`
- `Star` vs `StarFilled`
- `Arrow` vs `Chevron`

#### 4. Consider Context

Think about where the icon will be used:

- **Navigation:** Arrows, Chevrons, Menu
- **Actions:** Plus, Trash, Edit, Check
- **Status:** Check, X, Alert, Info
- **Media:** Play, Pause, Volume, Music

---

## 🎯 USAGE_EXAMPLES

### Example 1: Navigation Menu

```typescript
import { Home, Briefcase, FileText, User, Send } from '@aazucena/icons';

function Navigation() {
  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/projects', icon: Briefcase, label: 'Projects' },
    { href: '/blog', icon: FileText, label: 'Blog' },
    { href: '/about', icon: User, label: 'About' },
    { href: '/contact', icon: Send, label: 'Contact' },
  ];

  return (
    <nav className="flex gap-6">
      {links.map(({ href, icon: Icon, label }) => (
        <a key={href} href={href} className="flex items-center gap-2">
          <Icon size={20} className="text-gray-700" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
```

---

### Example 2: Status Indicators

```typescript
import { CheckCircle, XCircle, AlertCircle, Info } from '@aazucena/icons';

function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' | 'info' }) {
  const configs = {
    success: { Icon: CheckCircle, color: 'text-green-500', label: 'Success' },
    error: { Icon: XCircle, color: 'text-red-500', label: 'Error' },
    warning: { Icon: AlertCircle, color: 'text-yellow-500', label: 'Warning' },
    info: { Icon: Info, color: 'text-blue-500', label: 'Info' },
  };

  const { Icon, color, label } = configs[status];

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );
}
```

---

### Example 3: Media Player Controls

```typescript
import { Play, Pause, SkipBack, SkipForward, VolumeHigh } from '@aazucena/icons';

function MediaControls() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button aria-label="Previous track">
        <SkipBack size={24} className="text-gray-700" />
      </button>

      <button
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? 'Pause' : 'Play'}
        className="p-3 rounded-full bg-primary text-white"
      >
        {playing ? (
          <Pause size={24} />
        ) : (
          <Play size={24} />
        )}
      </button>

      <button aria-label="Next track">
        <SkipForward size={24} className="text-gray-700" />
      </button>

      <button aria-label="Volume">
        <VolumeHigh size={20} className="text-gray-600" />
      </button>
    </div>
  );
}
```

---

### Example 4: File Type Icons

```typescript
import { FileText, FileImage, FileVideo, FileCode, File } from '@aazucena/icons';

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();

  const iconMap: Record<string, React.ComponentType> = {
    txt: FileText,
    md: FileText,
    doc: FileText,
    docx: FileText,
    jpg: FileImage,
    jpeg: FileImage,
    png: FileImage,
    gif: FileImage,
    mp4: FileVideo,
    mov: FileVideo,
    avi: FileVideo,
    js: FileCode,
    ts: FileCode,
    tsx: FileCode,
    jsx: FileCode,
  };

  return iconMap[ext || ''] || File;
}

function FileList({ files }: { files: string[] }) {
  return (
    <ul>
      {files.map(filename => {
        const Icon = getFileIcon(filename);
        return (
          <li key={filename} className="flex items-center gap-2">
            <Icon size={20} className="text-gray-600" />
            <span>{filename}</span>
          </li>
        );
      })}
    </ul>
  );
}
```

---

## 📝 NAMING_CONVENTIONS

### Icon Name Patterns

#### 1. Base Names

Most icons have a simple, descriptive base name:

```typescript
(Code, Home, User, Heart, Star, Cloud, Lock, Settings);
```

#### 2. Variants with Suffixes

Common suffixes indicate variations:

- **Filled:** `HeartFilled`, `StarFilled`, `CircleFilled`
- **Circle:** `UserCircle`, `CheckCircle`, `XCircle`
- **Plus:** `FilePlus`, `UserPlus`, `CalendarPlus`
- **Minus:** `FileMinus`, `UserMinus`
- **Check:** `FileCheck`, `UserCheck`
- **X:** `FileX`

#### 3. Directional Icons

Direction is part of the name:

```typescript
(ArrowLeft, ArrowRight, ArrowUp, ArrowDown);
(ChevronLeft, ChevronRight, ChevronUp, ChevronDown);
(CornerUpLeft, CornerDownRight);
```

#### 4. Multi-Word Names

Use PascalCase:

```typescript
(ClockCircle, BrandGithub, CloudDownload, LayoutSidebar);
```

#### 5. Brand Icons

Prefixed with `Brand`:

```typescript
(BrandGithub, BrandTwitter, BrandFacebook);
```

---

### Registry Aliases

Some icons have alternative names in the registry:

```typescript
// registry.ts
const iconMap = {
  // Standard name
  Settings: Icons.CogFour,

  // Alias
  CogFour: Icons.CogFour,

  // Both work!
  X: TwitterIcon,
  Twitter: TwitterIcon,

  // Alternative names
  Download: Icons.Download,
  DownloadAlt: DownloadIcon, // Custom icon
};
```

---

## 📊 ICON_STATISTICS

### By Source

- **@mynaui/icons-react:** 800+ icons
- **Custom Icons:** 24 icons
- **Total:** 824+ icons

### By Category

- **UI/UX:** 100+ icons (12%)
- **System:** 90+ icons (11%)
- **Development:** 80+ icons (10%)
- **Business:** 70+ icons (8.5%)
- **Arrows:** 60+ icons (7%)
- **Media:** 60+ icons (7%)
- **Communication:** 50+ icons (6%)
- **Files:** 50+ icons (6%)
- **Social:** 40+ icons (5%)
- **Shapes:** 40+ icons (5%)
- **Device:** 35+ icons (4%)
- **Weather:** 30+ icons (3.5%)
- **Time & Calendar:** 25+ icons (3%)
- **Other:** 164+ icons (20%)

---

## 🔗 REFERENCES

### Official Resources

- **@mynaui/icons Documentation:** [icons.mynaui.com](https://icons.mynaui.com/)
- **@mynaui/icons GitHub:** [github.com/mynaui/icons](https://github.com/mynaui/icons)
- **NPM Package:** [npmjs.com/package/@mynaui/icons-react](https://www.npmjs.com/package/@mynaui/icons-react)

### Related Documentation

- [Main README](../README.md) - Package overview and installation
- [Custom Icons Guide](./custom-icons-guide.md) - Creating custom icons

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Total Icons:** 824+ (800+ @mynaui + 24 custom)
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,400

**INTELLIGENCE_THEME** • **COMPLETE_ICON_REFERENCE** 📖
