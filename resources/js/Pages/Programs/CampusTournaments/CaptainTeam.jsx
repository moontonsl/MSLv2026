import { ROLE_SLOTS } from "@/data/campusTournamentCaptainData";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Search, Shield, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

const roleLabel = (code) => ROLE_SLOTS.find((role) => role.id === code)?.label ?? code;

export default function CaptainTeam({ team }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState("");
    const [searching, setSearching] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (search.trim().length < 2 || selectedUser) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(`/school-players?search=${encodeURIComponent(search.trim())}&tournament=${team.tournamentId}&team=${team.id}`, {
                    headers: { Accept: "application/json" },
                    signal: controller.signal,
                });
                const payload = await response.json();
                setResults(response.ok ? payload.data ?? [] : []);
            } catch (requestError) {
                if (requestError.name !== "AbortError") setResults([]);
            } finally {
                setSearching(false);
            }
        }, 250);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [search, selectedUser, team.tournamentId]);

    const invite = (event) => {
        event.preventDefault();
        if (!selectedUser || !role) return;
        router.post(`/tournament-teams/${team.id}/invitations`, {
            user_id: selectedUser.id,
            intended_lane_role_code: role,
        }, {
            preserveScroll: true,
            onStart: () => { setProcessing(true); setError(null); },
            onSuccess: () => { setSearch(""); setSelectedUser(null); setRole(""); },
            onError: (errors) => setError(Object.values(errors ?? {})[0] ?? "Unable to send invitation."),
            onFinish: () => setProcessing(false),
        });
    };

    const cancelInvitation = (invitationId) => {
        router.delete(`/tournament-invitations/${invitationId}`, {
            preserveScroll: true,
            onError: (errors) => setError(Object.values(errors ?? {})[0] ?? "Unable to cancel invitation."),
        });
    };

    return (
        <MainLayout fullWidth>
            <Head title="Captain Team — Campus Tournament" />
            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-yellow-500" />
                            <div><h1 className="text-2xl font-black uppercase">{team.name}</h1><p className="text-sm text-gray-400">{team.school}</p></div>
                        </div>
                        <Link href="/Tournament/CampusTournament" className="text-sm text-gray-400 hover:text-white">Back to hub</Link>
                    </div>

                    <section className="rounded-xl border border-neutral-800 bg-[#111111] p-5">
                        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Roster</h2><span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase text-yellow-500">{team.status}</span></div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {[team.captain, ...team.players].filter(Boolean).map((player) => (
                                <article key={`${player.status}-${player.id}`} className="rounded-lg border border-neutral-800 bg-[#0a0a0a] p-4">
                                    <UserRound className="h-6 w-6 text-yellow-500" />
                                    <p className="mt-3 font-semibold">{player.ign}</p>
                                    <p className="truncate text-xs text-gray-400">{player.name}</p>
                                    <p className="mt-2 text-xs font-semibold text-yellow-500">{roleLabel(player.role)}</p>
                                    <p className="mt-1 text-xs uppercase text-gray-500">{player.status}</p>
                                    {player.status === "pending" ? (
                                        <button type="button" onClick={() => cancelInvitation(player.invitationId)} className="mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><X className="h-3 w-3" /> Cancel</button>
                                    ) : null}
                                </article>
                            ))}
                        </div>
                    </section>

                    {team.status !== "approved" && team.availableLaneRoles.length > 0 ? (
                        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-5">
                            <h2 className="text-lg font-bold">Invite a verified campus player</h2>
                            <p className="mt-1 text-sm text-gray-400">Search by name, username, or MLBB IGN, then assign an open lane.</p>
                            {error ? <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
                            <form onSubmit={invite} className="mt-5 grid gap-4 md:grid-cols-[1fr_220px_auto]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                                    <input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedUser(null); }} placeholder="Search eligible player" className="min-h-[44px] w-full rounded-lg border border-neutral-700 bg-[#0a0a0a] pl-10 pr-3" />
                                    {searching ? <p className="mt-1 text-xs text-gray-500">Searching…</p> : null}
                                    {results.length > 0 ? (
                                        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-700 bg-[#181818] shadow-xl">
                                            {results.map((player) => <button key={player.id} type="button" onClick={() => { setSelectedUser(player); setSearch(`${player.ign} — ${player.username}`); setResults([]); }} className="block w-full px-4 py-3 text-left text-sm hover:bg-neutral-800"><span className="font-semibold">{player.ign}</span><span className="ml-2 text-gray-400">{player.name}</span></button>)}
                                        </div>
                                    ) : null}
                                </div>
                                <select value={role} onChange={(event) => setRole(event.target.value)} required className="min-h-[44px] rounded-lg border border-neutral-700 bg-[#0a0a0a] px-3">
                                    <option value="">Select open lane</option>
                                    {team.availableLaneRoles.map((code) => <option key={code} value={code}>{roleLabel(code)}</option>)}
                                </select>
                                <button disabled={!selectedUser || processing} className="min-h-[44px] rounded-lg bg-yellow-500 px-5 font-bold text-black disabled:opacity-50">{processing ? "Inviting…" : "Send Invite"}</button>
                            </form>
                        </section>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    );
}
