import {
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    Pencil,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import AdminPagination from "@/Components/Admin/AdminPagination";
import { MODAL_ACTION_ICON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import { formatRegistrationDate } from "@/data/adminRegistrationData";

function CopyButton({ eventCode, copiedCode, onCopy, mobile = false }) {
    const isCopied = copiedCode === eventCode;

    return (
        <button
            type="button"
            onClick={() => onCopy(eventCode)}
            className={`inline-flex shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/10 hover:text-white ${
                mobile ? "min-h-10 min-w-10" : "min-h-8 min-w-8"
            }`}
            aria-label={isCopied ? `${eventCode} copied` : `Copy ${eventCode}`}
        >
            {isCopied ? (
                <Check className="h-4 w-4 text-emerald-400" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}

function EventCodeValue({ registration, copiedCode, onCopy }) {
    return (
        <div className="flex items-center gap-2">
            <span className="truncate">{registration.eventCode}</span>

            <CopyButton
                eventCode={registration.eventCode}
                copiedCode={copiedCode}
                onCopy={onCopy}
            />
        </div>
    );
}

function ResponseValue({ responseUrl }) {
    if (!responseUrl) {
        return <span className="text-gray-500">—</span>;
    }

    const isExternal = /^https?:\/\//i.test(responseUrl);

    return (
        <a
            href={responseUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className="font-semibold text-gray-400 underline-offset-4 transition hover:text-brand-400 hover:underline"
        >
            Link
        </a>
    );
}

function ActionButtons({
    registration,
    onEdit,
    onDelete,
    showEdit = true,
    showDelete = true,
}) {
    return (
        <div className="flex items-center gap-1">
            {showEdit ? (
                <button
                    type="button"
                    onClick={() => onEdit(registration)}
                    className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                    aria-label={`Edit ${registration.eventName}`}
                >
                    <Pencil className="h-4 w-4" />
                </button>
            ) : null}

            {showDelete ? (
                <button
                    type="button"
                    onClick={() => onDelete(registration)}
                    className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                    aria-label={`Delete ${registration.eventName}`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            ) : null}
        </div>
    );
}

function MobileField({ label, children }) {
    return (
        <div className="grid min-w-0 grid-cols-[max-content_minmax(0,1fr)] items-start gap-4">
            <span className="whitespace-nowrap text-sm font-bold text-white">
                {label}
            </span>

            <div className="min-w-0 text-sm font-semibold text-gray-400">
                {children}
            </div>
        </div>
    );
}

export default function RegistrationTable({
    registrations = [],
    showActions = true,
    showDates = true,
    showMobileActions = false,
    currentPage = 1,
    pageCount = 1,
    onPageChange = () => {},
    onEdit = () => {},
    onDelete = () => {},
    copiedCode = null,
    onCopy = () => {},
    emptyMessage = "No registrations found.",
    paginationLabel = "Registration pagination",
}) {
    const [expandedId, setExpandedId] = useState(registrations[0]?.id ?? null);

    useEffect(() => {
        setExpandedId(registrations[0]?.id ?? null);
    }, [registrations]);

    const columnCount = 3 + (showDates ? 2 : 0) + (showActions ? 1 : 0);

    const mobileHasActions = showActions || showMobileActions;

    return (
        <div className="w-full min-w-0 font-sans">
            <div className="hidden overflow-x-auto md:block">
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
                                Event Code
                            </th>

                            <th
                                className={`pb-4 text-left text-sm font-bold text-white lg:text-base ${
                                    showDates ? "w-[29%]" : "w-[56%]"
                                }`}
                            >
                                Event Name
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
                                        <EventCodeValue
                                            registration={registration}
                                            copiedCode={copiedCode}
                                            onCopy={onCopy}
                                        />
                                    </td>

                                    <td className="max-w-0 py-5 text-sm font-semibold text-gray-400 lg:text-base">
                                        <span className="block truncate">
                                            {registration.eventName}
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

                                    <td className="py-5 text-sm font-semibold text-gray-400 lg:text-base">
                                        <ResponseValue
                                            responseUrl={
                                                registration.responseUrl
                                            }
                                        />
                                    </td>

                                    {showActions ? (
                                        <td className="py-5 text-right">
                                            <ActionButtons
                                                registration={registration}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        </td>
                                    ) : null}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden">
                {registrations.length === 0 ? (
                    <div className="border-y border-white/10 py-12 text-center text-sm text-gray-500">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {registrations.map((registration) => {
                            const isExpanded = expandedId === registration.id;

                            return (
                                <article
                                    key={registration.id}
                                    className={
                                        isExpanded
                                            ? "bg-[#1A1A1A]"
                                            : "bg-[#0B0B0B]"
                                    }
                                >
                                    <div className="flex min-h-[52px] items-center border-b border-white/10 px-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedId((current) =>
                                                    current === registration.id
                                                        ? null
                                                        : registration.id,
                                                )
                                            }
                                            className="flex min-w-0 flex-1 items-center gap-4 text-left"
                                            aria-expanded={isExpanded}
                                        >
                                            <span className="shrink-0 text-sm font-bold text-white">
                                                Event Code
                                            </span>

                                            <span className="min-w-0 truncate text-sm font-semibold text-gray-400">
                                                {registration.eventCode}
                                            </span>
                                        </button>

                                        <CopyButton
                                            eventCode={registration.eventCode}
                                            copiedCode={copiedCode}
                                            onCopy={onCopy}
                                            mobile
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedId((current) =>
                                                    current === registration.id
                                                        ? null
                                                        : registration.id,
                                                )
                                            }
                                            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-white"
                                            aria-label={
                                                isExpanded
                                                    ? "Collapse registration"
                                                    : "Expand registration"
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
                                        <div className="space-y-3 px-2 py-3">
                                            <MobileField label="Event Name">
                                                <span className="block break-words">
                                                    {registration.eventName}
                                                </span>
                                            </MobileField>

                                            {showDates ? (
                                                <>
                                                    <MobileField label="Start Date">
                                                        <span className="block break-words">
                                                            {formatRegistrationDate(
                                                                registration.startDate,
                                                            )}
                                                        </span>
                                                    </MobileField>

                                                    <MobileField label="End Date">
                                                        <span className="block break-words">
                                                            {formatRegistrationDate(
                                                                registration.endDate,
                                                            )}
                                                        </span>
                                                    </MobileField>
                                                </>
                                            ) : null}

                                            <MobileField label="Response">
                                                <ResponseValue
                                                    responseUrl={
                                                        registration.responseUrl
                                                    }
                                                />
                                            </MobileField>

                                            {mobileHasActions ? (
                                                <MobileField label="Action">
                                                    <ActionButtons
                                                        registration={
                                                            registration
                                                        }
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                        showEdit={showActions}
                                                        showDelete
                                                    />
                                                </MobileField>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="mt-5 max-w-full overflow-x-auto border-t border-white/10 pt-4">
                <AdminPagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onChange={onPageChange}
                    ariaLabel={paginationLabel}
                />
            </div>
        </div>
    );
}
