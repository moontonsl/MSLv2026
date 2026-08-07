import { MODAL_ACTION_ICON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const ACCENT = '#FBBF24';

const SEARCH_CLASS =
    'w-full min-h-[44px] rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-base text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none md:text-sm';

const ADD_BUTTON_CLASS =
    'flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-base font-bold text-black md:w-auto md:text-sm';

export default function AdminTable({
    title,
    columns,
    data,
    entityName,
    onAdd,
    onEdit,
    onDelete,
}) {
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data;
        return data.filter((row) =>
            columns.some(({ key }) =>
                String(row[key] ?? '')
                    .toLowerCase()
                    .includes(q),
            ),
        );
    }, [columns, data, search]);

    const renderActions = (row, rowIndex) => (
        <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button
                type="button"
                onClick={() => onEdit?.(row, rowIndex)}
                className={`${MODAL_ACTION_ICON_CLASS} text-blue-500 hover:bg-blue-500/10 hover:text-blue-400`}
                aria-label="Edit row"
            >
                <Pencil className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => onDelete?.(row, rowIndex)}
                className={`${MODAL_ACTION_ICON_CLASS} text-red-500 hover:bg-red-500/10 hover:text-red-400`}
                aria-label="Delete row"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );

    return (
        <div className="mb-8 w-full rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold sm:text-xl" style={{ color: ACCENT }}>
                    {title}
                </h3>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className={SEARCH_CLASS}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onAdd}
                        className={ADD_BUTTON_CLASS}
                        style={{ backgroundColor: ACCENT }}
                    >
                        <Plus className="h-4 w-4" />
                        Add {entityName}
                    </button>
                </div>
            </div>

            {filteredData.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">No results found.</p>
            ) : (
                <>
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    {columns.map(({ key, label }) => (
                                        <th
                                            key={key}
                                            className="pb-4 text-left text-sm font-semibold text-white"
                                        >
                                            {label}
                                        </th>
                                    ))}
                                    <th className="pb-4 pr-4 text-right text-sm font-semibold text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map(({ key }) => (
                                            <td
                                                key={key}
                                                className="border-b border-neutral-800/50 py-4 text-sm text-gray-300"
                                            >
                                                {row[key]}
                                            </td>
                                        ))}
                                        <td className="border-b border-neutral-800/50 py-4 pr-4 text-right">
                                            {renderActions(row, rowIndex)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {filteredData.map((row, rowIndex) => (
                            <article
                                key={rowIndex}
                                className="rounded-lg border border-neutral-800 bg-[#1a1a1a] p-4"
                            >
                                {columns.map(({ key, label }) => (
                                    <div
                                        key={key}
                                        className="mb-3 border-b border-neutral-800/60 pb-3 last:mb-0 last:border-b-0 last:pb-0"
                                    >
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            {label}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-200">{row[key]}</p>
                                    </div>
                                ))}
                                <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3">
                                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Actions
                                    </span>
                                    {renderActions(row, rowIndex)}
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            <div className="mt-6 flex justify-end">
                <nav
                    className="flex flex-wrap items-center gap-2 text-sm text-gray-400"
                    aria-label={`${title} pagination`}
                >
                    <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                        &lt; Previous
                    </button>
                    <button type="button" className="min-h-[44px] px-2 font-medium text-white">
                        1
                    </button>
                    <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                        2
                    </button>
                    <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                        3
                    </button>
                    <span>...</span>
                    <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                        10
                    </button>
                    <button type="button" className="min-h-[44px] px-2 transition-colors hover:text-white">
                        Next &gt;
                    </button>
                </nav>
            </div>
        </div>
    );
}
