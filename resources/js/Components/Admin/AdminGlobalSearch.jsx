import { Search } from 'lucide-react';

export default function AdminGlobalSearch() {
    return (
        <div className="max-w-2xl flex-1">
            <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg border border-neutral-800 bg-[#1A1A1A] focus-within:shadow-lg">
                <Search className="ml-4 h-5 w-5 shrink-0 text-gray-500" />
                <input
                    className="peer h-full w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-gray-500"
                    type="text"
                    placeholder="Search records, institutions..."
                />
            </div>
        </div>
    );
}
