import { ArrowUpRight, Facebook } from "lucide-react";

function getStatusLabel(status) {
    return (status || "unknown")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusDotClass(status) {
    if (status === "active") return "bg-emerald-400";
    if (status === "rejected" || status === "blocked") return "bg-red-400";
    return "bg-yellow-400";
}

function MobileDetail({ label, children }) {
    return (
        <div className="min-w-0 rounded-lg border border-neutral-800/60 bg-[#121212] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                {label}
            </dt>
            <dd className="mt-1 break-words text-sm font-medium text-gray-200">
                {children}
            </dd>
        </div>
    );
}

export default function DashboardStudentMobileList({
    students = [],
    onReview,
}) {
    if (students.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-sm text-gray-500 md:hidden">
                No registration records match the active filters.
            </div>
        );
    }

    return (
        <div className="grid gap-3 p-3 sm:p-4 md:hidden">
            {students.map((student) => {
                const name = student.name || "Unnamed account";
                const isSeniorHigh = student.division === "shs";
                const avatarUrl = student.ml_avatar
                    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-${student.ml_avatar}`
                    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
                const avatarBorderClass = isSeniorHigh
                    ? "border-[#3b82f6]"
                    : student.division === "college"
                      ? "border-[#fbbf24]"
                      : "border-zinc-700";
                const divisionLabel = isSeniorHigh
                    ? "Senior High School"
                    : student.division === "college"
                      ? "College / University"
                      : "—";
                const serverLabel = student.ml_server
                    ? `${student.ml_id || "—"} (${student.ml_server})`
                    : student.ml_id || "—";

                return (
                    <article
                        key={student.id}
                        className="rounded-xl border border-neutral-800 bg-[#1A1A1A] p-4"
                    >
                        <div className="flex min-w-0 items-start gap-3">
                            <img
                                src={avatarUrl}
                                alt={`${name} avatar`}
                                className={`h-12 w-12 shrink-0 rounded-full border-[3px] bg-zinc-900 object-cover ${avatarBorderClass}`}
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-bold text-white">
                                            {name}
                                        </h3>
                                        <p className="mt-1 truncate text-xs text-gray-400">
                                            IGN: {student.ml_ign || "—"}
                                        </p>
                                    </div>

                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[10px] font-semibold text-gray-200">
                                        <span
                                            aria-hidden="true"
                                            className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(student.status)}`}
                                        />
                                        {getStatusLabel(student.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <dl className="mt-4 grid grid-cols-2 gap-2">
                            <MobileDetail label="Division">
                                {divisionLabel}
                            </MobileDetail>
                            <MobileDetail label="Region">
                                {student.region || "—"}
                            </MobileDetail>
                            <MobileDetail label="MLBB ID / Server">
                                {serverLabel}
                            </MobileDetail>
                            <MobileDetail label="Account type">
                                {student.user_type || "Student"}
                            </MobileDetail>
                        </dl>

                        {student.facebook_link ? (
                            <a
                                href={student.facebook_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-blue-500 hover:underline"
                            >
                                <Facebook className="h-4 w-4" />
                                Facebook profile
                            </a>
                        ) : null}

                        <button
                            type="button"
                            onClick={() => onReview(student)}
                            aria-label={`Review account for ${name}`}
                            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-700 bg-white/5 px-4 text-sm font-semibold text-gray-200 transition hover:border-yellow-500 hover:bg-white/10 hover:text-white"
                        >
                            Review account
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                        </button>
                    </article>
                );
            })}
        </div>
    );
}
