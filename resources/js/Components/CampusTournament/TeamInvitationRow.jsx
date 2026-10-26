import { User } from "lucide-react";

/**
 * Horizontal (desktop) / stacked (mobile) invitation row — Team Name, Captain, View/Accept/Decline.
 *
 * @param {{
 *   invitation: object;
 *   onView: () => void;
 *   onAccept: () => void;
 *   onDecline: () => void;
 * }} props
 */
export default function TeamInvitationRow({
    invitation,
    onView,
    onAccept,
    onDecline,
}) {
    const team = invitation.team;
    const captain = team.captain;

    return (
        <article className="rounded-xl border border-yellow-500/40 bg-[#0a0a0a] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 lg:w-44">
                    <p className="text-xs text-gray-400">Team Name</p>
                    <p className="mt-1 truncate text-lg font-bold uppercase text-yellow-500">
                        {team.name}
                    </p>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                            <User className="h-5 w-5" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-yellow-500">
                            Captain
                        </p>
                        <p className="truncate text-sm font-semibold text-white">
                            {captain?.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                            {captain?.ign}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                            {captain?.uid}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 lg:flex lg:shrink-0">
                    <button
                        type="button"
                        onClick={onView}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-600 bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:border-neutral-400"
                    >
                        View
                    </button>
                    <button
                        type="button"
                        onClick={onAccept}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        onClick={onDecline}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </article>
    );
}
