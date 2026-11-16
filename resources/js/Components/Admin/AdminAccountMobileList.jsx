import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

function MobileDetail({ label, children }) {
    return (
        <div className="flex flex-col gap-1 text-sm min-[420px]:grid min-[420px]:min-w-0 min-[420px]:grid-cols-[max-content_minmax(0,1fr)] min-[420px]:items-center min-[420px]:gap-3">
            <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-gray-400 min-[420px]:text-sm min-[420px]:normal-case min-[420px]:tracking-normal min-[420px]:text-white">
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
        <div className="flex w-full flex-col overflow-hidden rounded-lg border border-white/10">
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
                        className="w-full cursor-pointer border-b border-white/10 bg-[#1A1A1A] outline-none transition last:border-b-0 hover:bg-[#202020] focus:bg-[#202020]"
                    >
                        <div className="flex min-h-[56px] w-full items-center justify-between gap-2.5 px-3.5 py-2.5">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">
                                    {account.name}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-gray-400 sm:hidden">
                                    {account.roleLabel}
                                </p>
                            </div>

                            <span className="hidden shrink-0 rounded-md bg-[#3B3B3B] px-2.5 py-1 text-xs font-semibold text-gray-200 sm:inline-flex">
                                {account.roleLabel}
                            </span>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggle(event, account.id);
                                }}
                                className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10"
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

                        {isExpanded ? (
                            <div className="space-y-3 border-t border-white/10 px-3.5 py-3.5">
                                <MobileDetail label="Email Address">
                                    <span className="block min-w-0 break-all text-gray-300">
                                        {account.email}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Role">
                                    <span className="inline-flex max-w-full break-words rounded-md bg-[#3B3B3B] px-2.5 py-1 text-xs font-semibold text-gray-200">
                                        {account.roleLabel}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Created Date">
                                    <span className="block min-w-0 text-gray-300">
                                        {account.createdDate}
                                    </span>
                                </MobileDetail>

                                <MobileDetail label="Action">
                                    {account.protected ? (
                                        <span className="whitespace-nowrap text-gray-400">
                                            Protected
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onDelete(event, account);
                                            }}
                                            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md p-2 text-red-500 hover:bg-red-500/10"
                                            aria-label={`Delete ${account.email}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </MobileDetail>
                            </div>
                        ) : null}
                    </article>
                );
            })}
        </div>
    );
}
