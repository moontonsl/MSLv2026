/**
 * Red roster notice for captains (declined invite, member left, disqualification).
 *
 * @param {{ label: string; children: import('react').ReactNode }} props
 */
export default function TeamNoticeBanner({ label, children }) {
    return (
        <div
            role="alert"
            className="rounded-lg border border-red-700/70 bg-red-950/50 px-3 py-2.5 text-sm text-red-200"
        >
            <p>
                <span className="font-semibold text-red-300">{label}:</span> {children}
            </p>
        </div>
    );
}
