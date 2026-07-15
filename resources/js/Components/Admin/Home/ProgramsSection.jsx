import { ADMIN_GOLD_BUTTON_CLASS } from '@/Components/Admin/adminFormStyles';
import SectionCard from '@/Components/Admin/SectionCard';
import { PROGRAMS_DATA } from '@/data/adminHomeData';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProgramsSection() {
    const [search, setSearch] = useState('');

    const filteredPrograms = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return PROGRAMS_DATA;
        return PROGRAMS_DATA.filter(
            (row) =>
                row.title.toLowerCase().includes(q) ||
                row.link.toLowerCase().includes(q),
        );
    }, [search]);

    const headerRight = (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
            <button type="button" className={ADMIN_GOLD_BUTTON_CLASS}>
                <Plus className="h-4 w-4" />
                Add Program
            </button>
        </div>
    );

    return (
        <SectionCard title="Our Programs" headerRight={headerRight}>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="pb-4 text-left text-sm font-semibold text-white">Title</th>
                            <th className="pb-4 text-left text-sm font-semibold text-white">Links</th>
                            <th className="pb-4 pr-4 text-right text-sm font-semibold text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPrograms.map((row) => (
                            <tr key={row.title}>
                                <td className="border-b border-neutral-800/50 py-4 text-sm text-gray-300">
                                    {row.title}
                                </td>
                                <td className="border-b border-neutral-800/50 py-4 text-sm text-gray-300">
                                    {row.link}
                                </td>
                                <td className="border-b border-neutral-800/50 py-4 pr-4 text-right">
                                    <div className="inline-flex items-center justify-end gap-3">
                                        <img
                                            src={row.thumbnail}
                                            alt=""
                                            className="h-10 w-10 rounded-md border border-neutral-700 object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="text-blue-500 transition-colors hover:text-blue-400"
                                            aria-label="Edit program"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="text-red-500 transition-colors hover:text-red-400"
                                            aria-label="Delete program"
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

            <div className="mt-6 flex justify-end">
                <nav
                    className="flex items-center gap-2 text-sm text-gray-400"
                    aria-label="Programs pagination"
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
        </SectionCard>
    );
}
