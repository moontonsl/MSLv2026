import {
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    Pencil,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { MODAL_ACTION_ICON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import { formatEventDate } from "@/data/adminEventData";

function MobileField({ label, children }) {
    return (
        <div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] items-start gap-4">
            <span className="text-sm font-bold leading-5 text-[#F5F5F5]">
                {label}
            </span>

            <div className="min-w-0 break-words text-sm leading-5 text-[#94949F]">
                {children}
            </div>
        </div>
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
            className="font-semibold text-gray-400 hover:text-[#FBBF24] hover:underline"
        >
            Link
        </a>
    );
}

export default function EventMobileList({
    events,
    showDates,
    showActions,
    onEdit,
    onDelete,
    copiedCode,
    onCopy,
    emptyMessage,
}) {
    const [expandedId, setExpandedId] = useState(events[0]?.id ?? null);

    useEffect(() => {
        setExpandedId(events[0]?.id ?? null);
    }, [events]);

    if (events.length === 0) {
        return (
            <div className="border-y border-white/10 py-12 text-center text-sm text-[#777781]">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-[#080808]">
            {events.map((event) => {
                const expanded = expandedId === event.id;

                const copied = copiedCode === event.eventCode;

                return (
                    <article
                        key={event.id}
                        className={expanded ? "bg-[#1A1A1A]" : "bg-[#080808]"}
                    >
                        <div className="flex min-h-[52px] items-center border-b border-white/20 px-2.5">
                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedId(expanded ? null : event.id)
                                }
                                className="flex min-w-0 flex-1 items-center text-left"
                                aria-expanded={expanded}
                            >
                                <span className="w-[100px] shrink-0 text-sm font-bold text-[#F5F5F5]">
                                    Event Code
                                </span>

                                <span className="min-w-0 truncate text-sm text-[#94949F]">
                                    {event.eventCode}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onCopy(event.eventCode)}
                                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-gray-500 hover:bg-white/10 hover:text-white"
                                aria-label={`Copy ${event.eventCode}`}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-emerald-400" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedId(expanded ? null : event.id)
                                }
                                className="inline-flex min-h-10 min-w-10 items-center justify-center"
                                aria-label={
                                    expanded ? "Collapse event" : "Expand event"
                                }
                            >
                                {expanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {expanded ? (
                            <div className="space-y-3 px-3 py-4">
                                <MobileField label="Event Name">
                                    {event.eventName}
                                </MobileField>

                                {showDates ? (
                                    <>
                                        <MobileField label="Start Date">
                                            {formatEventDate(event.startDate)}
                                        </MobileField>

                                        <MobileField label="End Date">
                                            {formatEventDate(event.endDate)}
                                        </MobileField>
                                    </>
                                ) : null}

                                <MobileField label="Response">
                                    <ResponseLink url={event.responseUrl} />
                                </MobileField>

                                {showActions ? (
                                    <MobileField label="Actions">
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(event)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10`}
                                                aria-label={`Edit ${event.eventName}`}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(event)}
                                                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10`}
                                                aria-label={`Delete ${event.eventName}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </MobileField>
                                ) : null}
                            </div>
                        ) : null}
                    </article>
                );
            })}
        </div>
    );
}
