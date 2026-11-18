import ProgramsSection from '@/Components/Admin/Home/ProgramsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function OurPrograms({
    programs = [],
    bookmarkedCount = 0,
    maxBookmarked = 5,
}) {
    return (
        <AdminLayout activeNavId="home-programs">
            <Head title="Our Programs — Home Page" />
            <header className="mb-6 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Home Page Settings
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    Our Programs
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    All active programs appear on the public{' '}
                    <span className="font-semibold text-gray-200">/Programs</span>{' '}
                    main page, while up to {maxBookmarked} bookmarked programs are showcased on the Homepage.
                </p>
            </header>

            <ProgramsSection
                programs={programs}
                bookmarkedCount={bookmarkedCount}
                maxBookmarked={maxBookmarked}
            />
        </AdminLayout>
    );
}
