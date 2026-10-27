import { ROLE_SLOTS } from '@/data/campusTournamentCaptainData';
import { isLaneTakenByAnotherPlayer } from './laneSelection';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleHelp, Search, User, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const INPUT_CLASS =
    'min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500';

const PLAYER_SLOTS = [2, 3, 4, 5];

function SelectedPlayerCard({ player, onClear }) {
    return (
        <div className="flex min-h-[44px] items-center gap-3 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3 py-2.5">
            <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400">
                    <User className="h-5 w-5" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                    {player.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                    {player.ign}
                    {player.uid ? ` · ${player.uid}` : ''}
                </p>
            </div>
            <button
                type="button"
                onClick={onClear}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-500/10"
                aria-label="Remove player"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function PlayerSlotField({
    slot,
    tournamentId,
    selected,
    excludedKey,
    onSelect,
    onClear,
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const excludedIds = useMemo(
        () => (excludedKey ? excludedKey.split(',').filter(Boolean) : []),
        [excludedKey],
    );

    useEffect(() => {
        if (selected || query.trim().length < 2 || !tournamentId) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(
                    `/school-players?search=${encodeURIComponent(query.trim())}&tournament=${tournamentId}`,
                    {
                        headers: { Accept: 'application/json' },
                        signal: controller.signal,
                    },
                );
                const payload = await response.json();
                const list = response.ok ? (payload.data ?? []) : [];
                setResults(
                    list.filter(
                        (player) => !excludedIds.includes(String(player.id)),
                    ),
                );
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
    }, [query, selected, tournamentId, excludedIds]);

    if (selected) {
        return (
            <div>
                <label className="mb-2 block text-sm text-white">
                    Player {slot} <span className="text-red-500">*</span>
                </label>
                <SelectedPlayerCard
                    player={selected}
                    onClear={() => {
                        setQuery('');
                        onClear();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <label htmlFor={`player-${slot}`} className="mb-2 block text-sm text-white">
                Player {slot} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                    id={`player-${slot}`}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="e.g. DAKI"
                    autoComplete="off"
                    className={`${INPUT_CLASS} pl-10`}
                />
            </div>
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
                                onSelect(player);
                                setQuery('');
                                setResults([]);
                            }}
                            className="block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-800"
                        >
                            <span className="font-semibold text-white">{player.ign}</span>
                            <span className="ml-2 text-gray-400">{player.name}</span>
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function LaneSelect({ id, value, onChange, disabledLanes, error }) {
    return (
        <div className="min-w-0">
            <label htmlFor={id} className="mb-2 block text-sm text-white">
                Lane <span className="text-red-500">*</span>
            </label>
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required
                className={INPUT_CLASS}
            >
                <option value="">Select lane</option>
                {ROLE_SLOTS.map((role) => (
                    <option
                        key={role.id}
                        value={role.id}
                        disabled={disabledLanes(role.id)}
                    >
                        {role.label}
                    </option>
                ))}
            </select>
            {error ? (
                <p className="mt-1 text-xs text-red-400">{error}</p>
            ) : null}
        </div>
    );
}

export default function CaptainRegister({ captain, tournament }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        discord_id: '',
        assigned_lane_role_code: '',
        members: PLAYER_SLOTS.map(() => ({
            username: '',
            intended_lane_role_code: '',
        })),
    });
    const [players, setPlayers] = useState({ 2: null, 3: null, 4: null, 5: null });

    const excludedKey = useMemo(
        () =>
            Object.values(players)
                .filter(Boolean)
                .map((player) => String(player.id))
                .join(','),
        [players],
    );

    const setMember = (slot, field, value) => {
        const memberIndex = slot - 2;
        setData(
            'members',
            data.members.map((member, index) =>
                index === memberIndex ? { ...member, [field]: value } : member,
            ),
        );
    };

    const submit = (event) => {
        event.preventDefault();
        if (!tournament) return;
        post(`/campus-tournaments/${tournament.id}/teams`);
    };

    return (
        <MainLayout fullWidth>
            <Head title="Create Premade Team — Campus Tournament" />
            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6">
                <div className="mx-auto max-w-xl">
                    <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-5 sm:p-8">
                        <Link
                            href="/Tournament/CampusTournament"
                            className="mb-6 inline-flex min-h-[44px] items-center text-sm text-gray-400 hover:text-white"
                        >
                            Back
                        </Link>
                        <h1 className="text-center text-xl font-black uppercase tracking-wide sm:text-2xl">
                            {tournament?.title ?? 'Premade Team Registration'}
                        </h1>

                        {!tournament ? (
                            <div className="mt-8 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                                No tournament is currently open for registration at your campus.
                            </div>
                        ) : (
                            <form onSubmit={submit} className="mt-8 space-y-5">
                                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-4 text-sm">
                                    <p className="font-semibold text-yellow-500">
                                        Important Requirements:
                                    </p>
                                    <ul className="mt-2 list-disc space-y-2 pl-5 text-white">
                                        <li>
                                            <span className="font-semibold">Verification Required:</span>{' '}
                                            All team members must be verified users to participate in
                                            campus tournaments.
                                        </li>
                                        <li>
                                            Each team may include only one senior high school student
                                            in their roster.
                                        </li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,0.65fr)] gap-3">
                                    <div className="min-w-0">
                                        <label
                                            htmlFor="captain-ign"
                                            className="mb-2 block text-sm text-white"
                                        >
                                            Captain (Player 1) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="captain-ign"
                                                value={captain?.ign ?? ''}
                                                readOnly
                                                className={`${INPUT_CLASS} pr-11 text-gray-400`}
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                                title={`${captain?.name ?? ''} — ${captain?.ign ?? ''}`}
                                            >
                                                <CircleHelp className="h-5 w-5" />
                                            </span>
                                        </div>
                                    </div>
                                    <LaneSelect
                                        id="captain-lane"
                                        value={data.assigned_lane_role_code}
                                        onChange={(value) =>
                                            setData('assigned_lane_role_code', value)
                                        }
                                        disabledLanes={(lane) =>
                                            isLaneTakenByAnotherPlayer(
                                                lane,
                                                data.assigned_lane_role_code,
                                                data.members,
                                            )
                                        }
                                        error={errors.assigned_lane_role_code}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="discord-id"
                                        className="mb-2 block text-sm text-white"
                                    >
                                        Discord ID (optional)
                                    </label>
                                    <input
                                        id="discord-id"
                                        value={data.discord_id}
                                        onChange={(event) =>
                                            setData('discord_id', event.target.value)
                                        }
                                        placeholder="e.g. username00000"
                                        className={INPUT_CLASS}
                                    />
                                    {errors.discord_id ? (
                                        <span className="mt-1 block text-xs text-red-400">
                                            {errors.discord_id}
                                        </span>
                                    ) : null}
                                </div>

                                <div>
                                    <label
                                        htmlFor="team-name"
                                        className="mb-2 block text-sm text-white"
                                    >
                                        Team Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="team-name"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        placeholder="e.g. MSL PH"
                                        required
                                        className={INPUT_CLASS}
                                    />
                                    {errors.name ? (
                                        <span className="mt-1 block text-xs text-red-400">
                                            {errors.name}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-4 text-sm">
                                    <p className="font-semibold text-yellow-500">Note:</p>
                                    <p className="mt-1 text-white">
                                        Players must be from your school, verified, and have an MSL
                                        Account.
                                    </p>
                                </div>

                                {PLAYER_SLOTS.map((slot) => {
                                    const memberIndex = slot - 2;
                                    const member = data.members[memberIndex];

                                    return (
                                        <div
                                            key={slot}
                                            className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,0.65fr)] gap-3"
                                        >
                                            <PlayerSlotField
                                                slot={slot}
                                                tournamentId={tournament.id}
                                                selected={players[slot]}
                                                excludedKey={excludedKey}
                                                onSelect={(player) => {
                                                    setPlayers((current) => ({
                                                        ...current,
                                                        [slot]: player,
                                                    }));
                                                    setMember(slot, 'username', player.username);
                                                }}
                                                onClear={() => {
                                                    setPlayers((current) => ({
                                                        ...current,
                                                        [slot]: null,
                                                    }));
                                                    setMember(slot, 'username', '');
                                                }}
                                            />
                                            <LaneSelect
                                                id={`player-${slot}-lane`}
                                                value={member.intended_lane_role_code}
                                                onChange={(value) =>
                                                    setMember(
                                                        slot,
                                                        'intended_lane_role_code',
                                                        value,
                                                    )
                                                }
                                                disabledLanes={(lane) =>
                                                    isLaneTakenByAnotherPlayer(
                                                        lane,
                                                        data.assigned_lane_role_code,
                                                        data.members,
                                                        memberIndex,
                                                    )
                                                }
                                                error={
                                                    errors[
                                                        `members.${memberIndex}.intended_lane_role_code`
                                                    ]
                                                }
                                            />
                                            {errors[`members.${memberIndex}.username`] ? (
                                                <p className="col-span-2 text-xs text-red-400">
                                                    {errors[`members.${memberIndex}.username`]}
                                                </p>
                                            ) : null}
                                        </div>
                                    );
                                })}

                                {errors.members ? (
                                    <p className="text-sm text-red-400">{errors.members}</p>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="min-h-[48px] w-full rounded-lg bg-yellow-500 text-base font-bold text-black transition-colors hover:bg-yellow-400 disabled:opacity-60"
                                >
                                    {processing ? 'Submitting…' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>

                    <p className="mt-6 text-center text-xs leading-relaxed text-gray-400 sm:text-sm">
                        Make sure that you have read the{' '}
                        <a href="#" className="text-yellow-500 underline underline-offset-2">
                            Rulebook
                        </a>{' '}
                        to avoid conflicts. Also, join the{' '}
                        <a href="#" className="text-yellow-500 underline underline-offset-2">
                            Discord Server
                        </a>{' '}
                        or our{' '}
                        <a href="#" className="text-yellow-500 underline underline-offset-2">
                            Facebook Page
                        </a>{' '}
                        for more information and announcements
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
