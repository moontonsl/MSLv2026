import { ROLE_SLOTS } from "@/data/campusTournamentCaptainData";
import { isLaneTakenByAnotherPlayer } from "./laneSelection";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft, CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";

const INPUT_CLASS =
    "min-h-[44px] w-full rounded-lg border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-base text-white outline-none transition-shadow placeholder:text-gray-600 focus:ring-2 focus:ring-yellow-500 md:text-sm";

const LABEL_CLASS = "mb-2 block text-sm text-white";

function MemberSearchField({ index, tournamentId, value, onChange, error, selectedUsernames }) {
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [focused, setFocused] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);

    useEffect(() => {
        if (!tournamentId || !focused || selectedUser || value.trim().length < 2) {
            setResults([]);
            setSearching(false);
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setSearching(true);
            setSearchError(false);
            try {
                const response = await fetch(
                    `/school-players?search=${encodeURIComponent(value.trim())}&tournament=${tournamentId}`,
                    { headers: { Accept: "application/json" }, signal: controller.signal },
                );
                if (!response.ok) throw new Error("Player search failed");
                const payload = await response.json();
                setResults((payload.data ?? []).filter((user) => user.username));
            } catch (requestError) {
                if (requestError.name !== "AbortError") {
                    setResults([]);
                    setSearchError(true);
                }
            } finally {
                if (!controller.signal.aborted) setSearching(false);
            }
        }, 250);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [focused, selectedUser, tournamentId, value]);

    const chooseUser = (user) => {
        setSelectedUser(user);
        setResults([]);
        setFocused(false);
        onChange(user.username);
    };

    return (
        <div className="min-w-0">
            <label htmlFor={`player-${index + 2}`} className={LABEL_CLASS}>
                Player {index + 2} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    id={`player-${index + 2}`}
                    value={value}
                    onChange={(event) => {
                        setSelectedUser(null);
                        setResults([]);
                        onChange(event.target.value);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search name, username, or IGN"
                    autoComplete="off"
                    required
                    className={INPUT_CLASS}
                    aria-autocomplete="list"
                    aria-expanded={focused && !selectedUser && value.trim().length >= 2}
                />
                {focused && !selectedUser && value.trim().length >= 2 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-neutral-700 bg-[#181818] shadow-xl">
                        {searching ? (
                            <p className="px-3 py-2 text-sm text-gray-400">Searching…</p>
                        ) : searchError ? (
                            <p className="px-3 py-2 text-sm text-red-400">Unable to search players. Try again.</p>
                        ) : results.length ? (
                            results.map((user) => {
                                const alreadySelected = selectedUsernames.includes(user.username);
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        disabled={alreadySelected}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => chooseUser(user)}
                                        className="block w-full border-b border-neutral-800 px-3 py-2 text-left text-sm text-white last:border-0 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <span className="block font-semibold">{user.name} · @{user.username}</span>
                                        <span className="block text-xs text-gray-400">{user.ign} · {user.uid}{alreadySelected ? " · Already selected" : ""}</span>
                                    </button>
                                );
                            })
                        ) : (
                            <p className="px-3 py-2 text-sm text-gray-400">No eligible players found.</p>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}

export default function CaptainRegister({ captain, tournament }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        discord_id: "",
        assigned_lane_role_code: "",
        members: Array.from({ length: 4 }, () => ({
            username: "",
            intended_lane_role_code: "",
        })),
    });

    const setMember = (index, field, value) => {
        setData(
            "members",
            data.members.map((member, memberIndex) =>
                memberIndex === index ? { ...member, [field]: value } : member,
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
            <Head title="Register Premade Team — Campus Tournament" />

            <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-[#111111] p-5 sm:p-8">
                    <Link
                        href="/Tournament/CampusTournament"
                        className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-400 hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4" /> Back
                    </Link>

                    <h1 className="mb-6 text-center text-xl font-black uppercase tracking-wide sm:text-2xl">
                        {tournament?.title ?? "Premade Team Registration"}
                    </h1>

                    {!tournament ? (
                        <div className="rounded-xl border border-yellow-500/70 bg-yellow-500/5 p-4 text-sm text-yellow-200">
                            No tournament is currently open for registration at your campus.
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 rounded-xl border border-yellow-500/70 bg-yellow-500/5 p-4 text-sm text-yellow-200">
                                <p className="mb-2 font-semibold text-yellow-500">Important Requirements:</p>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>
                                        <span className="font-semibold text-yellow-500">Verification Required:</span>{' '}
                                        All team members must be verified users to participate in campus tournaments.
                                    </li>
                                    <li>Each team may include only one senior high school student in their roster.</li>
                                </ul>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,0.65fr)] gap-3">
                                    <div className="min-w-0">
                                        <label htmlFor="captain" className={LABEL_CLASS}>
                                            Captain (Player 1) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="captain"
                                                value={`${captain.ign} — ${captain.name}`}
                                                readOnly
                                                className={`${INPUT_CLASS} pr-10 text-gray-300`}
                                            />
                                            <CircleHelp className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <label htmlFor="captain-lane" className={LABEL_CLASS}>
                                            Lane <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="captain-lane"
                                            value={data.assigned_lane_role_code}
                                            onChange={(event) => setData("assigned_lane_role_code", event.target.value)}
                                            required
                                            className={INPUT_CLASS}
                                        >
                                            <option value="">Select lane</option>
                                            {ROLE_SLOTS.map((role) => (
                                                <option
                                                    key={role.id}
                                                    value={role.id}
                                                    disabled={isLaneTakenByAnotherPlayer(role.id, data.assigned_lane_role_code, data.members)}
                                                >
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.assigned_lane_role_code && <p className="mt-1 text-xs text-red-400">{errors.assigned_lane_role_code}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="team-name" className={LABEL_CLASS}>
                                        Team Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="team-name"
                                        value={data.name}
                                        onChange={(event) => setData("name", event.target.value)}
                                        placeholder="e.g. MSL PH"
                                        required
                                        className={INPUT_CLASS}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="discord-id" className={LABEL_CLASS}>
                                        Discord ID <span className="text-gray-500">(optional)</span>
                                    </label>
                                    <input
                                        id="discord-id"
                                        value={data.discord_id}
                                        onChange={(event) => setData("discord_id", event.target.value)}
                                        placeholder="e.g. username00000"
                                        className={INPUT_CLASS}
                                    />
                                    {errors.discord_id && <p className="mt-1 text-xs text-red-400">{errors.discord_id}</p>}
                                </div>

                                <div className="rounded-lg border border-yellow-500/70 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-200">
                                    <span className="font-semibold text-yellow-500">Note:</span>{' '}
                                    Players must be from your school, verified, and have an MSL Account.
                                </div>

                                {data.members.map((member, index) => (
                                    <div key={index} className="grid grid-cols-[minmax(0,1fr)_minmax(7rem,0.65fr)] gap-3">
                                        <MemberSearchField
                                            index={index}
                                            tournamentId={tournament.id}
                                            value={member.username}
                                            onChange={(username) => setMember(index, "username", username)}
                                            error={errors[`members.${index}.username`]}
                                            selectedUsernames={data.members.filter((_, memberIndex) => memberIndex !== index).map((other) => other.username).filter(Boolean)}
                                        />
                                        <div className="min-w-0">
                                            <label htmlFor={`player-${index + 2}-lane`} className={LABEL_CLASS}>
                                                Lane <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`player-${index + 2}-lane`}
                                                value={member.intended_lane_role_code}
                                                onChange={(event) => setMember(index, "intended_lane_role_code", event.target.value)}
                                                required
                                                className={INPUT_CLASS}
                                            >
                                                <option value="">Select lane</option>
                                                {ROLE_SLOTS.map((role) => (
                                                    <option
                                                        key={role.id}
                                                        value={role.id}
                                                        disabled={isLaneTakenByAnotherPlayer(role.id, data.assigned_lane_role_code, data.members, index)}
                                                    >
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`members.${index}.intended_lane_role_code`] && (
                                                <p className="mt-1 text-xs text-red-400">{errors[`members.${index}.intended_lane_role_code`]}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {errors.members && <p className="text-sm text-red-400">{errors.members}</p>}
                                {errors.user_id && <p className="text-sm text-red-400">{errors.user_id}</p>}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 min-h-[48px] w-full rounded-lg bg-yellow-500 font-bold text-black hover:bg-yellow-400 disabled:opacity-60"
                                >
                                    {processing ? "Submitting…" : "Submit"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
