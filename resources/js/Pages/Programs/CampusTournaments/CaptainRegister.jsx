import { ROLE_SLOTS } from "@/data/campusTournamentCaptainData";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";

const INPUT_CLASS =
    "min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-500";

export default function CaptainRegister({ captain, tournament }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        discord_id: "",
        assigned_lane_role_code: "",
    });

    const submit = (event) => {
        event.preventDefault();
        if (!tournament) return;
        post(`/campus-tournaments/${tournament.id}/teams`);
    };

    return (
        <MainLayout fullWidth>
            <Head title="Create Premade Team — Campus Tournament" />
            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6">
                <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-[#111111] p-5 sm:p-8">
                    <Link href="/Tournament/CampusTournament" className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-400 hover:text-white">
                        <ChevronLeft className="h-4 w-4" /> Back
                    </Link>
                    <h1 className="text-center text-2xl font-black uppercase">
                        {tournament?.title ?? "Premade Team Registration"}
                    </h1>
                    {tournament ? <p className="mt-2 text-center text-sm text-gray-400">{tournament.school}</p> : null}

                    {!tournament ? (
                        <div className="mt-8 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                            No tournament is currently open for registration at your campus.
                        </div>
                    ) : (
                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/5 p-4 text-sm text-yellow-200">
                                Create the team first, then invite four verified campus players from your captain dashboard.
                            </div>
                            <label className="block text-sm">
                                Captain
                                <input value={`${captain.ign} — ${captain.name}`} readOnly className={`${INPUT_CLASS} mt-2 text-gray-400`} />
                            </label>
                            <label className="block text-sm">
                                Team Name <span className="text-red-500">*</span>
                                <input value={data.name} onChange={(event) => setData("name", event.target.value)} required className={`${INPUT_CLASS} mt-2`} />
                                {errors.name ? <span className="mt-1 block text-xs text-red-400">{errors.name}</span> : null}
                            </label>
                            <label className="block text-sm">
                                Discord ID <span className="text-gray-500">(optional)</span>
                                <input value={data.discord_id} onChange={(event) => setData("discord_id", event.target.value)} className={`${INPUT_CLASS} mt-2`} />
                                {errors.discord_id ? <span className="mt-1 block text-xs text-red-400">{errors.discord_id}</span> : null}
                            </label>
                            <label className="block text-sm">
                                Captain Lane <span className="text-red-500">*</span>
                                <select value={data.assigned_lane_role_code} onChange={(event) => setData("assigned_lane_role_code", event.target.value)} required className={`${INPUT_CLASS} mt-2`}>
                                    <option value="">Select lane</option>
                                    {ROLE_SLOTS.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
                                </select>
                                {errors.assigned_lane_role_code ? <span className="mt-1 block text-xs text-red-400">{errors.assigned_lane_role_code}</span> : null}
                            </label>
                            <button disabled={processing} className="min-h-[48px] w-full rounded-lg bg-yellow-500 font-bold text-black disabled:opacity-60">
                                {processing ? "Creating Team…" : "Create Team"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
