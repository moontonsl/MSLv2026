const TONES = {
    purple: 'border-purple-500/50 bg-purple-900/30 text-purple-300',
    blue: 'border-blue-500/30 bg-blue-950/40 text-blue-300',
    gold: 'border-brand-500/30 bg-brand-500/10 text-brand-500',
};

export default function DepartmentBadge({ icon: Icon, tone = 'purple', className = '', children }) {
    return (
        <span className={`inline-flex min-h-8 max-w-full items-center justify-center gap-2 rounded-full border px-3 py-1.5 align-middle font-sans text-body-footer font-bold ${TONES[tone] || TONES.purple} ${className}`}>
            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="min-w-0 text-center">{children}</span>
        </span>
    );
}
