import { useEffect, useRef, useState } from 'react';

/**
 * Site-wide card hover effect, taken from the Buffs & Support "Sponsorship Roadmap":
 * when the parent card is hovered (or focused), an outline draws itself around it.
 *
 * Place it as the LAST direct child of a positioned card (relative/absolute).
 * `color` should be the card's own hover border colour (any CSS colour, incl. var(--x)).
 * Defaults to currentColor. The corner radius is read from the parent automatically.
 * Styles live in resources/css/app.css (.hover-outline).
 */
export default function HoverOutline({ color }) {
    const ref = useRef(null);
    const [radius, setRadius] = useState(15);

    useEffect(() => {
        const parent = ref.current?.parentElement;
        if (!parent) return;
        const value = parseFloat(window.getComputedStyle(parent).borderTopLeftRadius);
        if (!Number.isNaN(value)) setRadius(Math.max(0, value - 1));
    }, []);

    return (
        <svg
            ref={ref}
            className="hover-outline"
            style={color ? { '--hover-outline-color': color } : undefined}
            aria-hidden="true"
            focusable="false"
        >
            <rect x="1" y="1" rx={radius} pathLength="100" strokeDasharray="100 100" />
        </svg>
    );
}
