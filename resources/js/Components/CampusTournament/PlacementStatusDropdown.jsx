import { PLACEMENT_OPTIONS } from '@/data/campusTournamentData';
import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

/**
 * Colored placement status dropdown for Match Management.
 *
 * @param {{
 *   value: string;
 *   onChange: (placementId: string) => void;
 *   disabled?: boolean;
 * }} props
 */
export default function PlacementStatusDropdown({ value, onChange, disabled = false }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const listId = useId();

    const selected =
        PLACEMENT_OPTIONS.find((option) => option.id === value) ?? PLACEMENT_OPTIONS[0];

    useEffect(() => {
        if (!open) return undefined;

        const handlePointer = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', handlePointer);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handlePointer);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative inline-block min-w-[128px]">
            <button
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((prev) => !prev)}
                className={`inline-flex min-h-[36px] w-full items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${selected.buttonClass}`}
            >
                <span className="truncate">{selected.label}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" />
            </button>

            {open ? (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute right-0 z-30 mt-1 min-w-full overflow-hidden rounded-lg border border-neutral-700 bg-[#0a0a0a] py-1 shadow-xl"
                >
                    {PLACEMENT_OPTIONS.map((option) => {
                        const isActive = option.id === selected.id;
                        return (
                            <li key={option.id} role="option" aria-selected={isActive}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option.id);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center px-3 py-2.5 text-left text-xs font-semibold transition-colors hover:bg-[#1a1a1a] ${option.menuClass} ${
                                        isActive ? 'bg-[#1a1a1a]' : ''
                                    }`}
                                >
                                    {option.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
