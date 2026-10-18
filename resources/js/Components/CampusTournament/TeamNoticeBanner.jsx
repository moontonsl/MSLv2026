import { AlertTriangle } from 'lucide-react';

/**
 * Red roster notice for captains (declined invite, member left, disqualification).
 *
 * @param {{ label: string; children: import('react').ReactNode }} props
 */
export default function TeamNoticeBanner({ label, children }) {
    return (
        <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-700/60 bg-red-950/40 px-4 py-3 text-sm text-red-100 sm:items-center"
        >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400 sm:mt-0" />
            <p>
                <span className="font-semibold text-red-400">{label}:</span> {children}
            </p>
        </div>
    );
}
