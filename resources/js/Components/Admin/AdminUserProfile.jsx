import { User } from 'lucide-react';

const ACCENT = '#FBBF24';

export default function AdminUserProfile({
    name = 'Evren',
    role = 'Super Admin',
}) {
    return (
        <div className="flex items-center gap-3">
            <div>
                <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: ACCENT }}>
                        {name}
                    </p>
                    <p className="text-xs text-gray-400">{role}</p>
                </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-neutral-800">
                <User className="h-5 w-5 text-gray-300" />
            </div>
        </div>
    );
}
