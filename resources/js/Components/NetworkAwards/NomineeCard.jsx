import { Building2, Check, MapPin } from 'lucide-react';

/**
 * MSL Network Awards nominee card (Figma voting: org campus + individual portrait).
 *
 * @param {{
 *   nominee: { id: string; name: string; school: string; image: string };
 *   type?: 'organization' | 'individual';
 *   selected?: boolean;
 *   dimmed?: boolean;
 *   onSelect?: () => void;
 *   className?: string;
 * }} props
 */
export default function NomineeCard({
    nominee,
    type = 'organization',
    selected = false,
    dimmed = false,
    onSelect,
    className = '',
}) {
    const SchoolIcon = type === 'individual' ? MapPin : Building2;

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`group w-full overflow-hidden rounded-xl text-left transition ${
                selected
                    ? 'border-2 border-[#FBBF24] bg-[#141414]'
                    : 'border border-neutral-700 bg-[#141414]'
            } ${dimmed ? 'opacity-40 grayscale' : 'opacity-100'} ${className}`}
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                <img
                    src={nominee.image}
                    alt={nominee.name}
                    className="h-full w-full object-cover"
                />
                {selected ? (
                    <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                        <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                ) : null}
            </div>

            <div className="space-y-1.5 px-3 py-3">
                <p
                    className={`truncate text-base font-bold ${
                        selected
                            ? 'text-[#FBBF24]'
                            : dimmed
                              ? 'text-gray-500'
                              : 'text-white'
                    }`}
                >
                    {nominee.name}
                </p>
                <p
                    className={`flex items-center gap-1.5 truncate text-xs ${
                        dimmed ? 'text-gray-600' : 'text-gray-400'
                    }`}
                >
                    <SchoolIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{nominee.school}</span>
                </p>
            </div>
        </button>
    );
}
