import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const ACCENT = '#FBBF24';

export default function AdminTable({
    title,
    columns,
    data,
    entityName,
    onAdd,
    onEdit,
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

    return (
        <div className="mb-8 w-full rounded-xl border border-neutral-800 bg-[#111111] p-6">
            
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-bold" style={{ color: ACCENT }}>
                        {title}
                    </h3>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded-md border border-neutral-800 bg-[#1A1A1A] py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-neutral-600 focus:outline-none"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={onAdd}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-black"
                            style={{ backgroundColor: ACCENT }}
                        >
                            <Plus className="h-4 w-4" />
                            Add {entityName}
                        </button>
                    </div>
                </div>
            

            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] table-auto border-collapse">
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
                        {filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="py-8 text-center text-sm text-gray-500"
                                >
                                    No results found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, rowIndex) => (
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
                                        <div className="inline-flex items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onEdit?.(row, rowIndex)}
                                                className="text-blue-500 transition-colors hover:text-blue-400"
                                                aria-label="Edit row"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-500 transition-colors hover:text-red-400"
                                                aria-label="Delete row"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end">
                <nav
                    className="flex items-center gap-2 text-sm text-gray-400"
                    aria-label={`${title} pagination`}
                >
                    <button type="button" className="transition-colors hover:text-white">
                        &lt; Previous
                    </button>
                    <button type="button" className="font-medium text-white">
                        1
                    </button>
                    <button type="button" className="transition-colors hover:text-white">
                        2
                    </button>
                    <button type="button" className="transition-colors hover:text-white">
                        3
                    </button>
                    <span>...</span>
                    <button type="button" className="transition-colors hover:text-white">
                        10
                    </button>
                    <button type="button" className="transition-colors hover:text-white">
                        Next &gt;
                    </button>
                </nav>
            </div>
        </div>
    );
}
