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
            className="group relative w-full overflow-hidden rounded-2xl outline-none transition-transform duration-300 ease-out will-change-transform motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.03] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] rounded-2xl opacity-0 shadow-[0_0_0_1px_rgba(251,191,36,0.35),0_12px_40px_rgba(251,191,36,0.28)] transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-1/3 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 ease-out motion-safe:group-hover:translate-x-[280%] motion-safe:group-hover:opacity-100"
            />
            <img
                src={image}
                alt={label}
                className="relative z-0 h-auto w-full object-contain transition duration-300 ease-out group-hover:brightness-110 group-hover:contrast-[1.05]"
            />
        </button>
    );
}
