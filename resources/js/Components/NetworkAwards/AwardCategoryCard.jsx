/**
 * Category tile for Individual / Organization nomination grids (Figma export).
 *
 * @param {{
 *   label: string;
 *   image: string;
 *   onClick?: () => void;
 *   className?: string;
 * }} props
 */
export default function AwardCategoryCard({
    label,
    image,
    onClick,
    className = '',
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`group w-full overflow-hidden rounded-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] ${className}`}
        >
            <img
                src={image}
                alt={label}
                className="h-auto w-full object-contain transition duration-300 group-hover:brightness-110"
            />
        </button>
    );
}
