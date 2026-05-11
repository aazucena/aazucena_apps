# Grid System Guide

## SUMMARY

Flexible 12-column responsive grid patterns using Tailwind CSS grid utilities and layout composition.

---

## 🏗️ GRID_FUNDAMENTALS

### 12-Column System

The grid system divides the page into 12 equal columns, providing flexible layout options.

**Why 12 Columns?**

- Divisible by 2, 3, 4, 6 (flexible layout options)
- Common industry standard (Bootstrap, Material UI)
- Supports complex multi-column layouts

**Column Spans:**

- `col-span-1` → 1/12 width (8.33%)
- `col-span-2` → 2/12 width (16.67%)
- `col-span-3` → 3/12 width (25%)
- `col-span-4` → 4/12 width (33.33%)
- `col-span-6` → 6/12 width (50%)
- `col-span-12` → 12/12 width (100%)

---

## 📐 BASIC_GRID

### Simple Grid Layout

```typescript
import { MainContainer } from '@aazucena/layouts';

function BasicGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar: 3 columns */}
        <div className="col-span-3 bg-muted p-4">
          Sidebar
        </div>

        {/* Main Content: 9 columns */}
        <div className="col-span-9 bg-background p-4">
          Main Content
        </div>
      </div>
    </MainContainer>
  );
}
```

**Breakdown:**

- `grid-cols-12` → 12-column grid
- `gap-4` → 1rem (16px) gap between columns
- `col-span-3` → Span 3 columns (25% width)
- `col-span-9` → Span 9 columns (75% width)

---

### Equal Columns

```typescript
function ThreeColumnGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">Column 1</div>
        <div className="col-span-4">Column 2</div>
        <div className="col-span-4">Column 3</div>
      </div>
    </MainContainer>
  );
}
```

**Result:** 3 equal columns (33.33% each)

---

## 📱 RESPONSIVE_GRIDS

### Mobile-First Approach

```typescript
function ResponsiveGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
        <div>Item 5</div>
        <div>Item 6</div>
      </div>
    </MainContainer>
  );
}
```

**Breakpoint Behavior:**

- **Mobile (< 768px):** 1 column (100% width)
- **Tablet (≥ 768px):** 2 columns (50% each)
- **Desktop (≥ 1024px):** 3 columns (33.33% each)

---

### Complex Responsive Layout

```typescript
function ComplexGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* Hero: Full width on mobile, spans 8 cols on desktop */}
        <div className="col-span-12 lg:col-span-8">
          Hero Content
        </div>

        {/* Sidebar: Full width on mobile, spans 4 cols on desktop */}
        <div className="col-span-12 lg:col-span-4">
          Sidebar
        </div>

        {/* Cards: Full width on mobile, 6 cols on tablet, 4 cols on desktop */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          Card 1
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          Card 2
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          Card 3
        </div>
      </div>
    </MainContainer>
  );
}
```

**Breakpoint Behavior:**

- **Mobile:** All items full width (stacked)
- **Tablet:** Hero + Sidebar full width, Cards 2-column (50% each)
- **Desktop:** Hero 66.67%, Sidebar 33.33%, Cards 33.33% each

---

## 🎯 GRID_AUTO

### Auto-Fill Pattern

```typescript
function AutoGrid() {
  return (
    <MainContainer>
      {/* Auto-fill: Creates as many columns as fit */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
        <div>Card 4</div>
      </div>
    </MainContainer>
  );
}
```

**How it works:**

- `auto-fill` → Creates as many columns as fit
- `minmax(250px, 1fr)` → Each column min 250px, max 1fr (equal width)
- Result: Responsive without breakpoints

**Use Cases:**

- Product grids
- Image galleries
- Blog post cards

---

### Auto-Fit Pattern

```typescript
function AutoFitGrid() {
  return (
    <MainContainer>
      {/* Auto-fit: Expands columns to fill space */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </div>
    </MainContainer>
  );
}
```

**Difference from Auto-Fill:**

- `auto-fill` → Creates empty columns if space available
- `auto-fit` → Expands existing columns to fill space
- Use `auto-fit` when you want columns to stretch

---

## 🔀 GRID_OFFSETS

### Column Start/End

```typescript
function OffsetGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* Centered 6-column content with 3-column margins */}
        <div className="col-start-4 col-span-6">
          Centered Content
        </div>

        {/* Item starting at column 3, ending at column 11 */}
        <div className="col-start-3 col-end-11">
          Offset Content
        </div>
      </div>
    </MainContainer>
  );
}
```

**Grid Lines:**

```
1  2  3  4  5  6  7  8  9  10 11 12 13
|--|--|--|--|--|--|--|--|--|--|--|--|
   ^col-start-3              ^col-end-11
```

---

### Responsive Offsets

```typescript
function ResponsiveOffsetGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* Full width mobile, centered 8 cols desktop */}
        <div className="col-span-12 lg:col-start-3 lg:col-span-8">
          Content
        </div>
      </div>
    </MainContainer>
  );
}
```

---

## 📦 NESTED_GRIDS

### Grid Within Grid

```typescript
function NestedGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* Outer grid: 8 columns */}
        <div className="col-span-8">
          {/* Inner grid: 4 columns */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">Nested 1</div>
            <div className="col-span-2">Nested 2</div>
            <div className="col-span-4">Nested Full</div>
          </div>
        </div>

        {/* Outer grid: 4 columns */}
        <div className="col-span-4">
          Sidebar
        </div>
      </div>
    </MainContainer>
  );
}
```

**Use Cases:**

- Complex dashboards
- Magazine-style layouts
- Multi-level navigation

---

## 🎨 ASYMMETRIC_LAYOUTS

### Golden Ratio Layout (61.8% / 38.2%)

```typescript
function GoldenRatioGrid() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* ~61.8%: 7-8 columns */}
        <div className="col-span-7">
          Primary Content
        </div>

        {/* ~38.2%: 5-4 columns */}
        <div className="col-span-5">
          Secondary Content
        </div>
      </div>
    </MainContainer>
  );
}
```

---

### Magazine Layout

```typescript
function MagazineLayout() {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* Featured: Full width */}
        <div className="col-span-12">
          <img src="/featured.jpg" alt="Featured" className="w-full h-96 object-cover" />
        </div>

        {/* Main article: 8 columns */}
        <div className="col-span-12 lg:col-span-8">
          <article>Main Article</article>
        </div>

        {/* Side content: 4 columns */}
        <div className="col-span-12 lg:col-span-4">
          <aside>Related Articles</aside>
        </div>

        {/* Sub-articles: 3 columns each */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          Sub Article 1
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          Sub Article 2
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          Sub Article 3
        </div>
      </div>
    </MainContainer>
  );
}
```

---

## 🏢 DASHBOARD_LAYOUTS

### Admin Dashboard

```typescript
function DashboardLayout() {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Header: Full width */}
      <header className="col-span-12 bg-background border-b p-4">
        <h1>Dashboard</h1>
      </header>

      {/* Sidebar: 2 columns desktop, full width mobile */}
      <aside className="col-span-12 lg:col-span-2 bg-muted p-4">
        Navigation
      </aside>

      {/* Main Content: 10 columns desktop */}
      <main className="col-span-12 lg:col-span-10">
        <div className="grid grid-cols-12 gap-6">
          {/* KPI Cards: 3 columns each */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KPICard title="Revenue" value="$125k" />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KPICard title="Users" value="1,234" />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KPICard title="Orders" value="567" />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <KPICard title="Growth" value="+12%" />
          </div>

          {/* Chart: 8 columns */}
          <div className="col-span-12 lg:col-span-8">
            <Chart />
          </div>

          {/* Table: 4 columns */}
          <div className="col-span-12 lg:col-span-4">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## 📊 GRID_GAPS

### Variable Gaps

```typescript
function VariableGapGrid() {
  return (
    <MainContainer>
      {/* Different gaps at different breakpoints */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div>Item 1</div>
        <div>Item 2</div>
      </div>
    </MainContainer>
  );
}
```

**Gap Sizes:**

- `gap-4` → 1rem (16px) - Mobile
- `md:gap-6` → 1.5rem (24px) - Tablet
- `lg:gap-8` → 2rem (32px) - Desktop

---

### Row & Column Gaps

```typescript
function DirectionalGaps() {
  return (
    <MainContainer>
      {/* Different gaps for rows vs columns */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-8">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
        <div>Item 5</div>
        <div>Item 6</div>
      </div>
    </MainContainer>
  );
}
```

**Result:**

- Horizontal gap: 1rem (16px)
- Vertical gap: 2rem (32px)

---

## 🎯 PRACTICAL_EXAMPLES

### Blog Grid

```typescript
function BlogGrid({ posts }) {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-8">
        {/* Featured Post: Full width desktop, 8 cols mobile */}
        <article className="col-span-12 lg:col-span-8">
          <img src={posts[0].image} className="w-full h-96 object-cover rounded-lg" />
          <h2 className="text-3xl font-bold mt-6">{posts[0].title}</h2>
          <p className="mt-4">{posts[0].excerpt}</p>
        </article>

        {/* Recent Posts: 4 cols desktop, full width mobile */}
        <aside className="col-span-12 lg:col-span-4">
          <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {posts.slice(1, 5).map((post) => (
              <div key={post.id}>
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Post Grid: 4 cols each desktop, 6 cols tablet, full mobile */}
        {posts.slice(5).map((post) => (
          <article key={post.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <img src={post.image} className="w-full h-48 object-cover rounded-lg" />
            <h3 className="text-lg font-semibold mt-3">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </MainContainer>
  );
}
```

---

### Portfolio Grid

```typescript
function PortfolioGrid({ projects }) {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {projects.map((project, idx) => {
          // Vary sizes: first is featured (12 cols), then alternate 6/6, 4/4/4
          let colSpan = 'col-span-12 md:col-span-6 lg:col-span-4';

          if (idx === 0) {
            colSpan = 'col-span-12'; // Featured: Full width
          } else if (idx % 3 === 1) {
            colSpan = 'col-span-12 md:col-span-6'; // Alternating large
          }

          return (
            <article key={project.id} className={colSpan}>
              <img
                src={project.image}
                className="w-full aspect-video object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold mt-4">{project.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {project.description}
              </p>
            </article>
          );
        })}
      </div>
    </MainContainer>
  );
}
```

---

### E-Commerce Grid

```typescript
function ProductGrid({ products }) {
  return (
    <MainContainer>
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Filters: 3 cols desktop, full width mobile */}
        <aside className="col-span-12 lg:col-span-3">
          <h3 className="font-bold mb-4">Filters</h3>
          <FilterPanel />
        </aside>

        {/* Product Grid: 9 cols desktop */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article key={product.id}>
                <img
                  src={product.image}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <h4 className="font-semibold mt-3">{product.name}</h4>
                <p className="text-lg font-bold text-primary mt-1">
                  ${product.price}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
```

---

## 🧩 GRID_UTILITIES

### Tailwind Grid Classes Reference

**Grid Columns:**

```typescript
grid - cols - 1; // 1 column
grid - cols - 2; // 2 columns
grid - cols - 3; // 3 columns
grid - cols - 4; // 4 columns
grid - cols - 12; // 12 columns
```

**Column Span:**

```typescript
col - span - 1; // Span 1 column
col - span - 2; // Span 2 columns
col - span - 6; // Span 6 columns
col - span - 12; // Span all 12 columns
col - span - full; // Span all columns (any grid)
```

**Column Start/End:**

```typescript
col - start - 1; // Start at column 1
col - start - 4; // Start at column 4
col - end - 7; // End at column 7
col - end - 13; // End at column 13 (after last column)
```

**Grid Gaps:**

```typescript
gap - 0; // No gap
gap - 4; // 1rem gap
gap - 6; // 1.5rem gap
gap - 8; // 2rem gap
gap - x - 4; // Horizontal gap only
gap - y - 8; // Vertical gap only
```

---

## 📋 BEST_PRACTICES

### Do's ✅

1. **Mobile-First:** Start with mobile layout, add breakpoints upward
2. **Consistent Gaps:** Use consistent gap sizes (4, 6, 8)
3. **Semantic HTML:** Use `<article>`, `<section>`, `<aside>` appropriately
4. **Auto Grids:** Use `auto-fill`/`auto-fit` for simple responsive grids
5. **Nested Containers:** Combine `MainContainer` with grid for max-width + grid
6. **Test Breakpoints:** Test layouts at all breakpoint sizes

### Don'ts ❌

1. **Don't Mix Units:** Use rem/px consistently, avoid mixing with %
2. **Don't Over-Nest:** Limit grid nesting to 2-3 levels
3. **Don't Ignore Mobile:** Always test mobile-first
4. **Don't Hardcode:** Use breakpoint utilities, not custom CSS
5. **Don't Forget Gaps:** Always include gap for visual breathing room
6. **Don't Overuse 12-Col:** Use simpler `grid-cols-{n}` when appropriate

---

**AUTHOR:** aazucena_grid_intelligence
