/**
 * Landing Individual / Organization awards entry card (Figma export).
 *
 * @param {{
 *   label: string;
 *   image: string;
 *   onClick?: () => void;
 * }} props
 */
export default function NominationTrackCard({ label, image, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="group w-full overflow-hidden rounded-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
        >
            <img
                src={image}
                alt={label}
                className="h-auto w-full object-contain transition duration-300 group-hover:brightness-110"
            />
        </button>
    );
}
