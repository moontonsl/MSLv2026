import CampusTournamentPageHeader from '@/Components/CampusTournament/CampusTournamentPageHeader';
import ConfirmResultsModal from '@/Components/CampusTournament/ConfirmResultsModal';
import MatchPlayerCell from '@/Components/CampusTournament/MatchPlayerCell';
import PlacementStatusDropdown from '@/Components/CampusTournament/PlacementStatusDropdown';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    FileCheck2,
    History,
    Pencil,
    Save,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const MANILA_TIME = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
});

const PLACEMENT_LABELS = {
    '1st': '1st Place',
    '2nd': '2nd Place',
    '3rd': '3rd Place',
    '4th': '4th Place',
    participant: 'Participant',
};

const PLACEMENT_COLORS = {
    '1st': 'text-yellow-400',
    '2nd': 'text-slate-300',
    '3rd': 'text-orange-400',
    '4th': 'text-emerald-400',
};

function initialPlacementMap(teams) {
    return Object.fromEntries(
        teams.map((team) => [team.id, team.placement ?? 'participant']),
    );
}

export default function PostEventReport({
    viewerRole,
    backUrl,
    tournament,
    permissions,
}) {
    const [placements, setPlacements] = useState(() =>
        initialPlacementMap(tournament.teams),
    );
    const [editing, setEditing] = useState(
        !tournament.currentResult && permissions.canSubmit,
    );
    const [reason, setReason] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const isCorrection = Boolean(tournament.currentResult);
    const canEdit = permissions.canSubmit || permissions.canCorrect;
    const playerCount = tournament.teams.reduce(
        (total, team) => total + (team.players?.length ?? 0),
        0,
    );
    const placementSummary = useMemo(
        () =>
            ['1st', '2nd', '3rd', '4th'].map((code) => ({
                id: code,
                label: PLACEMENT_LABELS[code],
                rankColor: PLACEMENT_COLORS[code],
                teamName:
                    tournament.teams
                        .filter((team) => placements[team.id] === code)
                        .map((team) => team.name)
                        .join(', ') || '—',
            })),
        [placements, tournament.teams],
    );

    const beginCorrection = () => {
        setPlacements(initialPlacementMap(tournament.teams));
        setReason('');
        setError('');
        setEditing(true);
    };

    const cancelCorrection = () => {
        setPlacements(initialPlacementMap(tournament.teams));
        setReason('');
        setError('');
        setEditing(false);
    };

    const requestSubmit = () => {
        if (!Object.values(placements).includes('1st')) {
            setError('Assign at least one team to first place.');
            return;
        }
        if (isCorrection && !reason.trim()) {
            setError('Provide a reason for this correction.');
            return;
        }
        setError('');
        setConfirmOpen(true);
    };

    const confirmSubmit = () => {
        const url = isCorrection
            ? `/campus-tournaments/${tournament.id}/result-revisions`
            : `/campus-tournaments/${tournament.id}/results`;
        const payload = {
            entries: tournament.teams.map((team) => ({
                team_id: team.id,
                placement_code: placements[team.id],
            })),
            ...(isCorrection ? { reason: reason.trim() } : {}),
        };

        setProcessing(true);
        router.post(url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmOpen(false);
                setEditing(false);
                setReason('');
            },
            onError: (errors) => {
                setConfirmOpen(false);
                setError(
                    errors?.reason ||
                        errors?.entries ||
                        Object.values(errors || {})[0] ||
                        'Unable to save the tournament report.',
                );
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <MainLayout fullWidth>
            <Head title={`${tournament.name} — Post-Event Report`} />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <Link
                        href={backUrl}
                        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-300 hover:text-yellow-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to tournaments
                    </Link>

                    <CampusTournamentPageHeader title="Post-Event Report" />

                    <section className="rounded-2xl border border-neutral-800 bg-[#111111] p-5 sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="mb-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase text-emerald-400">
                                        Completed
                                    </span>
                                    <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-bold text-yellow-400">
                                        {tournament.type}
                                    </span>
                                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold capitalize text-gray-300">
                                        {viewerRole.replace('_', ' ')} view
                                    </span>
                                </div>
                                <h1 className="text-2xl font-black uppercase text-white sm:text-3xl">
                                    {tournament.name}
                                </h1>
                                <p className="mt-2 text-sm text-gray-400">
                                    {tournament.school}
                                    {tournament.campus
                                        ? ` — ${tournament.campus}`
                                        : ''}
                                    {tournament.region
                                        ? ` · ${tournament.region}`
                                        : ''}
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {MANILA_TIME.format(
                                        new Date(tournament.startsAt),
                                    )}{' '}
                                    –{' '}
                                    {MANILA_TIME.format(
                                        new Date(tournament.endsAt),
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {permissions.canExport ? (
                                    <a
                                        href={`/campus-tournaments/${tournament.id}/results/export`}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-yellow-500 px-4 text-sm font-bold text-black hover:bg-yellow-400"
                                    >
                                        <Download className="h-4 w-4" /> Excel
                                    </a>
                                ) : null}
                                {permissions.canCorrect && !editing ? (
                                    <button
                                        type="button"
                                        onClick={beginCorrection}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500"
                                    >
                                        <Pencil className="h-4 w-4" /> Edit
                                        results
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Stat
                                label="Registered teams"
                                value={tournament.teams.length}
                                icon={Users}
                            />
                            <Stat
                                label="Registered players"
                                value={playerCount}
                                icon={Users}
                            />
                            <Stat
                                label="Report status"
                                value={
                                    tournament.currentResult
                                        ? 'Submitted'
                                        : 'Pending'
                                }
                                icon={FileCheck2}
                            />
                            <Stat
                                label="Current revision"
                                value={
                                    tournament.currentResult
                                        ? `v${tournament.currentResult.version}`
                                        : '—'
                                }
                                icon={History}
                            />
                        </div>
                    </section>

                    {tournament.currentResult ? (
                        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
                            <p className="font-bold text-emerald-400">
                                Results submitted
                            </p>
                            <p className="mt-1 text-gray-300">
                                Version {tournament.currentResult.version} by{' '}
                                {tournament.currentResult.submittedBy ||
                                    'Unknown user'}{' '}
                                on{' '}
                                {MANILA_TIME.format(
                                    new Date(
                                        tournament.currentResult.submittedAt,
                                    ),
                                )}
                            </p>
                            {tournament.currentResult.reason ? (
                                <p className="mt-2 text-gray-400">
                                    Correction reason:{' '}
                                    {tournament.currentResult.reason}
                                </p>
                            ) : null}
                        </section>
                    ) : (
                        <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-100">
                            The post-event results have not been submitted yet.
                        </section>
                    )}

                    <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]">
                        <div className="border-b border-neutral-800 px-5 py-4">
                            <h2 className="text-lg font-bold text-yellow-500">
                                Team placements
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Every registered team is included. Multiple
                                teams may share a placement.
                            </p>
                        </div>

                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full min-w-[1050px]">
                                <thead className="border-b border-neutral-800 text-left text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Team</th>
                                        {[
                                            'Captain',
                                            'Player 2',
                                            'Player 3',
                                            'Player 4',
                                            'Player 5',
                                        ].map((label) => (
                                            <th
                                                key={label}
                                                className="px-3 py-3"
                                            >
                                                {label}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3">Placement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tournament.teams.map((team) => (
                                        <tr
                                            key={team.id}
                                            className="border-b border-neutral-800/70 last:border-0"
                                        >
                                            <td className="px-4 py-4 font-semibold text-white">
                                                {team.name}
                                            </td>
                                            {Array.from(
                                                { length: 5 },
                                                (_, index) => (
                                                    <td
                                                        key={index}
                                                        className="px-3 py-4"
                                                    >
                                                        {team.players[index] ? (
                                                            <MatchPlayerCell
                                                                player={{
                                                                    ...team
                                                                        .players[
                                                                        index
                                                                    ],
                                                                    uid: team
                                                                        .players[
                                                                        index
                                                                    ].uid
                                                                        ? `${team.players[index].uid}${team.players[index].server ? ` (${team.players[index].server})` : ''}`
                                                                        : 'N/A',
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-red-400">
                                                                Missing player
                                                            </span>
                                                        )}
                                                    </td>
                                                ),
                                            )}
                                            <td className="px-4 py-4">
                                                <PlacementStatusDropdown
                                                    value={placements[team.id]}
                                                    disabled={
                                                        !editing || !canEdit
                                                    }
                                                    onChange={(code) =>
                                                        setPlacements(
                                                            (current) => ({
                                                                ...current,
                                                                [team.id]: code,
                                                            }),
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 p-4 lg:hidden">
                            {tournament.teams.map((team) => (
                                <article
                                    key={team.id}
                                    className="rounded-xl border border-neutral-800 bg-[#0a0a0a] p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-bold text-white">
                                            {team.name}
                                        </h3>
                                        <PlacementStatusDropdown
                                            value={placements[team.id]}
                                            disabled={!editing || !canEdit}
                                            onChange={(code) =>
                                                setPlacements((current) => ({
                                                    ...current,
                                                    [team.id]: code,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {team.players.map((player) => (
                                            <MatchPlayerCell
                                                key={player.id}
                                                player={player}
                                            />
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {editing && canEdit ? (
                        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-5">
                            {isCorrection ? (
                                <div>
                                    <label
                                        htmlFor="correction-reason"
                                        className="text-sm font-semibold text-white"
                                    >
                                        Correction reason
                                    </label>
                                    <textarea
                                        id="correction-reason"
                                        value={reason}
                                        onChange={(event) =>
                                            setReason(event.target.value)
                                        }
                                        rows={3}
                                        maxLength={2000}
                                        className="mt-2 w-full rounded-lg border border-neutral-700 bg-[#0a0a0a] px-3 py-2 text-white outline-none focus:border-yellow-500"
                                        placeholder="Explain why the submitted rankings need to change."
                                    />
                                </div>
                            ) : null}

                            {error ? (
                                <p className="mt-3 text-sm text-red-400">
                                    {error}
                                </p>
                            ) : null}

                            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                                {isCorrection ? (
                                    <button
                                        type="button"
                                        onClick={cancelCorrection}
                                        className="min-h-11 rounded-lg border border-neutral-600 px-5 text-sm font-semibold text-gray-200"
                                    >
                                        Cancel
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={requestSubmit}
                                    disabled={processing}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 text-sm font-bold text-black hover:bg-yellow-400 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isCorrection
                                        ? 'Save correction'
                                        : 'Submit results'}
                                </button>
                            </div>
                        </section>
                    ) : null}

                    {tournament.revisionHistory.length > 0 ? (
                        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-5">
                            <h2 className="flex items-center gap-2 font-bold text-white">
                                <History className="h-4 w-4 text-yellow-500" />{' '}
                                Revision history
                            </h2>
                            <div className="mt-4 space-y-3">
                                {tournament.revisionHistory.map((revision) => (
                                    <div
                                        key={revision.version}
                                        className="rounded-lg border border-neutral-800 p-3 text-sm"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="font-semibold text-white">
                                                Version {revision.version}{' '}
                                                {revision.isCurrent ? (
                                                    <span className="ml-1 text-xs text-emerald-400">
                                                        Current
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {MANILA_TIME.format(
                                                    new Date(
                                                        revision.submittedAt,
                                                    ),
                                                )}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-gray-400">
                                            Submitted by {revision.submittedBy}
                                        </p>
                                        {revision.reason ? (
                                            <p className="mt-1 text-gray-300">
                                                Reason: {revision.reason}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>

            <ConfirmResultsModal
                isOpen={confirmOpen}
                mode={isCorrection ? 'update' : 'submit'}
                placements={placementSummary}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmSubmit}
            />
        </MainLayout>
    );
}

function Stat({ label, value, icon: Icon }) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-[#0a0a0a] p-4">
            <Icon className="h-4 w-4 text-yellow-500" />
            <p className="mt-3 text-xl font-black text-white">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{label}</p>
        </div>
    );
}
