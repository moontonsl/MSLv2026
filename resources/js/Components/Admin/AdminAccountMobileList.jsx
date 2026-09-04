import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import {
    formatDate,
    getRole,
    isProtectedAccount,
} from "@/Components/Admin/adminAccountUtils";

function MobileDetail({ label, children }) {
    return (
        <div className="grid min-w-0 grid-cols-[max-content_minmax(0,1fr)] items-center gap-3 text-sm">
            <span className="whitespace-nowrap font-bold text-white">
                {label}
            </span>

            <div className="min-w-0">{children}</div>
        </div>
    );
}

export default function AdminAccountMobileList({
    accounts,
    expandedAccountId,
    onToggle,
    onEdit,
    onDelete,
}) {
    if (accounts.length === 0) {
        return (
            <div className="border-y border-white/10 px-3 py-12 text-center text-sm text-gray-500">
                No admin accounts found.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">
            {accounts.map((account) => {
                const isExpanded = expandedAccountId === account.id;

                return (
                    <article
                        key={account.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onEdit(account)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onEdit(account);
                            }
                        }}
                        className="w-full cursor-pointer border-b border-white/10 bg-[#1A1A1A] outline-none transition hover:bg-[#202020] focus:bg-[#202020]"
                    >
                        <div className="flex min-h-[52px] w-full items-center gap-3 px-3 py-2.5">
                            <div className="grid min-w-0 flex-1 grid-cols-[max-content_minmax(0,1fr)] items-center gap-3">
                                <span className="whitespace-nowrap text-sm font-bold text-white">
                                    Admin Name
                                </span>

                                <span className="min-w-0 truncate whitespace-nowrap text-sm text-gray-400">
                                    {account.name}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={(event) => onToggle(event, account.id)}
                                className="flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10"
                                aria-label={
                                    isExpanded
                                        ? "Collapse account"
                                        : "Expand account"
                                }
                                aria-expanded={isExpanded}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="space-y-3 border-t border-white/10 px-3 py-3">
                                <MobileDetail label="Email Address">
                                    <span className="block min-w-0 truncate whitespace-nowrap text-gray-400">
                                        {account.email}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Role">
                                    <span className="inline-flex w-fit rounded-md bg-[#3B3B3B] px-2 py-1 text-gray-200">
                                        {getRole(account)}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Created Date">
                                    <span className="block min-w-0 truncate whitespace-nowrap text-gray-400">
                                        {formatDate(account.created_at)}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Action">
                                    {isProtectedAccount(account) ? (
                                        <span className="whitespace-nowrap text-gray-400">
                                            Protected
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(event) =>
                                                onDelete(event, account)
                                            }
                                            className="w-fit rounded-md p-1 text-red-500 hover:bg-red-500/10"
                                            aria-label={`Delete ${account.email}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </MobileDetail>
                            </div>
                        )}
                    </article>
                );
            })}
        </div>
    );
}

