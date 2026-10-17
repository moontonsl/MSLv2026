import { ChevronDown } from 'lucide-react';

export default function AdminFilterSelect({
    className = '',
    compact = false,
    children,
    ...props
}) {
    const sizeClasses = compact
        ? 'min-h-10 px-2 py-2 text-xs'
        : 'min-h-[44px] px-3 py-2.5 text-sm';

    return (
        <div className="relative w-full min-w-0 sm:w-auto">
            <select
                {...props}
                className={`w-full appearance-none rounded-md border border-neutral-800 bg-[#1a1a1a] ${sizeClasses} text-white outline-none focus:ring-2 focus:ring-yellow-500 ${className} !pr-10`}
            >
                {children}
            </select>
            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            />
        </div>
    );
}
