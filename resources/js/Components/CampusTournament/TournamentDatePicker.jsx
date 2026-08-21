import { CALENDAR_EVENT_DATES, formatShortDate } from '@/data/campusTournamentData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su'];
const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function toIso(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseIso(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildCalendarDays(viewDate) {
    const first = startOfMonth(viewDate);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + index);
        return day;
    });
}

/**
 * @param {{
 *   isOpen: boolean;
 *   value?: string | null;
 *   eventDates?: string[];
 *   onCancel: () => void;
 *   onApply: (isoDate: string) => void;
 * }} props
 */
export default function TournamentDatePicker({
    isOpen,
    value = null,
    eventDates = CALENDAR_EVENT_DATES,
    onCancel,
    onApply,
}) {
    const initial = parseIso(value) ?? new Date();
    const [viewDate, setViewDate] = useState(startOfMonth(initial));
    const [selected, setSelected] = useState(value ?? toIso(initial));

    useEffect(() => {
        if (!isOpen) return;
        const next = parseIso(value) ?? new Date();
        setViewDate(startOfMonth(next));
        setSelected(value ?? toIso(next));
    }, [isOpen, value]);

    const days = useMemo(() => buildCalendarDays(viewDate), [viewDate]);
    const eventSet = useMemo(() => new Set(eventDates), [eventDates]);

    if (!isOpen) return null;

    const goMonth = (delta) => {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const selectToday = () => {
        const today = new Date();
        setViewDate(startOfMonth(today));
        setSelected(toIso(today));
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Select date"
        >
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close date picker"
                onClick={onCancel}
            />
            <div className="relative w-[95%] max-w-sm rounded-2xl border border-[#333] bg-[#111111] p-4 shadow-2xl sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => goMonth(-1)}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-yellow-500 transition-colors hover:bg-yellow-500/10"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <p className="text-base font-semibold text-yellow-500">
                        {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </p>
                    <button
                        type="button"
                        onClick={() => goMonth(1)}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-yellow-500 transition-colors hover:bg-yellow-500/10"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4 flex items-center gap-2">
                    <div className="min-h-[44px] flex-1 rounded-lg border border-yellow-500/40 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white">
                        {formatShortDate(selected)}
                    </div>
                    <button
                        type="button"
                        onClick={selectToday}
                        className="min-h-[44px] shrink-0 rounded-lg border border-yellow-500/40 bg-[#1a1a1a] px-4 text-sm font-medium text-white transition-colors hover:border-yellow-500"
                    >
                        Today
                    </button>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                    {WEEKDAYS.map((day) => (
                        <span key={day} className="py-1 text-xs font-semibold text-yellow-500">
                            {day}
                        </span>
                    ))}
                </div>

                <div className="mb-5 grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const iso = toIso(day);
                        const inMonth = day.getMonth() === viewDate.getMonth();
                        const isSelected = iso === selected;
                        const hasEvent = eventSet.has(iso);

                        return (
                            <button
                                key={iso}
                                type="button"
                                onClick={() => setSelected(iso)}
                                className={`relative flex min-h-11 flex-col items-center justify-center rounded-full text-sm transition-colors ${
                                    isSelected
                                        ? 'bg-yellow-500 font-bold text-black'
                                        : inMonth
                                          ? 'text-gray-200 hover:bg-yellow-500/20'
                                          : 'text-gray-600 hover:bg-white/5'
                                }`}
                            >
                                {day.getDate()}
                                {hasEvent ? (
                                    <span
                                        className={`absolute bottom-1 h-1 w-1 rounded-full ${
                                            isSelected ? 'bg-black' : 'bg-yellow-500'
                                        }`}
                                    />
                                ) : null}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[#333] pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="min-h-[44px] rounded-lg border border-yellow-500 bg-transparent text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onApply(selected)}
                        className="min-h-[44px] rounded-lg bg-yellow-500 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
