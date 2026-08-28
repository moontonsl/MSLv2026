import RosterLockCard from '@/Components/CampusTournament/RosterLockCard';
import { SL_ROSTER_FILTER_TABS } from '@/data/campusTournamentData';
import { Check, User } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Roster & Solo Players tab for SL tournament panel.
 *
 * @param {{
 *   rosterLockDate?: string;
 *   teams?: Array<{
 *     id: string;
 *     name: string;
 *     type?: string;
 *     status?: string;
 *     captain?: { name: string; ign: string; uid: string; role?: string };
 *     matchReady?: boolean;
 *   }>;
 * }} props
 */
export default function SlRosterPanel({ rosterLockDate = 'May 14, 2026', teams = [] }) {
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

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

            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-neutral-800 py-10 text-center text-sm text-gray-500">
                        No roster entries for this filter.
                    </p>
                ) : (
                    filtered.map((team) => (
                        <article
                            key={team.id}
                            className="overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]"
                        >
                            <div className="flex items-center justify-between gap-3 border-b border-neutral-800 px-4 py-3">
                                <h4 className="text-sm font-bold uppercase text-white">
                                    {team.name}
                                </h4>
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-400">
                                    <Check className="h-3 w-3" />
                                    Confirmed
                                </span>
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

                            {team.matchReady ? (
                                <div className="px-4 pb-4">
                                    <button
                                        type="button"
                                        className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border border-emerald-600/60 bg-emerald-950/50 text-sm font-semibold text-emerald-400"
                                    >
                                        Ready for Match
                                    </button>
                                </div>
                            ) : null}
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
