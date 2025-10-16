import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealColumn } from './DealColumn';
import { Deal } from '@/types/database';

type DealStatus = 'lead' | 'booked' | 'done';

interface DealCarouselProps {
  columns: { id: DealStatus; title: string; color: string }[];
  getDealsByStatus: (status: DealStatus) => Deal[];
}

export const DealCarousel: React.FC<DealCarouselProps> = ({ columns, getDealsByStatus }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    containScroll: 'trimSnaps',
    direction: 'rtl'
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative" dir="rtl">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {columns.map((column) => (
            <div key={column.id} className="flex-[0_0_85%] min-w-0">
              <DealColumn
                column={column}
                deals={getDealsByStatus(column.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="touch-feedback min-h-[44px] min-w-[44px] rounded-full"
          aria-label="עמודה קודמת"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {columns.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all touch-feedback ${
                index === selectedIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`עבור לעמודה ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="touch-feedback min-h-[44px] min-w-[44px] rounded-full"
          aria-label="עמודה הבאה"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Status Legend */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {columns[selectedIndex]?.title} ({getDealsByStatus(columns[selectedIndex]?.id).length} עסקאות)
      </div>
    </div>
  );
};
