import CampusTournamentPageHeader from '@/Components/CampusTournament/CampusTournamentPageHeader';
import CaptainTeamCard from '@/Components/CampusTournament/CaptainTeamCard';
import { ROLE_SLOTS } from '@/data/campusTournamentCaptainData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Hourglass, Search, UserRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const SEARCH_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#0a0a0a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-yellow-500 md:text-sm';

const SELECT_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3 py-2.5 text-base text-white outline-none focus:ring-2 focus:ring-yellow-500 md:text-sm';

const roleLabel = (code) => ROLE_SLOTS.find((role) => role.id === code)?.label ?? code;

export default function CaptainTeam({ team }) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState('');
    const [searching, setSearching] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Participants and open invitations can share ids, so the roster keys are namespaced.
    const rosterTeam = useMemo(
        () => ({
            ...team,
            players: (team.players ?? []).map((player) => ({
                ...player,
                id: `${player.status}-${player.id}`,
            })),
        }),
        [team],
    );

    const pendingInvites = useMemo(
        () => (team.players ?? []).filter((player) => player.status === 'pending'),
        [team.players],
    );

    useEffect(() => {
        if (search.trim().length < 2 || selectedUser) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(
                    `/school-players?search=${encodeURIComponent(search.trim())}&tournament=${team.tournamentId}&team=${team.id}`,
                    {
                        headers: { Accept: 'application/json' },
                        signal: controller.signal,
                    },
                );
                const payload = await response.json();
                setResults(response.ok ? (payload.data ?? []) : []);
            } catch (requestError) {
                if (requestError.name !== 'AbortError') setResults([]);
            } finally {
                setSearching(false);
            }
        }, 250);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [search, selectedUser, team.tournamentId, team.id]);

    const invite = (event) => {
        event.preventDefault();
        if (!selectedUser || !role) return;

        router.post(
            `/tournament-teams/${team.id}/invitations`,
            {
                user_id: selectedUser.id,
                intended_lane_role_code: role,
            },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setError(null);
                },
                onSuccess: () => {
                    setSearch('');
                    setSelectedUser(null);
                    setRole('');
                },
                onError: (errors) =>
                    setError(
                        Object.values(errors ?? {})[0] ?? 'Unable to send invitation.',
                    ),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const cancelInvitation = (invitationId) => {
        router.delete(`/tournament-invitations/${invitationId}`, {
            preserveScroll: true,
            onError: (errors) =>
                setError(
                    Object.values(errors ?? {})[0] ?? 'Unable to cancel invitation.',
                ),
        });
    };

    const canInvite = team.status !== 'approved' && (team.availableLaneRoles ?? []).length > 0;

    return (
        <MainLayout fullWidth>
            <Head title="Captain Team — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <CampusTournamentPageHeader>
                        <Link
                            href="/Tournament/CampusTournament"
                            className="text-sm text-gray-400 transition-colors hover:text-white"
                        >
                            ← Back to registration hub
                        </Link>
                    </CampusTournamentPageHeader>

                    {error ? (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    ) : null}

                    <CaptainTeamCard
                        team={rosterTeam}
                        showInviteCode={false}
                        onEdit={() => router.visit('/Tournament/CampusTournamentReg')}
                    />

                    {pendingInvites.length > 0 ? (
                        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">
                                    Pending Invitations
                                </h2>
                                <p className="shrink-0 text-sm text-white">
                                    {pendingInvites.length} Pending
                                </p>
                            </div>

                            <div className="space-y-3">
                                {pendingInvites.map((player) => (
                                    <article
                                        key={player.invitationId ?? player.id}
                                        className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-[#0a0a0a] p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                                                <UserRound className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-white">
                                                    {player.ign || player.name}
                                                </p>
                                                <p className="truncate text-xs text-gray-400">
                                                    {player.name} · {roleLabel(player.role)}
                                                </p>
                                            </div>
                                            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-yellow-500/15 px-2.5 py-1 text-xs font-semibold text-yellow-500 sm:ml-0">
                                                <Hourglass className="h-3.5 w-3.5" />
                                                Pending
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => cancelInvitation(player.invitationId)}
                                            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {canInvite ? (
                        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                            <h2 className="text-lg font-bold text-yellow-500 sm:text-xl">
                                Invite a Verified Campus Player
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Search by name, username, or MLBB IGN, then assign an open lane.
                            </p>

                            <form
                                onSubmit={invite}
                                className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-start"
                            >
                                <div className="relative">
                                    <label
                                        htmlFor="player-search"
                                        className="mb-2 block text-sm text-white"
                                    >
                                        Player <span className="text-red-500">*</span>
                                    </label>
                                    <Search className="pointer-events-none absolute left-3 top-[46px] h-4 w-4 text-gray-500" />
                                    <input
                                        id="player-search"
                                        type="search"
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setSelectedUser(null);
                                        }}
                                        placeholder="Search eligible player"
                                        autoComplete="off"
                                        className={SEARCH_CLASS}
                                    />
                                    {searching ? (
                                        <p className="mt-1 text-xs text-gray-500">Searching…</p>
                                    ) : null}
                                    {results.length > 0 ? (
                                        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-700 bg-[#181818] shadow-xl">
                                            {results.map((player) => (
                                                <button
                                                    key={player.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedUser(player);
                                                        setSearch(
                                                            `${player.ign} — ${player.username}`,
                                                        );
                                                        setResults([]);
                                                    }}
                                                    className="block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-800"
                                                >
                                                    <span className="font-semibold text-white">
                                                        {player.ign}
                                                    </span>
                                                    <span className="ml-2 text-gray-400">
                                                        {player.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <div>
                                    <label
                                        htmlFor="player-lane"
                                        className="mb-2 block text-sm text-white"
                                    >
                                        Lane <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="player-lane"
                                        value={role}
                                        onChange={(event) => setRole(event.target.value)}
                                        required
                                        className={SELECT_CLASS}
                                    >
                                        <option value="">Select open lane</option>
                                        {team.availableLaneRoles.map((code) => (
                                            <option key={code} value={code}>
                                                {roleLabel(code)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!selectedUser || processing}
                                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-yellow-500 px-6 text-sm font-bold text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 lg:mt-[30px] lg:w-auto"
                                >
                                    {processing ? 'Inviting…' : 'Send Invite'}
                                </button>
                            </form>
                        </section>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
}
