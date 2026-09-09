import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

function MobileDetail({ label, children }) {
    return (
        <div className="grid min-w-0 grid-cols-[110px_minmax(0,1fr)] gap-3 text-sm">
            <span className="font-bold text-white">{label}</span>

            <div className="min-w-0 text-gray-400">{children}</div>
        </div>
    );
}

export default function RegionalAdminMobileList({
    regionalAdmins,
    expandedRegionalAdminId,
    onToggle,
    onEdit,
    onDelete,
}) {
    if (regionalAdmins.length === 0) {
        return (
            <div className="border-y border-white/10 px-3 py-12 text-center text-sm text-gray-500">
                No regional administrators found.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">
            {regionalAdmins.map((regionalAdmin) => {
                const isExpanded = expandedRegionalAdminId === regionalAdmin.id;

                const detailsId = `regional-admin-details-${regionalAdmin.id}`;

                return (
                    <article
                        key={regionalAdmin.id}
                        className="w-full border-b border-white/10 bg-[#1A1A1A] last:border-b-0"
                    >
                        <button
                            type="button"
                            onClick={() => onToggle(regionalAdmin.id)}
                            className="flex min-h-[56px] w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-[#202020]"
                            aria-expanded={isExpanded}
                            aria-controls={detailsId}
                        >
                            <div className="grid min-w-0 flex-1 grid-cols-[82px_minmax(0,1fr)] items-center gap-3">
                                <span className="whitespace-nowrap text-sm font-bold text-white">
                                    Fullname
                                </span>

                                <span className="min-w-0 truncate text-sm font-medium text-gray-400">
                                    {regionalAdmin.fullName}
                                </span>
                            </div>

                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4 shrink-0 text-white" />
                            ) : (
                                <ChevronDown className="h-4 w-4 shrink-0 text-white" />
                            )}
                        </button>

                        {isExpanded ? (
                            <div
                                id={detailsId}
                                className="space-y-4 border-t border-white/10 px-3 py-4"
                            >
                                <MobileDetail label="Username">
                                    <span className="block truncate">
                                        {regionalAdmin.username}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="MSL ID">
                                    <span className="block truncate">
                                        {regionalAdmin.mslId}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Original School">
                                    <span className="block break-words">
                                        {regionalAdmin.originalSchool}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Assigned">
                                    <span>
                                        {regionalAdmin.assignedSchools.length}{" "}
                                        {regionalAdmin.assignedSchools
                                            .length === 1
                                            ? "school"
                                            : "schools"}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Actions">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEdit(regionalAdmin)
                                            }
                                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-blue-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                                            aria-label={`Edit ${regionalAdmin.fullName}`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDelete(regionalAdmin)
                                            }
                                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
                                            aria-label={`Delete ${regionalAdmin.fullName}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </MobileDetail>
                            </div>
                        ) : null}
                    </article>
                );
            })}
        </div>
    );
}
