import MatchPlayerCell from '@/Components/CampusTournament/MatchPlayerCell';
import PlacementStatusDropdown from '@/Components/CampusTournament/PlacementStatusDropdown';
import RosterLockCard from '@/Components/CampusTournament/RosterLockCard';
import { SL_ROSTER_FILTER_TABS } from '@/data/campusTournamentData';
import { ArrowDownUp, Check, User } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Roster & Solo Players tab for SL tournament panel.
 * Figma: Roster Lock + All/Solo/Team filters + full roster table with Participant status.
 *
 * @param {{
 *   rosterLockDate?: string;
 *   teams?: Array<{
 *     id: string;
 *     name: string;
 *     type?: string;
 *     status?: string;
 *     placement?: string;
 *     captain?: { name: string; ign: string; uid: string; role?: string };
 *     players?: Array<{ id: string; name: string; ign: string; uid: string; role?: string }>;
 *     matchReady?: boolean;
 *   }>;
 * }} props
 */
export default function SlRosterPanel({ rosterLockDate = 'May 14, 2026', teams = [] }) {
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [placements, setPlacements] = useState(() =>
        Object.fromEntries(
            teams.map((team) => [team.id, team.placement ?? 'participant']),
        ),
    );

    const counts = useMemo(
        () => ({
            all: teams.length,
            solo: teams.filter((team) => team.type === 'solo').length,
            team: teams.filter((team) => team.type !== 'solo').length,
        }),
        [teams],
    );

    const filtered = useMemo(() => {
        return teams.filter((team) => {
            if (filter === 'solo' && team.type !== 'solo') return false;
            if (filter === 'team' && team.type === 'solo') return false;
            if (statusFilter !== 'all' && team.status !== statusFilter) return false;
            return true;
        });
    }, [teams, filter, statusFilter]);

    return (
        <div className="space-y-4">
            <RosterLockCard lockDate={rosterLockDate} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex flex-wrap gap-2 rounded-xl bg-[#0a0a0a] p-1">
                    {SL_ROSTER_FILTER_TABS.map((tab) => {
                        const isActive = filter === tab.id;
                        const count = counts[tab.id] ?? 0;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setFilter(tab.id)}
                                className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-yellow-500 text-black'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                                        isActive
                                            ? 'bg-black text-yellow-500'
                                            : 'bg-yellow-500 text-black'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500 sm:w-auto sm:min-w-[140px]"
                    aria-label="Filter by status"
                >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="assembling">Assembling</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <p className="rounded-xl border border-dashed border-neutral-800 py-10 text-center text-sm text-gray-500">
                    No roster entries for this filter.
                </p>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[980px] table-auto border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-[#0a0a0a]">
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                        Team Name
                                    </th>
                                    {['Captain', 'Player 2', 'Player 3', 'Player 4', 'Player 5'].map(
                                        (label) => (
                                            <th
                                                key={label}
                                                className="px-3 py-3 text-left text-xs font-semibold text-yellow-500"
                                            >
                                                <span className="inline-flex items-center gap-1">
                                                    {label}
                                                    <ArrowDownUp className="h-3 w-3 opacity-60" />
                                                </span>
                                            </th>
                                        ),
                                    )}
                                    <th className="px-3 py-3 text-left text-xs font-semibold text-yellow-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((team) => {
                                    const players =
                                        team.players?.length > 0
                                            ? team.players
                                            : [team.captain].filter(Boolean);
                                    return (
                                        <tr
                                            key={team.id}
                                            className="border-b border-neutral-800/80"
                                        >
                                            <td className="px-3 py-3">
                                                <p className="text-sm font-semibold text-white">
                                                    {team.name}
                                                </p>
                                                {team.status === 'confirmed' || team.matchReady ? (
                                                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                                                        <Check className="h-3 w-3" />
                                                        Confirmed
                                                    </span>
                                                ) : null}
                                            </td>
                                            {Array.from({ length: 5 }, (_, index) => {
                                                const player = players[index];
                                                return (
                                                    <td key={`${team.id}-slot-${index}`} className="px-3 py-3">
                                                        <MatchPlayerCell
                                                            player={player}
                                                            showRole
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="px-3 py-3">
                                                <PlacementStatusDropdown
                                                    value={placements[team.id] ?? 'participant'}
                                                    onChange={(placementId) =>
                                                        setPlacements((prev) => ({
                                                            ...prev,
                                                            [team.id]: placementId,
                                                        }))
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="space-y-3 lg:hidden">
                        {filtered.map((team) => (
                            <article
                                key={team.id}
                                className="overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]"
                            >
                                <div className="flex items-center justify-between gap-3 border-b border-neutral-800 px-4 py-3">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase text-white">
                                            {team.name}
                                        </h4>
                                        {team.status === 'confirmed' || team.matchReady ? (
                                            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                                                <Check className="h-3 w-3" />
                                                Confirmed
                                            </span>
                                        ) : null}
                                    </div>
                                    <PlacementStatusDropdown
                                        value={placements[team.id] ?? 'participant'}
                                        onChange={(placementId) =>
                                            setPlacements((prev) => ({
                                                ...prev,
                                                [team.id]: placementId,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="border-b border-neutral-800 bg-[#111111] px-4 py-2">
                                    <p className="text-xs font-semibold text-yellow-500">Captain</p>
                                </div>

                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="relative shrink-0">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-[#1a1a1a] text-yellow-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {team.captain?.name ?? '—'}
                                        </p>
                                        <p className="truncate text-xs text-gray-300">
                                            <span>{team.captain?.ign ?? '—'}</span>
                                            <span className="text-gray-500"> | </span>
                                            <span className="text-yellow-500">
                                                {team.captain?.role ?? 'JUNGLER'}
                                            </span>
                                        </p>
                                        <p className="truncate text-[11px] text-gray-500">
                                            {team.captain?.uid ?? ''}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
