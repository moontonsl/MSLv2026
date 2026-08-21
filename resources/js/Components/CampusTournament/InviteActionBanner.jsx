import { Bell } from 'lucide-react';

/**
 * Amber “Action Required” banner for invited team members.
 *
 * @param {{
 *   teamName: string;
 *   onAccept: () => void;
 *   onDecline: () => void;
 * }} props
 */
export default function InviteActionBanner({ teamName, onAccept, onDecline }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-700/50 bg-amber-950/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="flex items-start gap-2 text-sm text-amber-100 sm:items-center">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-amber-400 sm:mt-0" />
                <span>
                    Action Required: You have been invited to join Team{' '}
                    <span className="font-semibold text-white">{teamName}</span>.
                </span>
            </p>
            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    onClick={onDecline}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:flex-none"
                >
                    Decline
                </button>
                <button
                    type="button"
                    onClick={onAccept}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:flex-none"
                >
                    Accept Invite
                </button>
            </div>
        </div>
    );
}
