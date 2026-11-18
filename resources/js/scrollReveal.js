// Site-wide scroll reveal (AOS "fade-up" style, built in — no extra package).
//
// What animates automatically on every page (inside <main>):
//   • section headings (h2) and the intro paragraph right after them
//   • every card that has the shared hover outline (<HoverOutline />)
//   • every item of a grid layout (card grids on News, Events, Programs, …)
//   • figures/images blocks and anything marked with `data-reveal`
// Items that share a parent arrive one after another (stagger), each only once.
// State lives in data attributes (not classes) because React rewrites `className`
// on re-render, which would wipe a JS-added class and hide the element again.
// Nested matches inside an already-animating block are skipped so nothing
// animates twice. Content in the first screen of the page is never hidden,
// and users who prefer reduced motion see everything immediately.

const AUTO_TARGETS = [
    'main h2',
    'main h2 + p',
    'main :has(> .hover-outline)',
    'main [class*="grid"] > *',
    'main figure',
    '[data-reveal]',
].join(', ');
const SKIP = '[data-reveal="false"], .hover-outline, header *, nav *, footer *, [role="dialog"] *, [aria-hidden="true"], script, style';
const STAGGER_MS = 140;
const MAX_STAGGER_STEPS = 5;
const DURATION_MS = 1200;

let observer;

function collect(root) {
    const nodes = [];
    if (root.nodeType !== 1) return nodes;
    if (root.matches?.(AUTO_TARGETS)) nodes.push(root);
    root.querySelectorAll?.(AUTO_TARGETS).forEach((node) => nodes.push(node));
    return nodes.filter((node) => !node.matches(SKIP) && !node.hasAttribute('data-reveal-ready'));
}

function prepare(nodes) {
    nodes.forEach((node) => {
        // Don't animate something whose ancestor is already animating in.
        if (node.parentElement?.closest('[data-reveal-ready]')) return;

        node.setAttribute('data-reveal-ready', '');

        // Use the position within the whole document, not the current scroll, so a page
        // opened from a scrolled-down page still animates. Only the first screen of the
        // page (hero) shows immediately.
        const documentTop = node.getBoundingClientRect().top + window.scrollY;
        if (documentTop < window.innerHeight * 0.85) {
            node.setAttribute('data-reveal-state', 'done');
            return;
        }

        const siblings = Array.from(node.parentElement?.children ?? []).filter((child) => child.matches(AUTO_TARGETS));
        const step = Math.min(Math.max(siblings.indexOf(node), 0), MAX_STAGGER_STEPS);
        node.style.setProperty('--reveal-delay', `${step * STAGGER_MS}ms`);

        observer.observe(node);
    });
}

export function initScrollReveal() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const node = entry.target;
            node.setAttribute('data-reveal-state', 'shown');
            observer.unobserve(node);
            // After the entrance, hand control back to the element's own hover transitions.
            const delay = parseFloat(node.style.getPropertyValue('--reveal-delay')) || 0;
            window.setTimeout(() => node.setAttribute('data-reveal-state', 'done'), delay + DURATION_MS);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    document.documentElement.classList.add('reveal-enabled');
    prepare(collect(document.body));

    // Inertia swaps page content without a reload; pick up new elements as they appear.
    new MutationObserver((mutations) => {
        const added = [];
        mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => added.push(...collect(node))));
        if (added.length) prepare(added);
    }).observe(document.body, { childList: true, subtree: true });
}
