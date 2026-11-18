import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import HoverOutline from "@/Components/HoverOutline";
import { getNetworkGalleryLayout } from "./networkGalleryLayout";
import styles from "./NetworkSection.module.css";

function getDisplayLabel(logo) {
    const raw = (logo.name || logo.alt || "").trim();
    if (!raw || /^msl network organization\s*\d*$/i.test(raw)) {
        return "";
    }
    return raw;
}

/**
 * Curved 3D "photo wall" of MSL Network organization logos.
 * Shared by the Home page (NetworkSection) and the MSL Network page.
 * Falls back to a flat grid on phones.
 */
export default function NetworkLogoWall({ logos = [], className = "" }) {
    const galleryRef = useRef(null);
    const [galleryWidth, setGalleryWidth] = useState(0);
    const layout = getNetworkGalleryLayout(logos.length, galleryWidth);
    const wallStyle = layout ? {
        "--wall-height": `${layout.height}px`,
        "--wall-perspective": `${layout.perspective}px`,
        "--wall-origin-y": `${layout.originY}px`,
        "--tile-width": `${layout.tileWidth}px`,
        "--tile-height": `${layout.tileHeight}px`,
    } : undefined;

    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return undefined;
        const observer = new ResizeObserver(([entry]) => {
            setGalleryWidth(entry.contentRect.width);
        });
        observer.observe(gallery);
        return () => observer.disconnect();
    }, [logos.length]);

    if (logos.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.scene} ${className}`}>
            <ul
                aria-label="MSL network organization logos"
                ref={galleryRef}
                className={styles.gallery}
                data-curved={Boolean(layout)}
                style={wallStyle}
            >
                {logos.map((logo, index) => {
                    const tile = layout?.tiles[index];
                    const displayLabel = getDisplayLabel(logo);
                    const accessibleName =
                        displayLabel ||
                        logo.alt ||
                        logo.name ||
                        `MSL Network Organization ${index + 1}`;
                    const href = typeof logo.link === "string" ? logo.link.trim() : "";
                    const hasLink = Boolean(href) && href !== "#";
                    const isExternal = /^https?:\/\//i.test(href);

                    const tileInner = (
                        <>
                            {/* Top subtle gold highlight on hover */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#F2C21A]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                            />

                            {hasLink ? (
                                <span
                                    aria-hidden="true"
                                    className={`${styles.externalBadge} pointer-events-none absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black/50 text-[#F2C21A] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-70`}
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </span>
                            ) : null}

                            <div className={styles.logoFrame}>
                                <img
                                    src={logo.src}
                                    alt={accessibleName}
                                    loading="lazy"
                                    className={styles.logo}
                                />
                            </div>

                            {displayLabel ? (
                                <span className={styles.label}>
                                    {displayLabel}
                                </span>
                            ) : <span className={styles.label} aria-hidden="true" />}

                            {/* Hover outline in the tile's hover border colour */}
                            <HoverOutline color={hasLink ? "#F2C21A" : "rgb(255 255 255 / 20%)"} />
                        </>
                    );

                    const baseTileClasses =
                        `${styles.card} group relative flex h-full w-full flex-col items-center justify-center rounded-lg border border-white/10 text-center`;

                    return (
                        <li
                            key={logo.id ?? `${logo.src}-${index}`}
                            className={styles.tile}
                            style={tile ? {
                                "--tile-top": `${tile.top}px`,
                                "--angle": `${tile.angle}deg`,
                                "--radius": `${layout.radius}px`,
                            } : undefined}
                        >
                            <div className={styles.face}>
                                {hasLink ? (
                                    <a
                                        href={href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        title={accessibleName}
                                        aria-label={isExternal ? `${accessibleName} (opens in a new tab)` : accessibleName}
                                        className={`${baseTileClasses} cursor-pointer hover:border-[#F2C21A]/45 hover:bg-white/[0.06] hover:shadow-[0_14px_34px_-8px_rgba(242,194,26,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]`}
                                    >
                                        {tileInner}
                                    </a>
                                ) : (
                                    <div
                                        title={accessibleName}
                                        className={`${baseTileClasses} hover:border-white/20 hover:bg-white/[0.04]`}
                                    >
                                        {tileInner}
                                    </div>
                                )}
                                {tile?.reflection && (
                                    <div className={styles.reflection} aria-hidden="true">
                                        <img src={logo.src} alt="" loading="lazy" />
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
