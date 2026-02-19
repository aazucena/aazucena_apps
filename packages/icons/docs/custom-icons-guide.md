# 🎨 CUSTOM_ICONS_GUIDE

**DEVELOPER_GUIDE** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Comprehensive guide for creating, optimizing, and integrating custom SVG icons into the @aazucena/icons package.

---

## 📋 TABLE_OF_CONTENTS

- [🎯 OVERVIEW](#-overview)
- [🛠️ CREATING_CUSTOM_ICONS](#️-creating_custom_icons)
- [⚙️ SVG_OPTIMIZATION](#️-svg_optimization)
- [📦 REACT_COMPONENT_PATTERN](#-react_component_pattern)
- [🔌 REGISTRY_INTEGRATION](#-registry_integration)
- [✅ BEST_PRACTICES](#-best_practices)
- [🎨 DESIGN_WORKFLOW](#-design_workflow)
- [🧪 TESTING_CUSTOM_ICONS](#-testing_custom_icons)

---

## 🎯 OVERVIEW

### When to Create Custom Icons

Create custom icons when:

- ✅ Icon doesn't exist in @mynaui/icons-react library
- ✅ Brand-specific logos or designs required
- ✅ Unique visual identity needed
- ✅ Project-specific iconography
- ✅ Custom animations or interactions

**Examples:**

- ✅ AAZUCENA brand logo (BrandIcon)
- ✅ Tech stack logos (AstroIcon, ReactIcon, TailwindIcon)
- ✅ Social media logos (GitHubIcon, LinkedInIcon)
- ✅ Project-specific UI elements (ScrollDownIcon, ViewportsIcon)

---

### Custom Icon Requirements

| Requirement       | Specification                             | Reason                                  |
| ----------------- | ----------------------------------------- | --------------------------------------- |
| **Format**        | SVG (Scalable Vector Graphics)            | Resolution-independent, small file size |
| **Viewbox**       | Consistent dimensions (e.g., 24×24)       | Predictable sizing behavior             |
| **Stroke**        | Consistent width (1-2px typical)          | Visual consistency with @mynaui icons   |
| **Fill**          | Use `currentColor`                        | Inherits text color for theming         |
| **Optimization**  | Minified paths, no unnecessary attributes | Smallest file size                      |
| **Accessibility** | Semantic SVG markup                       | Screen reader support                   |

---

## 🛠️ CREATING_CUSTOM_ICONS

### Step 1: Design the Icon

#### Design Tools

- **Figma** (Recommended) - Free, web-based, collaborative
- **Adobe Illustrator** - Industry standard for vector graphics
- **Sketch** - macOS design tool
- **Inkscape** - Free, open-source alternative

#### Design Specifications

```yaml
Canvas Size: 24×24px (or 256×256px for logos)
Stroke Width: 2px (for outline icons)
Corner Radius: 2px (rounded corners)
Grid: 1px grid with 2px snap
Padding: 2px from canvas edge
Style: Outline (not filled) for consistency
Colors: Single color (will be replaced with currentColor)
```

**Example Figma Setup:**

```
1. Create new frame: 24×24px
2. Enable grid: 1px spacing
3. Enable snap to grid
4. Set stroke: 2px
5. Set corner radius: 2px
6. Design icon within 20×20px safe area (2px padding)
```

---

### Step 2: Export SVG

#### Figma Export Settings

```
Format: SVG
Export as: Outline
Include "id" attribute: No
Outline text: Yes
Flatten transforms: Yes
```

#### Illustrator Export Settings

```
Format: SVG
Styling: Inline Style
Font: Convert to Outlines
Images: Embed
Object IDs: Layer Names
Decimal: 2
Minify: Yes
Responsive: Yes
```

#### Raw SVG Example

```xml
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>
</svg>
```

---

## ⚙️ SVG_OPTIMIZATION

### Step 3: Optimize SVG

#### Tool 1: SVGOMG (Recommended)

**Website:** [jakearchibald.github.io/svgomg/](https://jakearchibald.github.io/svgomg/)

**Settings:**

```yaml
Precision: 2 decimals
Multipass: Yes
Remove viewBox: No
Remove <style> elements: Yes
Remove <script> elements: Yes
Remove hidden elements: Yes
Remove empty attributes: Yes
Remove empty containers: Yes
Merge paths: Yes
Convert shapes to paths: Yes
Sort attributes: Yes
Remove title: Yes
Remove desc: Yes
```

**Before Optimization (245 bytes):**

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="9" y1="9" x2="15" y2="15"></line>
  <line x1="15" y1="9" x2="9" y2="15"></line>
</svg>
```

**After Optimization (128 bytes - 48% reduction):**

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 9l6 6m0-6l-6 6"/></svg>
```

---

#### Tool 2: SVGO (Command Line)

**Installation:**

```bash
npm install -g svgo
```

**Usage:**

```bash
# Optimize single file
svgo input.svg -o output.svg

# Optimize all SVGs in directory
svgo -f ./icons -o ./icons-optimized

# Custom config
svgo --config=svgo.config.js input.svg
```

**Config File (`svgo.config.js`):**

```javascript
module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // Keep viewBox for responsive sizing
          cleanupIDs: true,
          removeTitle: true,
          removeDesc: true,
        },
      },
    },
    'removeDimensions', // Remove width/height attributes
  ],
};
```

---

### Optimization Checklist

- ✅ **Remove unnecessary attributes** (id, class, data-\*)
- ✅ **Merge redundant paths** into single path
- ✅ **Simplify path commands** (use relative commands)
- ✅ **Round decimal precision** to 2 places
- ✅ **Remove metadata** (title, desc, comments)
- ✅ **Convert shapes to paths** (rect, circle → path)
- ✅ **Replace colors with `currentColor`**
- ✅ **Remove inline styles** (use props instead)
- ✅ **Minify whitespace** (no line breaks)

---

## 📦 REACT_COMPONENT_PATTERN

### Step 4: Convert to React Component

#### Template Pattern

```typescript
// packages/icons/src/custom/MyCustomIcon.tsx
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const MyCustomIcon = ({
  size = 24,
  stroke,
  className = '',
  ...props
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
    strokeWidth={stroke}
    {...props}
  >
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
  </svg>
);
```

---

#### Props Explanation

```typescript
interface MynaIconsProps extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number | string; // Controls width + height
  stroke?: number | string; // SVG stroke-width
  color?: string; // SVG fill/stroke color
  className?: string; // Tailwind/CSS classes
}
```

**Key Features:**

1. **`size` prop** - Controls both width and height simultaneously
2. **`stroke` prop** - Maps to strokeWidth attribute
3. **`className` prop** - Tailwind CSS support
4. **`fill="currentColor"`** - Inherits text color from parent
5. **`...props`** - Passes all other SVG props (aria-_, data-_, etc.)

---

#### Real-World Examples

##### Example 1: Simple Outline Icon

```typescript
// packages/icons/src/custom/ShieldIcon.tsx
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const ShieldIcon = ({ size = 24, stroke, className = '', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
  </svg>
);
```

**Usage:**

```typescript
<ShieldIcon size={32} stroke={2} className="text-blue-500" />
```

---

##### Example 2: Brand Logo with Multiple Paths

```typescript
// packages/icons/src/custom/AstroIcon.tsx
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const AstroIcon = ({ size = 24, stroke, className = '', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 366"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    fill="currentColor"
    className={className}
    strokeWidth={stroke}
    {...props}
  >
    <path d="M182.022 9.147c2.982 3.702..." />
    <path
      fill="#FF5D01"
      d="M189.972 256.46c-10.952..."
    />
  </svg>
);
```

**Note:** Brand logos often have:

- Non-square viewBox (256×366)
- Multiple paths with different fills
- Specific brand colors (override currentColor)

---

##### Example 3: Social Media Icon

```typescript
// packages/icons/src/custom/GitHubIcon.tsx
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const GitHubIcon = ({ size = 24, stroke, className = '', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    strokeWidth={stroke}
    {...props}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302..." />
  </svg>
);
```

**Usage:**

```typescript
<GitHubIcon size={24} className="text-gray-800 dark:text-white" />
```

---

## 🔌 REGISTRY_INTEGRATION

### Step 5: Export from Custom Icons

Add your new icon to the barrel export:

```typescript
// packages/icons/src/custom/index.ts
export * from './AstroIcon.js';
export * from './ReactIcon.js';
export * from './MyCustomIcon.js'; // Add your new icon here
```

---

### Step 6: Register in Icon Registry

Add your icon to the registry mapping:

```typescript
// packages/icons/src/registry.ts
import * as Icons from '@mynaui/icons-react';
import { MyCustomIcon } from './custom/index.js';
import type { IconComponent } from '@aazucena/types';

export function getIconComponent(iconName: string | null | undefined): IconComponent {
  if (!iconName || iconName.trim() === '') {
    return Icons.Code as IconComponent;
  }

  const iconMap: Record<string, IconComponent> = {
    // Custom Icons
    MyCustom: MyCustomIcon as IconComponent, // Add your icon here

    // Existing icons...
    Astro: AstroIcon as IconComponent,
    React: ReactIcon as IconComponent,
    // ... rest of the registry
  };

  return (
    iconMap[iconName] || (Icons as unknown as Record<string, IconComponent>)[iconName] || Icons.Code
  );
}
```

---

### Step 7: Add to Validation List (Optional)

For stricter type safety, add to the validation list:

```typescript
// packages/icons/src/registry.ts
export function isValidIconName(iconName: string): boolean {
  const customIcons = [
    'Astro',
    'React',
    'MyCustom', // Add your icon name here
    // ... rest of custom icons
  ];
  return iconName in Icons || iconName.startsWith('<svg') || customIcons.includes(iconName);
}
```

---

## ✅ BEST_PRACTICES

### Design Principles

#### 1. Consistency

```yaml
✅ GOOD:
  - Same stroke width as @mynaui icons (2px)
  - Same corner radius (2px)
  - Same padding from edge (2px)
  - Same viewBox dimensions (24×24)

❌ BAD:
  - Mixed stroke widths (1px, 3px, 4px)
  - Sharp corners on some, rounded on others
  - Inconsistent spacing
  - Random viewBox sizes
```

---

#### 2. Simplicity

```yaml
✅ GOOD:
  - Clean, minimal paths
  - Clear visual at small sizes
  - Single concept per icon
  - 3-5 paths maximum

❌ BAD:
  - Overly complex details
  - 10+ paths
  - Multiple concepts in one icon
  - Fine details that disappear at 16px
```

---

#### 3. Scalability

```yaml
✅ GOOD:
  - Recognizable at 16px, 24px, 48px
  - Vector paths (scale infinitely)
  - No raster images embedded
  - No text (convert to paths)

❌ BAD:
  - Only looks good at one size
  - Embedded PNG/JPEG images
  - Text that doesn't scale
  - 1px details that vanish when small
```

---

### Code Patterns

#### 1. Always Use `currentColor`

```typescript
// ✅ GOOD - Inherits text color (themeable)
<svg fill="currentColor" stroke="currentColor">
  <path d="..." />
</svg>

// ❌ BAD - Hard-coded color (not themeable)
<svg fill="#000000" stroke="#000000">
  <path d="..." />
</svg>
```

**Exception:** Brand logos with specific colors (AstroIcon, ReactIcon)

---

#### 2. Props Destructuring

```typescript
// ✅ GOOD - Clean, readable
export const MyIcon = ({ size = 24, stroke, className = '', ...props }: IconProps) => (
  <svg width={size} height={size} {...props}>
    ...
  </svg>
);

// ❌ BAD - Props drilling, verbose
export const MyIcon = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    ...
  </svg>
);
```

---

#### 3. Default Values

```typescript
// ✅ GOOD - Sensible defaults
{
  size = 24,        // Most common size
  stroke,           // Optional (defaults to SVG's strokeWidth)
  className = '',   // Empty string (no classes)
}

// ❌ BAD - No defaults
{
  size,             // Undefined without explicit prop
  stroke,           // Undefined
  className,        // Undefined
}
```

---

### File Organization

```
packages/icons/src/custom/
├── index.ts                     # Barrel export (alphabetical)
├── AstroIcon.tsx                # Tech stack icons
├── ReactIcon.tsx
├── TailwindIcon.tsx
├── ViteIcon.tsx
├── GitHubIcon.tsx               # Social icons
├── LinkedInIcon.tsx
├── TwitterIcon.tsx
├── BrandIcon.tsx                # Brand/UI icons
├── RssIcon.tsx
└── MyCustomIcon.tsx             # Your new icon
```

**Naming Convention:**

- PascalCase file names (MyCustomIcon.tsx)
- Match component name (export const MyCustomIcon)
- Descriptive, not abbreviated (GitHubIcon not GHIcon)
- Suffix with "Icon" for clarity

---

## 🎨 DESIGN_WORKFLOW

### Workflow 1: Figma to React

```
1. Design in Figma
   ├─ 24×24px frame
   ├─ 2px stroke
   ├─ 2px corner radius
   └─ 2px padding

2. Export SVG
   ├─ Format: SVG
   ├─ Export as: Outline
   └─ Minify: Yes

3. Optimize with SVGOMG
   ├─ Precision: 2 decimals
   ├─ Remove viewBox: No
   └─ Merge paths: Yes

4. Convert to React Component
   ├─ Add TypeScript props
   ├─ Replace colors with currentColor
   └─ Add size/stroke props

5. Register in Icon System
   ├─ Export from custom/index.ts
   └─ Add to registry.ts
```

---

### Workflow 2: Illustrator to React

```
1. Design in Illustrator
   ├─ 24×24px artboard
   ├─ 2pt stroke
   └─ Expand appearance before export

2. Export SVG
   ├─ Styling: Inline Style
   ├─ Font: Convert to Outlines
   └─ Minify: Yes

3. Optimize with SVGO CLI
   $ svgo input.svg -o output.svg

4. Convert to React Component
   (same as Figma workflow)

5. Register in Icon System
   (same as Figma workflow)
```

---

### Workflow 3: Existing SVG to React

```
1. Download SVG file
   (from Figma Community, IconScout, etc.)

2. Verify License
   ├─ MIT, Apache, CC0 → ✅ OK to use
   └─ Proprietary → ❌ Cannot use without permission

3. Optimize SVG
   $ svgo input.svg -o output.svg

4. Audit SVG Code
   ├─ Check viewBox (should be "0 0 24 24")
   ├─ Check paths (should be clean)
   ├─ Check colors (should be currentColor)
   └─ Remove unnecessary attributes

5. Convert to React Component
   (same as above)

6. Test Rendering
   ├─ 16px size
   ├─ 24px size
   ├─ 48px size
   └─ Dark/light modes

7. Register in Icon System
   (same as above)
```

---

## 🧪 TESTING_CUSTOM_ICONS

### Manual Testing

#### Test 1: Rendering

```tsx
// Test component rendering at multiple sizes
function IconTest() {
  return (
    <div className="flex gap-4 items-end">
      <MyCustomIcon size={16} />
      <MyCustomIcon size={24} />
      <MyCustomIcon size={32} />
      <MyCustomIcon size={48} />
      <MyCustomIcon size={64} />
    </div>
  );
}
```

**Expected:** Icon scales smoothly without pixelation or distortion

---

#### Test 2: Color Inheritance

```tsx
// Test currentColor inheritance
function ColorTest() {
  return (
    <div>
      <div className="text-red-500">
        <MyCustomIcon size={32} />
      </div>
      <div className="text-blue-500">
        <MyCustomIcon size={32} />
      </div>
      <div className="text-green-500">
        <MyCustomIcon size={32} />
      </div>
    </div>
  );
}
```

**Expected:** Icon inherits parent text color

---

#### Test 3: Dark Mode

```tsx
// Test dark mode compatibility
function DarkModeTest() {
  return (
    <div className="dark">
      <div className="bg-gray-900 text-white p-4">
        <MyCustomIcon size={32} />
      </div>
    </div>
  );
}
```

**Expected:** Icon visible and properly colored in dark mode

---

#### Test 4: Accessibility

```tsx
// Test with screen reader
function AccessibilityTest() {
  return (
    <button aria-label="Custom action">
      <MyCustomIcon size={24} />
    </button>
  );
}
```

**Expected:** Button is announced correctly by screen readers

---

### Automated Testing (Optional)

#### Visual Regression Test (Storybook + Chromatic)

```typescript
// packages/ui/src/stories/MyCustomIcon.stories.ts
import { MyCustomIcon } from '@aazucena/icons';

export default {
  title: 'Icons/Custom/MyCustomIcon',
  component: MyCustomIcon,
};

export const Sizes = () => (
  <div className="flex gap-4 items-end">
    <MyCustomIcon size={16} />
    <MyCustomIcon size={24} />
    <MyCustomIcon size={32} />
    <MyCustomIcon size={48} />
  </div>
);

export const Colors = () => (
  <div className="flex gap-4">
    <MyCustomIcon size={32} className="text-red-500" />
    <MyCustomIcon size={32} className="text-blue-500" />
    <MyCustomIcon size={32} className="text-green-500" />
  </div>
);
```

---

### Testing Checklist

Before merging your custom icon:

- ✅ **Renders correctly** at 16px, 24px, 48px
- ✅ **Inherits color** from parent (currentColor works)
- ✅ **Dark mode compatible** (visible in dark backgrounds)
- ✅ **Scales smoothly** (no pixelation or artifacts)
- ✅ **Optimized file size** (<2KB for most icons)
- ✅ **Exported from custom/index.ts**
- ✅ **Registered in registry.ts**
- ✅ **TypeScript types correct** (no errors)
- ✅ **Accessible** (works with aria-label)
- ✅ **Documented** (added to icon-catalog.md if significant)

---

## 📚 RESOURCES

### Design Tools

- **Figma:** [figma.com](https://figma.com) - Free design tool
- **Adobe Illustrator:** [adobe.com/illustrator](https://adobe.com/illustrator) - Vector graphics editor
- **Inkscape:** [inkscape.org](https://inkscape.org) - Free, open-source alternative

### Optimization Tools

- **SVGOMG:** [jakearchibald.github.io/svgomg/](https://jakearchibald.github.io/svgomg/) - Web-based SVG optimizer
- **SVGO:** [github.com/svg/svgo](https://github.com/svg/svgo) - Node.js SVG optimizer

### Icon Resources

- **Heroicons:** [heroicons.com](https://heroicons.com) - Free MIT-licensed icons
- **Lucide:** [lucide.dev](https://lucide.dev) - Beautiful open-source icons
- **Tabler Icons:** [tabler.io/icons](https://tabler.io/icons) - 5000+ free icons
- **Phosphor Icons:** [phosphoricons.com](https://phosphoricons.com) - Flexible icon family

### Learning Resources

- **SVG Tutorial:** [developer.mozilla.org/docs/Web/SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
- **SVG Optimization:** [css-tricks.com/a-complete-guide-to-svg-optimization/](https://css-tricks.com/a-complete-guide-to-svg-optimization/)

---

## 🔗 RELATED_DOCUMENTATION

- [Main README](../README.md) - Package overview and installation
- [Icon Catalog](./icon-catalog.md) - Complete icon reference

---

**DOCUMENTATION_METADATA:**

- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Author:** AAZUCENA Development Team
- **Status:** ✅ Complete
- **Phase:** Phase 4 - Developer Experience
- **Lines:** ~1,300

**INTELLIGENCE_THEME** • **CUSTOM_ICON_MASTERY** 🎨
