import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@aazucena/ui';
import { Card, CardContent, CardTitle, CardHeader } from '@aazucena/ui';
import { Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Fluid slider primitive built on `embla-carousel-react`.
 * - **UX:** Supports mouse drag, touch swipe, and keyboard (arrow keys) navigation.
 * - **Accessibility:** Uses `role="region"` and `aria-roledescription="carousel"` for semantic clarity.
 * - **Responsive:** Leverages Tailwind's `basis-*` classes for dynamic slide counts across breakpoints.
 */
const meta = {
  title: 'Components/Layout/Carousel',
  component: Carousel,
  subcomponents: {
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive carousel component with navigation controls and item-level customization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The scroll axis of the carousel',
      table: { category: 'Layout' }
    },
    opts: {
      control: 'object',
      description: 'Embla Carousel options (align, loop, skipSnaps, etc.)',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard horizontal carousel implementation.
 */
export const Basic: Story = {
  render: () => (
    <div className="w-[400px] px-12">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card variant="outline" className="aspect-square flex items-center justify-center">
                <p className="text-4xl font-black opacity-20">{index + 1}</p>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/**
 * Demonstrates a multi-item display using responsive basis classes.
 */
export const MultiItem: Story = {
  render: () => (
    <div className="w-[800px] px-12">
      <Carousel opts={{ align: 'start', loop: true }}>
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card variant="cyber" hover className="h-48">
                <CardHeader>
                  <CardTitle className="text-sm">ITEM_0{index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" size="xs">NODE_SPEC</Badge>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/**
 * High-performance vertical carousel orientation.
 */
export const Vertical: Story = {
  render: () => (
    <div className="py-12">
      <Carousel orientation="vertical" className="w-64">
        <CarouselContent className="-mt-1 h-[300px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 basis-1/2">
              <Card variant="glass" className="h-full flex items-center justify-center bg-zinc-900 border-white/10">
                <span className="text-2xl font-bold text-white/40">{index + 1}</span>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/**
 * Immersive showcase utilizing large cards and glass aesthetics.
 */
export const ProjectShowcase: Story = {
  render: () => (
    <div className="w-[1000px] px-12 p-20 bg-gradient-to-tr from-zinc-900 to-black rounded-[3rem]">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {[
            { title: 'Project_Alpha', type: 'CORE' },
            { title: 'Project_Beta', type: 'INTEL' },
            { title: 'Project_Gamma', type: 'WEB' }
          ].map((item, index) => (
            <CarouselItem key={index}>
              <Card variant="glass" className="h-96 border-white/5 bg-white/5 backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-3xl font-black tracking-tighter text-white">
                      {item.title}
                    </CardTitle>
                    <Badge variant="cyber">{item.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-full flex items-center justify-center">
                  <div className="w-full h-40 bg-primary/10 border border-primary/20 rounded-xl animate-pulse" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
        <CarouselNext className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
      </Carousel>
    </div>
  ),
};
