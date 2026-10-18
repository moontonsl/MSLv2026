import { CheckCircle2, ChevronsUpDown, Copy, Hourglass, User, XCircle } from "lucide-react";

const TONES = {
    green: {
        solid: "bg-emerald-500/15 text-emerald-400",
        outline: "border-emerald-500/60 bg-emerald-500/10 text-emerald-400",
        dot: "bg-emerald-400",
        Icon: CheckCircle2,
    },
    yellow: {
        solid: "bg-yellow-500/15 text-yellow-500",
        outline: "border-yellow-500/60 bg-yellow-500/10 text-yellow-500",
        dot: "bg-yellow-500",
        Icon: Hourglass,
    },
    red: {
        solid: "bg-red-500/15 text-red-400",
        outline: "border-red-500/60 bg-red-500/10 text-red-400",
        dot: "bg-red-500",
        Icon: XCircle,
    },
};

const TEAM_STATUS = {
    approved: { label: "Approved", tone: "green" },
    registered: { label: "Registered", tone: "green" },
    incomplete: { label: "Incomplete", tone: "red" },
    disqualified: { label: "Disqualified", tone: "red" },
    pending: { label: "Pending", tone: "yellow" },
};

const PLAYER_STATUS = {
    confirmed: { label: "Accepted", tone: "green" },
    accepted: { label: "Accepted", tone: "green" },
    declined: { label: "Declined", tone: "red" },
    withdrawn: { label: "Withdrawn", tone: "red" },
    pending: { label: "Pending", tone: "yellow" },
};

const teamStatusMeta = (status) => TEAM_STATUS[status] ?? TEAM_STATUS.pending;
const playerStatusMeta = (status) => PLAYER_STATUS[status] ?? PLAYER_STATUS.confirmed;

function StatusBadge({ label, tone, solid = false }) {
    const { solid: solidClass, outline: outlineClass, Icon } = TONES[tone];

    if (solid) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${solidClass}`}
            >
                <Icon className="h-3.5 w-3.5" />
                {label}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${outlineClass}`}
        >
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
}

function Avatar({ status }) {
    return (
        <div className="relative h-10 w-10 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                <User className="h-5 w-5" />
            </div>
            <span
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111111] ${
                    TONES[playerStatusMeta(status).tone].dot
                }`}
            />
        </div>
    );
}

function PlayerBadge({ status }) {
    const meta = playerStatusMeta(status);
    return <StatusBadge label={meta.label} tone={meta.tone} />;
}

function PlayerCell({ player, showStatusBadge = false }) {
    return (
        <div className="flex min-w-[140px] flex-1 items-start gap-3 px-3 py-3">
            <Avatar status={player.status} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                    {player.name}
                </p>
                <p className="truncate text-xs text-gray-400">{player.ign}</p>
                <p className="truncate text-xs text-gray-500">{player.uid}</p>
                {showStatusBadge ? (
                    <div className="mt-2">
                        <PlayerBadge status={player.status} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function PlayerMobileRow({ player, roleLabel, showStatusBadge = false }) {
    return (
        <div className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3 last:border-b-0">
            <Avatar status={player.status} />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-yellow-500">
                    {roleLabel}
                </p>
                <p className="truncate text-sm font-semibold text-white">
                    {player.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                    {player.ign} · {player.uid}
                </p>
            </div>
            {showStatusBadge ? <PlayerBadge status={player.status} /> : null}
        </div>
    );
}

/**
 * Captain / member roster card.
 *
 * Team statuses: pending | incomplete | registered | approved | disqualified.
 * Player statuses: confirmed (accepted) | pending | declined | withdrawn.
 *
 * @param {{
 *   team: object;
 *   onEdit?: () => void;
 *   onGenerateCode?: () => void;
 *   onCopyCode?: () => void;
 *   onLeave?: () => void;
 *   memberView?: boolean;
 *   showInviteCode?: boolean;
 * }} props
 */
export default function CaptainTeamCard({
    team,
    onEdit,
    onGenerateCode,
    onCopyCode,
    onLeave,
    memberView = false,
    showInviteCode = true,
}) {
    const roster = [team.captain, ...team.players].filter(Boolean);
    const teamMeta = teamStatusMeta(team.status);
    const isComplete = team.status === "approved" || team.status === "registered";
    const isDisqualified = team.status === "disqualified";
    const showCodeActions = !memberView && showInviteCode && !isDisqualified;
    // Approved members can only leave the team; everyone else sees the team status above Edit.
    const showLeave = memberView && isComplete && Boolean(onLeave);
    const showEdit = !showLeave && (!memberView || Boolean(onEdit));
    const showStatusInActions = !showLeave;
    const showActions = showEdit || showLeave || showStatusInActions;
    const showPlayerBadges = !isComplete;

    const actionStatusBadge = showStatusInActions ? (
        <div className="flex justify-center">
            <StatusBadge label={teamMeta.label} tone={teamMeta.tone} solid />
        </div>
    ) : null;

    const codeButton = showCodeActions ? (
        isComplete && team.inviteCode ? (
            <button
                type="button"
                onClick={onCopyCode}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-yellow-500 px-3 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
            >
                {team.inviteCode}
                <Copy className="h-4 w-4" />
            </button>
        ) : (
            <button
                type="button"
                onClick={onGenerateCode}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-yellow-500 px-4 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10"
            >
                Generate Code
            </button>
        )
    ) : null;

    const editButton = showEdit ? (
        <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black transition-colors hover:bg-yellow-400"
        >
            Edit
        </button>
    ) : null;

    const leaveButton = showLeave ? (
        <button
            type="button"
            onClick={onLeave}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
            Leave
        </button>
    ) : null;

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]">
            <div className="flex flex-col gap-3 border-b border-neutral-800 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        TEAM NAME:{" "}
                        <span className="text-yellow-500">{team.name}</span>
                    </h2>
                    <p className="mt-1 text-sm uppercase text-gray-300">
                        {team.school}
                    </p>
                </div>
                <div className="hidden sm:block">
                    <StatusBadge label={teamMeta.label} tone={teamMeta.tone} solid />
                </div>
            </div>

            {/* Mobile: stacked player rows */}
            <div className="md:hidden">
                {roster.map((player, index) => (
                    <PlayerMobileRow
                        key={player.id}
                        player={player}
                        roleLabel={
                            index === 0 ? "Captain" : `Player ${index + 1}`
                        }
                        showStatusBadge={index > 0 && showPlayerBadges}
                    />
                ))}
            </div>

            {/* Desktop: horizontal roster */}
            <div className="hidden flex-col gap-4 p-4 lg:flex-row lg:items-stretch lg:p-0 md:flex">
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex min-w-[760px] border-b border-neutral-800 bg-[#0a0a0a]">
                        {roster.map((player, index) => (
                            <div
                                key={player.id}
                                className="flex flex-1 items-center gap-1 px-3 py-2 text-xs font-semibold text-yellow-500"
                            >
                                {index === 0
                                    ? "Captain"
                                    : `Player ${index + 1}`}
                                <ChevronsUpDown className="h-3 w-3 text-gray-500" aria-hidden />
                            </div>
                        ))}
                    </div>
                    <div className="flex min-w-[760px] divide-x divide-neutral-800">
                        {roster.map((player, index) => (
                            <PlayerCell
                                key={player.id}
                                player={player}
                                showStatusBadge={index > 0 && showPlayerBadges}
                            />
                        ))}
                    </div>
                </div>

                {showActions ? (
                    <div className="flex shrink-0 flex-col justify-center gap-2 border-t border-neutral-800 pt-4 lg:w-40 lg:border-l lg:border-t-0 lg:p-4">
                        {actionStatusBadge}
                        {editButton}
                        {leaveButton}
                        {codeButton}
                    </div>
                ) : null}
            </div>

            {/* Mobile actions */}
            {showActions ? (
                <div className="grid grid-cols-1 gap-2 border-t border-neutral-800 p-4 md:hidden">
                    {actionStatusBadge}
                    {editButton || codeButton ? (
                        <div className={`grid gap-2 ${editButton && codeButton ? "grid-cols-2" : "grid-cols-1"}`}>
                            {editButton}
                            {codeButton}
                        </div>
                    ) : null}
                    {leaveButton}
                </div>
            ) : null}
        </article>
    );
}
