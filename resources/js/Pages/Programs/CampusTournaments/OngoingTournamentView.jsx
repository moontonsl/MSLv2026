import CampusTournamentPageHeader from "@/Components/CampusTournament/CampusTournamentPageHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { CalendarDays, MapPin, ShieldCheck, Swords, Users } from "lucide-react";

const VIEWER_LABELS = {
    student_leader: "Student Leader",
    regional_admin: "Regional Admin",
    core: "Core Admin",
};

const LANE_LABELS = {
    jungler: "Jungler",
    roam: "Roam",
    gold_laner: "Gold Laner",
    exp_laner: "EXP Laner",
    mid_laner: "Mid Laner",
};

function formatDateTime(value) {
    return new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
    }).format(new Date(value));
}

function StatCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-[#111111] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                </p>
                <Icon className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
    );
}

export default function OngoingTournamentView({
    tournament,
    viewerRole,
    backUrl,
}) {
    return (
        <MainLayout fullWidth>
            <Head title={`${tournament.name} — Ongoing Tournament`} />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CampusTournamentPageHeader />
                        <Link
                            href={backUrl}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-700 px-4 text-sm font-semibold text-gray-200 transition-colors hover:border-yellow-500 hover:text-yellow-500"
                        >
                            ← Back to tournaments
                        </Link>
                    </div>

                    <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]">
                        <div className="border-b border-neutral-800 p-5 sm:p-7">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                                            <Swords className="h-3.5 w-3.5" />
                                            Ongoing
                                        </span>
                                        <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-500">
                                            {tournament.type}
                                        </span>
                                        <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-semibold text-gray-300">
                                            {VIEWER_LABELS[viewerRole] ??
                                                "Tournament Viewer"}
                                        </span>
                                    </div>

                                    <h1 className="mt-4 text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                                        {tournament.name}
                                    </h1>
                                    <p className="mt-2 text-base font-semibold text-yellow-500">
                                        {tournament.school}
                                    </p>
                                    <div className="mt-4 flex flex-col gap-2 text-sm text-gray-400 sm:flex-row sm:flex-wrap sm:gap-x-6">
                                        <span className="inline-flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-yellow-500" />
                                            {formatDateTime(
                                                tournament.startsAt,
                                            )}{" "}
                                            –{" "}
                                            {formatDateTime(tournament.endsAt)}
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-yellow-500" />
                                            {[
                                                tournament.campus,
                                                tournament.region,
                                            ]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-gray-300 lg:max-w-sm">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                                        <p>
                                            This page shows the current
                                            participating teams and locked
                                            rosters. Results cannot be submitted
                                            from this page yet.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
                            <StatCard
                                label="Registered Teams"
                                value={tournament.registeredTeams}
                                icon={Swords}
                            />
                            <StatCard
                                label="Registered Players"
                                value={tournament.registeredPlayers}
                                icon={Users}
                            />
                            <StatCard
                                label="Premade Teams"
                                value={tournament.premadeTeams}
                                icon={ShieldCheck}
                            />
                            <StatCard
                                label="Solo Teams"
                                value={tournament.soloTeams}
                                icon={Users}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-white">
                                Participating Teams
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Only registered five-player teams are included
                                in the ongoing tournament roster.
                            </p>
                        </div>

                        {tournament.teams.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-neutral-700 px-6 py-14 text-center">
                                <Users className="mx-auto h-8 w-8 text-gray-600" />
                                <p className="mt-3 font-semibold text-white">
                                    No registered teams
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    No five-player roster qualified before the
                                    tournament started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tournament.teams.map((team) => (
                                    <article
                                        key={team.id}
                                        className="overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]"
                                    >
                                        <div className="flex flex-col gap-2 border-b border-neutral-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="font-bold uppercase text-yellow-500">
                                                    {team.name}
                                                </h3>
                                                <p className="mt-0.5 text-xs capitalize text-gray-500">
                                                    {team.formationMethod} team
                                                </p>
                                            </div>
                                            <span className="self-start rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-400 sm:self-auto">
                                                Registered
                                            </span>
                                        </div>

                                        <div className="grid divide-y divide-neutral-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-5">
                                            {team.players.map((player) => (
                                                <div
                                                    key={player.id}
                                                    className="p-4"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-xs font-bold uppercase text-yellow-500">
                                                            {LANE_LABELS[
                                                                player.laneRole
                                                            ] ??
                                                                player.laneRole}
                                                        </p>
                                                        {player.userId ===
                                                        team.captainUserId ? (
                                                            <span className="text-[10px] font-bold uppercase text-gray-500">
                                                                Captain
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <p className="mt-2 truncate text-sm font-semibold text-white">
                                                        {player.name}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-400">
                                                        {player.ign}
                                                    </p>
                                                    <p className="truncate text-[11px] text-gray-600">
                                                        {player.uid}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
