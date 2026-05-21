"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { GoogleReview } from "@/types/googleReview";
import { GoogleReviewCard } from "./GoogleReviewCard";

type Props = {
  reviews: GoogleReview[];
};

export function ReviewsCarouselClient({ reviews }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [expandedCount, setExpandedCount] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const plugins = useMemo(
    () =>
      reducedMotion || expandedCount > 0
        ? []
        : [
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ],
    [reducedMotion, expandedCount]
  );

  const handleExpandChange = useCallback((isExpanded: boolean) => {
    setExpandedCount((c) => c + (isExpanded ? 1 : -1));
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1, dragFree: false },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (reviews.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="min-w-0 flex-[0_0_100%] pl-6 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <GoogleReviewCard
                review={review}
                onExpandChange={handleExpandChange}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous reviews"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 hidden md:flex items-center justify-center h-11 w-11 rounded-full bg-white text-accent shadow-md border border-slate-100 hover:bg-brand-50 hover:text-brand-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next reviews"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 hidden md:flex items-center justify-center h-11 w-11 rounded-full bg-white text-accent shadow-md border border-slate-100 hover:bg-brand-50 hover:text-brand-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>

      {scrollSnaps.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {scrollSnaps.map((_, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to review ${i + 1}`}
                aria-current={active ? "true" : undefined}
                className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  active
                    ? "w-8 bg-brand-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
