import { Trash2 } from "lucide-react";

export default function AdminAccountDesktopTable({
    accounts,
    onEdit,
    onDelete,
}) {
    return (
        <div className="w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-[680px] table-fixed text-left">
                <thead>
                    <tr className="border-b border-white/[0.05]">
                        <th className="w-[22%] pb-4 pr-3 text-sm font-bold text-white">
                            Admin Name
                        </th>

                        <th className="w-[28%] pb-4 pr-3 text-sm font-bold text-white">
                            Email Address
                        </th>

                        <th className="w-[22%] pb-4 pr-3 text-sm font-bold text-white">
                            Role
                        </th>

                        <th className="w-[18%] pb-4 pr-3 text-sm font-bold text-white">
                            Created Date
                        </th>

                        <th className="w-[110px] pb-4 text-right text-sm font-bold text-white">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {accounts.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-12 text-center text-sm text-gray-500"
                            >
                                No admin accounts found.
                            </td>
                        </tr>
                    ) : (
                        accounts.map((account) => (
                            <tr
                                key={account.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => onEdit(account)}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        onEdit(account);
                                    }
                                }}
                                className="cursor-pointer border-b border-white/[0.04] outline-none transition last:border-0 hover:bg-white/[0.025] focus:bg-white/[0.04]"
                            >
                                <td className="max-w-0 py-5 pr-3 text-sm font-semibold text-gray-400">
                                    <span className="block truncate text-white">
                                        {account.name}
                                    </span>
                                </td>

                                <td className="max-w-0 py-5 pr-3 text-sm font-semibold text-gray-400">
                                    <span className="block truncate whitespace-nowrap">
                                        {account.email}
                                    </span>
                                </td>

                                <td className="max-w-0 py-5 pr-3">
                                    <span className="inline-flex max-w-full truncate rounded-md bg-[#3B3B3B] px-3 py-1.5 text-sm font-bold text-gray-200">
                                        {account.roleLabel}
                                    </span>
                                </td>

                                <td className="max-w-0 py-5 pr-3 text-sm font-semibold text-gray-400">
                                    <span className="block truncate whitespace-nowrap">
                                        {account.createdDate}
                                    </span>
                                </td>

                                <td className="py-5 text-right">
                                    {account.protected ? (
                                        <span className="whitespace-nowrap text-sm font-semibold text-gray-400">
                                            Protected
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(event) =>
                                                onDelete(event, account)
                                            }
                                            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md p-2 text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
                                            aria-label={`Delete ${account.email}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
