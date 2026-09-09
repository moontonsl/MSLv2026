import { Pencil, Trash2 } from "lucide-react";

export default function RegionalAdminDesktopTable({
    regionalAdmins,
    onEdit,
    onDelete,
}) {
    if (regionalAdmins.length === 0) {
        return (
            <div className="border-y border-white/[0.06] py-16 text-center text-sm text-gray-500">
                No regional administrators found.
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-hidden">
            <table className="w-full table-fixed text-left">
                <thead>
                    <tr className="border-b border-white/[0.06]">
                        <th className="w-[22%] pb-4 text-sm font-bold text-white lg:text-base">
                            Fullname
                        </th>

                        <th className="w-[22%] pb-4 text-sm font-bold text-white lg:text-base">
                            Username
                        </th>

                        <th className="w-[18%] pb-4 text-sm font-bold text-white lg:text-base">
                            MSL ID
                        </th>

                        <th className="w-[28%] pb-4 text-sm font-bold text-white lg:text-base">
                            Original School
                        </th>

                        <th className="w-[10%] pb-4 text-right text-sm font-bold text-white lg:text-base">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {regionalAdmins.map((regionalAdmin) => (
                        <tr
                            key={regionalAdmin.id}
                            className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.025]"
                        >
                            <td className="max-w-0 py-5 pr-4 text-sm font-semibold text-gray-400 lg:text-base">
                                <span className="block truncate">
                                    {regionalAdmin.fullName}
                                </span>
                            </td>

                            <td className="max-w-0 py-5 pr-4 text-sm font-semibold text-gray-400 lg:text-base">
                                <span className="block truncate">
                                    {regionalAdmin.username}
                                </span>
                            </td>

                            <td className="max-w-0 py-5 pr-4 text-sm font-semibold text-gray-400 lg:text-base">
                                <span className="block truncate">
                                    {regionalAdmin.mslId}
                                </span>
                            </td>

                            <td className="max-w-0 py-5 pr-4 text-sm font-semibold text-gray-400 lg:text-base">
                                <span className="block truncate">
                                    {regionalAdmin.originalSchool}
                                </span>
                            </td>

                            <td className="py-5">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(regionalAdmin)}
                                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-blue-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                                        aria-label={`Edit ${regionalAdmin.fullName}`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete(regionalAdmin)}
                                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
                                        aria-label={`Delete ${regionalAdmin.fullName}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
