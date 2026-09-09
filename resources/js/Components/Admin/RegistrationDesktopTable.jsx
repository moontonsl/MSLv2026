import { Check, Copy, Pencil, Trash2 } from "lucide-react";

import { MODAL_ACTION_ICON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import { formatRegistrationDate } from "@/data/adminRegistrationData";

function CopyButton({ value, copiedValue, onCopy }) {
    const copied = copiedValue === value;

    return (
        <button
            type="button"
            onClick={() => onCopy(value)}
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/10 hover:text-white"
            aria-label={copied ? `${value} copied` : `Copy ${value}`}
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}

function ResponseLink({ url }) {
    if (!url) {
        return <span className="text-gray-500">—</span>;
    }

    const external = /^https?:\/\//i.test(url);

    return (
        <a
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="font-semibold text-gray-400 underline-offset-4 transition hover:text-[#FBBF24] hover:underline"
        >
            Link
        </a>
    );
}

export default function RegistrationDesktopTable({
    registrations,
    showDates,
    showActions,
    onEdit,
    onDelete,
    copiedCode,
    onCopy,
    emptyMessage,
}) {
    const columnCount = 3 + (showDates ? 2 : 0) + (showActions ? 1 : 0);

    return (
        <div className="overflow-x-auto">
            <table
                className={`w-full table-fixed border-collapse ${
                    showDates ? "min-w-[980px]" : "min-w-[620px]"
                }`}
            >
                <thead>
                    <tr className="border-b border-white/[0.06]">
                        <th
                            className={`pb-4 text-left text-sm font-bold text-white lg:text-base ${
                                showDates ? "w-[15%]" : "w-[24%]"
                            }`}
                        >
                            Attendance Code
                        </th>

                        <th
                            className={`pb-4 text-left text-sm font-bold text-white lg:text-base ${
                                showDates ? "w-[29%]" : "w-[56%]"
                            }`}
                        >
                            Activity Name
                        </th>

                        {showDates ? (
                            <>
                                <th className="w-[19%] pb-4 text-left text-sm font-bold text-white lg:text-base">
                                    Start Date
                                </th>

                                <th className="w-[19%] pb-4 text-left text-sm font-bold text-white lg:text-base">
                                    End Date
                                </th>
                            </>
                        ) : null}

                        <th
                            className={`pb-4 text-left text-sm font-bold text-white lg:text-base ${
                                showDates ? "w-[11%]" : "w-[20%]"
                            }`}
                        >
                            Response
                        </th>

                        {showActions ? (
                            <th className="w-[7%] pb-4 text-right text-sm font-bold text-white lg:text-base">
                                Actions
                            </th>
                        ) : null}
                    </tr>
                </thead>

                <tbody>
                    {registrations.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columnCount}
                                className="py-14 text-center text-sm text-gray-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        registrations.map((registration) => (
                            <tr
                                key={registration.id}
                                className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.025]"
                            >
                                <td className="max-w-0 py-5 text-sm font-semibold text-gray-400 lg:text-base">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate">
                                            {registration.attendanceCode}
                                        </span>

                                        <CopyButton
                                            value={registration.attendanceCode}
                                            copiedValue={copiedCode}
                                            onCopy={onCopy}
                                        />
                                    </div>
                                </td>

                                <td className="max-w-0 py-5 text-sm font-semibold text-gray-400 lg:text-base">
                                    <span className="block truncate">
                                        {registration.activityName}
                                    </span>
                                </td>

                                {showDates ? (
                                    <>
                                        <td className="max-w-0 py-5 text-sm font-semibold text-gray-400 lg:text-base">
                                            <span className="block truncate whitespace-nowrap">
                                                {formatRegistrationDate(
                                                    registration.startDate,
                                                )}
                                            </span>
                                        </td>

                                        <td className="max-w-0 py-5 text-sm font-semibold text-gray-400 lg:text-base">
                                            <span className="block truncate whitespace-nowrap">
                                                {formatRegistrationDate(
                                                    registration.endDate,
                                                )}
                                            </span>
                                        </td>
                                    </>
                                ) : null}

                                <td className="py-5 text-sm font-semibold">
                                    <ResponseLink
                                        url={registration.responseUrl}
                                    />
                                </td>

                                {showActions ? (
                                    <td className="py-5">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(registration)
                                                }
                                                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                                                aria-label={`Edit ${registration.activityName}`}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(registration)
                                                }
                                                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                                                aria-label={`Delete ${registration.activityName}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                ) : null}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
