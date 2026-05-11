# Responsive Design Guide

## SUMMARY

Mobile-first responsive design patterns using breakpoint-aware layout components.

---

## BREAKPOINT_SYSTEM

```typescript
export const BREAKPOINTS = {
  base: '0px', // Mobile
  sm: '640px', // Small tablets
  md: '768px', // Tablets
  lg: '1024px', // Laptops
  xl: '1280px', // Desktops
  '2xl': '1536px', // Large desktops
} as const;
```

---

## RESPONSIVE_GRID

```typescript
import { Grid, GridItem } from '@aazucena/layouts';

function ResponsiveGrid() {
  return (
    <Grid
      cols={{
        base: 1,      // 1 column on mobile
        sm: 2,        // 2 columns on small tablets
        md: 3,        // 3 columns on tablets
        lg: 4,        // 4 columns on laptops
        xl: 6,        // 6 columns on desktops
      }}
      gap={{ base: 4, md: 6, lg: 8 }}
    >
      {items.map((item) => (
        <GridItem key={item.id}>
          <Card {...item} />
        </GridItem>
      ))}
    </Grid>
  );
}
```

---

## MEDIA_QUERY_HOOK

```typescript
import { useMediaQuery } from '@aazucena/hooks/device';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

---

**AUTHOR:** aazucena_responsive_design
