import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

export interface PolicyYearSlide {
  year: string;
  points: readonly string[];
}

interface PolicyYearCarouselProps {
  ariaLabel: string;
  slides: readonly PolicyYearSlide[];
}

export function PolicyYearCarousel({ ariaLabel, slides }: PolicyYearCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const updateCurrentIndex = () => setCurrentIndex(api.selectedScrollSnap());

    updateCurrentIndex();
    api.on('select', updateCurrentIndex);

    return () => {
      api.off('select', updateCurrentIndex);
    };
  }, [api]);

  const currentSlide = slides[currentIndex] ?? slides[0];

  return (
    <Carousel
      aria-label={ariaLabel}
      className="relative mx-0 mt-8 border-y border-border/80 py-4 sm:py-5"
      opts={{ align: 'start' }}
      setApi={setApi}
    >
      <div className="mb-4 grid gap-3 px-1 sm:px-2">
        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-1">
            <Badge variant="secondary" className="w-fit font-heading font-semibold">
              Policy transition
            </Badge>
            <p
              className="font-heading text-base font-semibold leading-tight sm:text-lg"
              aria-live="polite"
            >
              {currentSlide?.year}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <CarouselPrevious
              aria-label="Previous year"
              className="static my-0 size-9 translate-y-0"
            />
            <CarouselNext aria-label="Next year" className="static my-0 size-9 translate-y-0" />
          </div>
        </div>
        <div className="flex gap-1" role="tablist" aria-label={`${ariaLabel} years`}>
          {slides.map((slide, index) => (
            <Button
              key={slide.year}
              type="button"
              variant={index === currentIndex ? 'default' : 'outline'}
              size="sm"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Show ${slide.year}`}
              onClick={() => api?.scrollTo(index)}
            >
              {slide.year.replace('Year ', '')}
            </Button>
          ))}
        </div>
      </div>
      <CarouselContent className="-ml-4 items-stretch">
        {slides.map((slide) => (
          <CarouselItem key={slide.year} aria-label={slide.year} className="h-auto pl-4">
            <Card className="h-full min-h-[18rem] bg-card shadow-sm">
              <CardHeader className="gap-2 pb-1">
                <CardTitle className="text-base font-semibold leading-tight sm:text-lg">
                  Household impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="m-0 grid list-disc gap-3 pl-5 text-[0.95rem] leading-7 text-muted-foreground sm:text-base">
                  {slide.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
