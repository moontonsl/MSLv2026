/**
 * MLBB-style role badge icons for solo matchmaking slots.
 *
 * @param {{ role: string; className?: string }} props
 */
export default function SoloRoleIcon({ role, className = '' }) {
    const key = String(role || '').toUpperCase();
    const base = `flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-black ${className}`;

    if (key === 'GOLD') {
        return (
            <span className={`${base} bg-yellow-500 text-black`} aria-hidden>
                $
            </span>
        );
    }

    if (key === 'EXP') {
        return (
            <span className={`${base} bg-yellow-500 text-black`} aria-hidden>
                Σ
            </span>
        );
    }

    if (key === 'MID') {
        return (
            <span className={`${base} bg-yellow-500 text-black`} aria-hidden>
                Z
            </span>
        );
    }

    if (key === 'ROAM') {
        return (
            <span
                className={`${base} border border-white bg-transparent text-yellow-500`}
                aria-hidden
            >
                /
            </span>
        );
    }

    // JUNGLER default
    return (
        <span
            className={`${base} border border-white bg-transparent`}
            aria-hidden
        >
            <span className="block h-3 w-3 rotate-45 border border-yellow-500 bg-yellow-500/20" />
        </span>
    );
}
