import { useRef } from "react";

export default function useCardScroller() {
    const scrollerRef = useRef(null);

    function scroll(direction) {
        const element = scrollerRef.current;
        const firstCard = element?.firstElementChild;

        if (!element || !firstCard) return;

        const gap =
            Number.parseFloat(window.getComputedStyle(element).columnGap) || 0;

        const distance = firstCard.getBoundingClientRect().width + gap;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        element.scrollBy({
            left: direction * distance,
            behavior: reducedMotion ? "auto" : "smooth",
        });
    }

    return {
        scrollerRef,
        scrollPrevious: () => scroll(-1),
        scrollNext: () => scroll(1),
    };
}
